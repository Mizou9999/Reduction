import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import i18n from "./i18n.js";
import App from "./App.vue";
import store from "./stores/index.js";
import router from "./router";
import VueAgile from "vue-agile";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { vMaska } from "maska";

import "@/scss/main.scss";
import "@/scss/util.scss";

import InfoComponent from "@/components/helpers/InfoComponent.vue";
createApp(App)
	.use(store)
	.use(i18n)
	.use(router)
	.use(VueAgile)
	.use(Toast)
	.directive("maska", vMaska)

	.component("InfoComponent", InfoComponent)
	.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
