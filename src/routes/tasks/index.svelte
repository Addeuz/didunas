<script context="module" lang="ts">
	import type { Task, Type } from '$lib/database';

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
			const resTasks = await fetch(`${server}/api/tasks`);
			const resTypes = await fetch(`${server}/api/tasks/types`);
			if (resTasks.ok && resTypes.ok) {
				const dataTasks = await resTasks.json();
				const dataTypes = await resTypes.json();

				console.log(dataTasks.tasks);
				console.log(dataTypes.types);

				return {
					props: {
						tasks: dataTasks.tasks,
						types: dataTypes.types
					}
				};
			}
		} catch (error) {
			console.error(error);
		}

		return {
			props: {
				tasks: []
			}
		};
	};
</script>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import type { EditFieldAttributes } from 'src/global';

	export let tasks: Task[];
	export let types: Type[];

	let filterTask: 'noFilter' | 'Enumeration' | 'PatternRecognition' | 'NumberLine' | 'Color' =
		'noFilter';

	let colorAnswers: 'twoColors' | 'threeColors' = 'twoColors';

	let editFiles: FileList = undefined;

	let editFields: EditFieldAttributes = {
		editRightAnswer: undefined,
		editDifficulty: undefined,
		editFile: undefined,
		editTypeId: undefined,
		editAnswerType: undefined,
		editTask: undefined
	};

	let submitted: boolean = false;
	let loading: boolean = false;
	let error: string = undefined;
	let success: string = undefined;

	async function editTaskAction() {
		console.log(editFields);

		loading = true;
		submitted = true;
		if (editFields.editRightAnswer === undefined) {
			loading = false;
			submitted = false;
			error = 'Enter a right answer';
			return;
		} else {
			error = undefined;
		}

		if (editFiles) {
			try {
				const result = await toBase64(editFiles[0]).catch((e) => Error(e));
				if (result instanceof Error) {
					console.error(result.message);
					throw result;
				}
				editFields.editFile = result;
			} catch (error) {}
		}

		console.log(editFields);

		try {
			const res = await fetch('/api/tasks', {
				method: 'PUT',
				body: JSON.stringify({
					...editFields
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
				location.reload();
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
	}
</script>

<div class="flex place-content-between">
	<h1>Tasks</h1>
	<Button action={() => goto('/tasks/new-task')}>New task</Button>
</div>

{#if tasks?.length === 0}
	<p>No tasks</p>
{:else}
	{#if types}
		<h3 class="font-bold">Filter by type:</h3>
		<select bind:value={filterTask}>
			<option selected value="noFilter">No filter</option>
			{#each types as type}
				<option value={type.name}>
					{type.name}
				</option>
			{/each}
		</select>
	{/if}
	<p class="my-3 italic">Click on a task to edit</p>
	<ul class="flex flex-row flex-wrap gap-4">
		{#each tasks as task}
			{#if filterTask === 'noFilter' || task.Type.name === filterTask}
				<div class="flex flex-col">
					<li
						on:click={() => {
							if (editFields.editTask === task) {
								editFields.editTask = undefined;
								editFields.editRightAnswer = undefined;
								editFields.editDifficulty = undefined;
								editFields.editAnswerType = undefined;
								editFields.editTypeId = undefined;
							} else {
								editFields.editTask = task;
								editFields.editRightAnswer = task.rightAnswer;
								editFields.editDifficulty = task.difficulty;
								// @ts-ignore
								editFields.editAnswerType = task.answerType;
								editFields.editTypeId = task.Type.id;
							}
						}}
						class="flex flex-col gap-4 bg-gray-50 p-3 cursor-pointer"
					>
						<div class="h-24 flex items-center">
							<img src={task.imageString} class="w-52" alt="" />
						</div>
						<div>
							<p>Right answer:</p>
							<span>{task.rightAnswer}</span>
						</div>
						<div>
							<p>Difficulty:</p>
							<span>{task.difficulty}</span>
						</div>
						<div>
							<p>Type:</p>
							<span>{task.Type.name}</span>
						</div>
					</li>
					{#if editFields.editTask?.id === task.id}
						<div class="flex flex-col bg-gray-50 px-3 pb-3 gap-2">
							<p class="font-bold text-lg">Edit task:</p>
							<p class="font-bold">New image:</p>
							<input
								class="w-52"
								type="file"
								name="imageUrl"
								bind:files={editFiles}
								on:change={() => (editFields.editRightAnswer = undefined)}
							/>

							<h3 class="font-bold">Select type of task:</h3>
							<!-- svelte-ignore a11y-no-onchange -->
							{#if types}
								<select
									class="w-52"
									bind:value={editFields.editTypeId}
									on:change={(event) => {
										if (event.target.value !== '4') {
											editFields.editAnswerType = 'numbers';
											editFields.editRightAnswer = undefined;
										} else {
											editFields.editAnswerType = colorAnswers;
											editFields.editRightAnswer = undefined;
										}
									}}
								>
									{#each types as type}
										<option value={type.id}>
											{type.name}
										</option>
									{/each}
								</select>
							{/if}

							{#if editFields.editTypeId === 4}
								<h3 class="font-bold">Edit answer type:</h3>
								<div class="flex flex-col gap-2">
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editAnswerType}
											on:change={() => (editFields.editRightAnswer = undefined)}
											value="twoColors"
										/>
										<img class="w-36" src="/twoColor.png" alt="Two color answer type" />
									</label>
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editAnswerType}
											on:change={() => (editFields.editRightAnswer = undefined)}
											value="threeColors"
										/>
										<img class="w-36" src="/threeColor.png" alt="Three color answer type" />
									</label>
								</div>
							{/if}

							<p class="font-bold">Right answer:</p>
							{#if editFields.editTypeId !== 4}
								<input
									class="w-52"
									type="text"
									name="rightAnswer"
									bind:value={editFields.editRightAnswer}
									placeholder="e.g. 12"
									on:change={() => {}}
								/>
								<!-- {#if rightAnswerError}
									<p class="text-red-400">{rightAnswerError}</p>
								{/if} -->
							{:else if editFields.editAnswerType === 'twoColors'}
								<div class="flex flex-col">
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="blue"
										/>
										<span>Blue</span>
									</label>
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="equal"
										/>
										<span>Equal</span>
									</label>
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="yellow"
										/>
										<span>Yellow</span>
									</label>
								</div>
							{:else if editFields.editAnswerType === 'threeColors'}
								<div class="flex flex-col">
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="blue"
										/>
										<span>Blue</span>
									</label>
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="yellow"
										/>
										<span>Yellow</span>
									</label>
									<label class="flex items-center gap-2">
										<input
											class="w-6"
											type="radio"
											bind:group={editFields.editRightAnswer}
											value="red"
										/>
										<span>Red</span>
									</label>
								</div>
							{/if}
							<h3 class="font-bold">Edit difficulty:</h3>
							<input
								class="w-52"
								type="number"
								name="difficulty"
								min="0"
								max="10"
								bind:value={editFields.editDifficulty}
								on:change={() => {}}
							/>
							{#if error}
								<p class="text-red-400">{error}</p>
							{/if}
							{#if success}
								<p class="text-green-500">{success}</p>
							{/if}
							<button
								disabled={submitted}
								on:click={editTaskAction}
								class={submitted
									? `bg-green-600 p-4 w-full md:w-52 rounded-xl`
									: `bg-green-300 p-4 w-full md:w-52 rounded-xl`}
								type="submit"
							>
								{#if !loading}
									<p class="text-white">Edit task</p>
								{:else}
									<div class="lds-ring">
										<div />
										<div />
										<div />
										<div />
									</div>
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</ul>
{/if}

<style>
	.lds-ring {
		display: inline-block;
		position: relative;
		width: 20px;
		height: 20px;
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 20px;
		height: 20px;
		margin: 3px;
		border: 3px solid #fff;
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #fff transparent transparent transparent;
	}
	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
