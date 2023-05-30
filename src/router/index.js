import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import login from "../components/registration/login.vue";

import codeConfirm from "../components/registration/codeConfirm.vue";
import home from "../components/companies/main.vue";
import settingsComp from "../components/settings/settings.vue";
import companyProducts from "../components/pages/sms/companyProducts.vue";
import smsConfirm from "../components/pages/sms/smsConfirmation.vue";
import subscribe from "../components/pages/subscribe.vue";
import smsStock from "../components/pages/sms/smsStock.vue";
import CompanyPage from "../components/companies/CompanyPage.vue";
import product from "../components/companies/Product.vue";

// function generateRoute(path, name, component) {
// 	return {
// 		path: `${path}/:id_org?/:id_stock?`,
// 		name,
// 		component,
// 	};
// }
// const routes = [
// 	generateRoute("/", "home", home),
// 	generateRoute("/product", "product", product),
// 	generateRoute("/smsStock", "smsStock", smsStock),
// 	// generateRoute("/login", "login", login),
// 	{
// 		path: "/login",
// 		name: "login",
// 		component: login,
// 	},
// 	generateRoute("/companyPage", "companyPage", CompanyPage),
// 	generateRoute("/codeConfirm", "codeConfirm", codeConfirm),
// 	generateRoute("/settings", "settings", settingsComp),
// 	generateRoute("/companyProducts", "companyProducts", companyProducts),
// 	generateRoute("/smsConfirm", "smsConfirm", smsConfirm),
// 	generateRoute("/subscribe", "subscribe", subscribe),
// ];
const routes = [
	{
		path: "/product/id_org=:id_org?&id_stock=:id_stock?",
		name: "product",
		component: product,
		props: true,
	},
	{
		path: "/smsStock/id_org=:id_org?&id_stock=:id_stock?",
		name: "smsStock",
		props: true,

		component: smsStock,
	},
	{
		path: "/",
		name: "home",
		props: true,
		component: home,
	},

	{
		path: "/login",
		name: "login",
		component: login,
	},

	{
		path: "/companyPage/id_org=:id_org?&id_stock=:id_stock?",
		name: "companyPage",
		component: CompanyPage,
	},
	{
		path: "/codeConfirm/:id_org?/:id_stock?",
		name: "codeConfirm",
		component: codeConfirm,
		props: true,
	},
	{
		path: "/settings/id_org=:id_org?&id_stock=:id_stock?",
		name: "settings",
		props: true,
		component: settingsComp,
	},
	{
		path: "/companyProducts/id_org=:id_org?&id_stock=:id_stock?",
		name: "companyProducts",
		component: companyProducts,
		props: true,
	},
	{
		path: "/smsConfirm/id_org=:id_org?&id_stock=:id_stock?",
		name: "smsConfirm",
		component: smsConfirm,
		props: true,
	},
	{
		path: "/subscribe/id_org=:id_org?&id_stock=:id_stock?",
		name: "subscribe",
		component: subscribe,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
