<template>
	<div class="container">
		<div class="row w-100 mb-4">
			<div class="col-12 text-left">
				<p class="caption">{{ $t("stock") }}</p>
				<p class="title">{{ currentStock.name }}</p>
			</div>
		</div>
		<div v-if="currentStock.images && currentStock.images.length" class="row w-100 mb-4">
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
				<p class="title">{{ currentStock.description }}</p>
			</div>
		</div>

		<div class="col m-2 pb-2 btn-container"></div>
		<span class="pb-4 text-danger pointer" @click="unsubscribe">
			{{ $t("unsubscribe_from_shop") }}
		</span>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "login",

	data() {
		return {
			days: 0,
			one: "",
		};
	},

	computed: {
		...mapState("stocksProducts", {
			currentStock: state => state.currentStock,
		}),
		...mapState("login", {
			myCompanies: state => state.myCompanies[0],
		}),
	},
	methods: {
		unsubscribe() {
			this.$emit("unsubscribe");
			// this.$store.dispatch("stocksProducts/DELETE_SUBSCRIBE");
		},
	},
};
</script>
