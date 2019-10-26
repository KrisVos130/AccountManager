<template>
	<main v-if="schema">
		<h1>View schema</h1>
		<hr/>
		<br/>
		<p><b>Version from</b>: {{ schema.versionFrom }}</p>
		<p><b>Version to</b>: {{ schema.versionTo }}</p>
		<p><b>Changes</b>: </p>
		<div class="changes-container">
			<div v-for="(key, value) in schema.changes" class="change-item">
				<p><b>{{ key }}</b>: {{ value }}</p>
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
			this.socket.emit("convertSchema.removeById", this.schemaId, (res) => {
				alert(res.status);
				this.$router.push("/convert");
			});
		}
	},
	mounted() {
		this.schemaId = this.$route.params.schemaId;
		io.getSocket(socket => {
			this.socket = socket;

			this.socket.emit("convertSchema.getById", this.schemaId, res => {
				if (res.status === "success") {
					this.schema = res.schema;
					this.schema.changes = {
						Test123: "test1232321"
					}
				}
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.change-item {
	padding-left: 25px;
	border: 1px solid black;
	margin-right: -1px;
	margin-bottom: -1px;
}
</style>
