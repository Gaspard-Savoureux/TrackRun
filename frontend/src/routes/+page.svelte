<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<h1>It works!</h1>
<img src={data.imageSrc} alt="dog" />

<style>
	h1 {
		color: var(--color-background);
	}
</style>
