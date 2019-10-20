<template>
	<main>
		<h1>Convert account</h1>
		<hr/>
		<br/>
		<account-form class="account-form" v-if="oldAccount.version" :onSubmit="() => {}" :initialAccount="oldAccount" :readonly="true"/>
		<account-form class="account-form" v-if="newAccount.version" :onSubmit="onSubmit" :initialAccount="newAccount"/>
		<p v-else>{{ message }}</p>
	</main>
</template>

<script>
import AccountForm from '../components/AccountForm.vue';

import io from "../../io.js";

export default {
	components: { AccountForm },
	data: () => {
		return {
			oldAccount: {},
			newAccount: {},
			accountId: "",
			message: ""
		}
	},
	methods: {
		onSubmit(account) {
			console.log(account);
			this.socket.emit("account.editById", this.oldAccount._id, account, (res) => {
				console.log(res);
				if (res.status === "success") {
					this.$router.push("/accounts")
				}
			});
		},
		createMigratingAccount() {
			/*this.$set(this.newAccount, "fields", {});
			this.$set(this.newAccount, "version", this.newSchema.version);

			let defaultNewObjects = {};

			this.newSchema.fields.forEach(newField => {
				const oldField = this.oldSchema.fields.find(oldField => oldField.fieldId === newField.fieldId);
				let defaultNewObject = {};
				//console.log(newField.fieldId, newField);
				newField.fieldTypes.forEach(newFieldType => {
					if (newFieldType.type === "text" || newFieldType.type === "select") defaultNewObject[newFieldType.fieldTypeId] = "";
					else if (newFieldType.type === "checkbox") defaultNewObject[newFieldType.fieldTypeId] = false;
				});
				defaultNewObjects[newField.fieldId] = defaultNewObject;

				this.$set(this.newAccount.fields, newField.fieldId, []);

				
				if (oldField) { // If the new field id is the same in the old & new schema
					// console.log("FIELD STILL EXISTS", newField.fieldId);

					let entries = [];

					this.oldAccount.fields[oldField.fieldId].forEach(oldAccountFieldEntry => {
						entries.push({});
					});
					 
					newField.fieldTypes.forEach(newFieldType => {
						const oldFieldType = oldField.fieldTypes.find(oldFieldType => oldFieldType.fieldTypeId === newFieldType.fieldTypeId);
						if (oldFieldType) { // If the new field type id is the same in the old & new schema
							// console.log("FIELDTYPE STILL EXISTS", newFieldType.fieldTypeId);
							this.oldAccount.fields[oldField.fieldId].forEach((oldAccountFieldEntry, index) => {
								entries[index][newFieldType.fieldTypeId] = oldAccountFieldEntry[newFieldType.fieldTypeId];
							});
						} else { // If the new field type id was not in the old schema
							// console.log("NEW FIELDTYPE", newFieldType.fieldTypeId);
							entries = entries.map(entry => {
								entry[newFieldType.fieldTypeId] = defaultNewObject[newFieldType.fieldTypeId];
								return entry;
							});
						}
					});

					this.$set(this.newAccount.fields, newField.fieldId, entries);
				}
			});

			Object.keys(this.migrate.changes).forEach(changeOld => {
				const oldFieldId = changeOld.split(".")[0];
				const oldFieldTypeId = changeOld.split(".")[1];
				const changeNew = this.migrate.changes[changeOld];
				const newFieldId = changeNew.split(".")[0];
				const newFieldTypeId = changeNew.split(".")[1];
				
				const oldField = this.oldAccount.fields[oldFieldId];
				const newField = this.newAccount.fields[newFieldId];
				
				//console.log(oldField, newField);

				const entriesToAdd = oldField.length - newField.length;
				for(let i = 0; i < entriesToAdd; i++) {
					this.newAccount.fields[newFieldId].push(JSON.parse(JSON.stringify(defaultNewObjects[newFieldId])));
				}

				for(let i = 0; i < newField.length; i++) {
					//console.log(i, this.oldAccount.fields[oldFieldId][i][oldFieldTypeId], this.newAccount.fields[newFieldId][i][newFieldTypeId]);
					//this.$set(this.newAccount.fields[newFieldId][i], `${newFieldTypeId}`, this.oldAccount.fields[oldFieldId][i][oldFieldTypeId]);
					this.$set(this.newAccount.fields[newFieldId][i], newFieldTypeId, this.oldAccount.fields[oldFieldId][i][oldFieldTypeId]);
					//console.log(this.newAccount.fields[newFieldId][i]);
				}
			});

			this.newSchema.fields.forEach(newField => {
				const entriesToAdd = newField.minEntries - this.newAccount.fields[newField.fieldId];

				for(let i = 0; i < entriesToAdd; i++) {
					this.newAccount.fields[newField.fieldId].push(JSON.parse(JSON.stringify(defaultNewObjects[newField.fieldId])));
				}
			});

			//console.log(defaultNewObjects["newemail"]);*/
		}
	},
	mounted() {
		this.accountId = this.$route.params.accountId;
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("account.getById", this.accountId, res => {
				console.log(res);
				if (res.status === "success") {
					this.oldAccount = res.account;
				}
			});

			this.socket.emit("account.getMigratedAccount", this.accountId, res => {
				console.log(res);
				if (res.status === "success") {
					this.newAccount = res.account;
				} else this.message = res.message;
			});

			/*this.socket.emit("accountSchema.getByVersion", this.migrate.versionFrom, res => {
				this.oldSchema = res.schema;

				this.socket.emit("accountSchema.getByVersion", this.migrate.versionTo, res2 => {
					this.newSchema = res2.schema;


					this.createMigratingAccount();
				});
			});*/

			
		});	}
};
</script>

<style lang="scss" scoped>
.account-form {
	float: left;

	&:last-of-type {
		margin-left: 32px;
	}
}
</style>