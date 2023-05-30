<template>
	<div class="container h-100 p-0 m-0">
		<div v-if="isUserSubscribed" class="row header w-100">
			<div class="col d-flex align-items-center w-100">
				<div class="item">
					<img
						class="company-logo"
						:src="
							theCompany.avatar
								? ` https://lk.adit.pro/photo/${theCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt="company logo"
					/>
				</div>
				<div class="item">
					<h1 class="login-title">{{ theCompany.name }}</h1>
				</div>
			</div>
		</div>
		<div v-else class="row header w-100">
			<div class="col d-flex align-items-center w-100">
				<div class="item pointer" @click="$router.go(-1)">
					<svg
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path
							d="M29 23C29.5523 23 30 22.5523 30 22C30 21.4477 29.5523 21 29 21V23ZM14.2929 21.2929C13.9024 21.6834 13.9024 22.3166 14.2929 22.7071L20.6569 29.0711C21.0474 29.4616 21.6805 29.4616 22.0711 29.0711C22.4616 28.6805 22.4616 28.0474 22.0711 27.6569L16.4142 22L22.0711 16.3431C22.4616 15.9526 22.4616 15.3195 22.0711 14.9289C21.6805 14.5384 21.0474 14.5384 20.6569 14.9289L14.2929 21.2929ZM29 21H15V23H29V21Z"
							fill="#E06530"
						/>
					</svg>
				</div>
				<div class="item">
					<img
						class="company-logo"
						:src="
							theCompany.avatar
								? ` https://lk.adit.pro/photo/${theCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt="company logo"
					/>
				</div>
				<div class="item">
					<h1 class="login-title">{{ theCompany.name }}</h1>
				</div>
			</div>
		</div>

		<div class="mb-4">
			<h3>Подписаться</h3>
			<p>Выберите каналы связи, по которым вам будут приходить предложения от этого продавца.</p>
		</div>
		<form class="my-form p2">
			<div style="margin-left: 20px; width: 80%" class="row d-flex flex-column">
				<label class="b-contain">
					<span>{{ $t("recieve_sms") }}</span>
					<input disabled checked v-model="recieveSms" type="checkbox" />
					<div class="b-input"></div>
				</label>

				<label class="b-contain">
					<span>{{ $t("recieve_call") }}</span>
					<input v-model="recieveCall" type="checkbox" />
					<div class="b-input"></div>
				</label>
			</div>
			<div class="container telegram p-2">
				<div @click="GoTelegram" class="row d-flex flex-column">
					<div class="col pointer d-flex align-items-center justify-content-start">
						<img src="@/assets/imgs/telegram.png" alt="Logo telegram" />
						<div
							style="text-align: left; margin-left: 10px"
							class="col align-items-start d-flex flex-column"
						>
							<span class="telegram-title">{{ $t("tg_bot") }}</span>
							<span class="telegram-text">{{ $t("tg_text") }}</span>
						</div>
					</div>
				</div>
			</div>

			<!--  Subscribe template -->
			<!-- if user is logged and subscribed then click on unsubscribe = show phone + sms confirm  -->
			<!-- if user is NOT logged and not Subscribed  = show phone + sms confirm  -->

			<div v-if="!isUserSubscribed" class="container">
				<div v-if="!isLoggedIn" class="row">
					<div
						v-if="!codeConfirm"
						class="col d-flex flex-column justify-content-center align-items-center"
					>
						<input
							:class="[
								'form-control',
								'my-input',
								'phone-input',
								'col-6 mt-4',
								{ 'input-error': errors.phone },
							]"
							v-maska
							data-maska="+7 ### ### ## ##"
							placeholder="Ваш телефон"
							v-model="phone"
						/>
						<InfoComponent color="info" :msg="$t('call_answer')" />
						<button @click.prevent="verifyPhone" :class="['btn', 'text-white', 'btn-primary']">
							{{ $t("next") }}
						</button>
					</div>
					<div v-else class="col d-flex flex-column justify-content-center align-items-center">
						<input
							:class="['form-control', 'my-input', 'col-6 mt-4', { 'input-error': errors.code }]"
							:placeholder="$t('code_placeholder')"
							v-model="verify_code"
							v-maska
							data-maska="######"
						/>
						<InfoComponent v-if="isCodeIncorrect" color="warning" :msg="errors.code" />
						<!-- <InfoComponent v-else color="info" :msg="$t('call_error')" /> -->
						<button @click.prevent="submitSub" :class="['btn  mt-4', 'text-white', 'btn-primary']">
							{{ $t("subscribe") }} 9
						</button>
					</div>
				</div>
				<button
					v-else
					@click.prevent="submitUnsub"
					:class="['btn mt-4', 'text-white', 'btn-primary']"
				>
					{{ $t("subscribe") }}
				</button>
			</div>

			<div v-else class="col btn-container">
				<button @click.prevent="submit" class="btn text-white btn-primary col">
					{{ $t("save") }}
				</button>
			</div>
		</form>
	</div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
	name: "login",
	data() {
		return {
			recieveCall: false,
			recieveSms: true,
			is_subscribed: true,
			phone: "",
			verify_code: "",
			errors: {},
			codeConfirm: false,
			isCodeIncorrect: false,
			isNew: false,
			route_from: "companyPage",
			is_logged: false,
		};
	},
	computed: {
		...mapState("stocksProducts", {
			currentCompany: state => state.currentCompany[0],
			id_stock: state => state.id_stock,
			linkType: state => state.linkType,
			currentStatus: state => state.currentStatus,
		}),
		...mapState("login", {
			myCompanies: state => state.myCompanies[0],
			userNavigationType: state => state.userNavigationType,
			isLoggedIn: state => state.isLoggedIn,
			isUserSubscribed: state => state.isUserSubscribed,
			stockId: state => state.stockId,
		}),
		...mapState("company", {
			openedCompany: state => state.companyProducts,
			settingsParent: state => state.settingsParent,
		}),
		companyId: function () {
			return this.theCompany.id ? this.theCompany.id : this.theCompany.id_org;
		},
		theCompany: function () {
			return this.openedCompany.company;
			// let thecompany;
			// if (this.myCompanies) {
			// 	thecompany = this.myCompanies;
			// } else if (this.currentCompany) {
			// 	thecompany = this.currentCompany;
			// }
			// return thecompany;
		},
	},
	methods: {
		GoTelegram() {
			window.open(`https://t.me/adit_pro_bot?start=${this.phone}`, "_blank");
		},
		async verifyPhone() {
			let phoneNumber = this.phone.replace(/\s+/g, "");
			if (!phoneNumber.length || phoneNumber.length !== 12) {
				this.errors.phone = "Указан неверный номер.";
			} else {
				this.errors = {};
				try {
					const data = await axios.post("/api/signup", { login: `${phoneNumber}` });

					this.codeConfirm = true;
				} catch (error) {
					console.log("login err", error);
					this.codeConfirm = false;
				}
			}
		},
		async submitSub() {
			if (!this.verify_code.length || this.verify_code.length !== 6) {
				this.errors.code = this.$t("code_error");
				this.isCodeIncorrect = true;
			} else {
				this.isCodeIncorrect = false;
				this.errors = {};
				let phoneNumber = this.phone.replace(/\s+/g, "");
				let form = {
					login: phoneNumber,
					reg_type: "phone",
					// verify_code: +formData.verify_code,
					verify_code: +this.verify_code,
				};
				try {
					const data = await axios.post("/api/signup", form);
					this.isNew = true;
					this.submit();
				} catch (error) {
					console.log("wrong code", error);
					this.errors.code = this.$t("code_error");
					this.isCodeIncorrect = true;
				}
			}
		},
		handleUserUnSubscribed(formData) {
			const params =
				this.stockId && this.companyId
					? { id_org: this.companyId, id_stock: this.stockId }
					: { id_org: this.companyId };

			this.$store.dispatch("company/subscribe", formData);
			this.$store.dispatch("company/getCompany", this.theCompany);
			this.$store.commit("login/userSubscribed", true);
			this.$store.commit("login/setIsLoggedIn", true);
			if (this.settingsParent === "smsStock") {
				this.$store.dispatch("company/getStock", this.stockId);
				// this.$router.push("/smsStock");
				this.$router.push({ name: "smsStock", params });
			} else if (this.settingsParent === "companyPage") {
				this.$router.push({ name: "companyPage", params });
				// this.$router.push("/companyPage");
			} else {
				console.log("v-2");
				this.$router.go(-1);
			}
		},
		handleUserSubscribed(formData) {
			const params =
				this.stockId && this.companyId
					? { id_org: this.companyId, id_stock: this.stockId }
					: { id_org: this.companyId };

			this.$store.dispatch("company/subscribe", formData);
			if (this.userNavigationType === "isOrgAndStockUrl") {
				this.$store.dispatch("company/getStock", this.stockId);
				this.$router.push({ name: "smsStock", params });
			} else if (this.userNavigationType === "isOrgUrl") {
				this.$router.push({ name: "companyPage", params });
			} else {
				console.log("v-3");
				this.$router.go(-1);
			}
		},
		submit() {
			let formData = {
				id: this.theCompany.id_org ? this.theCompany.id_org : this.theCompany.id,
				is_sms: this.recieveSms,
				is_call: this.recieveCall,
				is_tg: false,
				id_stock: this.linkType === "stock" ? this.id_stock : undefined,
				linkType: this.linkType,
				route_from: this.route_from,
			};

			if (!this.isSubscribed) {
				this.handleUserUnSubscribed(formData);
			} else {
				this.handleUserSubscribed(formData);
			}
		},
		subscribe(formData) {
			this.$store.dispatch("stocksProducts/SUBSCRIBE", formData);
			localStorage.setItem("is_subscribed", true);
		},
		openCompany() {
			const params =
				this.stockId && this.companyId
					? { id_org: this.companyId, id_stock: this.stockId }
					: { id_org: this.companyId };
			this.$router.push({ name: "companyPage", params });
			// this.$router.push("/companyPage");
			// this.$store.dispatch("company/OPEN_COMPANY", this.currentCompany);
		},
		setStatus() {
			this.$store.commit("stocksProducts/SET_STATUS", {
				status: { registered: true, subscribed: true },
				linktype: this.linkType,
			});
		},
		submitUnsub() {
			let formData = {
				id: this.theCompany.id_org ? this.theCompany.id_org : this.theCompany.id,
				is_sms: this.recieveSms,
				is_call: this.recieveCall,
				is_tg: false,
				id_stock: this.linkType === "stock" ? this.id_stock : undefined,
				linkType: this.linkType,
				route_from: this.route_from,
			};
			if (!this.isUserSubscribed) {
				this.handleUserUnSubscribed(formData);
			} else {
				this.openCompany();
				this.setStatus();
			}
		},
		ignore() {
			const payload = {
				isIgnore: true,
				id_org: this.currentCompany ? this.currentCompany.id : this.myCompanies.id_org,
			};
			this.$store.commit("company/SET_LOGIN_TYPE", "ignore");
			this.$store.dispatch("company/OPEN_COMPANY", payload);
		},
	},

	async created() {
		console.log("user subscribed :", this.isUserSubscribed);
		if (this.isUserSubscribed) {
			try {
				const data = await axios.post("/api/user");
				this.recieveCall = data.data[0].is_call;
				this.phone = data.data[0].phone;
				this.recieveSms = data.data[0].is_sms;
				this.is_tg = data.data[0].is_tg;
				const isSubscribed = JSON.parse(localStorage.getItem("is_subscribed"));
				this.is_subscribed = isSubscribed || false;
				const isLogged = JSON.parse(localStorage.getItem("ISLOGGED"));
				this.is_logged = isLogged || false;
			} catch (err) {
				console.log(err);
			}
		}
	},
};
</script>

<style scoped>
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
	width: 90%;
	background-color: #f4f4f4;
	border-radius: 12px;
	margin-top: 40px;
}
input {
	letter-spacing: 10px;
}
input::placeholder {
	letter-spacing: 1px;
}
.phone-input {
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
