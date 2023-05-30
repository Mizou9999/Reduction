/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
import createPersistedState from "vuex-persistedstate";
export default {
	plugins: [
		createPersistedState({
			storage: window.sessionStorage,
		}),
	],
	namespaced: true,
	state() {
		return {
			allStocks: [],
			allProducts: [],
			credentials: {},
			currentCompany: [],
			currentUser: null,
			currentStock: [],
			userPhone: null,
			isSubscribe: null,
			// new data
			isSubscribed: "",
			activeCompanies: [],
			isAuthorized: "",
			currentStatus: "",
			id_stock: "",
			codeError: "",
			userId: "",
			currentProduct: {},
			linkType: "",
			currentRoute: "",
		};
	},

	actions: {
		GET_CURRENT_ROUTE({ commit }, payload) {
			commit("SET_CURRENT_ROUTE", payload);
		},
		async SET_REGISTERED_SUBSCRIBED({ commit, dispatch }, formData) {
			try {
				const company = await axios.post("/api/org", { id: formData.id_org });
				commit("SET_CURRENTCOMPANY", company.data);
				commit("SET_STATUS", {
					status: { registered: true, subscribed: true },
					linktype: formData.from,
				});

				if (formData.from === "stock") {
					const myStock = await axios.post("/api/my_stock", { id_stock: formData.id_stock });
					commit("SET_STOCK", myStock.data);
				} else if (formData.from === "qr") {
					dispatch("company/OPEN_COMPANY", company.data[0], { root: true });
				}
			} catch (error) {
				console.log("SET_REGISTERED_SUBSCRIBED", error);
			}
		},
		async DELETE_ALL_SUBSCRIBE({ commit, dispatch }, companies) {
			try {
				companies.forEach(async company => {
					const deletedResponse = await axios.delete(`/api/phone?ids={${company.id}}`);
				});
				dispatch("login/ALL_UNSUBSCRIBED_SUCCESS", [], { root: true }).then(() => {
					let toast = useToast();
					toast.success("вы отписались от всех компаний", {
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
				});
			} catch (error) {
				console.log("error unsubscribe all companies", error);
			}
		},
		async DELETE_SUBSCRIBE({ commit }, user) {
			const data = await axios
				.delete(`/api/phone?ids={${user}}`)
				.then(response => {
					let toast = useToast();
					toast.success("вы успешно отписались", {
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
					commit("DELETE_SUCCESS", { registered: true, subscribed: false });
					localStorage.setItem("ISLOGGED", false);
				})
				.catch(error => {
					console.log("err delete user", error);
				});
		},
		async SIGNUPSMS({ commit, dispatch }, phone) {
			try {
				const data = await axios.post("/api/signup", { login: phone });
				commit("SIGNUP", phone);
				// router.push("/smsConfirm");
				commit("SET_CURRENT_ROUTE", "smsConfirm");
			} catch (error) {
				console.log("login err", error);
			}
		},
		async CONFIRM({ commit, dispatch }, formData) {
			try {
				// const sms = await axios.get("https://api.adit.pro/sms");
				// let split = sms.data.split(" ");
				// let code = split[split.length - 1];
				let loginForm = {
					login: formData.login,
					reg_type: "phone",
					verify_code: +formData.verify_code,
					// verify_code: +code,
				};
				const data = await axios.post("/api/signup", loginForm);
				if (data.data.status === "Successfully set password.") {
					localStorage.setItem("ISLOGGED", true);
					// verify if is registered
					try {
						const orgsResponse = await axios.post("api/orgs");
						const currentCompany = orgsResponse.data.find(
							company => company.id_org === formData.currentCompany.id
						);
						if (currentCompany && currentCompany.status === "active") {
							const myStock = await axios.post("/api/my_stock", { id_stock: formData.id_stock });
							commit("SET_STOCK", myStock.data);
							commit("SET_STATUS", {
								status: {
									registered: true,
									subscribed: true,
								},
								linktype: formData.from,
							});
						} else {
							commit("SET_STATUS", {
								status: {
									registered: true,
									subscribed: false,
								},
								// linktype: formData.from,
							});

							console.log("Registered / Unsubscribed 2", formData.from);
							// router.push("/subscribe");
							commit("SET_CURRENT_ROUTE", "subscribe");
						}
					} catch (err) {
						console.log("Unregistered ", err);
					}
				}
			} catch (error) {
				console.log("error code confirm", error);
				commit("SET_ERROR_CODE", error);
			}
		},

		async SUBSCRIBE({ commit, dispatch }, formData) {
			// Define method subscription data
			const methodSub = {
				is_sms: formData.is_sms,
				is_call: formData.is_call,
				is_tg: formData.is_tg,
			};

			// Define activation data
			const activationData = { id: formData.id, status: "active" };
			//

			try {
				// Update user's method subscription
				await axios.put("/api/user", methodSub);
				localStorage.setItem("is_call", methodSub.is_call);
				localStorage.setItem("is_subscribed", true);
			} catch (err) {
				console.log("Error updating user's method subscription:", err);
			}

			try {
				// Activate organization
				await axios.put("/api/orgs", activationData);
				commit("SET_STATUS", {
					status: {
						registered: true,
						subscribed: true,
					},
				});
			} catch (err) {
				console.log("Error activating organization:", err);
			}

			try {
				// Fetch list of companies
				const companies = await axios.post("/api/orgs");

				// Fetch single company by ID
				const company = await axios.post("https://lk.adit.pro/org", { id: formData.id });
				// const company = await axios.post("/api/org", { id: formData.id });

				// Fetch stock data for the company
				if (formData.linkType === "stock") {
					console.log("stock !");
					//  ------------------------------------------------  must add linkType !!!!!
					const myStock = await axios.post("/api/my_stock", { id_stock: formData.id_stock });
					// Commit stock data to store
					commit("SET_STOCK", myStock.data);
					// } else if (formData.linkType === "qr") {
				} else {
					console.log("else !");
					// commit("OPEN_COMPANY_QR");
					dispatch("company/OPEN_COMPANY", company.data[0], { root: true });
					console.log("qr ");
				}
			} catch (err) {
				console.log("Error fetching companies and stock data:", err);
			}
		},
		async GET_INITIAL_PRODUCTS({ commit, dispatch }, formData) {
			try {
				const currentCompany = await axios.post("https://lk.adit.pro/org", { id: formData.id_org });
				// const currentCompany = await axios.post("/api/org", { id: formData.id_org });
				const currentProducts = await axios.post("https://lk.adit.pro/my_products", {
					id_org: formData.id_org,
				});
				const myData = {
					currentProducts: currentProducts.data,
					currentCompany: currentCompany.data,
					currentCompanyId: formData.id_org,
					linkType: formData.from,
				};

				if (formData.from === "stock") {
					myData.currentStock = formData.id_stock;
				}

				commit("SET_INITIAL_PRODUCTS", myData);
			} catch (error) {
				console.log("login err", error);
			}
		},
	},
	mutations: {
		openProduct(state, product) {
			state.currentProduct = product;
			// state.currentRoute = "product";
			// router.push("/product");
		},
		openStock(state, stock) {
			state.currentStock = stock;
			state.currentRoute = "stock";
			state.id_stock = stock.id_stock;
			// router.push("/smsStock");
		},
		// old
		DELETE_SUCCESS(state, payload) {
			state.currentStatus = payload;
		},
		SET_CURRENT_ROUTE(state, payload) {
			state.currentRoute = payload;
		},
		SET_ERROR_CODE(state, error) {
			state.codeError = !state.codeError;
		},
		SET_STATUS(state, formData) {
			state.currentStatus = formData.status;
			if (formData.linkType) state.linkType = formData.linkType;
		},
		SET_AUTHORIZATION(state, isAuthorized) {
			state.isAuthorized = isAuthorized;
		},
		SET_COMPANIES(state, activeCompanies) {
			state.activeCompanies = activeCompanies;
		},

		SET_INITIAL_PRODUCTS(state, { currentCompany, currentProducts, linkType, currentStock }) {
			state.currentCompany = currentCompany;
			state.allProducts = currentProducts;
			state.linkType = linkType;
			state.id_stock = linkType === "stock" ? currentStock : undefined;
			state.currentRoute = "companyProducts";
			// router.push("/companyProducts");
		},

		SET_STOCK(state, stock) {
			state.currentStock = stock;
			state.currentRoute = "stock";
			state.id_stock = stock.id_stock;
			// router.push("/smsStock");
		},

		SIGNUP(state, phone) {
			state.userPhone = phone;
		},
		SUBSCRIBE_TO_SHOP(state, isSubscribe) {
			state.isSubscribe = isSubscribe;
		},
		SET_CURRENTCOMPANY(state, currentCompany) {
			state.currentCompany = currentCompany;
		},
		SET_USER_ID(state, userId) {
			state.userId = userId;
		},
		OPEN_PRODUCT(state, product) {
			state.currentProduct = product;
			// state.currentRoute = "product";
			router.push("/product");
		},
		OPEN_SUBSCRIBE(state, payload) {
			state.linkType = payload;
			state.currentRoute = "subscribe";
			// router.push("/subscribe");
		},
	},
};
