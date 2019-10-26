<template>
	<div @click.stop="toggle()" class="object-container" :class="{ 'toggled-off': toggledOff }">
		<div v-if="isObject(item) && !toggledOff">
			<p v-for="(value, name) in item">
				<b>{{ name }}</b>: 
				<object-item :item="value" v-if="isArray(value) || isObject(value)"/>
				<span v-else>{{ value }}</span>
			</p>
		</div>

		<div v-if="isArray(item) && !toggledOff">
			<p v-for="(value, index) in item">
				<b>{{ index }}</b>
				<object-item :item="value" v-if="isArray(value) || isObject(value)"/>
				<span v-else>{{ value }}</span>
			</p>
		</div>
	</div>
</template>

<script>
import ObjectItem from './ObjectItem.vue';

export default {
	components: { ObjectItem },
	name: "ObjectItem",
	data: () => {
		return {
			toggledOff: false
		}
	},
	computed: {
		
	},
	props: {
		item: [Object, Array]
	},
	methods: {
		isObject(item) {
			return typeof item === "object" && item !== null && !Array.isArray(item);
		},
		isArray(item) {
			return Array.isArray(item);
		},
		toggle() {
			this.toggledOff = !this.toggledOff;
		}
	},
	mounted() {
		
	}
};
</script>

<style lang="scss" scoped>
.object-container {
	padding-left: 25px;
	border: 1px solid black;
	margin-right: -1px;
	margin-bottom: -1px;

	&.toggled-off {
		padding: 10px;
		
		&::before {
			content: "Click to show";
		}
	}
}


</style>
