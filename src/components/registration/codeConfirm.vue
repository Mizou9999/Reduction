<template>
	<div class="container my-4 h-100">
		<img src="../../assets/imgs/logo.svg" alt="Logo Adit" class="mb-5" />
		<h1 class="login-title mb-4">{{ $t("confirmation") }}</h1>
		<div class="header mb-4">
			<p>{{ $t("code_sent") }}</p>
			<span>{{ userPhone }}</span>
		</div>
		<form class="row my-form">
			<!-- <input
				class="form-control my-input col-6"
				placeholder="Код подтверждения"
				v-model="formData.verify_code"
			/> -->
			<input
				:class="['form-control', 'my-input', 'col-6', { 'input-error': errors.code }]"
				:placeholder="$t('code_placeholder')"
				v-model="formData.verify_code"
				v-maska
				data-maska="######"
			/>
			<InfoComponent v-if="isCodeIncorrect" color="warning" :msg="errors.code" />
			<!-- <InfoComponent v-else color="info" :msg="$t('call_error')" /> -->
			<span class="countdown mt-2" v-if="timeLeft > 0">
				Отправить смс повторно ({{ timeLeft }})
			</span>
			<span class="countdown mt-2 pointer" v-else @click="resendCode">Отправить</span>
			<div class="col btn-container">
				<button @click.prevent="submit" class="btn text-white btn-primary col">
					{{ $t("confirm") }}
				</button>
			</div>
			<span @click="cancel" class="cancel pointer">{{ $t("number_change") }}</span>
		</form>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "codeConfirm",
	data() {
		return {
			timeLeft: 60,
			formData: {
				verify_code: "",
				reg_type: "phone",
			},
			errors: {},
			isCodeIncorrect: false,
		};
	},
	computed: {
		...mapState("login", {
			userPhone: state => state.userPhone,
			codeError: state => state.codeError,
			userNavigationType: state => state.userNavigationType,
			initialCompany: state => state.initialCompany,
			orgId: state => state.orgId,
			isUserSubscribed: state => state.isUserSubscribed,
			stockId: state => state.stockId,
		}),
	},
	watch: {
		codeError(val) {
			this.isCodeIncorrect = true;
			this.errors.code = this.$t("code_error");
		},
	},
	methods: {
		resendCode() {
			this.$store.dispatch("login/SIGNUP", `${this.userPhone}`);
			this.startCountdown();
		},
		startCountdown() {
			// reset the time left to 60 seconds
			this.timeLeft = 60;

			const countdownInterval = setInterval(() => {
				// decrement the time left
				this.timeLeft--;

				// if the countdown reaches 0, stop the interval and display the "Resend Code" button
				if (this.timeLeft === 0) {
					clearInterval(countdownInterval);
				}
			}, 1000);
		},
		async submit() {
			const params =
				this.stockId && this.orgId
					? { id_org: this.orgId, id_stock: this.stockId }
					: { id_org: this.orgId };
			if (!this.formData.verify_code.length || this.formData.verify_code.length !== 6) {
				this.errors.code = this.$t("code_error");
				this.isCodeIncorrect = true;
			} else {
				this.isCodeIncorrect = false;
				this.errors = {};
				if (this.userNavigationType === "isDefaultUrl") {
					this.$store.dispatch("login/confirmCode", {
						...this.formData,
						login: this.userPhone,
					});
				} else if (this.userNavigationType === "isOrgUrl") {
					this.$store.commit("company/setSettingsParent", "companyPage");
					try {
						await this.$store.dispatch("login/confirmCodeOrgUrl", {
							...this.formData,
							login: this.userPhone,
							id_org: this.orgId,
						});

						if (this.isUserSubscribed) {
							this.$router.push({ name: "companyPage", params });
						} else {
							this.$router.push({ name: "subscribe", params });
						}
					} catch (err) {
						console.log("submit codeConfirm;", err);
					}
				} else {
					console.log(1, params);
					this.$store.commit("company/setSettingsParent", "smsStock");
					await this.$store.dispatch("login/confirmCodeStock", {
						...this.formData,
						login: this.userPhone,
						id_org: this.orgId,
					});
					this.$store.dispatch("company/getStock", this.stockId);
					if (this.isUserSubscribed) {
						this.$router.push({
							name: "smsStock",
							params,
						});
					} else {
						this.$router.push({
							name: "subscribe",
							params,
						});
					}
				}
			}

			// this.$store.dispatch("login/CONFIRM", { ...this.formData, login: this.userPhone });
		},

		cancel() {
			// this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "login")
			this.$router.go(-1);
		},
	},
	mounted() {
		this.startCountdown();
	},
};
</script>

<style scoped>
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
.confidentials {
	height: 100px;
}
.confidentials {
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;
	text-align: center;
	letter-spacing: 0.4px;
}
.confidentials p {
	margin: 0 !important;
	color: #9f9f9f;
}
.confidentials span {
	margin: 0 !important;
	color: #000000;
	text-decoration-line: underline;
}
.header {
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	text-align: center;
	letter-spacing: 0.25px;
}
.countdown {
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	letter-spacing: 0.1px;

	/* black (tone 4) */

	color: #9f9f9f;
}
</style>
