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
			:readonly="readonly"
			:fieldTypes="field.fieldTypes"/>
			<button @click="submit()" type="button" class="button" v-if="!readonly">
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
			schema: {},
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
			/*try {
				return eval(dependencyEval);
			} catch(err) {
				console.log("Eval error", err);
				return false;
			}*/
			return false;
		},
		onFieldChange(fieldId) {
			return () => {
				this.$set(this.account.fields, fieldId, this.$refs[fieldId][0].entries);
			};
		},
		initializeAccount() {
			if (!this.initialAccount) {
				this.$set(this.account, "fields", {});
				this.$set(this.account, "version", this.schema.version);

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
		}
	},
	props: {
		onSubmit: Function,
		initialAccount: Object,
		readonly: Boolean
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			if (this.initialAccount) {
				socket.emit("accountSchema.getByVersion", this.initialAccount.version, res => {
					this.fields = res.schema.fields;
					this.dependencies = (res.schema.dependencies) ? res.schema.dependencies : {};
					this.initializeAccount();
				});
			} else {
				socket.emit("accountSchema.getLatest", res => {
					this.fields = res.schema.fields;
					this.schema = res.schema;
					this.dependencies = (res.schema.dependencies) ? res.schema.dependencies : {};
					this.initializeAccount();
				});
			}

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
