<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import * as yup from 'yup';
	import { Form, Message } from 'svelte-yup';
	import type { LoginAttributes } from 'src/global';
	import { session } from '$app/stores';
	import SubmitButton from '$lib/components/SubmitButton.svelte';

	let schema = yup.object().shape({
		username: yup.string().required().label('Username'),
		password: yup.string().required().label('Password')
	});
	let fields: LoginAttributes = { username: '', password: '' };
	let submitted: boolean = false;
	let isValid: boolean;
	let error: string;

	let loading: boolean = false;

	let timesSent = 0;

	async function login() {
		timesSent++;
		error = undefined;
		loading = true;
		// validation
		submitted = true;
		isValid = await schema.isValid(fields);
		if (isValid) {
			try {
				const res = await fetch('/api/auth/login', {
					method: 'POST',
					body: JSON.stringify({
						...fields
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (res.ok) {
					const data = await res.json();
					location.reload();
				} else {
					const data = await res.json();
					error = data.message;
					loading = false;
					throw error;
				}
			} catch (err) {
				submitted = false;
			}
		} else {
			loading = false;
			// submitted = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-screen min-w-full ">
	<h1 class="text-4xl font-semibold">DIDUNAS</h1>
	<div class="">
		<Form class="form flex flex-col items-center space-y-5 my-6" {schema} {fields} {submitted}>
			<input
				type="text"
				name="username"
				bind:value={fields.username}
				on:change={() => {
					submitted = false;
				}}
				placeholder="Username"
			/>
			{#if !isValid}
				<Message name="username" />
			{/if}
			<input
				type="password"
				name="password"
				bind:value={fields.password}
				on:change={() => {
					submitted = false;
				}}
				placeholder="Password"
			/>
			{#if !isValid}
				<Message name="password" />
			{/if}
			{#if error}
				<p class="text-red-400">{error}</p>
			{/if}
			<SubmitButton action={login} disabled={submitted} {loading}>Login</SubmitButton>
		</Form>
	</div>
</div>
