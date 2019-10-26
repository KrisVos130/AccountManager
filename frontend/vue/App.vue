<template>
	<div>
		<navbar/>
		<router-view />
		<span v-if="connecting" class="alert">Socket.io connecting</span>
		<span v-if="!connecting && !connected" class="alert">Socket.io not connected</span>
	</div>
</template>

<script>
import io from "../io.js";

import Navbar from './components/Navbar.vue';

export default {
	components: { Navbar },
	replace: false,
	data: () => {
		return {
			connecting: true,
			connected: false
		}
	},
	methods: {
		
	},
	mounted() {
		io.onConnect(() => {
			this.connected = true;
			this.connecting = false
		});

		io.onDisconnect(() => {
			this.connected = false;
		});

		io.onConnectError(() => {
			this.connecting = false;
		});
	}
};
</script>

<style lang="scss">
body {
	font-family: Roboto, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	background-color: lightgray;
}

* {
	margin: 0;
	padding: 0;
}

main {
	padding: 25px 50px;
}

.button {
	padding: 8px 12px;
	background-color: rgb(45, 150, 185);
	color: white;
	text-decoration: none;
	display: inline-block;
	box-shadow: none;
	border: none;
	cursor: pointer;

	&:hover, &:focus {
		background-color: rgb(22, 133, 170);
	}
}

input, select {
	padding: 8px 12px;
}
</style>

<style lang="scss" scoped>
.alert {
	position: absolute;
	top: 50px;
	right: 50px;
	background-color: rgb(45, 150, 185);
	color: white;
	padding: 20px;
	font-size: 40px;
}
</style>
