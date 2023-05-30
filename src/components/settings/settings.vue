<template>
	<div class="main">
		<div class="container header pb-4 mb-4">
			<div class="row pt-4">
				<div @click="$emit('close')" class="col-2 pointer settings">
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
				<div class="col title-container">
					<p class="">Настройки</p>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col xx-w radio-container">
					<p class="subtitle mb-4">{{ $t("interface_language") }}</p>
					<div class="radio mb-4">
						<input id="radio-1" v-model="currentLanguage" value="Ru" name="radio" type="radio" />
						<label for="radio-1" class="radio-label">{{ $t("russian") }}</label>
					</div>
					<div class="radio">
						<input id="radio-2" name="radio" type="radio" v-model="currentLanguage" value="Kz" />
						<label for="radio-2" class="radio-label">{{ $t("kazakh") }}</label>
					</div>
				</div>
			</div>
			<div class="row mt-2">
				<div class="col d-flex flex-column align-items-start justify-content-start mt-4">
					<span class="subtitle mb-3">{{ $t("extra") }}</span>
					<span @click="deleteAccount" class="text-danger pointer">{{ $t("delete_account") }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
	computed: {
		...mapState("stocksProducts", {
			currentCompany: state => state.currentCompany[0],
			id_stock: state => state.id_stock,
			linkType: state => state.linkType,
			userPhone: state => state.userPhone,
			currentStatus: state => state.currentStatus,
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
	},
	watch: {
		currentLanguage() {
			console.log(this.currentLanguage);
		},
	},
	data() {
		return {
			currentLanguage: "Ru",
		};
	},
	methods: {
		async deleteAccount() {
			try {
				const deleteRequest = await axios.delete("/api/user");
				sessionStorage.clear();
				document.cookie.split(";").forEach(function (c) {
					document.cookie = c
						.replace(/^ +/, "")
						.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
				});

				localStorage.clear();
				localStorage.removeItem("vuex");
				console.log("cleared", window.location);
				window.location.href = window.location.origin;
			} catch (err) {
				console.log("err delete account", err);
			}
		},
	},
};
</script>
<style lang="scss" scoped>
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
	color: #0e0e0e;
	margin-left: 0;
	padding-left: 0;
}
</style>
