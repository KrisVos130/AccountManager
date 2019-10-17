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
	padding: 50px;
	margin: 0;
	font-family: Roboto, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	background-color: lightgray;
}
</style>

<style lang="scss" scoped>

</style>
