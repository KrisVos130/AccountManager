<template>
	<main>
		<h1>Accounts</h1>
		<hr/>
		<br/>
		<router-link
			to="/accounts/add"
			class="button"
		>
			Add account
		</router-link>
		<br/>
		<br/>
		<data-table ref="datatable"
			:fields="fields"
			:sort-order="sortOrder"
			:data="localData"
		>
			<div slot="actions-slot" slot-scope="props">
				<router-link
					:to="`/accounts/edit/${props.data.accountId}`"
					class="button"
				>
					Edit account
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
					name: "domain",
					displayName: "Domain(s)"
				},
				{
					name: "email",
					displayName: "Email(s)"
				},
				{
					name: "actions-slot",
					displayName: "Actions"
				}
			],
			sortOrder: [
				{
					field: "name",
					order: "asc"
				}
			]
		}
	},
	computed: {
		localData: function() {
			return this.accounts.map(account => {
				return {
					name: account.fields.name[0].name,
					domain: account.fields.domain.map(domain => domain.domain).join(", "),
					email: account.fields.email.map(email => email.email).join(", "),
					accountId: account._id
				};
			});
		}
	},
	methods: {
		
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