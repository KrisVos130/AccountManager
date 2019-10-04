<template>
	<div class="control">
		<label for="name">{{ name }}</label>
		<button v-if="entries.length === 0" @click="addEntry()" type="button">+</button>
		<div class="control-row" v-for="(entry, entryIndex) in entries">
			<div class="control-col" v-for="(fieldType, fieldIndex) in fieldTypes" :class="{ 'fill-remaining': fieldType.fill }">
				<input name="name" type="text" v-if="fieldType.type === 'text'" v-model="entry[fieldIndex]"/>
				<select name="name" v-if="fieldType.type === 'select'" class="fill-remaining" v-model="entry[fieldIndex]">
					<option v-for="option in fieldType.options" :value="option.value">{{option.text}}</option>
				</select>
				<div tabindex="0" v-on:keyup.enter="toggleCheckbox(entryIndex, fieldIndex)" v-on:keyup.space="toggleCheckbox(entryIndex, fieldIndex)" name="name" class="checkbox" v-if="fieldType.type === 'checkbox'" :class="{ checked: entry[fieldIndex] }" @click="toggleCheckbox(entryIndex, fieldIndex)"></div>

				<button v-if="fieldType.extraButtons" v-for="buttonInfo in fieldType.extraButtons" type="button" :class="[buttonInfo.style]">{{buttonInfo.icon}}</button>
				<button v-if="entryIndex + 1 === entries.length && entryIndex + 1 < maxEntries && fieldIndex + 1 === fieldTypes.length" @click="addEntry()" type="button">+</button>
				<button v-if="entries.length > minEntries && fieldIndex + 1 === fieldTypes.length" @click="removeEntry(entryIndex)" type="button">-</button>
			</div>
		</div>
	</div>
</template>

<script>
function Field() {

}

export default {
	data: function() {
		return {
			entries: [this.initialEntries]
		};
	},
	methods: {
		
	},
	props: {
		name: String,
		fieldTypes: Array,
		minEntries: Number,
		maxEntries: Number,
		initialEntries: Array
	},
	mounted() {

	},
	methods: {
		addEntry() {
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
		}
	}
};
</script>

<style lang="scss" scoped>
.control {
	width: 100%;
	margin-bottom: 16px;

	label {
		display: block;
		margin-bottom: 4px;
	}

	.control-row {
		height: 32px;
		display: flex;
		grid-column-gap: 12px;
	}

	.control-row:not(:last-of-type) {
		margin-bottom: 8px;
	}

	.control-col {
		display: flex;
		button:last-of-type {
			border-radius: 0 5px 5px 0;
		}

		> input:not(:last-child) {
			border-right: none;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	input, select {
		border: solid .5px #464646;
		border-radius: 5px;
		padding: 4px;
	}

	input {
		width: 100%;
	}

	button {
		width: 32px;
		height: 32px;
		border: none;
		font-size: 24px;
		background-color: green;
		color: white;
		cursor: pointer;
	}

	button:hover, button:focus {
		background-color: darkgreen;
	}
}

.fill-remaining {
	width: 100%;
	width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
}

.checkbox {
	height: 32px;
	width: 32px;
	background-color: white;
	border: .5px #464646 solid;
	border-radius: 3px;
	cursor: pointer;
	position: relative;
	box-sizing: border-box;
}

.checkbox.checked::after {
	content: "";
	width: 26px;
	height: 26px;
	left: 2px;
	top: 2px;
	display: inline-block;
	position: absolute;
	border-radius: 3px;
	background-color: #69B862;
}
</style>
