<script context="module" lang="ts">
	export const load: Load = async ({ page }) => {
		// Get the tasks for selected task type
		const res = await fetch(`${server}/api/running/${page.params.type}`);

		if (res.ok) {
			return {
				props: {
					tasks: (await res.json()).tasks
				}
			};
		}

		return {
			props: {
				tasks: []
			}
		};
	};
</script>

<script lang="ts">
	import type { TaskAttributes } from '$lib/database';
	import type { Load } from '@sveltejs/kit';
	import type { Answer } from 'src/global';
	import { server, shuffle } from '$lib/utils';
	import { onMount } from 'svelte';
	import TaskRun from '$lib/components/TaskRun.svelte';

	export let tasks: TaskAttributes[];

	let taskIndex = 0;
	let allTaskComplete = false;

	let completions: Answer[] = [];

	function handleTaskAnswer(event) {
		completions.push(event.detail.answer);
		if (taskIndex !== tasks.length - 1) {
			taskIndex++;
		} else {
			console.log('YAAAY');
			console.log(completions);
			allTaskComplete = true;
		}
	}

	onMount(async () => {
		console.log(tasks);
		tasks = shuffle(tasks);
	});
</script>

<!-- {#each tasks as task}
	<div class="flex flex-col items-center">
		<span>{task.difficulty}</span>
		<span>{task.answerType}</span>
		<img class="h-16" src={task.imageString} alt="Task" />
	</div>
{/each} -->

{#if !allTaskComplete}
	<TaskRun on:taskComplete={handleTaskAnswer} task={tasks[taskIndex]} />
{:else}
	All tasks are done
{/if}
