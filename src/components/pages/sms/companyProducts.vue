<template>
	<div class="main d-flex flex-column">
		<div class="container header pb-4">
			<div class="row pt-4">
				<div class="col title-container">
					<div class="container position-relative">
						<div @click="$router.push('/login')" class="col-2 pointer settings position-absolute">
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
						<img
							style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover"
							@error="handleImageError"
							:src="
								currentCompany.avatar
									? ` https://lk.adit.pro/photo/${currentCompany.avatar}`
									: ' https://lk.adit.pro/photo/default_img_store.jpg'
							"
							alt="company logo"
						/>
						<p class="mt-2 company-name">{{ currentCompany.name }}</p>
					</div>
				</div>
			</div>
		</div>
		<div :class="['container', 'cards-container', isMobile ? 'card-container-mobile' : '']">
			<swiper
				:slidesPerView="isMobile"
				:spaceBetween="isSmall ? 3 : 30"
				:pagination="{
					clickable: true,
				}"
				:modules="modules"
				class="mySwiper"
			>
				<swiper-slide class="mb-2" v-for="(product, index) in allProducts" :key="index">
					<div class="card" style="width: 100%; height: 160px; border-radius: 12px">
						<img
							style="border-radius: 12px; width: 100%; max-height: 74px; object-fit: cover"
							:src="
								product.images.length
									? ` https://lk.adit.pro/photo/${product.images[0]}`
									: ' https://lk.adit.pro/photo/Default_img_product.jpg'
							"
							alt=""
							ref="companylogo"
						/>
						<div class="card-body">
							<h5 class="card-title">{{ product.name }}</h5>
						</div>
					</div>
				</swiper-slide>
				<swiper-slide>
					<div class="showAll" style="width: 120px; height: 160px; border-radius: 12px">
						<h5 class="showAll-title pointer" @click="showAllProducts">
							{{ $t("view_all_products") }} ({{ allProducts.length }})
						</h5>
					</div>
				</swiper-slide>
			</swiper>
		</div>
		<div class="container h-100 mt-4">
			<div class="row flex-column">
				<div class="col d-flex flex-column align-items-center justify-content-center">
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
				</div>
				<div class="col d-flex justify-content-center">
					<!-- <InfoComponent color="info" :msg="$t('call_answer')" /> -->
				</div>
				<div class="col justify-content-center mt-10 flex-grow-1">
					<div class="col btn-container">
						<button @click.prevent="submit" class="btn text-white btn-primary col">
							{{ $t("send_phone") }}
						</button>
					</div>
				</div>
				<div class="confidentials">
					<p>{{ $t("confidential_btn") }}</p>
					<span class="pointer" @click="goToConfidentials">
						{{ $t("confidential_link") }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import "swiper/css";

import "swiper/css/pagination";

export default {
	components: {
		Swiper,
		SwiperSlide,
	},
	computed: {
		// ...mapState("stocksProducts", {
		// 	allProducts: state => state.allProducts,
		// 	currentCompany: state => state.currentCompany[0],
		// }),
		...mapState("login", {
			initialCompany: state => state.initialCompany,
			orgId: state => state.orgId,
			stockId: state => state.stockId,
		}),
		currentCompany() {
			return this.initialCompany.company[0];
		},
		allProducts() {
			return this.initialCompany.currentProducts;
		},
	},

	data() {
		return {
			isMobile: 3,
			modules: [Pagination],
			phone: "",
			errors: {},
			isSmall: false,
		};
	},
	methods: {
		handleImageError() {
			console.log("error loading image");
		},
		async showAllProducts() {
			console.log(this.currentCompany);
			await this.$store.dispatch("company/openCompanyProducts", this.currentCompany);
			// this.$router.push("/companyPage");
			this.$router.push({ name: "companyPage", params: { id_org: this.orgId } });
			this.$store.commit("company/SET_LOGIN_TYPE", "showAll");
		},
		checkisMobile() {
			if (screen.width <= 760) {
				this.isMobile = 3;
				this.isSmall = true;
			} else {
				this.isMobile = 5;
				this.isSmall = false;
			}
		},
		goToConfidentials() {
			window.open(
				"https://docs.google.com/document/d/16M4YPU4_vMI4EhZviJDYUjeEN60rK555bYePDjG8I3g/edit",
				"_blank"
			);
		},
		submit() {
			let phoneNumber = this.phone.replace(/\s+/g, "");
			if (!phoneNumber.length || phoneNumber.length !== 12) {
				this.errors.phone = this.$t("wrong_phone_number");
			} else {
				this.errors = {};
				this.$store.dispatch("login/signUpFromOrgUrl", `${phoneNumber}`).then(() => {
					const params = {};
					this.orgId ? (params.id_org = this.orgId) : "";
					this.stockId ? (params.id_stock = this.stockId) : "";
					this.$router.push({
						name: "codeConfirm",
						params,
					});
				});

				// this.$store.dispatch("stocksProducts/SIGNUPSMS", `${phoneNumber}`);
			}
		},
	},

	created() {
		console.log(this.initialCompany);
		this.checkisMobile();
	},
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

.showAll {
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
	border: none;
	background: white;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* or 143% */

	text-align: center;
	letter-spacing: 0.1px;

	/* orange (tone 2) */

	color: #e06530;
	border: 2px solid #e06530;
}
.showAll-title {
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* or 143% */

	text-align: center;
	letter-spacing: 0.1px;

	/* orange (tone 2) */

	color: #e06530;
}
.company-name {
	font-weight: 400;
	font-size: 22px;
	line-height: 28px;
	/* identical to box height, or 127% */

	text-align: center;
}
.radio-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}
.main {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #ffffff;
}
.header {
	background: #f4f4f4;
}
.title-container {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #0e0e0e;
	margin-left: 0;
	padding-left: 0;
}
.card {
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
	border: none;
	width: 126px;
}
.cards-container {
	background: linear-gradient(360deg, #ffffff 50%, #f4f4f4 50%);
	padding: 0;
	padding-left: 20px;
}
.card-container-mobile {
	padding-left: 8px;
}
.card-title {
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;
	color: #0e0e0e;
	/* or 133% */

	letter-spacing: 0.4px;
}
.confidentials {
	margin-top: 10px;
	height: 100px;
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
<style>
.swiper-pagination {
	position: relative;
	margin-top: 20px;
}
.swiper-pagination span {
	margin-left: 10px !important;
}
</style>
