<template>
	<main v-if="schema">
		<h1>View schema</h1>
		<hr/>
		<br/>
		<p><b>Name</b>: {{ schema.name }}</p>
		<p><b>Description</b>: {{ schema.description }}</p>
		<p><b>Version</b>: v{{ schema.version }}</p>
		<p><b>Fields</b>: </p>
		<div class="fields-container">
			<div v-for="field in schema.fields" class="field-item">
				<p><b>Field ID</b>: {{ field.fieldId }}</p>
				<p><b>Name</b>: {{ field.name }}</p>
				<p><b>Min entries</b>: {{ field.minEntries }}</p>
				<p><b>Max entries</b>: {{ field.maxEntries }}</p>
				<p><b>Field types</b>:</p>
				<div class="field-types-container">
					<div v-for="fieldType in field.fieldTypes" class="field-type-item">
						<p><b>Field type ID</b>: {{ fieldType.fieldTypeId }}</p>
						<p><b>Type</b>: {{ fieldType.type }}</p>
						<p><b>Fill</b>: {{ fieldType.fill }}</p>
						<p v-if="fieldType.type === 'select'"><b>Options</b>: </p>
						<div v-if="fieldType.type === 'select'">
							<div v-for="option in fieldType.options" class="option-item">
								<p><b>Text</b>: {{ option.text }}</p>
								<p><b>Value</b>: {{ option.value }}</p>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>
		<br/>
		<br/>
		<button class="button" @click="removeSchema()">Remove schema</button>
	</main>
</template>

<script>
import io from "../../io.js";

export default {
	components: {},
	data: () => {
		return {
			schema: null
		}
	},
	props: {
	},
	methods: {
		removeSchema() {
			this.socket.emit("accountSchema.removeById", this.schemaId, (res) => {
				alert(res.status);
				this.$router.push("/schemas");
			});
		}
	},
	mounted() {
		this.schemaId = this.$route.params.schemaId;
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("accountSchema.getLatest", this.schemaId, res => {
				if (res.status === "success") {
					this.schema = res.schema;
				}
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.field-item, .field-type-item, .option-item {
	padding-left: 25px;
	border: 1px solid black;
	margin-right: -1px;
	margin-bottom: -1px;
}
</style>
