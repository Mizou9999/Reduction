/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router";

export default {
	namespaced: true,

	state() {
		return {
			user: null,
			isLoggedIn: false,
			companies: [],
			userNavigationType: "",
			initialCompany: {},
			orgId: null,
			stockId: null,
			isUserSubscribed: false,
			// old version
			userPhone: null,
			myCompanies: [],
			codeError: "",
		};
	},
	actions: {
		async getInialProducts({ commit }, id_org) {
			try {
				const data = await axios.post("https://lk.adit.pro/org", { id: id_org });
				const currentProducts = await axios.post("https://lk.adit.pro/my_products", {
					id_org: id_org,
				});
				commit("setInitalCompany", { company: data.data, currentProducts: currentProducts.data });
			} catch (error) {
				console.log("error getting initial company products");
			}
		},
		async getMe({ commit }) {
			try {
				const data = await axios.post("/api/user");
				commit("setMe", data.data[0]);
			} catch (error) {
				console.log("error login ", error);
			}
		},
		async getCompanies({ commit }) {
			try {
				const orgsResponse = await axios.post("/api/orgs");
				commit("setCompanies", orgsResponse.data);
				router.push("/");
				console.log("registred - domain");
			} catch (err) {
				console.log("Unregistered - domain", err);
				router.push("/login");
				// this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "login");
			}
		},
		async signUpFromOrgUrl({ commit }, phone) {
			try {
				const data = await axios.post("/api/signup", { login: phone });
				commit("signUp", phone);

				// dispatch("stocksProducts/GET_CURRENT_ROUTE", "codeConfirm", { root: true });
			} catch (error) {
				console.log("login FromUrlOrg err", error);
			}
		},
		async signUp({ commit }, phone) {
			try {
				const data = await axios.post("/api/signup", { login: phone });
				commit("signUp", phone);
				router.push("/codeConfirm");
				// dispatch("stocksProducts/GET_CURRENT_ROUTE", "codeConfirm", { root: true });
			} catch (error) {
				console.log("login err", error);
			}
		},
		async confirmCode({ commit }, formData) {
			try {
				let form = {
					login: formData.login,
					reg_type: "phone",
					verify_code: +formData.verify_code,
				};
				const data = await axios.post("/api/signup", form);
				console.log(666, data.headers);
				console.log(777, data.headers.token);
				if (data.data.status === "Successfully set password.") {
					localStorage.setItem("ISLOGGED", true);
					const orgsResponse = await axios.post("api/orgs");
					commit("setCompanies", orgsResponse.data);
					// dispatch("stocksProducts/GET_CURRENT_ROUTE", "mainComponent", { root: true });
					router.push("/");
				} else {
					console.log("could not connect ");
				}
			} catch (error) {
				console.log("login err", error);
				commit("SET_ERROR_CODE", error);
			}
		},
		async confirmCodeOrgUrl({ commit, dispatch }, formData) {
			try {
				let form = {
					login: formData.login,
					reg_type: "phone",
					verify_code: +formData.verify_code,
				};
				const data = await axios.post("/api/signup", form);

				if (data.data.status === "Successfully set password.") {
					const orgsResponse = await axios.post("/api/orgs");
					console.log(orgsResponse.data);
					await commit("setCompanies", orgsResponse.data);
					await dispatch("company/getCompany", formData, { root: true });
				} else {
					console.log("could not connect ");
				}
			} catch (error) {
				console.log("login err", error);
				commit("SET_ERROR_CODE", error);
			}
		},
		async confirmCodeStock({ commit, dispatch }, formData) {
			try {
				let form = {
					login: formData.login,
					reg_type: "phone",
					verify_code: +formData.verify_code,
				};
				const data = await axios.post("/api/signup", form);

				if (data.data.status === "Successfully set password.") {
					const orgsResponse = await axios.post("/api/orgs");
					console.log(orgsResponse.data);
					await commit("setCompanies", orgsResponse.data);
					await dispatch("company/getCompany", formData, { root: true });
				} else {
					console.log("could not connect ");
				}
			} catch (error) {
				console.log("login err", error);
				commit("SET_ERROR_CODE", error);
			}
		},
		setIsLoggedIn({ commit }, isLoggedIn) {
			commit("setIsLoggedIn", isLoggedIn);
		},

		// old version
		async SIGNUP({ commit, dispatch }, phone) {
			// console.log(111, phone);
			try {
				const data = await axios.post("/api/signup", { login: phone });
				commit("SIGNUP", phone);
				// router.push("codeConfirm");
				dispatch("stocksProducts/GET_CURRENT_ROUTE", "codeConfirm", { root: true });
			} catch (error) {
				console.log("login err", error);
			}
		},
		async CONFIRM({ commit, dispatch }, formData) {
			// console.log(111, formData);
			try {
				// const sms = await axios.get("/api/sms");
				// let split = sms.data.split(" ");
				// let code = split[split.length - 1];

				let form = {
					login: formData.login,
					reg_type: "phone",
					verify_code: +formData.verify_code,
					// verify_code: +code,
				};
				const data = await axios.post("/api/signup", form);

				if (data.data.status === "Successfully set password.") {
					localStorage.setItem("ISLOGGED", true);
					const orgsResponse = await axios.post("api/orgs");
					commit("SET_COMPANIES", orgsResponse.data);
					dispatch("stocksProducts/GET_CURRENT_ROUTE", "mainComponent", { root: true });
					// router.push("/");
				} else {
					console.log("refused to cnnect ");
				}
			} catch (error) {
				console.log("login err", error);
				commit("SET_ERROR_CODE", error);
			}
		},
		async GET_ORGS({ commit }) {
			try {
				const data = await axios.post("/api/orgs");
				commit("SET_COMPANIES", data.data);
			} catch (err) {
				console.log("err getting ogrs", err);
			}
		},
		ALL_UNSUBSCRIBED_SUCCESS({ commit }, payload) {
			commit("ALL_UNSUBSCRIBED_SUCCESS", payload);
		},
	},
	mutations: {
		userSubscribed(state, isSub) {
			state.isUserSubscribed = isSub;
		},
		setOrgId(state, orgId) {
			state.orgId = orgId;
		},
		setStockId(state, stockId) {
			state.stockId = stockId;
		},

		setInitalCompany(state, payload) {
			state.initialCompany = payload;
		},
		setUser(state, user) {
			state.user = user;
		},
		setIsLoggedIn(state, isLoggedIn) {
			state.isLoggedIn = isLoggedIn;
		},
		setCompanies(state, payload) {
			state.companies = payload;
		},
		signUp(state, phone) {
			state.userPhone = phone;
		},
		setUserNavigationType(state, payload) {
			state.userNavigationType = payload;
		},
		// old version
		SIGNUP(state, phone) {
			state.userPhone = phone;
		},
		SET_COMPANIES(state, companies) {
			console.log("SET_COMPANIES", companies);
			state.myCompanies = companies;
			// localStorage.setItem("ISLOGGED", true);
		},
		SET_ERROR_CODE(state, error) {
			state.codeError = !state.codeError;
		},
		UNSUBSCRIBED_SUCCESS(state, payload) {
			state.myCompanies.filter(company => company.id !== payload.id);
		},
		ALL_UNSUBSCRIBED_SUCCESS(state, payload) {
			state.myCompanies = payload;
		},
	},
};
