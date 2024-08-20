import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../components/LanguageSwitcher/languageSwitcher';
import { useTranslation } from 'react-i18next';
import frenchFlag from '../assets/fr.png'
import spanishFlag from '../assets/es.png'
import ukFlag from '../assets/uk.png'
import validator from 'validator';
import '../styles/Setting.css'

function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    return (
        <div className="language-switcher">
            <p className="language-title">{t('settings.language')}</p>
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
	const [currentSection, setCurrentSection] = useState('ACCESSIBILITY');

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
                        <button className={currentSection === 'USER' ? 'active' : ''} onClick={() => handleSectionChange('USER')}>{t('settings.user')}</button>
                    </div>
                    <div className="settings_grid">
                        {currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />}
                        {currentSection === 'PRIVACY' && <PrivacySettings />}
                        {currentSection === 'USER' && <UserSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

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

function UserSettings() {
    return (
        <div className="user_settings">
            <PasswordCardSettings />
            <TextCardSettings property="bio" />
            <TextCardSettings property="username" />
            <TextCardSettings property="email" />
        </div>
    );
}

export function DeleteAccountCardSettings() {
	const { t } = useTranslation();
	const [isDeleted, setDeleted] = useState<boolean>(false);
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
            <button className="delete_settings__btn">
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

export function TextCardSettings({ property }: { property: string }) {
    const [userInput, setUserInput] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [propertyChanged, setPropertyChange] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (validator.isEmpty(userInput)) {
            setErrorMsg('Field is empty');
            return;
        }

        if (property === 'email' && !validator.isEmail(userInput)) {
            setErrorMsg('Invalid email');
            return;
        }

        // Simulating an API call with setTimeout
        setTimeout(() => {
            console.log(`Property: ${property}, New Value: ${userInput}`);
            setPropertyChange(true);
            setErrorMsg('');
        }, 1000);
    };

    return (
        <div className={`text_settings ${property === 'password' ? 'independent_password' : ''}`}>
            <div className="title_user">
                <h2>{`Update ${property}`}</h2>
            </div>
            <div className="input_user">
                <input
                    className="text_input"
                    type="text"
                    placeholder={`Enter new ${property}`}
                    onChange={handleChange}
                />
            </div>
            <div>
                <button className="button_user" onClick={handleUpdate}>
                    Update
                </button>
            </div>
            {errorMsg && <div className="error_msg">{errorMsg}</div>}
            {propertyChanged && <div className="success_msg">{`${property} updated successfully!`}</div>}
        </div>
    );
};

export function PasswordCardSettings() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (validator.isEmpty(password) || validator.isEmpty(confirmPassword)) {
            setErrorMsg('Both fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        if (!validator.isStrongPassword(password)) {
            setErrorMsg('Password is not strong enough');
            return;
        }

        // Simulating an API call with setTimeout
        setTimeout(() => {
            console.log(`Password changed to: ${password}`);
            setPasswordChanged(true);
            setErrorMsg('');
        }, 1000);
    };

    return (
        <div className="independent_password">
            <div className="title_user">
                <h2>Update Password</h2>
            </div>
            <div className="settings_input">
                <input
                    className="password_input"
                    type={showPassword ? 'text' : 'password'} // Afficher ou cacher le mot de passe
                    placeholder="Enter new password"
                    onChange={handlePasswordChange}
                />
                <input
                    className="password_input"
                    type={showPassword ? 'text' : 'password'} // Afficher ou cacher le mot de passe
                    placeholder="Confirm new password"
                    onChange={handleConfirmPasswordChange}
                />
                <button className="show-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            <div>
                <button className="button_password" onClick={handleUpdate}>
                    Update Password
                </button>
            </div>
            {errorMsg && <div className="error_msg">{errorMsg}</div>}
            {passwordChanged && <div className="success_msg">Password updated successfully!</div>}
        </div>
    );
}