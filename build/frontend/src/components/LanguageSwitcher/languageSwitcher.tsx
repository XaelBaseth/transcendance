import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
const { t, i18n } = useTranslation();

const changeLanguage = (language) => {
	i18n.changeLanguage(language);
};

return (
	<div>
	<button onClick={() => changeLanguage('en')}>English</button>
	<button onClick={() => changeLanguage('fr')}>French</button>
	<button onClick={() => changeLanguage('es')}>Spanish</button>
	<button onClick={() => changeLanguage('pt')}>Portuguese</button>
	</div>
);
}

export default LanguageSwitcher;
