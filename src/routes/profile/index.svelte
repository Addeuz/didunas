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
		return {
			status: 302,
			redirect: session.authenticated ? `/profile/${session.user.username}` : '/login'
		};
	};
</script>

<!-- <script lang="ts">
	import type { User } from '$lib/database';

	export let user: User;

</script>

<h1>Hello, {user.username}</h1> -->
