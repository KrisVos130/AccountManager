<template>
	<div class="control">
		<label for="name">{{ name }}</label>
		<button v-if="entries.length === 0 && !readonly" @click="addEntry()" type="button">+</button>
		<div class="control-row" v-for="(entry, entryIndex) in entries">
			<div class="control-col" v-for="(fieldType, fieldIndex) in fieldTypes" :class="{ 'fill-remaining': fieldType.fill }">
				<input :ref="`input:${entryIndex}:${fieldType.fieldTypeId}`" :disabled="readonly" name="name" type="text" v-if="fieldType.type === 'text'" v-model="entry[fieldType.fieldTypeId]" @change="onInputChange()" v-on:blur="blurInput(entryIndex, fieldType.fieldTypeId)" v-on:focus="focusInput(entryIndex, fieldType.fieldTypeId)" v-on:keydown="keydownInput(entryIndex, fieldType.fieldTypeId)" @keyup.ctrl.exact.59="fillInput(entryIndex, fieldType.fieldTypeId, 'date')" @keyup.ctrl.shift.exact.59="fillInput(entryIndex, fieldType.fieldTypeId, 'time')" />
				<select name="name" v-if="fieldType.type === 'select'" :disabled="readonly" class="fill-remaining" v-model="entry[fieldType.fieldTypeId]" @change="onSelectChange()">
					<option v-for="option in fieldType.options" :value="option.value">{{option.text}}</option>
				</select>
				<div tabindex="0" v-on:keyup.enter="toggleCheckbox(entryIndex, fieldType.fieldTypeId)" v-on:keyup.space="toggleCheckbox(entryIndex, fieldType.fieldTypeId)" name="name" class="checkbox" v-if="fieldType.type === 'checkbox'" :class="{ checked: entry[fieldType.fieldTypeId], disabled: readonly }" @click="toggleCheckbox(entryIndex, fieldType.fieldTypeId)"></div>

				<button v-if="fieldType.extraButtons && !readonly" v-for="buttonInfo in fieldType.extraButtons" type="button" :class="[buttonInfo.style]">{{buttonInfo.icon}}</button>
				<button v-if="entryIndex + 1 === entries.length && entryIndex + 1 < maxEntries && fieldIndex + 1 === fieldTypes.length && !readonly" @click="addEntry()" type="button">+</button>
				<button v-if="entries.length > minEntries && fieldIndex + 1 === fieldTypes.length && !readonly" @click="removeEntry(entryIndex)" type="button">-</button>

				<div v-if="fieldType.autosuggestGroup && (focusedInput === `${entryIndex}.${fieldType.fieldTypeId}` || autosuggestHover === `${entryIndex}.${fieldType.fieldTypeId}`)" class="autosuggest-container" @mouseover="focusAutosuggestContainer(entryIndex, fieldType.fieldTypeId)" @mouseleave="blurAutosuggestContainer()">
					<div v-for="autosuggestItem in filter(autosuggest[fieldType.autosuggestGroup], entry[fieldType.fieldTypeId])" class="autosuggest-item" @click="selectAutosuggest(entryIndex, fieldType.fieldTypeId, autosuggestItem)">
						{{ autosuggestItem }}
					</div>
				</div>
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
			entries: [...this.initialEntries],
			focusedInput: "",
			activeAutosuggestHover: "",
			autosuggestHover: ""
		};
	},
	props: {
		name: String,
		fieldTypes: Array,
		minEntries: Number,
		maxEntries: Number,
		initialEntries: Array,
		autosuggest: Object,
		onChange: Function,
		readonly: Boolean
	},
	mounted() {
		
	},
	methods: {
		addEntry() {
			let emptyEntry = {};
			this.fieldTypes.forEach((fieldType) => {
				if (fieldType.type === "text" || fieldType.type === "select") emptyEntry[fieldType.fieldTypeId] = "";
				else if (fieldType.type === "checkbox") emptyEntry[fieldType.fieldTypeId] = false;
			});
			this.entries.push(emptyEntry);
			this.onChange();
		},
		removeEntry(index) {
			this.entries.splice(index, 1);
			this.onChange();
		},
		toggleCheckbox(entryIndex, fieldTypeId) {
			if (this.readonly) return;
			this.entries[entryIndex][fieldTypeId] = !this.entries[entryIndex][fieldTypeId];
			this.onChange();
		},
		selectAutosuggest(entryIndex, fieldTypeId, autosuggestItem) {
			this.entries[entryIndex][fieldTypeId] = autosuggestItem;
		},
		blurInput(entryIndex, fieldTypeId) {
			this.focusedInput = "";
		},
		focusInput(entryIndex, fieldTypeId) {
			this.focusedInput = `${entryIndex}.${fieldTypeId}`;
		},
		keydownInput(entryIndex, fieldTypeId) {

		},
		focusAutosuggestContainer(entryIndex, fieldTypeId) {
			this.autosuggestHover = `${entryIndex}.${fieldTypeId}`;
		},
		blurAutosuggestContainer() {
			this.autosuggestHover = "";
		},
		onSelectChange() {
			this.onChange();
		},
		onInputChange() {
			this.onChange();
		},
		filter(autosuggest, value) {
			return autosuggest.filter(autosuggestItem => autosuggestItem.toLowerCase().startsWith(value.toLowerCase())).sort();
		},
		fillInput(entryIndex, fieldTypeId, fillType) {
			let input = this.$refs[`input:${entryIndex}:${fieldTypeId}`][0];
			const cursorPoint = input.selectionStart;
			const currentValue = this.entries[entryIndex][fieldTypeId];

			const firstPart = currentValue.substring(0, cursorPoint);
			const lastPart = currentValue.substring(cursorPoint, currentValue.length);

			let fillValue = "";
			const currentDate = new Date();
			switch(fillType) {
				case "date":
					const year = currentDate.getFullYear();
					const month = `0${(currentDate.getMonth() + 1)}`.slice(-2);
					const day = `0${currentDate.getDate()}`.slice(-2);
					fillValue = `${year}-${month}-${day}`;
					break;
				case "time":
					const hour = `0${currentDate.getHours()}`.slice(-2);
					const minute = `0${currentDate.getMinutes()}`.slice(-2);
					fillValue = `${hour}:${minute}`;
					break;
			}

			const newValue = `${firstPart}${fillValue}${lastPart}`;

			this.entries[entryIndex][fieldTypeId] = newValue;

			const newCaretPosition = firstPart.length + fillValue.length;
			this.$nextTick(() => {
				input.focus();
				input.setSelectionRange(newCaretPosition, newCaretPosition);
			});
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
		position: relative;
		button:last-of-type {
			border-radius: 0 5px 5px 0;
		}

		> input:not(:last-child) {
			border-right: none;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		.autosuggest-container {
			position: absolute;
			top: 31px;
			width: 100%;
			border-radius: 5px 5px 5px 5px;
			border: solid .5px #464646;
			z-index: 10;

			.autosuggest-item {
				padding: 8px;
				cursor: pointer;
				background-color: white;
				

				&:hover, &:focus {
					background-color: lightgray;
				}
			}
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

	&.disabled {
		cursor:auto;
	}
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
