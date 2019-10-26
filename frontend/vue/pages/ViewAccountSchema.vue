<template>
	<main v-if="schema">
		<h1>View schema</h1>
		<hr/>
		<br/>
		<object-viewer :object="schema"/>
		<br/>
		<br/>
		<button class="button" @click="removeSchema()">Remove schema</button>
	</main>
</template>

<script>
import ObjectViewer from '../components/ObjectViewer.vue';

import io from "../../io.js";

export default {
	components: { ObjectViewer },
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
