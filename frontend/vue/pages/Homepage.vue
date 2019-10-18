<template>
	<main>
		<h1>Homepage</h1>
	</main>
</template>

<script>
import DataTable from '../components/DataTable.vue'

import io from "../../io.js";

export default {
	components: { DataTable },
	data: () => {
		return {
			
		}
	},
	methods: {
		
	},
	mounted() {
		io.getSocket(socket => {
			this.socket = socket;
		});
	}
};
</script>

<style lang="scss" scoped>

</style>
