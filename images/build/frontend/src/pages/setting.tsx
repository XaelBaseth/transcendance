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


// import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";
// import validator from 'validator';
// import { useAuth } from '../context';
// import api from '../api';
// import LanguageSwitcher from '../components/LanguageSwitcher/languageSwitcher';
// import { useTranslation } from 'react-i18next';

// import '../styles/Setting.css'

// export default function Settings() {
//     const { t } = useTranslation();

//     const [currentSection, setCurrentSection] = useState('USER'); // Default section is 'USER'

//     const handleSectionChange = (section: string) => {
//         setCurrentSection(section);
//     };

//     return (
//         <div className='settings__flex'>
//             <div className='settings'>
//                 <h1>{t('settings.settings')}</h1>
//                 <img src="" alt="" />
//                 <div className='settings__container'>
//                     <div className="navigation">
//                         <button className={currentSection === 'USER' ? 'active' : ''} onClick={() => handleSectionChange('USER')}>{t('settings.user')}</button>
//                         <button className={currentSection === 'PRIVACY' ? 'active' : ''} onClick={() => handleSectionChange('PRIVACY')}>{t('settings.privacy')}</button>
//                         <button className={currentSection === 'ACCESSIBILITY' ? 'active' : ''} onClick={() => handleSectionChange('ACCESSIBILITY')}>{t('settings.accessibility')}</button>
//                     </div>
//                     <div className="settings_grid">
//                         {currentSection === 'USER' && <UserSettings />} 
//                         {currentSection === 'PRIVACY' && <PrivacySettings />} 
//                         {currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export function EditProfile() {
//     const { t } = useTranslation();
//     const { updateProfile, getProfile, successMsg, errorMsg } = useAuth();

//     const [username, setUsername] = useState<string>('');
//     const [email, setEmail] = useState<string>('');
//     const [currentPassword, setCurrentPassword] = useState<string>('');
//     const [newPassword, setNewPassword] = useState<string>('');
//     const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

//     useEffect(() => {
//         // Charger les informations actuelles de l'utilisateur
//         const loadProfile = async () => {
//             try {
//                 const profile = await getProfile();
//                 setUsername(profile.username);
//                 setEmail(profile.email);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         loadProfile();
//     }, [getProfile]);

//     const handleUpdateProfile = async (e: FormEvent) => {
//         e.preventDefault();
//         try {
//             await updateProfile(username, email, currentPassword, newPassword, confirmNewPassword);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <div className="editProfile">
//             <div className="background" />
//             <div className="editProfile_title">
//                 <h1 className="editProfile__title">{t('editProfile.title')}</h1>
//                 <form className="editProfile-form" onSubmit={handleUpdateProfile}>
//                     <label className="editProfile_label" htmlFor="email">{t('editProfile.email')}</label>
//                     <input
//                         type="text"
//                         value={email}
//                         onChange={(event) => setEmail(event.target.value)}
//                         placeholder={t('editProfile.email')}
//                         id="email"
//                     />
//                     <label className="editProfile_label" htmlFor="username">{t('editProfile.username')}</label>
//                     <input
//                         type="text"
//                         value={username}
//                         onChange={(event) => setUsername(event.target.value)}
//                         placeholder={t('editProfile.username')}
//                         id="username"
//                     />
//                     <label className="editProfile_label" htmlFor="currentPassword">{t('editProfile.currentPassword')}</label>
//                     <input
//                         type="password"
//                         value={currentPassword}
//                         onChange={(event) => setCurrentPassword(event.target.value)}
//                         placeholder={t('editProfile.currentPassword')}
//                         id="currentPassword"
//                     />
//                     <label className="editProfile_label" htmlFor="newPassword">{t('editProfile.newPassword')}</label>
//                     <input
//                         type="password"
//                         value={newPassword}
//                         onChange={(event) => setNewPassword(event.target.value)}
//                         placeholder={t('editProfile.newPassword')}
//                         id="newPassword"
//                     />
//                     <label className="editProfile_label" htmlFor="confirmNewPassword">{t('editProfile.confirmNewPassword')}</label>
//                     <input
//                         type="password"
//                         value={confirmNewPassword}
//                         onChange={(event) => setConfirmNewPassword(event.target.value)}
//                         placeholder={t('editProfile.confirmNewPassword')}
//                         id="confirmNewPassword"
//                     />
//                     {successMsg && <div className="editProfile__alert_ok"><h6>{successMsg}</h6></div>}
//                     {errorMsg && <div className="editProfile__alert_err"><h6>{errorMsg}</h6></div>}
//                     <button type="submit" id="editProfile-btn">{t('editProfile.update')}</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// function PrivacySettings() {
//     return (
//         <div className="privacy_settings">
//             <PasswordCardSettings />
//             {/** <Activate2FA /> */}
//             <CookieSettings />
//         </div>
//     );
// }

// function AccessibilitySettings() {
//     return (
//         /**Languages changes */
//         /**Colorbling mode */
//         <DeleteAccountCardSettings />
//     );
// }

// export function TextCardSettings({ property } : {property: string}) {
//     {/** Automatiser de maniere a ce que chaque 
//         personne puisse avoir son propre avatar */}

//     const [userInput, setUserInput] = useState<string>("");
//     const [errorMsg, setErrorMsg] = useState<string>("");
//     const [propertyChanged, setPropertyChange] = useState<boolean>(false);

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setUserInput(event.target.value); }
    
//     const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
//         event.preventDefault();
//         if (property !== 'email' ||
//             (property === 'email' && validator.isEmail(userInput) === true)) {
//             setErrorMsg("");
//         }
//         else {
//             setErrorMsg("Email must be formatted mail@mail.mail");
//         }
//     };

//     return (
//         <div className="text_settings__card">
//             <div className="text_settings_property">{property}</div>
//             <div className="text_settings_input">
//                 <input  
//                 type="text"
//                 name={property}
//                 id={property}
//                 placeholder="Placeholder"
//                 onChange={handleChange}
//                 className="text_input"
//                 />
//             </div>
//             <div className="setting__line"></div>
//             {propertyChanged &&
//                 <div className="settings__alert_ok">
//                 <h6>Your modification was success</h6>
//                 </div>
//             }
//             {errorMsg &&
//                 <div className="settings__alert_err">
//                 <h6>{errorMsg}</h6>
//                 </div>
//             }
//         </div>
//     );
// }

// export function AvatarCardSettings() {
//     const { t } = useTranslation();
//     const { user, setUser } = useAuth();
//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const [errorMsg, setErrorMsg] = useState<string>("");
//     const [browseMsg, setBrowseMsg] = useState<string>("Choose a file");

//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setSelectedImage(event.target.files[0]);
//             setBrowseMsg("File chosen!");
//         }
//     };

//     const uploadImage = async (event: FormEvent) => {
//         event.preventDefault();

//         if (!selectedImage) {
//             setErrorMsg("No image selected");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', selectedImage);
//         formData.append('userId', user.id);

//         try {
//             const response = await fetch(`${api.defaults.baseURL}/api/UpateUserInfo`, {
//                 method: 'POST',
//                 headers: {
//                     "Authorization": `Token ${localStorage.getItem("token")}`
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const userResponse = await fetch(`${api.defaults.baseURL}/api/user`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     "Authorization": `Token ${localStorage.getItem("token")}`
//                 }
//             });

//             if (!userResponse.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const updatedUser: User = await userResponse.json();
//             setUser(updatedUser);

//             const pp = document.getElementById('user_avatar') as HTMLImageElement;
//             if (pp) {
//                 pp.src = `${api.defaults.baseURL}${updatedUser.image}`;
//             }

//             toast.success('Avatar updated successfully');
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             setErrorMsg('Error uploading image');
//         }
//     };

//     return (
//         <div id='avatar_settings'>
//             <div>
//                 <img src={user.image ? `${api.defaults.baseURL}${user.image}` : ''} alt='user_avatar' id='user_avatar'/>
//             </div>
//             <div className='avatar_block'>
//                 <h5>{t('settings.changeAvatar')} :</h5>
//                 <input onChange={handleImageChange} type='file' accept='image/png, image/jpeg, image/gif' name="file" id='file' />
//                 <label htmlFor='file' id='chose_file'>
//                     <span>{browseMsg}</span>
//                 </label>
//                 <>
//                     {
//                         errorMsg &&
//                         <div className="setting__alert_err">
//                             <h6>{errorMsg}</h6>
//                         </div>
//                     }
//                 </>
//                 <button id="avatar_upload_btn" onClick={uploadImage}>{t('settings.upload')}</button>
//             </div>
//         </div>
//     );
// }

// function PasswordCardSettings() {
//     const { t } = useTranslation();
//     const [password, setPassword] = useState<string>("");
//     const [confirmPassword, setConfirmPassword] = useState<string>("");
//     const [errorMsg, setErrorMsg] = useState<string>("");
//     const [passwordChanged, setPasswordChange] = useState<boolean>(false);
//     const [type, setType] = useState<string>("password");

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setPassword(event.target.value);
//         validatePassword(event.target.value);
//     };

//     const handleConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setConfirmPassword(event.target.value);
//         if (event.target.value !== password) {
//             setErrorMsg(t("settings.passwordMismatch"));
//         } else {
//             setErrorMsg("");
//         }
//     };

//     const validatePassword = (password: string) => {
//         if (!validator.isStrongPassword(password, {
//             minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
//         })) {
//             setErrorMsg(t("settings.weakPassword"));
//         } else {
//             setErrorMsg("");
//         }
//     };

//     const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
//         event.preventDefault();
//         if (errorMsg === "") {
//             try {
//                 const response = await api.post('/api/user/update/password/', { password });
//                 if (response.status >= 200 && response.status < 300) {
//                     setPasswordChange(true);
//                 } else {
//                     setErrorMsg("Failed to update password");
//                 }
//             } catch (error) {
//                 console.error("Error updating password:", error);
//                 setErrorMsg("Error updating password");
//             }
//         }
//     };

//     const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//         event.preventDefault();
//         setType(type === "password" ? "text" : "password");
//     };

//     return (
//         <div className="password__card">
//             <h2>{t("settings.changePassword")}</h2>
//             <h4>{t('settings.newPassword')}</h4>
//             <div className="input_container">
//                 <input  
//                     type={type}
//                     name="password"
//                     value={password}
//                     onChange={handleChange}
//                     className="password__input"
//                 />
//                 <span onClick={handleClick}>{t('settings.showPassword')}</span>
//             </div>
//             <h4>{t('settings.confirmPassword')}</h4>
//             <div className="input_container">
//                 <input  
//                     type={type}
//                     name="confirmPassword"
//                     value={confirmPassword}
//                     onChange={handleConfirmation}
//                     className="password__input"
//                 />
//                 <span onClick={handleClick}>{t('settings.showPassword')}</span>
//             </div>
//             <button id="password__btn" onClick={handleUpdate}>{t('settings.savePassword')}</button>
//             {passwordChanged && <div className="settings__alert_ok"><h6>{t('settings.successMsg')}</h6></div>}
//             {errorMsg && <div className="settings__alert_err"><h6>{errorMsg}</h6></div>}
//         </div>
//     );
// }

// export function Activate2FA() {
// 	const { t } = useTranslation();

// 	const [is2FAActivated, setIs2FAActivated] = useState(false);

// 	return (
// 		// Use a React Fragment or a div to wrap all elements
// 		<>
// 			<div className="checkbox_2FA">
// 				<label>
// 					Activate 2FA:
// 					<input type="checkbox" checked={is2FAActivated} onChange={(e) => setIs2FAActivated(e.target.checked)} />
// 				</label>
// 			</div>
// 		</>
// 	);
// }

// export function DeleteAccountCardSettings() {
// 	const { t } = useTranslation();
// 	const [isDeleted, setDeleted] = useState<boolean>(false);

// 	// fonction qui va être appelée au click du bouton, et activer deleteUser
// 	const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
// 		e.preventDefault();
// 		//try { deleteUser.mutate(); }
// 		//catch (error) { console.log(error); }
// 		setDeleted(true);
// 	};

// 	// UseEffect to redirect to home page after account deletion
// 	const navigate = useNavigate();
// 	useEffect(() => {
// 		if (isDeleted === true) {
// 			setTimeout(() => {
// 				navigate('/login');
// 			}, 3000);
// 		}
// 	}, [isDeleted, navigate]);

// 	return (
// 		<div className="delete_settings">
// 			<h2 className="delete_settings__title">{t('settings.delete')}</h2>
// 			<h4 className="delete_settings__subtitle">{t('settings.irreversible')}</h4>
// 			<button className="delete_settings__btn"
// 				onClick={handleDelete}>
// 				Delete
// 				<span>Delete your account</span>
// 			</button>
// 			<>
// 				{
// 					isDeleted &&
// 					<div className="delete_settings__alert">
// 						<h5>{t('settings.deleteSuccess')}</h5>
// 						<h6>{t('settings.redirection')}</h6>
// 					</div>
// 				}
// 			</>
// 		</div>
// 	);
// }

// export function CookieSettings() {
// 	const { t } = useTranslation();

// 	return (
// 		<div className="cookie-settings">
// 		  <div className="cookie-content">
// 			<h3>{t('cookie.policy')}</h3>
// 			<section>
// 			  <h4>{t('cookie.introduction')}</h4>
// 			  <p>
// 				{t('cookie.intro_text')}
// 			  </p>
// 			</section>
	
// 			<section>
// 			  <h4>{t('cookie.cookie_title')}</h4>
// 			  <p>
// 				{t('cookie.cookie_text')}
// 			  </p>
// 			</section>
	
// 			<section>
// 			  <h3>{t('cookie.type_title')}</h3>
// 			  <p>
// 				{t('cookie.type_text')}
// 			  </p>
// 			</section>
	
// 			<section>
// 			  <h3>{t('cookie.use_title')}</h3>
// 			  <p>
// 			  		{t('cookie.type_text')}
// 			  </p>
	
// 			  <h5>{t('cookie.manage_title')}</h5>
// 			  <p>
// 				{t('cookie.manage_text')}
// 			  </p>
// 			</section>
	
// 			<section>
// 			  <h5>{t('cookie.rights_title')}</h5>
// 			  <ul>
// 				<li>{t('cookie.rights_1')}</li>
// 				<li>{t('cookie.rights_2')}</li>
// 				<li>{t('cookie.rights_3')}</li>
// 				<li>{t('cookie.rights_4')}</li>
// 				<li>{t('cookie.rights_5')}</li>
// 			  </ul>
// 			  <p>{t('cookie.rights_text')}</p>
// 			</section>
	
// 			<section>
// 			  <h5>{t('cookie.contact_title')}</h5>
// 			  <ul>
// 				<li>{t('cookie.contact_adress')} </li>
// 				<li>{t('cookie.contact_email')} </li>
// 				<li>{t('cookie.contact_adress')} </li>
// 			  </ul>
// 			  <p>{t('cookie.contact_text')}</p>
// 			</section>
// 		  </div>
// 		</div>
// 	  );
// }