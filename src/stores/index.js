import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";

import login from "./modules/login";
import company from "./modules/company";
import stocksProducts from "./modules/stocksProducts";
import QRCode from "./modules/QRCode";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
	modules: {
		login,
		company,
		stocksProducts,
		QRCode,
	},
	// strict: debug,
	plugins: [createPersistedState()],
});

export default store;

// /* eslint-disable no-mixed-spaces-and-tabs */
// import { createStore, createLogger } from "vuex";
// import createPersistedState from "vuex-persistedstate";
// import login from "./modules/login";
// import company from "./modules/company";
// import stocksProducts from "./modules/stocksProducts";
// import QRCode from "./modules/QRCode";

// const debug = process.env.NODE_ENV !== "production";

// const store = createStore({
// 	modules: {
// 		login,
// 		company,
// 		stocksProducts,
// 		QRCode,
// 	},
// 	strict: debug,
// 	// plugins: debug ? [createLogger()] : [],
// 	plugins: debug
// 		? [
// 				createLogger(),
// 				createPersistedState({
// 					removeState: key => {
// 						if (key === "vuex") {
// 							localStorage.removeItem(key);
// 						}
// 					},
// 				}),
// 		  ]
// 		: [createPersistedState()],
// });

// export default store;
