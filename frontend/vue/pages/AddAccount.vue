<template>
	<account-form :onSubmit="onSubmit"/>
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
			this.socket.emit("addAccount", account, (res) => {
				console.log(res);
				if (res.status === "success") {
					this.$router.push("/")
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