import { createI18n } from "vue-i18n";
import ru from "@/locales/ru";
import kz from "@/locales/kz";

const i18n = createI18n({
	legacy: false,
	locale: "ru",
	fallbackLocale: "ru",
	messages: {
		ru,
		kz,
	},
});

export default i18n;
