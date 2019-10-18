<template>
	<main>
		<h1>Add account</h1>
		<hr/>
		<br/>
		<account-form :onSubmit="onSubmit"/>
	</main>
</template>

<script>
import AccountForm from '../components/AccountForm.vue';

import io from "../../io.js";

export default {
	components: { AccountForm },
	data: () => {
		return {
			
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
		});
	}
};
</script>

<style lang="scss" scoped>

</style>