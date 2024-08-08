import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import { useAuth } from '../context';
import api from '../api';
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

    const handleSectionChange = (section: string) => {
        setCurrentSection(section);
    };

    return (
        <div className='settings__flex'>
            <div className='settings'>
                <h1>{t('settings.settings')}</h1>
                <div className='settings__container'>
                    <div className="navigation">
                        <button className={currentSection === 'USER' ? 'active' : ''} onClick={() => handleSectionChange('USER')}>{t('settings.user')}</button>
                        <button className={currentSection === 'PRIVACY' ? 'active' : ''} onClick={() => handleSectionChange('PRIVACY')}>{t('settings.privacy')}</button>
                        <button className={currentSection === 'ACCESSIBILITY' ? 'active' : ''} onClick={() => handleSectionChange('ACCESSIBILITY')}>{t('settings.accessibility')}</button>
                    </div>
                    <div className="settings_grid">
                        {currentSection === 'USER' && <UserSettings />} 
                        {currentSection === 'PRIVACY' && <PrivacySettings />} 
                        {currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserSettings: React.FC = () => {
    const { t } = useTranslation();
    const { user, setUser, successMsg, errorMsg } = useAuth();
    const [username, setUsername] = useState<string>(user?.username || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData();
        if (selectedImage) {
            formData.append('file', selectedImage);
        }
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
    
        try {
            const response = await api.post('/api/user/UpdateUserInfo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`,
                    'X-CSRFToken': getCookie('csrftoken') // Inclure le token CSRF si nécessaire
                }
            });
    
            if (response.status >= 200 && response.status < 300) {
                setUser(response.data);
                toast.success('Information mise à jour avec succès');
                navigate('/profile'); // Exemple de redirection
            } else {
                throw new Error('Échec de la mise à jour');
            }
        } catch (error) {
            console.error('Échec de la mise à jour', error);
            toast.error('Échec de la mise à jour');
        }
    };
    

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <div className="userSettings">
            <h1>{t('settings.title')}</h1>
            <form onSubmit={handleUpdate}>
                <label htmlFor="username">{t('settings.username')}</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="email">{t('settings.email')}</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">{t('settings.password')}</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">{t('settings.confirmPassword')}</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="profileImage">{t('settings.uploadImage')}</label>
                <input
                    id="profileImage"
                    type="file"
                    onChange={handleImageChange}
                />
                <button type="submit">{t('settings.update')}</button>
                {successMsg && <div className="successMsg">{successMsg}</div>}
                {errorMsg && <div className="errorMsg">{errorMsg}</div>}
            </form>
        </div>
    );
};

const PrivacySettings: React.FC = () => {
    return (
        <div className="privacy_settings">
            <PasswordCardSettings />
            {/* <Activate2FA /> */}
            <CookieSettings />
        </div>
    );
};

const AccessibilitySettings: React.FC = () => {
    return (
        <div>
            <DeleteAccountCardSettings />
            {/* Additional accessibility settings can go here */}
        </div>
    );
};

const PasswordCardSettings: React.FC = () => {
    const { t } = useTranslation();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [passwordChanged, setPasswordChange] = useState<boolean>(false);
    const [type, setType] = useState<string>('password');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        validatePassword(event.target.value);
    };

    const handleConfirmation = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        if (event.target.value !== password) {
            setErrorMsg(t("settings.passwordMismatch"));
        } else {
            setErrorMsg('');
        }
    };

    const validatePassword = (password: string) => {
        if (!validator.isStrongPassword(password, {
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMsg(t("settings.weakPassword"));
        } else {
            setErrorMsg('');
        }
    };

    const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (errorMsg === '') {
            try {
                const response = await api.post('/api/user/update/password/', { password });
                if (response.status >= 200 && response.status < 300) {
                    setPasswordChange(true);
                } else {
                    setErrorMsg('Failed to update password');
                }
            } catch (error) {
                console.error('Error updating password:', error);
                setErrorMsg('Error updating password');
            }
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setType(type === 'password' ? 'text' : 'password');
    };

    return (
        <div className="password__card">
            <h2>{t("settings.changePassword")}</h2>
            <h4>{t('settings.newPassword')}</h4>
            <div className="input_container">
                <input
                    type={type}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="password__input"
                />
                <span onClick={handleClick}>{t('settings.showPassword')}</span>
            </div>
            <h4>{t('settings.confirmPassword')}</h4>
            <div className="input_container">
                <input
                    type={type}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmation}
                    className="password__input"
                />
                <span onClick={handleClick}>{t('settings.showPassword')}</span>
            </div>
            <button id="password__btn" onClick={handleUpdate}>{t('settings.savePassword')}</button>
            {passwordChanged && <div className="settings__alert_ok"><h6>{t('settings.successMsg')}</h6></div>}
            {errorMsg && <div className="settings__alert_err"><h6>{errorMsg}</h6></div>}
        </div>
    );
};

const DeleteAccountCardSettings: React.FC = () => {
    const { t } = useTranslation();
    const [isDeleted, setDeleted] = useState<boolean>(false);
    const navigate = useNavigate();

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

const CookieSettings: React.FC = () => {
    return (
        <div className="cookie_settings">
            <h2>Cookie Settings</h2>
            <p>Manage your cookie preferences here.</p>
        </div>
    );
};

export default Settings;

