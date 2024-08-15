import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Error.css'

const ErrorPage = () => {
	const { t, i18n } = useTranslation();
  
	return (
	  <div className="Error">
		<div className="background" />
		<form className="connection-error-form">
		  <h1>{t('error.error')}</h1>
		  <h3>{t('error.sorry')}</h3>
		</form>
	  </div>
	);
  };
  
  export default ErrorPage;