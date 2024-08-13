import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Setting.css';

// Composant pour le switcher de mode daltonien
function ColorBlindSwitcher() {
    const [isColorBlind, setIsColorBlind] = useState(false);

    const toggleColorBlindMode = () => {
        setIsColorBlind(!isColorBlind);
        if (!isColorBlind) {
            document.documentElement.style.setProperty('--linen', 'var(--linen_colorblind)');
            document.documentElement.style.setProperty('--olive_green', 'var(--olive_green_colorblind)');
            document.documentElement.style.setProperty('--coral', 'var(--coral_colorblind)');
            document.documentElement.style.setProperty('--sky_blue', 'var(--sky_blue_colorblind)');
        } else {
            document.documentElement.style.setProperty('--linen', 'var(--linen)');
            document.documentElement.style.setProperty('--olive_green', 'var(--olive_green)');
            document.documentElement.style.setProperty('--coral', 'var(--coral)');
            document.documentElement.style.setProperty('--sky_blue', 'var(--sky_blue)');
        }
    };

    return (
        <label className="switch">
            <input type="checkbox" onChange={toggleColorBlindMode} />
            <span className="slider round"></span>
            <span>{isColorBlind ? 'Colorblind Mode: On' : 'Colorblind Mode: Off'}</span>
        </label>
    );
}

// Composant pour le switcher de langue
function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    return (
        <div className="language-switcher">
            <img
                src="/images/flags/en.png"
                alt="English"
                onClick={() => changeLanguage('en')}
                style={{ cursor: 'pointer', width: '30px', marginRight: '10px' }}
            />
            <img
                src="/images/flags/fr.png"
                alt="French"
                onClick={() => changeLanguage('fr')}
                style={{ cursor: 'pointer', width: '30px', marginRight: '10px' }}
            />
            <img
                src="/images/flags/es.png"
                alt="Spanish"
                onClick={() => changeLanguage('es')}
                style={{ cursor: 'pointer', width: '30px', marginRight: '10px' }}
            />
        </div>
    );
}

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
        <div className="accessibility_settings">
            <LanguageSwitcher />
            <ColorBlindSwitcher />
        </div>
    );
}

export function DeleteAccountCardSettings() {
    const { t } = useTranslation();
    const [isDeleted, setDeleted] = useState<boolean>(false);

    // fonction qui va être appelée au click du bouton, et activer deleteUser
    const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        //try { deleteUser.mutate(); }
        //catch (error) { console.log(error); }
        setDeleted(true);
    };

    return (
        <div className="delete_settings">
            <h2 className="delete_settings__title">{t('settings.delete')}</h2>
            <h4 className="delete_settings__subtitle">{t('settings.irreversible')}</h4>
            <button className="delete_settings__btn" onClick={handleDelete}>
                Delete
                <span>Delete your account</span>
            </button>
            <>
                {isDeleted && (
                    <div className="delete_settings__alert">
                        <h5>{t('settings.deleteSuccess')}</h5>
                        <h6>{t('settings.redirection')}</h6>
                    </div>
                )}
            </>
        </div>
    );
}

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
