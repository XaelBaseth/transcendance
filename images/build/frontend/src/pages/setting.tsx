import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../components/LanguageSwitcher/languageSwitcher';
import { useTranslation } from 'react-i18next';
import '../styles/Setting.css';

const getCookie = (name: string) => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
    return cookieValue;
};


const Settings: React.FC = () => {
    const { t } = useTranslation();
    const [currentSection, setCurrentSection] = useState('USER');

	// const [currentSection, setCurrentSection] = useState('ACCESSIBILITY'); // Default section is 'USER'

	const handleSectionChange = (section) => {
		setCurrentSection(section);
	};

	return (
		<div className='settings__flex'>
			<div className='settings'>
				<h1>{t('settings.settings')}</h1>
				<img src="" alt="" />
				<div className='settings__container'>
					<div className="navigation">
						<button className={currentSection === 'ACCESSIBILITY' ? 'active' : ''} onClick={() => handleSectionChange('ACCESSIBILITY')}>{t('settings.accessibility')}</button>
						<button className={currentSection === 'PRIVACY' ? 'active' : ''} onClick={() => handleSectionChange('PRIVACY')}>{t('settings.privacy')}</button>
					</div>
					<div className="settings_grid">
						{currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />}
						{currentSection === 'PRIVACY' && <PrivacySettings />} 
					</div>
				</div>
			</div>
		</div>
	);
}


function PrivacySettings() {
	return (
		<div className="privacy_settings">
			<CookieSettings />
			<DeleteAccountCardSettings />
		</div>
	);
}

function AccessibilitySettings() {
	return (
		<div className="privacy_settings">
		{/**Colorbling mode */}
		<LanguageSwitcher />
	</div>
	);
}

export function DeleteAccountCardSettings() {
	const { t } = useTranslation();
	const [isDeleted, setDeleted] = useState<boolean>(false);

    const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        // Appel API pour supprimer le compte utilisateur
        api.post('/api/user/delete', {}, {
            headers: {
                'Authorization': `Token ${user.token}`
            }
        }).then(() => {
            setDeleted(true);
        }).catch((error) => {
            console.error('Error deleting account:', error);
        });
    };

    useEffect(() => {
        if (isDeleted) {
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [isDeleted, navigate]);

    return (
        <div className="delete_settings">
            <h2 className="delete_settings__title">{t('settings.delete')}</h2>
            <h4 className="delete_settings__subtitle">{t('settings.irreversible')}</h4>
            <button className="delete_settings__btn" onClick={handleDelete}>
                {t('settings.delete')}
                <span>{t('settings.deleteYourAccount')}</span>
            </button>
            {isDeleted && (
                <div className="delete_settings__alert">
                    <h5>{t('settings.deleteSuccess')}</h5>
                    <h6>{t('settings.redirection')}</h6>
                </div>
            )}
        </div>
    );
};

export function CookieSettings() {
	const { t } = useTranslation();

	return (
		<div className="cookie-settings">
		  <div className="cookie-content">
			<h3>{t('cookie.policy')}</h3>
			<section>
			  <h4>{t('cookie.introduction')}</h4>
			  <p>
				{t('cookie.intro_text')}
			  </p>
			</section>
	
			<section>
			  <h4>{t('cookie.cookie_title')}</h4>
			  <p>
				{t('cookie.cookie_text')}
			  </p>
			</section>
	
			<section>
			  <h3>{t('cookie.type_title')}</h3>
			  <p>
				{t('cookie.type_text')}
			  </p>
			</section>
	
			<section>
			  <h3>{t('cookie.use_title')}</h3>
			  <p>
			  		{t('cookie.type_text')}
			  </p>
	
			  <h5>{t('cookie.manage_title')}</h5>
			  <p>
				{t('cookie.manage_text')}
			  </p>
			</section>
	
			<section>
			  <h5>{t('cookie.rights_title')}</h5>
			  <ul>
				<li>{t('cookie.rights_1')}</li>
				<li>{t('cookie.rights_2')}</li>
				<li>{t('cookie.rights_3')}</li>
				<li>{t('cookie.rights_4')}</li>
				<li>{t('cookie.rights_5')}</li>
			  </ul>
			  <p>{t('cookie.rights_text')}</p>
			</section>
	
			<section>
			  <h5>{t('cookie.contact_title')}</h5>
			  <ul>
				<li>{t('cookie.contact_adress')} </li>
				<li>{t('cookie.contact_email')} </li>
				<li>{t('cookie.contact_phone')} </li>
			  </ul>
			  <p>{t('cookie.contact_text')}</p>
			</section>
		  </div>
		</div>
	  );
}
export default Settings;