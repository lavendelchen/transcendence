<template>
	<h1>Jobs</h1>
	<div v-for="job in jobs" :key="job.id" class="job">
		<h2>{{ job.title }}</h2>
	</div>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				jobs: [
					{ title: '', id: 0, details: ''}
				]
			}
		},
		mounted() {
			fetch('http://localhost:3000/jobs')
				.then(response => response.json())
				.then(data => this.jobs = data)
				.catch(error => console.log(error.message))
		}
	}
</script>