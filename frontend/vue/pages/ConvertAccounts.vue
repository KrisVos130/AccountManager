<template>
	<main>
		<h1>Convert accounts</h1>
		<hr/>
		<br/>
		<p>Select/deselect all:</p>
		<button class="button" v-for="version in versions" @click="toggleVersion(version)">{{version}}</button>
		<br/>
		<br/>
		<data-table ref="accounts-datatable"
			:fields="accountsFields"
			:sort-order="accountsSortOrder"
			:data="accountsLocalData"
		>
			<div slot="select-slot" slot-scope="props">
				<div tabindex="0" name="name" class="checkbox" @click="toggleCheckbox(props.data.accountId)" v-on:keyup.enter="toggleCheckbox(props.data.accountId)" v-on:keyup.space="toggleCheckbox(props.data.accountId)" :class="{ checked: selectedAccounts.indexOf(props.data.accountId) !== -1 }"></div>
			</div>
			<div slot="actions-slot" slot-scope="props">
				<router-link
					:to="`/convert/${props.data.accountId}`"
					class="button"
				>
					Convert account
				</router-link>
			</div>
		</data-table>
		<br/>
		<button @click="convertAccounts()" v-if="!convertingAccounts" class="button">Migrate accounts</button>
		<br/>
		<br/>
		<h1>Convert schemas</h1>
		<hr/>
		<br/>
		<select v-model="importConvertSchemaName">
			<option v-for="schema in schemasInDirectory" :value="schema">{{ schema }}</option>
		</select>
		<button @click="importConvertSchema()" class="button">Import convert schema</button>
		<br/>
		<br/>
		<data-table ref="convert-schema-datatable"
			:fields="convertSchemasFields"
			:sort-order="convertSchemasSortOrder"
			:data="convertSchemasLocalData"
		>
			<div slot="actions-slot" slot-scope="props">
				<router-link
					:to="`/convert/view/${props.data.schemaId}`"
					class="button"
				>
					View convert schema
				</router-link>
			</div>
		</data-table>
	</main>
</template>

<script>
import io from "../../io.js";

import DataTable from '../components/DataTable.vue';

export default {
	components: { DataTable },
	data: () => {
		return {
			accounts: [],
			convertSchemas: [],
			versions: [],
			selectedAccounts: [],
			schemasInDirectory: [],
			convertingAccounts: false,
			accountsFields: [
				{
					name: "select-slot",
					displayName: ""
				},
				{
					name: "name",
					displayName: "Name"
				},
				{
					name: "version",
					displayName: "Version"
				},
				{
					name: "actions-slot",
					displayName: "Actions"
				}
			],
			accountsSortOrder: [
				{
					field: "name",
					order: "desc"
				},
				{
					field: "version",
					order: "asc"
				}
			],
			convertSchemasFields: [
				{
					name: "versionFrom",
					displayName: "Version from"
				},
				{
					name: "versionTo",
					displayName: "Version to"
				},
				{
					name: "actions-slot",
					displayName: "Actions"
				}
			],
			convertSchemasSortOrder: [
				{
					field: "versionFrom",
					order: "asc"
				},
				{
					field: "versionTo",
					order: "asc"
				}
			],
			importConvertSchemaName: ""
		}
	},
	computed: {
		accountsLocalData: function() {
			return this.accounts.map(account => {
				return {
					name: account.fields.name[0].name,
					version: account.version,
					accountId: account._id
				};
			});
		},
		convertSchemasLocalData: function() {
			return this.convertSchemas.map(schema => {
				return {
					versionFrom: schema.versionFrom,
					versionTo: schema.versionTo,
					schemaId: schema._id
				};
			});
		}
	},
	methods: {
		importConvertSchema() {
			this.socket.emit("convertSchema.import", this.importConvertSchemaName, (res) => {
				console.log(res);
				alert(res.status);
			});
		},
		convertAccounts() {
			this.convertingAccounts = true;
			this.socket.emit("account.migrateAccounts", this.selectedAccounts, (res) => {
				console.log(res);
				alert(`Migrated accounts. Successful: ${res.successful}; failed: ${res.failed}`);
				location.reload();
			});
		},
		toggleCheckbox(accountId) {
			const selectedAccountIndex = this.selectedAccounts.indexOf(accountId);
			if (selectedAccountIndex === -1) this.selectedAccounts.push(accountId);
			else this.selectedAccounts.splice(selectedAccountIndex, 1);
		},
		toggleVersion(version) {
			let allAccountsChecked = true;
			this.accounts.forEach(account => {
				if (account.version === version && this.selectedAccounts.indexOf(account._id) === -1) allAccountsChecked = false;
			});

			let toggleTo;

			if (allAccountsChecked) toggleTo = false;
			else toggleTo = true;

			this.accounts.forEach(account => {
				if (account.version === version) {
					let selectedAccountIndex = this.selectedAccounts.indexOf(account._id);
					if (toggleTo && selectedAccountIndex === -1) this.selectedAccounts.push(account._id);
					if (!toggleTo && selectedAccountIndex !== -1) this.selectedAccounts.splice(selectedAccountIndex, 1);
				}
			});
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("account.getAll", res => {
				console.log(res);
				this.accounts = res.accounts;
			});

			socket.emit("accountSchema.getAllVersions", res => {
				this.versions = res.versions;
			});

			socket.emit("convertSchema.getAll", res => {
				this.convertSchemas = res.schemas;
			});

			socket.emit("convertSchema.listSchemasInDirectory", res => {
				this.schemasInDirectory = res.schemasInDirectory;
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.checkbox {
	height: 32px;
	width: 32px;
	background-color: white;
	border: .5px #464646 solid;
	border-radius: 3px;
	cursor: pointer;
	position: relative;
	box-sizing: border-box;

	&.disabled {
		cursor:auto;
	}
}

.checkbox.checked::after {
	content: "";
	width: 26px;
	height: 26px;
	left: 2px;
	top: 2px;
	display: inline-block;
	position: absolute;
	border-radius: 3px;
	background-color: #69B862;
}
</style>