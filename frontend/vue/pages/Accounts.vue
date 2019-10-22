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
					name: "complete",
					displayName: "% complete"
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
				const completePercentage = (Object.keys(account.fields).filter(fieldName => account.fields[fieldName].length >= 1).length / Object.keys(account.fields).length) * 100;

				return {
					name: account.fields.name[0].name,
					domain: account.fields.domain.map(domain => domain.domain).join(", "),
					email: account.fields.email.map(email => email.email).join(", "),
					complete: `${(completePercentage % 1 > 0) ? completePercentage.toFixed(2) : completePercentage}%`,
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