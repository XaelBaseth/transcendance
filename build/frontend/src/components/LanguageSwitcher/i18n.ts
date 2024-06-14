import i18next from 'i18next';
import { initReactI18next } from "react-i18next"
import translationEN from '../../translation/en.json'
import translationFR from '../../translation/fr.json'

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
}

i18next
	.use(initReactI18next)
	.init({
		resources,
		lng:"en",
	});

export default i18next;