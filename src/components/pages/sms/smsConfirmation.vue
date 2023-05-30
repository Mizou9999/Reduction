<template>
	<div class="container h-100 p-0 m-0">
		<div class="row header w-100">
			<div class="col d-flex align-items-center w-100">
				<!--`https://api.adit.pro/photo/${currentCompany.avatar}` -->
				<div class=""></div>
				<div class="item">
					<img
						class="company-logo"
						:src="
							currentCompany.avatar
								? ` https://lk.adit.pro/photo/${currentCompany.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt="company logo"
					/>
				</div>
				<div class="item">
					<h1 class="login-title">{{ currentCompany.name }}</h1>
				</div>
			</div>
		</div>

		<div class="mb-4">
			<h3>{{ $t("confirmation") }}</h3>
			<p>{{ $t("code_sent") }}</p>
			<span>{{ userPhone }}</span>
		</div>
		<form class="row my-form">
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
	name: "login",
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
		...mapState("stocksProducts", {
			userPhone: state => state.userPhone,
			currentCompany: state => state.currentCompany[0],
			id_stock: state => state.id_stock,
			codeError: state => state.codeError,
			linkType: state => state.linkType,
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
		submit() {
			if (!this.formData.verify_code.length || this.formData.verify_code.length !== 6) {
				this.errors.code = this.$t("code_error");
				this.isCodeIncorrect = true;
			} else {
				this.isCodeIncorrect = false;
				this.errors = {};
				this.$store.dispatch("stocksProducts/CONFIRM", {
					...this.formData,
					login: this.userPhone,
					currentCompany: this.currentCompany,
					id_stock: this.id_stock,
					from: this.linkType,
				});
			}
		},

		cancel() {
			this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "companyProducts");
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
