<!-- eslint-disable no-unused-vars -->
<template>
	<!-- <CompanyPage v-if="currentRoute === 'companyPage'" />
	<Login v-else-if="currentRoute === 'login'" /> -->
	<!-- <component :is="currentRoute" /> -->

	<router-view />
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
// import companyPage from "@/components/companies/CompanyPage.vue";
// import login from "@/components/registration/login.vue";
// import codeConfirm from "@/components/registration/codeConfirm.vue";
// import mainComponent from "@/components/companies/main.vue";
// import subscribe from "@/components/pages/subscribe.vue";
// import product from "@/components/companies/Product.vue";
// import stock from "@/components/pages/sms/smsStock.vue";
// import companyProducts from "@/components/pages/sms/companyProducts.vue";
// import smsConfirm from "@/components/pages/sms/smsConfirmation.vue";
export default {
	// components: {
	// 	companyPage,
	// 	login,
	// 	codeConfirm,
	// 	mainComponent,
	// 	subscribe,
	// 	product,
	// 	stock,
	// 	companyProducts,
	// 	smsConfirm,
	// },
	data() {
		return {
			isLoggedIn: false,
		};
	},
	watch: {
		currentRoute() {
			console.log("currentRoute changed", this.currentRoute);
		},
	},
	computed: {
		...mapState("stocksProducts", {
			currentRoute: state => state.currentRoute,
		}),
		...mapState("login", {
			me: state => state.user,
		}),
		activeCompanies() {
			return this.myCompanies.filter(company => company.status === "active");
		},
	},
	methods: {
		async getMe() {
			await axios
				.post("/api/user")
				.then(response => {
					this.$store.commit("login/setUser", response.data[0]);
					this.$store.commit("login/setIsLoggedIn", true);
					this.isLoggedIn = true;
				})
				.catch(error => {
					this.$store.commit("login/setIsLoggedIn", false);
					this.isLoggedIn = false;
				});
		},
		nextRoute(route) {
			this.$router.push(route);
		},

		async verifyAuthorization(formData) {
			try {
				const orgsResponse = await axios.post("/api/orgs");
				const currentCompany = orgsResponse.data.find(org => org.id_org === formData.id_org);
				if (currentCompany && currentCompany.status === "active") {
					console.log("Registered / Subscribed");
					this.$store.dispatch("stocksProducts/SET_REGISTERED_SUBSCRIBED", formData);
					this.$store.commit("stocksProducts/SET_USER_ID", currentCompany.id);
				} else {
					console.log("Registered / Unsubscribed");
					this.$store.commit("stocksProducts/SET_STATUS", {
						status: { registered: true, subscribed: false },
						linktype: formData.from,
					});
					this.$store.dispatch("stocksProducts/GET_INITIAL_PRODUCTS", formData);
					// this.$store.commit("stocksProducts/SET_USER_ID", currentCompany.id);
				}
			} catch (err) {
				console.log("Unregistered", formData.from);
				this.$store.commit("stocksProducts/SET_STATUS", {
					status: { registered: false, subscribed: false },
					linktype: formData.from,
				});
				this.$store.dispatch("stocksProducts/GET_INITIAL_PRODUCTS", formData);
			}
		},
		async verifyDomainAuthorization() {
			this.$store.commit("company/SET_LOGIN_TYPE", "normal");
			this.$store.commit("stocksProducts/SET_STATUS", {
				linktype: "domain",
			});
			try {
				const orgsResponse = await axios.post("/api/orgs");
				console.log("logged in - domain");

				this.$store.commit("login/SET_COMPANIES", orgsResponse.data);
				// this.nextRoute("/");
				this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "mainComponent");
				localStorage.setItem("is_subscribed", true);
			} catch (err) {
				console.log("Unregistered - domain", err);
				// this.nextRoute("/login");
				this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "login");
			}
		},
		async getCompanyProductsLoggedIn(id_org_url, id_stock) {
			const orgsResponse = await axios.post("/api/orgs");
			const currentCompany = orgsResponse.data.find(org => org.id_org === id_org_url);
			let isSubscribed = currentCompany.status === "active";
			await this.$store.dispatch("company/getCompany", currentCompany);
			if (isSubscribed) {
				this.$store.commit("login/userSubscribed", true);
				if (id_stock) {
					this.$router.push({ name: "companyPage", params: { id_org: id_org_url, id_stock } });
				} else {
					this.$router.push({ name: "companyPage", params: { id_org: id_org_url } });
				}
				// this.$router.push("/companyPage");
			} else {
				if (id_stock) {
					this.$router.push({ name: "subscribe", params: { id_org: id_org_url, id_stock } });
				} else {
					this.$router.push({ name: "subscribe", params: { id_org: id_org_url } });
				}
				this.$store.commit("login/userSubscribed", false);
				// this.$router.push("/subscribe");
				console.log(
					"user not subscribed to the company , push to /settings to subscribe then to company page "
				);
			}
		},
		getCompanyProductsNOTLoggedIn() {},
	},

	async created() {
		await this.getMe();
		let myUrl = window.location.toString();
		if (myUrl.includes("id_stock=") && myUrl.toString().includes("id_org=")) {
			console.log("stock");
			let id_org_url = myUrl.split("id_org=").pop().split("&id_stock=")[0];
			let searchTerm = "id_stock=";
			let searchIndex = myUrl.indexOf(searchTerm);
			let id_stock = myUrl.substr(searchIndex + searchTerm.length);

			await this.$store.commit("login/setUserNavigationType", "isOrgAndStockUrl");
			await this.$store.commit("login/setOrgId", id_org_url);
			await this.$store.commit("login/setStockId", id_stock);

			if (this.$route.name === "companyProducts") {
				this.$router.push({
					name: "companyProducts",
					params: { id_org: id_org_url, id_stock: id_stock },
				});
			} else {
				// If the user is logged in, load company products
				if (this.isLoggedIn) {
					this.getCompanyProductsLoggedIn(id_org_url, id_stock);
					console.log(this.isLoggedIn);
				}
				// If the user is not logged in, load the initial products
				else {
					await this.$store.dispatch("login/getInialProducts", id_org_url);
					this.$router.push({
						name: "companyProducts",
						params: { id_org: id_org_url, id_stock: id_stock },
					});
					console.log("not logged - id_org id stock");
				}
			}
		} else if (!myUrl.includes("id_stock=") && myUrl.toString().includes("id_org=")) {
			console.log("company");
			let id_org_url = myUrl.split("id_org=").pop();
			this.$store.commit("login/setUserNavigationType", "isOrgUrl");
			this.$store.commit("login/setOrgId", id_org_url);

			if (this.$route.name === "companyProducts") {
				this.getCompanyProductsLoggedIn(id_org_url);
			} else {
				// If the user is logged in, load company products
				if (this.isLoggedIn) {
					this.getCompanyProductsLoggedIn(id_org_url);
					console.log("logged - id_org only");
				}
				// If the user is not logged in, load the initial products
				else {
					await this.$store.dispatch("login/getInialProducts", id_org_url);
					this.$router.push({
						name: "companyProducts",
						params: { id_org: id_org_url },
					});
					console.log("not logged - id_org only");
				}
			}
		} else {
			this.$store.commit("login/setUserNavigationType", "isDefaultUrl");

			if (this.isLoggedIn) {
				this.$store.dispatch("login/getCompanies");
			} else {
				this.$router.push({ name: "login" });
			}
		}
	},

	// async created() {
	// 	await this.getMe();
	// 	let myUrl = window.location.toString();
	// 	if (myUrl.includes("id_stock=") && myUrl.toString().includes("id_org=")) {
	// 		console.log("stock");
	// 		let id_org_url = myUrl.split("id_org=").pop().split("&id_stock=")[0];
	// 		let searchTerm = "id_stock=";
	// 		let searchIndex = myUrl.indexOf(searchTerm);
	// 		let id_stock = myUrl.substr(searchIndex + searchTerm.length);

	// 		await this.$store.commit("login/setUserNavigationType", "isOrgAndStockUrl");
	// 		await this.$store.commit("login/setOrgId", id_org_url);
	// 		await this.$store.commit("login/setStockId", id_stock);
	// 		if (this.isLoggedIn) {
	// 			console.log(this.isLoggedIn);
	// 			this.getCompanyProductsLoggedIn(id_org_url);
	// 		} else {
	// 			await this.$store.dispatch("login/getInialProducts", id_org_url);
	// 			this.$router.push({
	// 				name: "companyProducts",
	// 				params: { id_org: id_org_url, id_stock: id_stock },
	// 			});
	// 			// this.$router.push("/companyProducts");

	// 			console.log("not logged - id_org only");
	// 		}
	// 	} else if (!myUrl.includes("id_stock=") && myUrl.toString().includes("id_org=")) {
	// 		console.log("company");
	// 		let id_org_url = myUrl.split("id_org=").pop();
	// 		this.$store.commit("login/setUserNavigationType", "isOrgUrl");
	// 		this.$store.commit("login/setOrgId", id_org_url);

	// 		if (this.isLoggedIn) {
	// 			this.getCompanyProductsLoggedIn(id_org_url);
	// 			console.log("logged - id_org only");
	// 		} else {
	// 			await this.$store.dispatch("login/getInialProducts", id_org_url);
	// 			// this.$router.push({ name: "companyProducts", params: { id_org: id_org_url } });
	// 			// this.$router.push("/companyProducts");
	// 			this.$router.push({
	// 				name: "companyProducts",
	// 				params: { id_org: id_org_url },
	// 			});
	// 			console.log("not logged - id_org only");
	// 		}
	// 	} else {
	// 		this.$store.commit("login/setUserNavigationType", "isDefaultUrl");

	// 		if (this.isLoggedIn) {
	// 			this.$store.dispatch("login/getCompanies");
	// 		} else {
	// 			// this.$router.push("/login");
	// 			this.$router.push({ name: "login" });
	// 		}
	// 	}
	// },
	// beforeRouteLeave(to, from, next) {
	// 	localStorage.setItem("currentRoute", from.path);

	// 	if (from.name) {
	// 		localStorage.setItem("componentName", from.name);
	// 	} else {
	// 		localStorage.removeItem("componentName");
	// 	}

	// 	next();
	// },
	// beforeMount() {
	// 	const currentRoute = localStorage.getItem("currentRoute");
	// 	const componentName = localStorage.getItem("componentName");

	// 	if (componentName) {
	// 		this.$router.push({ name: componentName });
	// 	} else if (currentRoute) {
	// 		this.$router.push(currentRoute);
	// 	}
	// },
};
</script>

<style lang="scss">
@import url("http://fonts.googleapis.com/css?family=Roboto:400,300,700");
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	font-family: "Roboto", sans-serif !important;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
