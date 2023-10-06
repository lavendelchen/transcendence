<template>
	<h1>Jobs</h1>
	<div v-if="jobs[0].id > 0">
		<div v-for="job in jobs" :key="job.id" class="job">
			<h2>{{ job.title }}</h2>
		</div>
	</div>
	<div v-else>
		No jobs :/
	</div>
	<br><br><br>
	<h1>Cute Guys</h1>
	<div v-if="cute_guys[0].id > 0">
		<div v-for="cute_guy in cute_guys" :key="cute_guy.id" class="cute_guy">
			<h2>{{ cute_guy.title }}</h2>
		</div>
	</div>
	<div v-else>
		No guys :(
	</div>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				jobs: [
					{ title: '', id: 0, details: ''}
				],
				cute_guys: [
					{ title: '', id: 0, details: ''}
				]
			}
		},
		mounted() {
			fetch('http://localhost:3000/jobs')
				.then(response => response.json())
				.then(data => this.jobs = data)
				.catch(error => console.log(error.message))
			fetch('http://localhost:3000/cute_guys')
				.then(response => response.json())
				.then(data => this.cute_guys = data)
				.catch(error => console.log(error.message))
		}
	}
</script>