<template>
	<main>
		<h1>Options</h1>
		<hr/>
		<br/>
		<div class="control">
			<label for="passcode">Passcode: </label>
			<input type="text" id="passcode" v-model="passcode"/>
		</div>
		<button class="button" @click="save()">Save</button>
	</main>
</template>

<script>
export default {
	components: {  },
	data: () => {
		return {
			passcode: ""
		}
	},
	computed: {
		
	},
	methods: {
		save() {
			localStorage.setItem("passcode", this.passcode);
		}
	},
	mounted() {
		this.passcode = localStorage.getItem("passcode");
	}
};
</script>

<style lang="scss" scoped>

</style>
