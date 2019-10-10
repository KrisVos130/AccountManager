<template>
	<div>
		<input v-model="importAccountSchemaName"/>
		<button @click="importAccountSchema()">Import account schema</button>
		<hr />
		<h1>Sites</h1>
		<router-link to="/add">
			Add account
		</router-link>
		<accounts-list
			:accounts="accounts"
		/>
	</div>
</template>

<script>
import Field from '../components/Field.vue';
import AccountsList from '../components/AccountsList.vue';

import io from "../../io.js";

export default {
	components: { Field, AccountsList },
	data: () => {
		return {
			accounts: [],
			importAccountSchemaName: ""
		}
	},
	methods: {
		importAccountSchema() {
			this.socket.emit("importAccountSchema", this.importAccountSchemaName, (res) => {
				console.log(res);
				alert(res.status);
			});
		},
		addAccount() {
			
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("getAccounts", res => {
				this.accounts = res.accounts;
				//this.accounts = ["test", "test1", "test2"];
			});
		});
	}
};
</script>

<style lang="scss" scoped>

</style>
