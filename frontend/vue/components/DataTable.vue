<template>
	<table>
		<thead>
			<tr>
				<th v-for="field in fields">{{ field.displayName }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="data in computedData">
				<td v-for="field in fields">
					<span v-if="isFieldSlot(field.name)">
						<slot :name="field.name" :data="data"></slot>
					</span>
					<span v-else>
						{{ data[field.name] }}
					</span>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	components: {},
	data: () => {
		return {
			
		}
	},
	computed: {
		computedData: function() {
			let data = this.data;
			this.sortOrder.reverse().forEach(orderItem => {
				data = data.sort((a, b) => {
					if (orderItem.order === "desc") return a[orderItem.field] < b[orderItem.field];
					else return a[orderItem.field] > b[orderItem.field];
				});
			});
			return data;
		}
	},
	props: {
		data: Array,
		fields: Array,
		sortOrder: Array
	},
	methods: {
		isFieldSlot(name) {
			return !!this.$scopedSlots[name];
		}
	},
	mounted() {
		
	}
};
</script>

<style lang="scss" scoped>
table {
	background-color: white;
}

th, td {
	padding: 8px;
}

th {
	background-color: #eee;

	&:hover {
		background-color: #ddd;
	}
}

td {
	background-color: white;

	&:hover {
		background-color: #eee;
	}
}

table, th, td {
	border: 1px solid black;
	border-collapse: collapse;
}
</style>
