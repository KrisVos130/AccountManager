import Vue from "vue";

import VueRouter from "vue-router";

import App from "./vue/App.vue";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			component: () => import("./vue/pages/Homepage.vue")
		}
	]
});

new Vue({
	router,
	el: "#root",
	render: wrapper => wrapper(App)
});