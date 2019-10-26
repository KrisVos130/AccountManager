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
			path: "/accounts",
			component: () => import("./vue/pages/Accounts.vue")
		},
		{
			path: "/schemas",
			component: () => import("./vue/pages/Schemas.vue")
		},
		{
			path: "/convert",
			component: () => import("./vue/pages/ConvertAccounts.vue")
		},
		{
			path: "/convert/:accountId",
			component: () => import("./vue/pages/ConvertAccount.vue")
		},
		{
			path: "/convert/view/:schemaId",
			component: () => import("./vue/pages/ViewConvertSchema.vue")
		},
		{
			path: "/options",
			component: () => import("./vue/pages/Options.vue")
		},
		{
			path: "/schemas/:schemaId",
			component: () => import("./vue/pages/ViewAccountSchema.vue")
		},
		{
			path: "/accounts/add",
			component: () => import("./vue/pages/AddAccount.vue")
		},
		{
			path: "/accounts/edit/:accountId",
			component: () => import("./vue/pages/EditAccount.vue")
		},
	]
});

// router.beforeEach((to, from, next) => {
// 	next();
// });

lofig.folder = "/config/default.json";
lofig.get("backendUrl").then(url => {
	io.init(url);
});

new Vue({
	router,
	el: "#root",
	render: wrapper => wrapper(App)
});