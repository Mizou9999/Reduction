<template>
	<div class="container h-100 p-0 m-0 pb-4">
		<div class="row w-100 mb-4">
			<div class="col-12 text-left">
				<p class="caption text-center">{{ $t("stock") }}</p>
				<p class="title text-center">{{ currentStock.name }}</p>
			</div>
		</div>
		<div class="row w-100">
			<div class="col-12 text-left">
				<p class="caption text-center">{{ $t("description") }}</p>
				<p class="title text-center">{{ currentStock.description }}</p>
			</div>
		</div>

		<div class="row w-100 mt-4 pb-4 mb-4 justify-content-center">
			<form class="my-form" onsubmit="return false" id="questionsForm">
				<div
					class="container radio-container bg-grey row py-2"
					v-for="(answers, index) in questions"
					:key="index"
				>
					<p class="title col-lg-12 col-md-8">
						{{ Object.keys(answers)[0] }} ?
						<span class="caption">{{ index + 1 + "/" + questions.length }}</span>
					</p>

					<div class="row" v-for="(answer, i) in answers[Object.keys(answers)[0]]" :key="i">
						<div class="col d-flex align-items-center justify-content-between pb-2">
							<input
								class="radio-custom"
								:id="`${index}group${i}`"
								:checked="i === 0"
								:name="Object.keys(answers)[0]"
								type="radio"
								:value="answer"
							/>
							<label class="radio-custom-label" :for="`group${i}`">{{ answer }}</label>
						</div>
					</div>
				</div>

				<button type="normal" class="btn btn-primary" @click="submit">{{ $t("send") }}</button>
			</form>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
	name: "login",
	props: {
		currentStock: {
			type: Object,
			default: () => {},
		},
	},

	data() {
		return {
			days: 0,
			one: "",
			toast: useToast(),
		};
	},

	computed: {
		...mapState("stocksProducts", {
			currentCompany: state => state.currentCompany[0],
			credentials: state => state.credentials,
			// currentStock: state => state.currentStock,
		}),
		...mapState("login", {
			myCompanies: state => state.myCompanies[0],
		}),
		theCompany: function () {
			let thecompany;
			if (this.myCompanies) {
				thecompany = this.myCompanies;
			} else if (this.currentCompany) {
				thecompany = this.currentCompany;
			}
			return thecompany;
		},
		questions: function () {
			return this.currentStock.jdata.questions;
		},
	},
	methods: {
		submit() {
			let questionsFrom = {};
			this.questions.forEach(el => {
				let question = Object.keys(el)[0];
				let radios = document.getElementsByName(question);
				radios.forEach(radio => {
					if (radio.checked) {
						questionsFrom[question] = radio.value;
					}
				});
			});
			let formData = { id: this.currentStock.id, jdata: questionsFrom };

			axios.put("/api/response", JSON.parse(JSON.stringify(formData))).then(response => {
				// this.toast.success("stock added!", {
				// 	position: "top-right",
				// 	timeout: 5000,
				// 	closeOnClick: true,
				// 	pauseOnFocusLoss: true,
				// 	pauseOnHover: true,
				// 	draggable: true,
				// 	draggablePercent: 0.6,
				// 	showCloseButtonOnHover: false,

				// 	closeButton: "button",
				// 	icon: true,
				// 	rtl: false,
				// });
				this.$emit("close");
			});
		},
		async gotToMain() {
			this.$store.dispatch("login/GET_ORGS");
			// this.$router.push("/");
			this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "mainComponent");
		},

		openSubscribe() {
			// this.$router.push("/subscribe");
			this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "subscribe");
		},
		allProducts() {
			if (this.currentCompany) {
				this.$store.dispatch("company/OPEN_COMPANY", {
					...this.currentCompany,
					id_org: this.currentCompany.id,
				});
			} else {
				this.$store.dispatch("company/OPEN_COMPANY", {
					...this.myCompanies,
					id_org: this.myCompanies.id,
				});
			}
		},

		ignore() {
			// console.log("ignore go to next page !");
		},
	},
	created() {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		if (this.currentStock && this.currentStock.length) {
			const firstDate = new Date(this.currentStock.date_to);
			const secondDate = new Date();
			this.days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
			this.QrValue = `aditpro://qr.code?id_user=${this.currentStock.id}&id_stock=${this.currentStock.id_stock}`;
		}
	},
};
</script>

<style scoped>
.checkbox-custom,
.radio-custom {
	opacity: 0;
	position: absolute;
	width: 26px;
}

.radio-custom,
.radio-custom-label {
	margin: 5px;
	cursor: pointer;
}

.radio-custom + .radio-custom-label:before {
	content: "";
	background: #f4f4f4;
	border: 1px solid #9f9f9f;
	display: inline-block;
	vertical-align: middle;
	width: 24px;
	height: 24px;
	padding: 2px;
	margin-right: 10px;
	text-align: center;
}

.radio-custom + .radio-custom-label:before {
	border-radius: 50%;
}

.radio-custom:checked + .radio-custom-label:before {
	background: #ca521e;
	box-shadow: inset 0px 0px 0px 4px #ffd0bc;
}

.checkbox-custom:focus + .checkbox-custom-label,
.radio-custom:focus + .radio-custom-label {
	outline: 1px solid #ddd;
}
.radio-container {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	margin-bottom: 20px;
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
