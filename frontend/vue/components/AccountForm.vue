<template>
	<form>
		<p><b>Schema version</b>: {{account.version}}</p>
		<field
			v-for="field in fields"
			v-if="dependencyChecksOut(field.fieldId)"
			:name="field.name"
			:minEntries="field.minEntries"
			:maxEntries="field.maxEntries"
			:initialEntries="account.fields[field.fieldId]"
			:autosuggest="autosuggest"
			:key="field.fieldId"
			:ref="field.fieldId"
			:onChange="onFieldChange(field.fieldId)"
			:fieldTypes="field.fieldTypes"/>
			<button @click="submit()" type="button" class="button">
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
			account: {},
			autosuggest: {},
			dependencies: {}
		};
	},
	methods: {
		submit() {
			let account = JSON.parse(JSON.stringify(this.account));
			let fields = JSON.parse(JSON.stringify(this.templateAccount)).fields;
			Object.keys(account.fields).forEach(fieldId => {
				if (this.$refs[fieldId]) fields[fieldId] = this.$refs[fieldId][0].entries;
			});
			account.fields = fields;
			this.onSubmit(account);
		},
		dependencyChecksOut(fieldId) {
			if (!this.dependencies[fieldId]) return true;
			let dependency = this.dependencies[fieldId];
			let dependencyFieldId = dependency.fieldId;
			if (!this.dependencyChecksOut(dependencyFieldId)) return false;
			let dependencyEval = dependency.eval.replace("{fields}", "this.account.fields");
			return eval(dependencyEval);
		},
		onFieldChange(fieldId) {
			return () => {
				this.$set(this.account.fields, fieldId, this.$refs[fieldId][0].entries);
			};
		}
	},
	props: {
		onSubmit: Function,
		initialAccount: Object
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("accountSchema.getLatest", res => {
				this.fields = res.schema.fields;
				this.dependencies = res.schema.dependencies;
				if (!this.initialAccount) {
					this.$set(this.account, "fields", {});
					this.$set(this.account, "version", res.schema.version);

					this.fields.forEach(field => {
						let defaultObject = {};
						field.fieldTypes.forEach(fieldType => {
							if (fieldType.type === "text" || fieldType.type === "select") defaultObject[fieldType.fieldTypeId] = "";
							else if (fieldType.type === "checkbox") defaultObject[fieldType.fieldTypeId] = false;
						});
						
						this.$set(this.account.fields, field.fieldId, []);

						for(let i = 0; i < field.minEntries; i++) {
							this.account.fields[field.fieldId].push(defaultObject);
						}
					});

					this.templateAccount = this.account;
				} else {
					this.account = this.initialAccount;
					this.templateAccount = this.initialAccount;
				}
			});

			socket.emit("util.getAutosuggest", res => {
				this.autosuggest = res.autosuggest;
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
