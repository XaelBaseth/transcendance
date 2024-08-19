import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../components/LanguageSwitcher/languageSwitcher';
//import '../assets';
import { useTranslation } from 'react-i18next';
import frenchFlag from '../assets/fr.png'
import spanishFlag from '../assets/es.png'
import ukFlag from '../assets/uk.png'

import '../styles/Setting.css'

function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    return (
        <div className="language-switcher">
            <p className="language-title">Choose your language:</p>
            <img
                src={frenchFlag}
                alt="French"
                onClick={() => changeLanguage('fr')}
            />
            <img
                src={spanishFlag}
                alt="Spanish"
                onClick={() => changeLanguage('es')}
            />
            <img
                src={ukFlag}
                alt="English"
                onClick={() => changeLanguage('en')}
            />
        </div>
    );
}


function ColorBlindSwitcher() {
    const [isColorBlind, setIsColorBlind] = useState(false);

    const toggleColorBlindMode = () => {
        setIsColorBlind(!isColorBlind);

        if (!isColorBlind) {
            // Activer le mode daltonien
            document.documentElement.style.setProperty('--linen', 'var(--linen-D)');
            document.documentElement.style.setProperty('--olive_green', 'var(--olive_green-D)');
            document.documentElement.style.setProperty('--light_teal', 'var(--light_teal-D)');
            document.documentElement.style.setProperty('--pink', 'var(--pink-D)');
            document.documentElement.style.setProperty('--light_pink', 'var(--light_pink-D)');
            document.documentElement.style.setProperty('--clear_beige', 'var(--clear_beige-D)');
            document.documentElement.style.setProperty('--clear_yellow', 'var(--clear_yellow-D)');
            document.documentElement.style.setProperty('--clear_teal', 'var(--clear_teal-D)');
            document.documentElement.style.setProperty('--error', 'var(--error-D)');
            document.documentElement.style.setProperty('--ok', 'var(--ok-D)');
        } else {
            // Désactiver le mode daltonien et revenir aux couleurs normales
            document.documentElement.style.setProperty('--linen', '#f7f2e8 !important');
            document.documentElement.style.setProperty('--olive_green', '#5c775b !important');
            document.documentElement.style.setProperty('--light_teal', '#a0ced9 !important');
            document.documentElement.style.setProperty('--pink', '#e27396 !important');
            document.documentElement.style.setProperty('--light_pink', '#ea9ab2 !important');
            document.documentElement.style.setProperty('--clear_beige', '#f7f2e8ce !important');
            document.documentElement.style.setProperty('--clear_yellow', '#fcf5c7a6 !important');
            document.documentElement.style.setProperty('--clear_teal', '#f7f2e8af !important');
            document.documentElement.style.setProperty('--error', '#f03e3e !important');
            document.documentElement.style.setProperty('--ok', '#90be8e !important');
        }
    };

    return (
        <label className="switch">
            <input type="checkbox" checked={isColorBlind} onChange={toggleColorBlindMode} />
            <span className="slider round"></span>
            <span>{isColorBlind ? 'Colorblind Mode: On' : 'Colorblind Mode: Off'}</span>
        </label>
    );
}

const Settings: React.FC = () => {
    const { t } = useTranslation();
	const [currentSection, setCurrentSection] = useState('ACCESSIBILITY'); // Default section is 'USER'

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
export default Settings;

/*
export default function Settings() {
    const { t } = useTranslation();
    const [currentSection, setCurrentSection] = useState('ACCESSIBILITY'); // Default section is 'USER'
    const navigate = useNavigate();

    const handleSectionChange = (section: string) => {
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
}*/

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
        <div className="accessibility_settings">
            <LanguageSwitcher />
            <ColorBlindSwitcher />
        </div>
    );
}

export function DeleteAccountCardSettings() {
	const { t } = useTranslation();
	const [isDeleted, setDeleted] = useState<boolean>(false);
	

    // const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    //     e.preventDefault();
    //     // Appel API pour supprimer le compte utilisateur
    //     api.post('/api/user/delete', {}, {
    //         headers: {
    //             'Authorization': `Token ${user.token}`
    //         }
    //     }).then(() => {
    //         setDeleted(true);
    //     }).catch((error) => {
    //         console.error('Error deleting account:', error);
    //     });
    // };

	const navigate = useNavigate();
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
                Delete
                <span>Delete your account</span>
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
                    <p>{t('cookie.intro_text')}</p>
                </section>

                <section>
                    <h4>{t('cookie.cookie_title')}</h4>
                    <p>{t('cookie.cookie_text')}</p>
                </section>

                <section>
                    <h3>{t('cookie.type_title')}</h3>
                    <p>{t('cookie.type_text')}</p>
                </section>

                <section>
                    <h3>{t('cookie.use_title')}</h3>
                    <p>{t('cookie.type_text')}</p>
                    <h5>{t('cookie.manage_title')}</h5>
                    <p>{t('cookie.manage_text')}</p>
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
                        <li>{t('cookie.contact_adress')}</li>
                        <li>{t('cookie.contact_email')}</li>
                        <li>{t('cookie.contact_adress')}</li>
                    </ul>
                    <p>{t('cookie.contact_text')}</p>
                </section>
            </div>
        </div>
    );
}