<template>
	<div class="container my-4 h-100">
		<img src="../../assets/imgs/logo.svg" alt="Logo Adit" class="mb-5 mt-4" />
		<form class="row my-form">
			<h1 class="login-title mb-4">{{ $t("registration") }}</h1>

			<input
				:class="['form-control', 'my-input', 'col-6', { 'input-error': errors.phone }]"
				v-maska
				data-maska="+7 ### ### ## ##"
				:placeholder="$t('phone_placeholder')"
				v-model="phone"
			/>
			<transition name="fade">
				<div v-if="errors.phone" class="error">{{ errors.phone }}</div>
			</transition>
			<!-- <InfoComponent color="info" :msg="$t('call_answer')" /> -->
			<div class="col btn-container">
				<button @click.prevent="submit" class="btn text-white btn-primary col">
					{{ $t("logout_register") }}
				</button>
			</div>
			<div class="confidentials">
				<p>{{ $t("confidential_btn") }}</p>
				<span class="pointer" @click="goToConfidentials">
					{{ $t("confidential_link") }}
				</span>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: "login",
	props: {
		id_org: {
			type: String,
			default: null,
		},
		id_stock: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			phone: "",
			errors: {},
		};
	},
	methods: {
		submit() {
			let phoneNumber = this.phone.replace(/\s+/g, "");
			if (!phoneNumber.length || phoneNumber.length !== 12) {
				this.errors.phone = this.$t("wrong_phone_number");
			} else {
				this.errors = {};

				this.$store.dispatch("login/signUp", `${phoneNumber}`);
				// this.$store.dispatch("stocksProducts/SIGNUPSMS", `${phoneNumber}`);
				// this.$store.dispatch("login/SIGNUP", `${phoneNumber}`);
			}
		},
		goToConfidentials() {
			window.open(
				"https://docs.google.com/document/d/16M4YPU4_vMI4EhZviJDYUjeEN60rK555bYePDjG8I3g/edit",
				"_blank"
			);
		},
	},
};
</script>

<style scoped>
.container,
.my-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.my-form {
	height: 80vh;
}

ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
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
</style>
