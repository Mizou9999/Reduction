import axios from "axios";
import InfoComponentVue from "./components/helpers/InfoComponent.vue";
import smsConfirmationVue from "./components/pages/sms/smsConfirmation.vue";
import kz from "./locales/kz";
import stocksProducts from "./stores/modules/stocksProducts";

const instance = axios.create({
	baseURL: "https://lk.adit.pro",
	// baseURL: "/api",
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});
// VERIFY WHY ORGS DONT WORK HERE , BUT WORK IN OLD PROJECT!!!
// instance.interceptors.request.use(config => {
// 	const currentRouteName = this.$route.name;
// 	console.log(11111111,  currentRouteName)
// 	const baseUrlWithoutComponent = instance.defaults.baseURL.split(currentRouteName)[0];

// 	config.url = `${baseUrlWithoutComponent}${config.url}`;

// 	return config;
// });
export default instance;
