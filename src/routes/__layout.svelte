<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		console.log('load session', session);

		if (session.user) {
			// Deletes the password from the object so that it doesn't get sent to the web all the time
			delete session.user.password;
			return {
				props: {
					user: session.user
				}
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import type { UserAttributes } from '$lib/database';

	import '../app.postcss';

	export let user: UserAttributes;

	let navOpen = false;
	$: nav = navOpen;
</script>

<header class="flex flex-wrap flex-row justify-between lg:items-center lg:space-x-4 p-6 relative">
	<a href="/"><h1 class="text-xl">DIDUNAS</h1></a>
	<button
		on:click={() => (navOpen = !navOpen)}
		class="inline-block lg:hidden w-8 h-8 bg-gray-200 text-gray-600 p-1 rounded"
	>
		<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
	<nav
		class={`${
			nav ? `flex` : `hidden`
		} absolute lg:relative lg:block top-16 lg:top-0 left-0 z-20 flex flex-col lg:flex-row lg:space-x-6 font-semibold w-full lg:w-auto bg-white shadow-md rounded-lg lg:shadow-none lg:rounded-none lg:bg-transparent p-6 pt-0 lg:p-0`}
	>
		{#if user}
			<a href="/profile" class="nav-item">Profile</a>
			{#if user.type === 'teacher' || user.type === 'researcher'}
				<a href="/profile" class="nav-item">Statistics</a>
				<a href="/new-user" class="nav-item">New user</a>
			{/if}
			{#if user.type === 'researcher'}
				<a href="/tasks" class="nav-item">Tasks</a>
			{/if}
		{:else}
			<a href="/login" class="nav-item">Login</a>
		{/if}
	</nav>
</header>

<div class="mx-6 lg:max-w-screen-xl lg:mx-auto">
	<slot />
</div>
