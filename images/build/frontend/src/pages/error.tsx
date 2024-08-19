import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Error.css'

const ErrorPage = () => {
	const { t } = useTranslation();
  
	return (
	  <div className="Error">
		<div className="background" />
		<form className="connection-error-form">
		  <label>{t('error.title')}</label>
		</form>
	  </div>
	);
  };
  
  export default ErrorPage;