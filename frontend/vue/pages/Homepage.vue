<template>
	<div>
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
			accounts: []
		}
	},
	methods: {
		
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("getAccountSchema", res => {
				this.fields = res.schema.versions[0].fields;
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
