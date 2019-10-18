<template>
	<div>
		<navbar/>
		<router-view />
	</div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
	components: { Navbar },
	replace: false,
	methods: {
		
	},
	mounted() {
		
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
}

input {
	padding: 8px 12px;
}
</style>

<style lang="scss" scoped>

</style>
