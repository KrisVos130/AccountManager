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
			path: "*",
			component: () => import("./vue/pages/NotFound.vue")
		},
		{
			path: "/add",
			component: () => import("./vue/pages/AddAccount.vue")
		},
		{
			path: "/edit/:accountId",
			component: () => import("./vue/pages/EditAccount.vue")
		},
	]
});

// router.beforeEach((to, from, next) => {
// 	next();
// });

io.init("http://localhost:8080");

new Vue({
	router,
	el: "#root",
	render: wrapper => wrapper(App)
});