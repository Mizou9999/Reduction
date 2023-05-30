<template>
	<div class="container h-100 p-0 m-0 mb-4">
		<div class="container bg-grey pb-4 mb-4">
			<div class="row row-flex pt-3 w-100">
				<div @click="gotToMain" class="col-4 d-flex justify-content-start pointer">
					<svg
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
						style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover"
						:src="
							theCompany.avatar
								? ` https://lk.adit.pro/photo/${theCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt=""
					/>
				</div>
				<div @click="openSubscribe" class="col-4 d-flex justify-content-end pointer">
					<svg
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

				<div class="col row-flex mt-3 btn-subscribe cancel">
					<button @click.prevent="allProducts" class="btn text-white btn-primary col">
						{{ $t("view_products_services") }}
						{{
							theCompany && theCompany.count_products ? "(" + theCompany.count_products + ")" : ""
						}}
					</button>
				</div>
			</div>
		</div>
		<!-- end header  -->
		<quizz
			:currentStock="currentStock"
			v-if="currentStock.type_stock === 'quiz'"
			@close="allProducts"
		/>
		<infoStock
			:currentStock="currentStock"
			v-else-if="currentStock.type_stock === 'info'"
			@unsubscribe="unsubscribe"
		/>
		<div v-else class="container">
			<div class="row w-100 mb-4">
				<div class="col-12 text-left">
					<p class="caption">{{ $t("stock") }}</p>
					<p class="title">{{ currentStock.name }}</p>
				</div>
			</div>
			<div class="row w-100 mb-4">
				<div class="">
					<img
						style="width: 335px; height: auto"
						:src="
							currentStock.images.length
								? ` https://lk.adit.pro/photo/${currentStock.images[0]}`
								: ' https://lk.adit.pro/photo/Default_img_product.jpg'
						"
						alt=""
					/>
				</div>
			</div>
			<div class="row w-100">
				<div class="col-12 text-left">
					<p class="caption">{{ $t("description") }}</p>
					<p class="title">{{ currentStock.description }} 213123</p>
				</div>
			</div>

			<div class="row w-100 mt-4 justify-content-center">
				<div class="col d-flex flex-column p-0">
					<span class="caption mb-2">{{ $t("stock_duration") }}</span>
					<div
						style="margin-left: 20px; border-radius: 12px"
						class="col cont bg-grey d-flex flex-column justify-content-around align-items-center"
					>
						<span class="p-2">
							{{ getDays() }}
						</span>
						<!-- <span class="caption">{{ new Date(currentStock.date_to) }}</span> -->
					</div>
				</div>
				<div class="col d-flex flex-column">
					<span class="caption mb-2">{{ $t("stock_amount") }}</span>
					<div
						style="margin-left: 20px; border-radius: 12px"
						class="col cont bg-grey d-flex flex-column justify-content-around align-items-center"
					>
						<span class="p-2">
							{{ currentStock.stock_discount ? currentStock.stock_discount + "%" : 0 + "%" }}
						</span>
					</div>
				</div>
			</div>
			<div class="qr-code-container">
				<qrcode-vue :size="266" :value="QrValue"></qrcode-vue>
			</div>

			<div class="col m-2 pb-2 btn-container"></div>
			<span
				v-if="theCompany.status === 'active'"
				class="pb-4 pointer text-danger pointer"
				@click="unsubscribe"
			>
				{{ $t("unsubscribe_from_shop") }}
			</span>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import QrcodeVue from "qrcode.vue";
import quizz from "../components/quizz.vue";
import infoStock from "../components/infoStock.vue";
export default {
	name: "login",
	components: {
		QrcodeVue,
		quizz,
		infoStock,
	},
	data() {
		return {
			days: 0,
			QrValue: "",
			isSubbed: true,
		};
	},
	computed: {
		...mapState("stocksProducts", {
			currentCompany: state => state.currentCompany[0],
			credentials: state => state.credentials,
			// currentStock: state => state.currentStock,
			userId: state => state.userId,
		}),
		...mapState("login", {
			myCompanies: state => state.myCompanies[0],
			isLoggedIn: state => state.isLoggedIn,
			userNavigationType: state => state.userNavigationType,
		}),
		...mapState("company", {
			clickedCompany: state => state.currentCompany,
			openedCompany: state => state.companyProducts,
			currentStock: state => state.myStock,
		}),

		theCompany: function () {
			return this.openedCompany.company;
			// let thecompany;

			// if (this.clickedCompany) {
			// 	thecompany = this.clickedCompany;
			// } else if (this.currentCompany) {
			// 	thecompany = this.currentCompany;
			// } else if (this.myCompanies) {
			// 	thecompany = this.myCompanies;
			// }

			// return thecompany;
		},
		companyId: function () {
			return this.theCompany.id ? this.theCompany.id : this.theCompany.id_org;
		},
	},
	methods: {
		getDays() {
			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
			const firstDate = new Date(this.currentStock.date_to);
			const secondDate = new Date();
			const days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
			return days === 1 ? days + " день " : days > 1 && days < 4 ? days + " дня" : days + " дней";
		},
		gotToMain() {
			if (this.isLoggedIn) {
				this.$store.dispatch("login/getCompanies");
			} else {
				this.$router.go(-1);
			}
		},
		// console.log("unsubscribe !!! go to previous page or disable the button");
		async unsubscribe() {
			try {
				// Check if the user is logged in
				if (!this.userId) {
					// If the user is not logged in, retrieve the current user
					let currentUser = await axios.post("/api/user");
					this.userId = currentUser.id;
				}

				// Dispatch the action to unsubscribe the user
				await this.$store.dispatch("stocksProducts/DELETE_SUBSCRIBE", this.userId);

				// got to company page
				this.allProducts();
				localStorage.setItem("is_subscribed", false);
			} catch (error) {
				// Handle the error
				console.error(error);
			}
		},

		openSubscribe() {
			const params =
				this.currentStock.id_stock && this.companyId
					? { id_org: this.companyId, id_stock: this.currentStock.id_stock }
					: { id_org: this.companyId };
			// this.$router.push("/subscribe");
			this.$router.push({ name: "subscribe", params });

			// this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "subscribe");
			this.$store.commit("company/setSettingsParent", "smsStock");
		},

		allProducts() {
			const params =
				(this.currentStock.id_stock && this.companyId) ||
				(this.currentStock.id_stock && this.companyId)
					? { id_org: this.companyId, id_stock: this.currentStock.id_stock }
					: { id_org: this.companyId };
			if (this.userNavigationType === "isDefaultUrl") {
				this.$router.go(-1);
			} else {
				this.$router.push({ name: "companyPage", params });
			}
			// if (this.currentCompany) {
			// 	this.$store.dispatch("company/OPEN_COMPANY", {
			// 		...this.currentCompany,
			// 		id_org: this.currentCompany.id,
			// 	});
			// } else {
			// 	this.$store.dispatch("company/OPEN_COMPANY", {
			// 		...this.myCompanies,
			// 		id_org: this.myCompanies.id,
			// 	});
			// }
		},
	},
	mounted() {
		console.log("current stock", this.currentStock);
		if (this.currentStock.id && this.currentStock.id_stock) {
			this.QrValue = `aditpro://qr.code?id_user=${this.currentStock.id}&id_stock=${this.currentStock.id_stock}`;
		}

		this.isSubbed = JSON.parse(localStorage.getItem("is_subscribed"));
	},
};
</script>

<style scoped>
.qr-code-container {
	width: 336px;
	height: 336px;
	background: #f4f4f4;
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 12px;
}
.title {
	font-weight: 400;
	font-size: 22px;
	line-height: 28px;
	color: #0e0e0e;
}
.btn-subscribe {
	width: 232px;
	height: 40px;
}
.company-name {
	font-style: normal;
	font-weight: 400;
	font-size: 22px;
	line-height: 28px;
	/* identical to box height, or 127% */

	text-align: center;

	/* black (tone 1) */

	color: #0e0e0e;
}
.telegram-text {
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;
	/* or 133% */

	letter-spacing: 0.4px;

	/* black (tone 4) */

	color: #9f9f9f;
}
.telegram-title {
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	letter-spacing: 0.1px;

	/* black (tone 3) */

	color: #3e3e3e;
}
.telegram {
	width: 100%;
	background-color: #f4f4f4;
	border-radius: 12px;
	margin-top: 40px;
	height: 72px;
}
input {
	letter-spacing: 10px;
}
input::placeholder {
	letter-spacing: 1px;
}
.container,
.my-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.my-form {
	height: 60vh;
}

.btn-container {
	display: flex;
	align-items: flex-end;
	margin-bottom: 20px;
}

.header {
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	text-align: center;
	letter-spacing: 0.25px;
	background-color: #f4f4f4;
	align-items: center;
	justify-content: center;
	display: flex;
	height: 72px;
	margin-bottom: 12px;
}
.login-title {
	text-align: left;
}
.item {
	margin-left: 20px;
}
</style>
