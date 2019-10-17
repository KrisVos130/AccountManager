<template>
	<main>
		<h1>Accounts</h1>
		<router-link to="/accounts/add">
			Add account
		</router-link>
		<accounts-list
			:accounts="accounts"
		/>
	</main>
</template>

<script>
import io from "../../io.js";

import AccountsList from '../components/AccountsList.vue';

export default {
	components: { AccountsList },
	data: () => {
		return {
			accounts: [],
		}
	},
	methods: {
		
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("getAccounts", res => {
				this.accounts = res.accounts;
			});
		});
	}
};
</script>

<style lang="scss" scoped>

</style>