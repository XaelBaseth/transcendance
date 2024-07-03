import i18n from 'i18next';
import { initReactI18next } from "react-i18next"
import translationEN from '../../translation/en.json'
import translationFR from '../../translation/fr.json'
import translationES from '../../translation/es.json'
import translationPT from '../../translation/pt.json'

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
	es: {
        translation: translationES,
    },
    pt: {
        translation: translationPT,
    },
}

i18n.use(initReactI18next).init({
		resources,
		lng: "en",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		},
	});

export default i18n;