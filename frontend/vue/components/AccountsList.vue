<template>
	<div class="accounts-list">
		<div class="account" v-for="(account, accountIndex) in accounts">
			Account
			<button
				@click="editAccount(accountIndex)"
			>
				Edit account
			</button>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			
		};
	},
	methods: {
		
	},
	props: {
		accounts: Array
	},
	mounted() {
	},
	methods: {
		editAccount(index) {
			console.log(this.accounts[index]);
		}
		/*addEntry() {
			let emptyEntry = [];
			this.fieldTypes.forEach((fieldType) => {
				emptyEntry.push(null);
			});
			this.entries.push(emptyEntry);
		},
		removeEntry(index) {
			this.entries.splice(index, 1);
		},
		toggleCheckbox(entryIndex, fieldIndex) {
			this.$set(this.entries[entryIndex], fieldIndex, !this.entries[entryIndex][fieldIndex]);
		}*/
	}
};
</script>

<style lang="scss" scoped>

</style>
