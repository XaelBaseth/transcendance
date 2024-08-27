import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import frenchFlag from '../assets/fr.png'
import spanishFlag from '../assets/es.png'
import ukFlag from '../assets/uk.png'
import '../styles/Setting.css'
import React, { useState, useEffect } from 'react';
import '../styles/Setting.css';
import arena1 from '../assets/default_arena.jpg';
import arena2 from '../assets/fire_arena.jpg';
import arena3 from '../assets/water_arena.jpg';
import pokemon6 from '../assets/Pachirisu.gif';

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
    const { t } = useTranslation();
    const [isColorBlind, setIsColorBlind] = useState(false);

    const toggleColorBlindMode = () => {
        const newColorBlindState = !isColorBlind;

        setIsColorBlind(newColorBlindState);

        if (newColorBlindState) {
            document.documentElement.style.setProperty('--linen', 'var(--linen-D)');
            document.documentElement.style.setProperty('--olive_green', 'var(--olive_green-D)');
            document.documentElement.style.setProperty('--light_teal', 'var(--light_teal-D)');
            document.documentElement.style.setProperty('--pink', 'var(--pink-D)');
            document.documentElement.style.setProperty('--light_pink', 'var(--light_pink-D)');
            document.documentElement.style.setProperty('--clear_beige', 'var(--clear_beige-D)');
            document.documentElement.style.setProperty('--clear_yellow', 'var(--clear_yellow-D)');
            document.documentElement.style.setProperty('--clear_teal', 'var(--clear_teal-D)');
            document.documentElement.style.setProperty('--error', 'var(--error-D)');
            document.documentElement.style.setProperty('--white', 'var(--white-D)');
            document.documentElement.style.setProperty('--loose', 'var(--loose-D)');
            document.documentElement.style.setProperty('--winner', 'var(--winner-D)');
            document.documentElement.style.setProperty('--ok', 'var(--ok-D)');
        } else {
            document.documentElement.style.setProperty('--linen', '#FDF0D5');
            document.documentElement.style.setProperty('--olive_green', '#5c775b');
            document.documentElement.style.setProperty('--light_teal', '#a0ced9');
            document.documentElement.style.setProperty('--pink', '#e27396');
            document.documentElement.style.setProperty('--light_pink', '#ea9ab2');
            document.documentElement.style.setProperty('--clear_beige', '#f7f2e8ce');
            document.documentElement.style.setProperty('--clear_yellow', '#fcf5c7a6');
            document.documentElement.style.setProperty('--clear_teal', '#f7f2e8af');
            document.documentElement.style.setProperty('--error', '#f03e3e');
            document.documentElement.style.setProperty('--ok', '#90be8e');
            document.documentElement.style.setProperty('--white', '#f5efe6');
            document.documentElement.style.setProperty('--loose', '#EA5863');
            document.documentElement.style.setProperty('--winner', '#BED3C3');
        }
    };

    return (
        <label className="switch">
            <input type="checkbox" checked={isColorBlind} onChange={toggleColorBlindMode} />
            <span className="slider round"></span>
            <span>{isColorBlind ? t('colorblindMode.on') : t('colorblindMode.off')}</span>
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
                    </div>
                    <div className="settings_grid">
                        {currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />}
                        {currentSection === 'PRIVACY' && <PrivacySettings />}
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
			<img src={pokemon6} alt="Pachirisu" className="pokemon6" />
        </div>
    );
}

function ArenaSelection() {
    const { t } = useTranslation();
    const [selectedArena, setSelectedArena] = useState<string>(() => localStorage.getItem('selectedArena') || arena1);

    const handleArenaSelection = (arena: string) => {
        setSelectedArena(arena);
        localStorage.setItem('selectedArena', arena);
    };

    return (
        <div className="arena-selection">
            <h2 className="arena_title">{t('settings.selectArena')}</h2>
            <div className="arena_thumbnails">
                <img
                    src={arena1}
                    alt="Arena 1"
                    onClick={() => handleArenaSelection(arena1)}
                    className={`arena-image ${selectedArena === arena1 ? 'selected' : ''}`}
                />
                <img
                    src={arena2}
                    alt="Arena 2"
                    onClick={() => handleArenaSelection(arena2)}
                    className={`arena-image ${selectedArena === arena2 ? 'selected' : ''}`}
                />
                <img
                    src={arena3}
                    alt="Arena 3"
                    onClick={() => handleArenaSelection(arena3)}
                    className={`arena-image ${selectedArena === arena3 ? 'selected' : ''}`}
                />
            </div>
        </div>
    );
}

function AccessibilitySettings() {
    return (
        <div className="accessibility_settings">
            <LanguageSwitcher />
            <ColorBlindSwitcher />
            <ArenaSelection />
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
                        <li>{t('cookie.contact_phone')}06 11 23 49 91</li>
                        <li>{t('cookie.contact_email')}contact@42lehavre.fr</li>
                        <li>{t('cookie.contact_adress')}20 Quai Frissard, 76600 Le Havre</li>
                    </ul>
                    <p>{t('cookie.contact_text')}</p>
                </section>
            </div>
        </div>
    );
}
