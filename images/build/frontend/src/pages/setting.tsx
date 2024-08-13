import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../components/LanguageSwitcher/languageSwitcher';
import { useTranslation } from 'react-i18next';

import '../styles/Setting.css'

export default function Settings() {
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
		<AvatarCardSettings />
	</div>
	);
}

export function AvatarCardSettings() 
{
	{/** Automatiser de maniere a ce que chaque 
		personne puisse avoir son propre avatar */}

	const [errorMsg, setErrorMsg] = useState<string>("");
	const [browseMsg, setBrowseMsg] = useState<string>("Choose a file");
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			{/** Change Avatar */}
			setBrowseMsg("File chosen!");
		}
	}

	return (
		<div id='avatar_settings'>
			<div>
				<img src={''} alt='user_avatar' id='user_avatar'/>
			</div>
			<div className='avatar_block'>
				<h5>Change your avatar :</h5>
				<input onChange={handleChange} type='file' accept='image/png, image/jpeg, image/gif' name="file" id='file' />
				<label htmlFor='file' id='chose_file'>
					<span>Choose a new file</span>
				</label>
				<>
					{
						errorMsg &&
						<div className="setting__alert_err">
							<h6>{errorMsg}</h6>
						</div>
					}
				</>
				<button id="avatar_upload_btn" /**onClick={handleSubmit} */>Upload</button>
			</div>
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

	// UseEffect to redirect to home page after account deletion
	const navigate = useNavigate();
	useEffect(() => {
		if (isDeleted === true) {
			setTimeout(() => {
				navigate('/login');
			}, 3000);
		}
	}, [isDeleted, navigate]);

	return (
		<div className="delete_settings">
			<h2 className="delete_settings__title">{t('settings.delete')}</h2>
			<h4 className="delete_settings__subtitle">{t('settings.irreversible')}</h4>
			<button className="delete_settings__btn"
				onClick={handleDelete}>
				Delete
				<span>Delete your account</span>
			</button>
			<>
				{
					isDeleted &&
					<div className="delete_settings__alert">
						<h5>{t('settings.deleteSuccess')}</h5>
						<h6>{t('settings.redirection')}</h6>
					</div>
				}
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
				<li>{t('cookie.contact_adress')} </li>
			  </ul>
			  <p>{t('cookie.contact_text')}</p>
			</section>
		  </div>
		</div>
	  );
}