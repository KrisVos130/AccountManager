<template>
	<div class="accounts-list">
		<div class="account" v-for="(account, accountIndex) in accounts">
			{{ account.fields.name[0].name }}
			<router-link
				:to="`edit/${account._id}`"
			>
				Edit account
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			
		};
	},
	methods: {
		
	},
	props: {
		accounts: Array
	},
	mounted() {
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>

</style>
