<template>
	<main>
		<input v-model="importAccountSchemaName"/>
		<button @click="importAccountSchema()">Import account schema</button>

		<router-link v-for="schema in schemas" :to="`/schemas/${schema._id}`" class="schema-item">{{ schema.name }} v{{ schema.version }}</router-link>
	</main>
</template>

<script>
import io from "../../io.js";

export default {
	components: {},
	data: () => {
		return {
			importAccountSchemaName: "",
			schemas: []
		}
	},
	methods: {
		importAccountSchema() {
			this.socket.emit("importAccountSchema", this.importAccountSchemaName, (res) => {
				console.log(res);
				alert(res.status);
			});
		}
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("getAccountSchemas", res => {
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
