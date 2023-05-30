import axios from "axios";
import router from "@/router";
import createPersistedState from "vuex-persistedstate";

export default {
	plugins: [
		createPersistedState({
			storage: window.sessionStorage,
		}),
	],
	state() {
		return {};
	},
	actions: {
		async GET_INITIAL_PRODUCTS({ commit }, formData) {
			try {
				// https://api.adit.pro/my_products
				// const currentCompany = await axios.post("https://lk.adit.pro/org", {
				const currentCompany = await axios.post("https://lk.adit.pro/org", {
					id: formData.id_org,
				});
				const currentProducts = await axios.post("https://lk.adit.pro/my_products", {
					id_org: formData.id_org,
				});
				commit("SET_INITIAL_PRODUCTS", {
					currentProducts: currentProducts.data,
					currentCompany: currentCompany.data,
					currentStock: formData.id_stock,
					currentCompanyId: formData.id_org,
				});
			} catch (error) {
				console.log("login err", error);
			}
		},
	},
	mutations: {
		SET_INITIAL_PRODUCTS(state, formData) {},
	},
};
