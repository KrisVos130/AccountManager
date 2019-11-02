<template>
	<main>
		<h1>Add account</h1>
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
			account: {}
		}
	},
	methods: {
		onSubmit(account) {
			this.socket.emit("account.add", account, (res) => {
				console.log(res);
				if (res.status === "success") {
					this.$router.push("/accounts")
				}
			});
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("accountSchema.getLatest", res => {
				this.socket.emit("account.createEmptyAccount", res.schema.version, res => {
					this.account = res.account;
				});
			});
		});
	}
};
</script>

<style lang="scss" scoped>

</style>