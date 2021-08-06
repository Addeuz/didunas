<script>
	let username;
	let password;

	async function login() {}
</script>

<h1 class="text-4xl">Log in</h1>
<input type="text" bind:value={username} placeholder="Username" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={login}>Log in</button>
