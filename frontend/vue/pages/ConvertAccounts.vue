<template>
	<main>
		<h1>Accounts</h1>
		<hr/>
		<br/>
		<input v-model="importConvertSchemaName"/>
		<button @click="importConvertSchema()" class="button">Import convert schema</button>
		<br/>
		<br/>
		<data-table ref="datatable"
			:fields="fields"
			:sort-order="sortOrder"
			:data="localData"
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
		<br/>
		<button @click="convertAccounts()" v-if="!convertingAccounts" class="button">Migrate accounts</button>
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
			selectedAccounts: [],
			convertingAccounts: false,
			fields: [
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
			sortOrder: [
				{
					field: "name",
					order: "desc"
				},
				{
					field: "version",
					order: "asc"
				}
			],
			importConvertSchemaName: ""
		}
	},
	computed: {
		localData: function() {
			return this.accounts.map(account => {
				return {
					name: account.fields.name[0].name,
					version: account.version,
					accountId: account._id
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
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			socket.emit("account.getAll", res => {
				console.log(res);
				this.accounts = res.accounts;
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