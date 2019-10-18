<template>
	<navbar>
		<router-link to="/" v-slot="{ href, navigate, isExactActive }">
			<a :class="{ 'active': isExactActive }" :href="href" @click="navigate">
				Homepage
			</a>
		</router-link>
		<router-link to="/accounts" v-slot="{ href, navigate, isExactActive }">
			<a :class="{ 'active': isExactActive }" :href="href" @click="navigate">
				Accounts
			</a>
		</router-link>
		<router-link to="/schemas" v-slot="{ href, navigate, isExactActive }">
			<a :class="{ 'active': isExactActive }" :href="href" @click="navigate">
				Schemas
			</a>
		</router-link>
	</navbar>
</template>

<script>
export default {
	components: {},
	data: () => {
		return {
			
		}
	},
	methods: {
		
	},
	mounted() {
		
	}
};
</script>

<style lang="scss" scoped>
navbar {
	display: flex;
	width: 100%;
	height: 60px;
	background-color: green;
	flex-direction: row;

	a {
		text-align: center;
		padding: 10px;
		vertical-align: middle;
		line-height: 40px;
		text-decoration: none;
		color: white;
		font-size: 20px;

		&.active {
			background-color: darkgreen;
		}
	}
}
</style>
