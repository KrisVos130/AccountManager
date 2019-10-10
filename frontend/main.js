import Vue from "vue";

import VueRouter from "vue-router";

import App from "./vue/App.vue";

import io from "./io.js";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			component: () => import("./vue/pages/Homepage.vue")
		},
		{
			path: "/add",
			component: () => import("./vue/pages/AddAccount.vue")
		}
	]
});

io.init("http://localhost:8080");

new Vue({
	router,
	el: "#root",
	render: wrapper => wrapper(App)
});