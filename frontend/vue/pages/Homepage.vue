<template>
	<div>
		<input v-model="importAccountSchemaName"/>
		<button @click="importAccountSchema()">Import account schema</button>
		<hr />
		<h1>Sites</h1>
		<form>
			<field
				v-for="field in fields"
				:name="field.name"
				:minEntries="field.minEntries"
				:maxEntries="field.maxEntries"
				:initialEntries="[]"
				:fieldTypes="field.fieldTypes"/>
		</form>
	</div>
</template>

<script>
import Field from '../components/Field.vue';

import io from "../../io.js";

export default {
	components: { Field },
	data: () => {
		return {
			fields: [],
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
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("getAccountSchema", res => {
				console.log(res);
				this.fields = res.schema.fields;
			});

			socket.emit("getAccounts", res => {
				this.accounts = res.accounts;
			});
		});
	}
};
</script>

<style lang="scss" scoped>
form {
	width: 400px;
}
</style>
