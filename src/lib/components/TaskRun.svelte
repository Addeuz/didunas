<script lang="ts">
	import type { TaskAttributes } from '$lib/database';
	import type { Answer } from 'src/global';
	import { createEventDispatcher, onMount } from 'svelte';
	import Numbers from './AnswerInputs/Numbers.svelte';

	export let task: TaskAttributes;

	let taskStartTime: Date;

	const dispatch = createEventDispatcher();

	function handleAnswer(event) {
		const taskEndTime = new Date();
		console.log('totalTime', taskEndTime.getTime() - taskStartTime.getTime());

		const answer: Answer = {
			answer: event.detail.answer,
			rightAnswer: task.rightAnswer,
			time: (taskEndTime.getTime() - taskStartTime.getTime()) / 1000
		};

		console.log(answer);

		dispatch('taskComplete', {
			answer
		});
	}

	onMount(() => {
		taskStartTime = new Date();
	});
</script>

<div class="flex flex-col items-center justify-between bg-gray-400 w-3/4 h-3/4 pt-4 rounded-lg">
	<img src={task.imageString} alt="Task" />
	<Numbers on:answer={handleAnswer} />
</div>
