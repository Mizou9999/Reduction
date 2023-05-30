<template>
	<div class="container main">
		<div class="container header pb-4 mb-4">
			<div class="row pt-4">
				<div class="col phone-container">
					<p class="login-title">{{ currentUser ? currentUser.phone : "" }}</p>
					<p class="subtitle">
						{{ $t("total_subscriptions") }}
						{{ activeCompanies ? activeCompanies.length : 0 }}
					</p>
				</div>
				<div @click="openSettings" class="col-4 pointer settings">
					<svg
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="22" fill="white" />
						<path
							d="M30.33 23.0967C30.3767 22.7467 30.4 22.385 30.4 22C30.4 21.6267 30.3767 21.2533 30.3183 20.9033L32.6867 19.06C32.8967 18.8967 32.955 18.5817 32.8267 18.3483L30.5867 14.475C30.4467 14.2183 30.155 14.1367 29.8983 14.2183L27.11 15.3383C26.5267 14.895 25.9083 14.5217 25.22 14.2417L24.8 11.2783C24.7533 10.9983 24.52 10.8 24.24 10.8H19.76C19.48 10.8 19.2583 10.9983 19.2117 11.2783L18.7917 14.2417C18.1033 14.5217 17.4733 14.9067 16.9017 15.3383L14.1133 14.2183C13.8567 14.125 13.565 14.2183 13.425 14.475L11.1967 18.3483C11.0567 18.5933 11.1033 18.8967 11.3367 19.06L13.705 20.9033C13.6467 21.2533 13.6 21.6383 13.6 22C13.6 22.3617 13.6233 22.7467 13.6817 23.0967L11.3133 24.94C11.1033 25.1033 11.045 25.4183 11.1733 25.6517L13.4133 29.525C13.5533 29.7817 13.845 29.8633 14.1017 29.7817L16.89 28.6617C17.4733 29.105 18.0917 29.4783 18.78 29.7583L19.2 32.7217C19.2583 33.0017 19.48 33.2 19.76 33.2H24.24C24.52 33.2 24.7533 33.0017 24.7883 32.7217L25.2083 29.7583C25.8967 29.4783 26.5267 29.105 27.0983 28.6617L29.8867 29.7817C30.1433 29.875 30.435 29.7817 30.575 29.525L32.815 25.6517C32.955 25.395 32.8967 25.1033 32.675 24.94L30.33 23.0967ZM22 26.2C19.69 26.2 17.8 24.31 17.8 22C17.8 19.69 19.69 17.8 22 17.8C24.31 17.8 26.2 19.69 26.2 22C26.2 24.31 24.31 26.2 22 26.2Z"
							fill="#E06530"
						/>
					</svg>
				</div>
			</div>
			<div class="row">
				<div class="col-6 mt-3 cancel">
					<span
						:class="[!activeCompanies.length ? 'subtitle cursor-disabled' : 'pointer']"
						@click="unsubscribeAll"
					>
						{{ $t("unsubscribe_from_all") }}
					</span>
				</div>
			</div>
		</div>
		<div class="container companies-container row flex-column">
			<div v-if="activeCompanies.length" class="container">
				<div
					v-for="(company, index) in activeCompanies"
					:key="index"
					@click="openCompany(company)"
					class="card-container pointer"
				>
					<img
						class="avatar"
						:src="
							company.avatar
								? ` https://lk.adit.pro/photo/${company.avatar}`
								: ' https://lk.adit.pro/photo/default_img_store.jpg'
						"
						alt="Company picture"
					/>
					<div class="col card-description">
						<span class="subtitle">{{ company.name }}</span>
						<div class="d-flex">
							<span class="subtitle">{{ " Товаров: " + company.count_products }}</span>
							<span class="subtitle">{{ " Акций: " + company.count_stocks }}</span>
						</div>
					</div>
					<div class="arrow">
						<svg
							width="7"
							height="12"
							viewBox="0 0 7 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M1.0459 1L6.09174 6.04585L1.0459 11.0917" stroke="#3E3E3E" />
						</svg>
					</div>
				</div>
			</div>
			<div v-else class="subtitle">{{ $t("empty") }}</div>
		</div>

		<!-- Button trigger logout modal -->
		<button
			type="button"
			class="btn btn-danger col cancel-btn"
			data-bs-toggle="modal"
			data-bs-target="#exampleModal"
		>
			{{ $t("logout.text") }}
		</button>

		<!-- logout Modal -->
		<div
			class="modal fade"
			id="exampleModal"
			tabindex="-1"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header no-border">
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="">{{ $t("logout.confirm") }}</div>
					<div class="modal-footer no-border">
						<span class="cancel-logout-btn pointer" data-bs-dismiss="modal">
							{{ $t("cancel") }}
						</span>
						<span
							@click.prevent="logout"
							data-bs-dismiss="modal"
							class="confirm-logout-btn pointer"
						>
							{{ $t("logout") }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<settings v-if="isSettings" @close="isSettings = false" />
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import settings from "@/components/settings/settings.vue";
export default {
	name: "login",
	components: { settings },
	data() {
		return {
			isSettings: false,
			currentUser: [],
		};
	},

	computed: {
		...mapState("login", {
			myCompanies: state => state.companies,
		}),
		activeCompanies() {
			return this.myCompanies.filter(company => company.status === "active");
		},
	},
	methods: {
		unsubscribeAll() {
			this.activeCompanies.length
				? this.$store.dispatch("stocksProducts/DELETE_ALL_SUBSCRIBE", this.activeCompanies)
				: "";
		},
		openSettings() {
			this.isSettings = true;
		},

		logout() {
			sessionStorage.clear();
			document.cookie.split(";").forEach(function (c) {
				document.cookie = c
					.replace(/^ +/, "")
					.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
			});

			localStorage.clear();

			window.location.href = window.location.origin;
			this.$router.push("/login");
			// this.$store.dispatch("stocksProducts/GET_CURRENT_ROUTE", "login");
			// location.reload();
		},
		async openCompany(company) {
			// this.$store.dispatch("company/OPEN_COMPANY", company);

			await this.$store.dispatch("company/getCompany", company).then(() => {
				this.$router.push({ name: "companyPage", params: { id_org: company.id_org } });
			});
		},
	},
	beforeCreate() {
		this.currentUser = axios.post("/api/user").then(response => {
			this.currentUser = response.data[0];
		});
	},
};
</script>

<style scoped>
.modal-footer {
	justify-content: space-between;
}
.cancel-logout-btn,
.confirm-logout-btn {
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	text-align: center;
	letter-spacing: 0.25px;

	/* orange (tone 2) */

	color: #e06530;
}
.confirm-logout-btn {
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	width: 86px;
	height: 40px;
	background: #bd2525;
}
.no-border {
	border: none;
}
/* .modal-dialog {
	width: 335px;
	height: 140px;
} */
.header {
	background: #f4f4f4;
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
	width: 44px;
	height: 44px;
	border-radius: 50%;
	object-fit: cover;
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
