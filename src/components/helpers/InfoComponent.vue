<template>
	<div :class="['row', color, 'info-container']">
		<div class="col-2">
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
					:stroke="color === 'info' ? '#3A75CE ' : '#BD2525'"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M11 15V11"
					:stroke="color === 'info' ? '#3A75CE ' : '#BD2525'"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M11 7H11.01"
					:stroke="color === 'info' ? '#3A75CE ' : '#BD2525'"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
		<p class="col-10">{{ msg }}</p>
	</div>
</template>

<script>
export default {
	name: "Info-component",
	computed: {},
	props: ["color", "msg"],
};
</script>
<style scoped>
.info-container {
	margin-top: 16px;
	margin-bottom: 16px;
	font-size: 12px;
	line-height: 16px;
	align-items: center;
	letter-spacing: 0.4px;
	max-width: 335px;
	border-radius: 12px;
	padding: 15px 25px 15px 10px;
	text-align: left;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.info {
	border: 1px solid #3a75ce;
	color: #265eb1;
	background-color: #cbecff;
}
.info-img {
	margin-bottom: 15px;
}
.warning {
	color: #bd2525;
	background-color: #ffeeee;
	border: 1px solid #bd2525;
}
</style>
