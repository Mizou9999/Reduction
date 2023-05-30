<template>
	<!-- <div class="container main" v-if="logintype === 'normal'"> -->
	<div class="container main" v-if="isNormal">
		<div class="container bg-grey pb-4 mb-4">
			<div class="row row-flex pt-3">
				<div class="col-4 d-flex justify-content-start pointer">
					<!-- v-if="(currentStatus && currentStatus.registered) || logintype === 'normal'" -->
					<svg
						@click="gotToMain"
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path d="M20 29V23H24V29H29V21H32L22 12L12 21H15V29H20Z" fill="#E06530" />
					</svg>
				</div>
				<div class="col-4">
					<img
						class="company-logo"
						:src="
							theCompany.avatar
								? ` https://lk.adit.pro/photo/${theCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt=""
					/>
				</div>
				<div class="col-4 d-flex justify-content-end pointer">
					<!-- v-if="is_subscribed || logintype === 'normal'" -->
					<svg
						v-if="isLoggedIn"
						@click="openSubscribe"
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path
							d="M17.55 13.58L16.12 12.15C13.72 13.98 12.14 16.8 12 20H14C14.15 17.35 15.51 15.03 17.55 13.58ZM29.94 20H31.94C31.79 16.8 30.21 13.98 27.82 12.15L26.4 13.58C28.42 15.03 29.79 17.35 29.94 20ZM27.97 20.5C27.97 17.43 26.33 14.86 23.47 14.18V13.5C23.47 12.67 22.8 12 21.97 12C21.14 12 20.47 12.67 20.47 13.5V14.18C17.6 14.86 15.97 17.42 15.97 20.5V25.5L13.97 27.5V28.5H29.97V27.5L27.97 25.5V20.5ZM21.97 31.5C22.11 31.5 22.24 31.49 22.37 31.46C23.02 31.32 23.55 30.88 23.81 30.28C23.91 30.04 23.96 29.78 23.96 29.5H19.96C19.97 30.6 20.86 31.5 21.97 31.5Z"
							fill="#E06530"
						/>
					</svg>
				</div>
			</div>

			<div class="row row-flex">
				<span class="pt-2 company-name">{{ theCompany.name }}</span>
				<span v-if="products.length">
					{{ $t("all_products_stocks") }}
					{{ products.length }}
				</span>
				<div v-if="!isUserSubscribed" class="col row-flex mt-3 text-primary pointer">
					<span @click="subscribeToShop" class="">{{ $t("subscribe_to_shop") }}</span>
				</div>
				<div v-else @click="unsubscribe" class="col row-flex mt-3 cancel pointer">
					<span class="">{{ $t("unsubscribe_from_shop") }}</span>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div
					@click="currentTab = 1"
					:class="['col', 'pointer', 'tab', { 'active-tab': currentTab === 1 }]"
				>
					<p>
						{{ $t("products_services") }}
						<span class="quantity-product">{{ products.length }}</span>
					</p>
				</div>
				<div
					@click="stocks.length ? (currentTab = 2) : ''"
					:class="['col', 'pointer', 'tab', { 'active-tab': currentTab === 2 }]"
				>
					<p>
						{{ $t("stocks") }}
						<span v-if="stocks.length" class="quantity-product">{{ stocks.length }}</span>
					</p>
				</div>
			</div>

			<div class="container p-0 d-flex justify-content-center align-items-center">
				<transition mode="out-in" name="fade">
					<div key="1" class="row w-100" v-if="currentTab === 1">
						<div
							v-for="(product, index) in products"
							:key="index"
							class="col my-card d-flex flex-column justify-content-start"
						>
							<div class="img-container">
								<img
									:src="
										product.images.length
											? ` https://lk.adit.pro/photo/${product.images[0]}`
											: ' https://lk.adit.pro/photo/Default_img_product.jpg'
									"
									alt=""
								/>
							</div>
							<div
								style="text-align: left"
								class="flex-grow-1 p-2 content d-flex flex-column align-items-start text-left"
							>
								<span>{{ product.name }}</span>
								<span
									@click="openProduct(product)"
									style="font-weight: bold"
									class="mt-2 text-primary pointer flex-grow-1 d-flex align-items-end"
								>
									{{ $t("view") }}
								</span>
							</div>
						</div>
					</div>
					<div class="row w-100" v-else key="2">
						<div
							v-for="(stock, index) in stocks"
							:key="index"
							class="col my-card d-flex flex-column justify-content-start"
						>
							<div class="img-container">
								<img
									:src="
										stock.images.length
											? ` https://lk.adit.pro/photo/${stock.images[0]}`
											: ' https://lk.adit.pro/photo/Default_img_product.jpg'
									"
									alt=""
								/>
							</div>
							<div class="flex-grow-1 p-2 content d-flex flex-column align-items-start text-left">
								<span>{{ stock.name }}</span>
								<span
									@click="openStock(stock)"
									style="font-weight: bold"
									class="mt-4 text-primary pointer"
								>
									{{ $t("view") }}
								</span>
							</div>
						</div>
					</div>
				</transition>
			</div>
			<div class="container footer p-0 d-flex">
				<div class="blocks">
					<span class="title">Адрес:</span>
					<span class="txt">{{ theCompany.address }}</span>
				</div>
				<div class="blocks">
					<span class="title">Описание:</span>
					<span class="txt">{{ theCompany.description }}</span>
				</div>
				<div v-if="theCompany && theCompany.links && theCompany.links.length" class="blocks">
					<span class="title">Ссылки:</span>
					<span v-for="(link, index) in theCompany.links" :key="index" class="txt">{{ link }}</span>
				</div>
			</div>
		</div>
	</div>
	<!-- Sms part   -->
	<!-- <div class="container main" v-else>
		<div class="container bg-grey pb-4 mb-4">
			<div class="row row-flex pt-3">
				<div class="col-4 d-flex justify-content-start pointer">
					<svg
						@click="gotToMain"
						v-if="(currentStatus && currentStatus.registered) || logintype === 'normal'"
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path d="M20 29V23H24V29H29V21H32L22 12L12 21H15V29H20Z" fill="#E06530" />
					</svg>
				</div>
				<div class="col-4">
					<img
						class="company-logo"
						:src="
							theCompany.avatar
								? ` https://lk.adit.pro/photo/${theCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt=""
					/>
				</div>
				<div class="col-4 d-flex justify-content-end pointer">
					<svg
						v-if="is_subscribed"
						@click="$store.commit('stocksProducts/OPEN_SUBSCRIBE', 'default')"
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path
							d="M17.55 13.58L16.12 12.15C13.72 13.98 12.14 16.8 12 20H14C14.15 17.35 15.51 15.03 17.55 13.58ZM29.94 20H31.94C31.79 16.8 30.21 13.98 27.82 12.15L26.4 13.58C28.42 15.03 29.79 17.35 29.94 20ZM27.97 20.5C27.97 17.43 26.33 14.86 23.47 14.18V13.5C23.47 12.67 22.8 12 21.97 12C21.14 12 20.47 12.67 20.47 13.5V14.18C17.6 14.86 15.97 17.42 15.97 20.5V25.5L13.97 27.5V28.5H29.97V27.5L27.97 25.5V20.5ZM21.97 31.5C22.11 31.5 22.24 31.49 22.37 31.46C23.02 31.32 23.55 30.88 23.81 30.28C23.91 30.04 23.96 29.78 23.96 29.5H19.96C19.97 30.6 20.86 31.5 21.97 31.5Z"
							fill="#E06530"
						/>
					</svg>
				</div>
			</div>

			<div class="row row-flex">
				<span class="pt-2 company-name">{{ theCompany.name }}</span>
				<span v-if="products.length">
					{{ $t("all_products_stocks") }}
					{{ products.length }}
				</span>
				<div
					v-if="currentStatus && !currentStatus.subscribed"
					class="col row-flex mt-3 text-primary pointer"
				>
					<span @click="subscribeToShop" class="">{{ $t("subscribe_to_shop") }}</span>
				</div>
				<div v-else class="col row-flex mt-3 cancel pointer">
					<span @click="unsubscribe" class="">{{ $t("unsubscribe_from_shop") }}</span>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div
					@click="currentTab = 1"
					:class="['col', 'pointer', 'tab', { 'active-tab': currentTab === 1 }]"
				>
					<p>
						{{ $t("products_services") }}
						<span class="quantity-product">{{ products.length }}</span>
					</p>
				</div>
				<div
					@click="logintype !== 'showAll' && stocks.length ? (currentTab = 2) : ''"
					:class="[
						'col',
						'pointer',
						'tab',
						{ 'active-tab': currentTab === 2, disabled: logintype === 'showAll' || !stocks.length },
					]"
				>
					<p>
						{{ $t("stocks") }}
						<span v-if="logintype !== 'showAll' && stocks.length" class="quantity-product">
							{{ stocks.length }}
						</span>
					</p>
				</div>
			</div>
			<div class="container p-0 d-flex justify-content-center align-items-center">
				<transition mode="out-in" name="fade">
					<div key="1" class="row w-100" v-if="currentTab === 1">
						<div
							v-for="(product, index) in products"
							:key="index"
							class="col my-card d-flex flex-column justify-content-start"
						>
							<div class="img-container">
								<img
									:src="
										product.images.length
											? ` https://lk.adit.pro/photo/${product.images[0]}`
											: ' https://lk.adit.pro/photo/Default_img_product.jpg'
									"
									alt=""
								/>
							</div>
							<div
								class="flex-grow-1 flex-grow-1 p-2 content d-flex flex-column align-items-start text-left text-left"
							>
								<span>{{ product.name }}</span>
								<span
									@click="openProduct(product)"
									style="font-weight: bold"
									class="mt-2 text-primary pointer flex-grow-1 d-flex align-items-end flex-grow-1 d-flex align-items-end"
								>
									{{ $t("view") }}
								</span>
							</div>
						</div>
					</div>
					<div class="row w-100" v-else key="2">
						<div
							v-for="(stock, index) in stocks"
							:key="index"
							class="col my-card d-flex flex-column justify-content-start"
						>
							<div class="img-container">
								<img
									:src="
										stock.images.length
											? ` https://lk.adit.pro/photo/${stock.images[0]}`
											: ' https://lk.adit.pro/photo/Default_img_product.jpg'
									"
									alt=""
								/>
							</div>
							<div class="flex-grow-1 p-2 content d-flex flex-column align-items-start text-left">
								<span>{{ stock.name }}</span>
								<span
									@click="openStock(stock)"
									style="font-weight: bold"
									class="mt-2 text-primary pointer flex-grow-1 d-flex align-items-end flex-grow-1 d-flex align-items-end"
								>
									{{ $t("view") }}
								</span>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div> -->

	<settings v-if="isSettings" @close="isSettings = false" />
</template>

<script>
import { mapState } from "vuex";
import settings from "@/components/settings/settings.vue";
import axios from "axios";
export default {
	components: { settings },
	data() {
		return {
			isNormal: true,
			formData: {
				verify_code: 123456,
				reg_type: "phone",
			},
			isSettings: false,
			currentTab: 1,
			is_subscribed: false,
			is_logged: false,
		};
	},
	computed: {
		...mapState("login", {
			isLoggedIn: state => state.isLoggedIn,
			isUserSubscribed: state => state.isUserSubscribed,
		}),
		...mapState("company", {
			currentCompany: state => state.currentCompany,
			// products: state => state.products,
			// stocks: state => state.stocks.filter(stock => stock.type_stock === "custom"),
			logintype: state => state.logintype,
			openedCompany: state => state.companyProducts,
		}),
		...mapState("stocksProducts", {
			stocksCurrentCompany: state => state.currentCompany[0],
			credentials: state => state.credentials,
			userId: state => state.userId,
			currentStatus: state => state.currentStatus,
		}),
		stocks: function () {
			return this.openedCompany.stocks.filter(stock => stock.type_stock === "custom");
		},
		products: function () {
			return this.openedCompany.products;
		},
		theCompany: function () {
			return this.openedCompany.company;
			// let thecompany;
			// if (this.currentCompany && this.currentCompany.name) {
			// 	thecompany = this.currentCompany;
			// } else if (this.stocksCurrentCompany) {
			// 	thecompany = this.stocksCurrentCompany;
			// }
			// return thecompany;
		},
		companyId: function () {
			return this.theCompany.id ? this.theCompany.id : this.theCompany.id_org;
		},
	},

	methods: {
		openSubscribe() {
			const params = { id_org: this.companyId };
			this.$router.push({ name: "subscribe", params });
			// this.$router.push("/subscribe");
			this.$store.commit("company/setSettingsParent", "companyPage");
		},
		async unsubscribe() {
			let companyArr = [];
			companyArr.push(this.theCompany);
			if (this.userId) {
				this.$store.dispatch("stocksProducts/DELETE_SUBSCRIBE", this.userId);
				this.$store.dispatch("company/unsubscribeCompany", companyArr);
			} else {
				let currentUserRequest = await axios.post("/api/user").then(response => {
					let userId = response.data[0].id;
					// this.$store.dispatch("stocksProducts/DELETE_SUBSCRIBE", userId).then(() => {
					this.$store.dispatch("company/unsubscribeCompany", companyArr).then(() => {
						const companyId = this.theCompany.id_org ? this.theCompany.id_org : this.theCompany.id;
						this.$store.commit("login/UNSUBSCRIBED_SUCCESS", { id: companyId });
					});
				});
			}

			localStorage.setItem("is_subscribed", false);
			this.is_subscribed = false;

			this.$store.commit("login/userSubscribed", false);
		},

		gotToMain() {
			// if (!this.currentStatus || (this.currentStatus && this.currentStatus.registered)) {
			// 	this.$store.dispatch("login/GET_ORGS");
			// 	this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "mainComponent");
			// } else {
			// 	this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "login");
			// }
			if (this.isLoggedIn) {
				this.$store.dispatch("login/getCompanies");
			} else {
				this.$router.go(-1);
			}
		},
		goToSubscribe() {
			console.log("1");
			this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "companyProducts");
		},
		subscribeToShop() {
			// this.$router.push("/subscribe");
			const params = { id_org: this.companyId };
			this.$router.push({ name: "subscribe", params });
			// this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "subscribe");
			// localStorage.setItem("route_from", "companyPage");
		},
		async openProduct(product) {
			await this.$store.commit("stocksProducts/openProduct", product);
			this.$router.push({ name: "product", params: { id_org: this.companyId } });
		},
		openStock(stock) {
			// this.$store.commit("stocksProducts/openStock", stock);
			// console.log("stocked", stock);
			this.$store.dispatch("company/getStock", stock.id_stock);
			// this.$router.push("/smsStock");
			const params = { id_org: this.companyId, id_stock: stock.id_stock };
			this.$router.push({ name: "smsStock", params });
		},
	},
	mounted() {
		console.log("check isUserSubscribed", this.isUserSubscribed);
		this.is_subscribed = JSON.parse(localStorage.getItem("is_subscribed"));
		this.is_logged = JSON.parse(localStorage.getItem("ISLOGGED"));
	},
};
</script>

<style scoped>
.disabled {
	color: grey;
	cursor: not-allowed;
}
.footer {
	position: absolute;
	bottom: 0px;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 20px;
	background: #f4f4f4;
}
.footer .blocks {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	padding: 8px 20px;
}
.blocks .title {
	font-family: "Roboto";
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	letter-spacing: 0.1px;

	/* black (tone 4) */

	color: #9f9f9f;
}
.blocks .txt {
	/* Body Medium */

	font-family: "Roboto";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	letter-spacing: 0.25px;

	/* black (tone 2) */

	color: #262626;
}
.disable-stock {
	background: grey !important;
}
.quantity-product {
	/* orange (tone 2) */
	color: white;
	background: #e06530;
	border-radius: 12px;
	padding: 1px 5px !important;
}
.my-card {
	height: 202px;
	max-height: 202px;
	width: 160px;
	min-width: 160px;
	max-width: 160px;
	border-radius: 12px;
	margin: 10px;
	background: #f4f4f4;
	display: flex;
	justify-content: center;
	padding: 0 !important;
}
.img-container {
	width: 100%;
	height: 114px;
	padding: 0;
	margin: 0;
	border-radius: 12px;
}
.my-card {
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* or 143% */

	letter-spacing: 0.25px;

	/* black (tone 2) */

	color: #262626;
}
.my-card img {
	max-height: 114px;
	/* border-radius: 12px; */
	width: 100%;
	object-fit: cover;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
}

.tab {
	border-bottom: 1px solid grey;
	margin-bottom: 28px;
}
.active-tab {
	border-bottom: 2px solid #e06530;
	color: #e06530;
}

.company-name {
	font-weight: 400;
	font-size: 22px;
	line-height: 28px;
}
.main {
	margin: 0;
	padding: 0;
}
.cancel-btn {
	background-color: #f4f4f4;
	border: none;
	color: #bd2525;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
}
.cancel {
	padding-left: 20px;
	text-align: left;
	color: #bd2525;
}
.subtitle {
	margin-right: 10px !important;
}
.phone-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	margin-left: 20px;
	padding: 0;
}
.settings {
	text-align: right;
	margin-right: 20px;
}
.companies-container {
	margin: 20px 0;
}
.avatar {
	max-width: 44px;
	max-height: 44px;
	border-radius: 50%;
}
.card-container {
	background: #f4f4f4;
	height: 60px !important;
	display: flex;
	border-radius: 12px;
	display: flex;
	align-items: center;
	padding: 8px;
	margin-bottom: 15px;
}
.card-description {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-left: 8px;
}
.arrow {
	margin-right: 10px;
}
</style>
