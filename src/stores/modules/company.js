/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
	namespaced: true,
	state() {
		return {
			companyProducts: {},
			myStock: {},
			settingsParent: null,

			// old
			currentCompany: null,
			products: null,
			stocks: null,
			logintype: null,
		};
	},
	actions: {
		async getStock({ commit }, stockId) {
			try {
				const myStock = await axios.post("/api/my_stock", { id_stock: stockId });
				commit("setStock", myStock.data);
			} catch (err) {
				console.log("err: getStock");
			}
		},
		async getCompany({ commit, dispatch }, company) {
			let id_org = company.id_org ? company.id_org : company.id;
			let stocksData;
			try {
				stocksData = await axios.post("/api/my_stocks", { id_org: id_org });
			} catch (err) {
				console.log("err getting stocks", err);
			}
			try {
				let currentCompany = await axios.post("/api/org", { id: id_org });
				const productsData = await axios.post("https://lk.adit.pro/my_products", {
					id_org: id_org,
				});
				const companyProducts = {
					company: currentCompany.data[0],
					stocks: stocksData.data,
					products: productsData.data,
				};
				commit("setCompanyProducts", companyProducts);
			} catch (err) {
				console.log("err getCompany /org", err);
			}

			if (company.isShowAllProducts) {
				dispatch("login/setIsLoggedIn", false, { root: true });
			} else {
				dispatch("login/setIsLoggedIn", true, { root: true });
			}
		},

		async openCompanyProducts({ commit, dispatch }, company) {
			let id_org = company.id_org ? company.id_org : company.id;

			const productsData = await axios.post("https://lk.adit.pro/my_products", {
				id_org: id_org,
			});

			commit("setCompanyProducts", {
				products: productsData.data,
				stocks: [],
				company: company,
			});

			// router.push("/companyPage");
		},
		async subscribe({ commit }, formData) {
			const methodSub = {
				is_sms: formData.is_sms,
				is_call: formData.is_call,
				is_tg: formData.is_tg,
			};
			try {
				// Update user's method subscription
				await axios.put("/api/user", methodSub);
			} catch (err) {
				console.log("Error updating user's method subscription:", err);
			}
		},
		async unsubscribeCompany({ commit, dispatch }, companies) {
			try {
				companies.forEach(async company => {
					const deletedResponse = await axios.delete(`/api/phone?ids={${company.id}}`);
				});

				let toast = useToast();
				toast.success(`вы отписались от ${companies[0].name}`, {
					position: "top-right",
					timeout: 5000,
					closeOnClick: true,
					pauseOnFocusLoss: true,
					pauseOnHover: true,
					draggable: true,
					draggablePercent: 0.6,
					showCloseButtonOnHover: false,

					closeButton: "button",
					icon: true,
					rtl: false,
				});
			} catch (error) {
				console.log("error unsubscribe all companies", error);
			}
		},

		// old
		async OPEN_COMPANY({ commit, dispatch }, company) {
			let id_org = company.id_org ? company.id_org : company.id;
			let stocksData;
			try {
				stocksData = await axios.post("/api/my_stocks", { id_org: id_org });
			} catch (err) {
				console.log("err getting stocks", err);
			}
			// https://api.adit.pro/my_products
			// https://lk.adit.pro/api/my_products
			const productsData = await axios.post("https://lk.adit.pro/my_products", {
				id_org: id_org,
			});

			commit("setCompanyProducts", {
				products: productsData.data,
				stocks: stocksData && stocksData.data ? stocksData.data : [],
				company: company,
			});
			// router.push("/companyPage");
			router.push({ name: "companyPage", params: { id_org: company.id } });
			// dispatch("stocksProducts/GET_CURRENT_ROUTE", "companyPage", { root: true });
		},
	},
	mutations: {
		setSettingsParent(state, parent) {
			state.settingsParent = parent;
		},
		setStock(state, stock) {
			state.myStock = stock;
		},
		setCompanyProducts(state, payload) {
			state.companyProducts = payload;
		},
		// old
		SET_LOGIN_TYPE(state, type) {
			state.logintype = type;
		},
		SET_CURRENTCOMPANY_PRODUCTS_STOCKS(state, formData) {
			state.products = formData.products;
			state.stocks = formData.stocks;
			state.currentCompany = formData.currentCompany;

			// router.push("/companyPage");
		},
	},
};
