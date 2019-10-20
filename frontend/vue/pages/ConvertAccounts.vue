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
			<div slot="actions-slot" slot-scope="props">
				<router-link
					:to="`/convert/${props.data.accountId}`"
					class="button"
				>
					Convert account
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
			fields: [
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

</style>