<!-- <script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
</script> -->
<script lang="ts">
	import { goto } from '$app/navigation';

	// let name: string;

	// let userName: string;
	// let className: string;

	// let result;

	// let errorMessage: string;

	// async function login() {
	// 	try {
	// 		const res = await fetch(`/api/auth/login/${name}`, {
	// 			method: 'POST',
	// 			body: JSON.stringify({
	// 				name: 'janne',
	// 				lastname: 'andersson'
	// 			}),
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		});
	// 		if (res.ok) {
	// 			result = res.json();
	// 			errorMessage = null;
	// 		} else {
	// 			const json = await res.json();
	// 			errorMessage = json.message;
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
</script>

<svelte:head>
	<title>Didunas</title>
</svelte:head>
<!-- {#await result then testUser}
	<p class="text-blue-400">{testUser?.user.username}</p>
{/await} -->

<div
	class="gap-3 flex flex-col lg:flex-row justify-between items-center mx-2 lg:h-screen lg:-mt-24 "
>
	<button
		on:click={() => goto('/running/Enumeration')}
		class="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 w-60 h-52 rounded-xl"
	>
		<img class="rounded-xl mb-3 w-48" src="/enumerationTask.png" alt="Enumeration task" />
		<span>Enumeration tasks</span>
	</button>
	<button
		on:click={() => goto('/running/PatternRecognition')}
		class="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 w-60 h-52 rounded-xl"
	>
		<img
			class="rounded-xl mb-3 w-48"
			src="/patternRecognitionTask.png"
			alt="Pattern recognition task"
		/>
		<span>Pattern recognition tasks</span>
	</button>
	<button
		on:click={() => goto('/running/NumberLine')}
		class="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 w-60 h-52 rounded-xl"
	>
		<img class="rounded-xl mb-3 w-48" src="/numberLineTask.png" alt="Number line tasks" />
		<span>Number line tasks</span>
	</button>
	<button
		on:click={() => goto('/running/Color')}
		class="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 w-60 h-52 rounded-xl"
	>
		<img class="rounded-xl mb-3 w-48" src="/colorTask.png" alt="Enumeration task" />
		<span>Color tasks</span>
	</button>
</div>
