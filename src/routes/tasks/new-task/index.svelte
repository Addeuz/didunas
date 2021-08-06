<script context="module" lang="ts">
	import type { Type, TypeAttributes } from '$lib/database';

	import { server, toBase64 } from '$lib/utils';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user || session.user.type === 'student' || session.user.type === 'teacher') {
			return {
				status: 302,
				redirect: '/login'
			};
		}

		try {
			const res = await fetch(`${server}/api/tasks/types`);
			if (res.ok) {
				const data = await res.json();

				return {
					props: {
						types: data.types
					}
				};
			}
		} catch (error) {}

		return {};
	};
</script>

<script lang="ts">
	import * as yup from 'yup';
	import { Form, Message } from 'svelte-yup';
	import type { NewTaskAttributes } from 'src/global';
	import SubmitButton from '$lib/components/SubmitButton.svelte';

	export let types: Type[];

	let colorAnswers: 'twoColors' | 'threeColors' = 'twoColors';

	let schema = yup.object().shape({
		difficulty: yup.number().min(0).max(10).required('Must select a difficulty'),
		rightAnswer: yup.string().required('A task needs a right answer')
	});

	let fields: NewTaskAttributes = {
		answerType: 'numbers',
		difficulty: 0,
		file: undefined,
		rightAnswer: '',
		typeId: null
	};

	let files: FileList = undefined;
	let submitted: boolean = false;
	let isValid: boolean;
	let fileError: string;
	let rightAnswerError: string;
	let error: string;
	let success: string;
	let loading: boolean = false;

	async function addNewTask() {
		submitted = true;
		loading = true;
		if (!files) {
			fileError = 'Please select a file';
			submitted = false;
			loading = false;
			return;
		} else {
			try {
				fileError = undefined;
				const result = await toBase64(files[0]).catch((e) => Error(e));
				if (result instanceof Error) {
					console.error(result.message);
					throw result;
				}
				fields.file = result;
			} catch (error) {}
		}

		if (fields.typeId !== 4) {
			if (Number.isNaN(Number(fields.rightAnswer))) {
				rightAnswerError = 'Must be a number';
				loading = false;
				submitted = false;
				return;
			}
			rightAnswerError = undefined;
		}

		isValid = await schema.isValid(fields);
		if (isValid) {
			try {
				const res = await fetch('/api/tasks/new-task', {
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
			} catch (error) {
				console.error(error);
				loading = false;
				submitted = false;
			}

			loading = false;
			submitted = false;
		} else {
			console.error('Everything is not valid');
			loading = false;
		}
	}
</script>

<Form class="flex flex-col md:items-center gap-3" {schema} {fields} {submitted}>
	<h1>Create a new task</h1>

	<h3 class="font-bold">Select type of task:</h3>
	<!-- svelte-ignore a11y-no-onchange -->
	{#if types}
		<select
			bind:value={fields.typeId}
			on:change={(event) => {
				submitted = false;
				if (event.target.value !== '4') {
					fields.answerType = 'numbers';
					fields.rightAnswer = '';
				} else {
					fields.answerType = colorAnswers;
				}
			}}
		>
			<option disabled selected value>Please select type of task</option>
			{#each types as type}
				<option value={type.id}>
					{type.name}
				</option>
			{/each}
		</select>
	{/if}

	<h3 class="font-bold">Select a image file of the task:</h3>
	<input type="file" name="imageUrl" bind:files />
	{#if fileError}
		<p class="text-red-400">Please select a file</p>
	{/if}
	{#if fields.typeId === 4}
		<h3 class="font-bold">Select what type of answer the task has:</h3>
		<div class="flex gap-2">
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.answerType} value="twoColors" />
				<img class="w-36" src="/twoColor.png" alt="Two color answer type" />
			</label>
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.answerType} value="threeColors" />
				<img class="w-36" src="/threeColor.png" alt="Three color answer type" />
			</label>
		</div>
	{/if}
	<h3 class="font-bold">Right answer to the question:</h3>
	{#if fields.typeId !== 4}
		<input
			type="string"
			name="rightAnswer"
			bind:value={fields.rightAnswer}
			placeholder="e.g. 12"
			on:change={() => {
				submitted = false;
			}}
		/>
		{#if rightAnswerError}
			<p class="text-red-400">{rightAnswerError}</p>
		{/if}
	{:else if fields.answerType === 'twoColors'}
		<div class="flex gap-2">
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="blue" />
				<span>Blue</span>
			</label>
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="equal" />
				<span>Equal</span>
			</label>
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="yellow" />
				<span>Yellow</span>
			</label>
		</div>
	{:else if fields.answerType === 'threeColors'}
		<div class="flex gap-2">
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="blue" />
				<span>Blue</span>
			</label>
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="yellow" />
				<span>Yellow</span>
			</label>
			<label class="flex items-center gap-2">
				<input class="w-6" type="radio" bind:group={fields.rightAnswer} value="red" />
				<span>Red</span>
			</label>
		</div>
	{/if}

	{#if !isValid}
		<Message name="rightAnswer" />
	{/if}
	<h3 class="font-bold">Difficulty rate:</h3>
	<input
		type="number"
		name="difficulty"
		min="0"
		max="10"
		bind:value={fields.difficulty}
		on:change={() => {
			submitted = false;
		}}
	/>
	{#if !isValid}
		<Message name="difficulty" />
	{/if}

	<SubmitButton disabled={submitted || fields.typeId === null} action={addNewTask} {loading}>
		Add new task
	</SubmitButton>

	{#if error}
		<p class="text-red-400">{error}</p>
	{/if}
	{#if success}
		<p class="text-green-500">{success}</p>
	{/if}
</Form>
