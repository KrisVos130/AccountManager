<template>
	<main>
		<h1>Schemas</h1>
		<hr/>
		<br/>
		<input v-model="importAccountSchemaName"/>
		<button @click="importAccountSchema()" class="button">Import account schema</button>
		<br/>
		<br/>
		<data-table ref="datatable"
			:fields="fields"
			:sort-order="sortOrder"
			:data="localData"
		>
			<div slot="actions-slot" slot-scope="props">
				<router-link
					:to="`/schemas/${props.data.schemaId}`"
					class="button"
				>
					View schema
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
			importAccountSchemaName: "",
			schemas: [],
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
					field: "version",
					order: "desc"
				}
			]
		}
	},
	computed: {
		localData: function() {
			return this.schemas.map(schema => {
				return {
					name: schema.name,
					version: schema.version,
					schemaId: schema._id
				};
			});
		}
	},
	methods: {
		importAccountSchema() {
			this.socket.emit("accountSchema.import", this.importAccountSchemaName, (res) => {
				console.log(res);
				alert(res.status);
			});
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("accountSchema.getAll", res => {
				this.schemas = res.schemas;
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.schema-item {
	display: block;
}
</style>
