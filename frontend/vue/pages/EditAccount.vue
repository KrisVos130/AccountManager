<template>
	<main>
		<h1>Edit account</h1>
		<hr/>
		<br/>
		<account-form v-if="account.version" :onSubmit="onSubmit" :initialAccount="account"/>
	</main>
</template>

<script>
import AccountForm from '../components/AccountForm.vue';

import io from "../../io.js";

export default {
	components: { AccountForm },
	data: () => {
		return {
			account: {},
			accountId: ""
		}
	},
	methods: {
		onSubmit(account) {
			this.socket.emit("account.editById", account._id, account, (res) => {
				console.log(res);
				if (res.status === "success") {
					this.$router.push("/accounts")
				}
			});
		}
	},
	mounted() {
		this.accountId = this.$route.params.accountId;
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("account.getById", this.accountId, res => {
				console.log(res);
				if (res.status === "success") {
					this.account = res.account;
				}
			});
		});
	}
};
</script>

<style lang="scss" scoped>

</style>