<template>
	<div>
		<h1>Sites</h1>
		<form>
			<field
				v-for="field in exampleFields"
				:name="field.name"
				:minEntries="field.minEntries"
				:maxEntries="field.maxEntries"
				:initialEntries="field.initialEntries"
				:fieldTypes="field.fieldTypes"/>
		</form>
	</div>
</template>

<script>
import Field from '../components/Field.vue';

export default {
	components: { Field },
	data: () => {
		return {
			exampleFields: [
				{
					name: "Domain",
					fieldTypes: [
						{
							type: "checkbox",
							extraButtons: []
						},
						{
							type: "select",
							options: [
								{
									value: "option1",
									text: "Option 1"
								},
								{
									value: "option2",
									text: "Option 2"
								},
								{
									value: "option3",
									text: "Option 3"
								}
							]/*,
							extraButtons: [
								{
									icon: "~",
									style: "red"
								}
							]*/
						},
						{
							type: "text",
							extraButtons: [],
							fill: true
						}
					],
					minEntries: 0,
					maxEntries: 3,
					initialEntries: [
						[
							true,
							"option1",
							"Hahaha value"
						]
					]
				},
				{
					name: "Apps",
					fieldTypes: [
						{
							type: "select",
							options: [
								{
									value: "option1",
									text: "Option 1"
								},
								{
									value: "option2",
									text: "Option 2"
								},
								{
									value: "option3",
									text: "Option 3"
								}
							]/*,
							extraButtons: [
								{
									icon: "~",
									style: "red"
								}
							]*/
						},
						{
							type: "text",
							extraButtons: [],
							fill: true
						}
					],
					minEntries: 0,
					maxEntries: 3,
					initialEntries: [
						[
							true,
							"option1",
							"Hahaha value"
						]
					]
				}
			],
		}
	},
	methods: {
		
	},
	mounted() {
		
	}
};
</script>

<style lang="scss" scoped>
form {
	width: 400px;
}
</style>
