<template>
	<div class="container h-100 p-0 m-0">
		<div class="row header w-100">
			<div class="col d-flex align-items-center w-100">
				<div @click="$router.go(-1)" class="item pointer">
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
		<div class="container mt-3">
			<div class="row w-100">
				<div class="col">
					<p class="text-left title">{{ currentProduct.name }}</p>
				</div>
			</div>
			<div class="row d-flex justify-content-center w-100">
				<div class="col img-container">
					<img :src="` https://lk.adit.pro/photo/${imageId}`" alt="" />
				</div>
			</div>
			<div class="row w-100 justify-content-center">
				<div
					v-for="img in currentProduct.images"
					:key="img"
					@click="imageId = img"
					:class="['col', 'thumb', 'pointer', imageId === img ? 'border-active' : '']"
				>
					<img :src="` https://lk.adit.pro/photo/${img}`" alt="" />
				</div>
			</div>
			<div class="row w-100 text-left mt-4">
				<span class="caption">{{ $t("description") }}</span>
				<p class="text-left">{{ currentProduct.description }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "login",
	data() {
		return {
			imageId: "",
		};
	},
	computed: {
		theCompany: function () {
			return this.openedCompany.company;
			// let thecompany;
			// if (this.myCompanies.length) {
			// 	thecompany = this.myCompanies[0];
			// } else if (this.currentCompany) {
			// 	thecompany = this.currentCompany;
			// }
			// // console.log("perez", this.currentCompany, this.myCompanies);
			// return thecompany;
		},
		...mapState("stocksProducts", {
			currentCompany: state => state.currentCompany[0],
			currentProduct: state => state.currentProduct,
		}),
		...mapState("login", {
			myCompanies: state => state.myCompanies,
		}),
		...mapState("company", {
			openedCompany: state => state.companyProducts,
		}),
	},
	methods: {
		ignore() {
			this.$store.dispatch("company/OPEN_COMPANY", { id_org: this.theCompany.id });
		},
	},
	created() {
		// console.log("this0", this.myCompanies);
		// console.log("this1", this.thecompany);
		this.imageId = this.currentProduct.images[0];
	},
};
</script>

<style scoped>
.thumb {
	margin-top: 16px;
	max-width: 72px;
	max-height: 72px;
	border-radius: 12px;
	padding: 0;
	margin-right: 10px;
	margin-left: 10px;
	border: 4px solid transparent;
}
.border-active {
	border: 4px solid #e06530;
}
.thumb img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
}
.title {
	font-weight: 400;
	font-size: 22px;
	line-height: 28px;
	/* identical to box height, or 127% */

	/* black (tone 2) */

	color: #262626;
}
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.img-container {
	margin-top: 10px;
	max-width: 335px;
	max-height: 251;
	border-radius: 12px;
}
.img-container img {
	width: 100%;
	height: 100%;
	max-height: 251px;
	object-fit: cover;
	border-radius: 12px;
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
