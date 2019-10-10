<template>
	<form>
		<field
			v-for="field in fields"
			:name="field.name"
			:minEntries="field.minEntries"
			:maxEntries="field.maxEntries"
			:initialEntries="account.fields[field.fieldId]"
			:key="field.fieldId"
			:ref="field.fieldId"
			:fieldTypes="field.fieldTypes"/>
			<button @click="submit()" type="button">
				Submit
			</button>
	</form>
</template>

<script>
import Field from '../components/Field.vue';

import io from "../../io.js";

export default {
	components: { Field },
	data: function() {
		return {
			fields: [],
			account: {
				version: 1,
				fields: {}
			}
		};
	},
	methods: {
		submit() {
			let account = JSON.parse(JSON.stringify(this.account));
			let fields = {};
			Object.keys(account.fields).forEach(fieldId => {
				fields[fieldId] = this.$refs[fieldId][0].entries;
			});
			account.fields = fields;
			this.onSubmit(account);
		}
	},
	props: {
		onSubmit: Function
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("getAccountSchema", res => {
				this.fields = res.schema.fields;
				this.fields.forEach(field => {
					let defaultObject = {};
					field.fieldTypes.forEach(fieldType => {
						if (fieldType.type === "text" || fieldType.type === "select") defaultObject[fieldType.fieldTypeId] = "";
						else if (fieldType.type === "checkbox") defaultObject[fieldType.fieldTypeId] = false;
					});

					this.account.fields[field.fieldId] = [];

					for(let i = 0; i < field.minEntries; i++) {
						this.account.fields[field.fieldId].push(defaultObject);
					}
				});
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
