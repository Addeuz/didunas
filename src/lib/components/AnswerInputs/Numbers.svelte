<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	const dispatch = createEventDispatcher();

	function selectAnswer(answer: number) {
		dispatch('answer', {
			answer
		});
	}
</script>

<div class="grid grid-cols-10 gap-4 mb-4">
	<!-- <button class="h-20 w-20 border">1</button>
	<button class="h-20 w-20 border">2</button>
	<button class="h-20 w-20 border">3</button>
	<button class="h-20 w-20 border">4</button>
	<button class="h-20 w-20 border">5</button>
	<button class="h-20 w-20 border">6</button>
	<button class="h-20 w-20 border">7</button>
	<button class="h-20 w-20 border">8</button>
	<button class="h-20 w-20 border">9</button>
	<button class="h-20 w-20 border">10</button>
	<button class="h-20 w-20 border">11</button>
	<button class="h-20 w-20 border">12</button>
	<button class="h-20 w-20 border">13</button>
	<button class="h-20 w-20 border">14</button>
	<button class="h-20 w-20 border">15</button>
	<button class="h-20 w-20 border">16</button>
	<button class="h-20 w-20 border">17</button>
	<button class="h-20 w-20 border">18</button>
	<button class="h-20 w-20 border">19</button>
	<button class="h-20 w-20 border">20</button> -->
	{#each numbers as number}
		<button
			on:click={() => selectAnswer(number)}
			class="h-20 w-20 border bg-gray-50 border-gray-400 rounded-xl hover:bg-gray-300 text-4xl"
		>
			{number}
		</button>
	{/each}
</div>
