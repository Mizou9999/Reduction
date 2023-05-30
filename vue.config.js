const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			"/api": {
				target: "https://lk.adit.pro",
				changeOrigin: true,

				pathRewrite: {
					"^/api": "/api",
				},
			},
		},
	},
});
