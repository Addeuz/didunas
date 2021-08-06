<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		// if (!session.authenticated) {
		// 	return {
		// 		status: 302,
		// 		redirect: '/login'
		// 	};
		// }

		// return {
		// 	props: {
		// 		user: session.user
		// 	}
		// };
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import type { UserAttributes } from '$lib/database';

	let error: string;
	let user: UserAttributes;

	if (browser) {
		onMount(() => {
			user = $session.user;
		});
	}

	async function logout() {
		// const user = $session.user as User;

		try {
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				location.reload();
			} else {
				const data = await res.json();
				error = data.message;
				throw error;
			}
		} catch (err) {}

		// const userCookie = await user.getCookie();
	}
</script>

<h1>Hej, {user?.username}</h1>
<button on:click={logout} class="bg-red-300 p-4 rounded">Logout</button>
