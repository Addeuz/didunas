<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user || session.user.type === 'student') {
			return {
				status: 302,
				redirect: '/login'
			};
		}

		if (session.user.type === 'researcher') {
			try {
				const res = await fetch(`${server}/api/new-user`);
				if (res.ok) {
					const data = await res.json();
					return {
						props: {
							schools: data.schools
						}
					};
				}
			} catch (error) {
				console.error(error);
			}
		}

		return {};
	};
</script>

<script lang="ts">
	import * as yup from 'yup';
	import { Form, Message } from 'svelte-yup';
	import { session } from '$app/stores';
	import bcrypt from 'bcryptjs';
	import type { RegisterAttributes } from 'src/global';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { server } from '$lib/utils';
	import type { School } from '$lib/database';
	import { onMount } from 'svelte';

	export let schools: School[];

	let userTypes = [
		{ value: 'student', text: 'Student' },
		{ value: 'teacher', text: 'Teacher' },
		{ value: 'researcher', text: 'Researcher' }
	];

	let schema = yup.object().shape({
		username: yup.string().required('Username is required').label('Username'),
		email: yup.string().email().required('E-mail is required').label('Email'),
		password: yup
			.string()
			.required('Password is required')
			.min(6, 'Password must be longer than 6 characters')
			.label('Password'),
		passwordConfirmation: yup
			.string()
			.oneOf([yup.ref('password'), null], 'Passwords must match')
			.label('PasswordConfirmation'),
		fullName: yup.string().required('Full name is required').label('FullName'),
		age: yup
			.number()
			.label('Age')
			.nullable(true)
			.transform((_, val) => (val === val ? val : null)),
		type: yup.string().label('Type'),
		school: yup
			.number()
			.typeError('Please select a school')
			.required('Please select a school')
			.label('School')
	});

	let fields: RegisterAttributes = {
		username: '',
		password: '',
		passwordConfirmation: '',
		type: 'student',
		email: '',
		fullName: '',
		age: null,
		schoolId: null
	};
	let submitted: boolean = false;
	let isValid: boolean;
	let error: string;
	let success: string;
	let loading: boolean = false;

	onMount(async () => {
		// Setting the school of the student to be the school of the teacher
		if ($session.user.type === 'teacher') {
			fields.schoolId = $session.user.Schools[0].id;
		}
	});

	async function register() {
		error = undefined;
		loading = true;
		// validation
		submitted = true;
		isValid = await schema.isValid(fields);
		if (isValid) {
			try {
				const cryptPassword = bcrypt.hashSync(fields.password);
				delete fields.passwordConfirmation;

				const res = await fetch('/api/new-user', {
					method: 'POST',
					body: JSON.stringify({
						...fields,
						password: cryptPassword
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (res.ok) {
					const data = await res.json();
					success = data.message;
					error = null;
					loading = false;
					submitted = false;
				} else {
					const data = await res.json();
					error = data.message;
					success = null;
					loading = false;
					throw error;
				}
			} catch (err) {
				console.error(err);
				loading = false;
				submitted = false;
			}
		} else {
			console.error('Everything is not valid');
			loading = false;
			// submitted = false;
		}
	}
</script>

<Form class="flex flex-col md:items-center gap-3" {schema} {fields} {submitted}>
	<h1>Create new user</h1>
	<input
		type="text"
		name="username"
		bind:value={fields.username}
		placeholder="Username"
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="username" />
	{/if}
	<input
		type="text"
		name="fullName"
		bind:value={fields.fullName}
		placeholder="Full name"
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="fullName" />
	{/if}
	<input
		type="text"
		name="email"
		bind:value={fields.email}
		placeholder="E-mail"
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="email" />
	{/if}
	<input
		type="password"
		name="password"
		bind:value={fields.password}
		placeholder="Password"
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="password" />
	{/if}
	<input
		type="password"
		name="passwordConfirmation"
		bind:value={fields.passwordConfirmation}
		placeholder="Confirm password"
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="passwordConfirmation" />
	{/if}
	<!-- svelte-ignore a11y-no-onchange -->
	<select
		bind:value={fields.type}
		on:change={() => {
			if (fields.type !== 'student') {
				fields.age = null;
			}
		}}
	>
		{#each userTypes as userType}
			<!-- If the user is a teacher it can not create a researcher only other teachers or students -->
			{#if $session.user.type === 'teacher' && userType.value === 'researcher'}
				{null}
			{:else}
				<option value={userType.value}>
					{userType.text}
				</option>
			{/if}
		{/each}
	</select>
	{#if fields.type === 'student'}
		<input type="number" min="0" max="99" name="age" bind:value={fields.age} placeholder="Age" />
		{#if !isValid}
			<Message name="age" />
		{/if}
	{/if}
	{#if $session.user.type === 'researcher' && schools}
		<!-- svelte-ignore a11y-no-onchange -->
		<select
			bind:value={fields.schoolId}
			on:change={() => {
				submitted = false;
			}}
		>
			<option disabled selected value>Select a school</option>
			{#each schools as school}
				<option value={school.id}>
					{school.name}
				</option>
			{/each}
		</select>
		{#if !isValid}
			<Message name="school" />
		{/if}
	{/if}
	<SubmitButton disabled={submitted} action={register} {loading}>Register</SubmitButton>

	{#if error}
		<p class="text-red-400">{error}</p>
	{/if}
	{#if success}
		<p class="text-green-500">{success}</p>
	{/if}
</Form>
