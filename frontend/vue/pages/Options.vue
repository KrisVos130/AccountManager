<template>
	<main>
		<h1>Options</h1>
		<hr/>
		<br/>
		<div class="control">
			<label for="passcode">Passcode: </label>
			<input type="password" id="passcode" v-model="passcode"/>
		</div>
		<button class="button" @click="save()">Save</button>
	</main>
</template>

<script>
import io from "../../io.js";

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
			this.socket.disconnect();
			this.socket.io.opts.query = `passcode=${this.passcode}`;
			this.socket.connect();
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;
		});
		this.passcode = localStorage.getItem("passcode");
	}
};
</script>

<style lang="scss" scoped>

</style>
