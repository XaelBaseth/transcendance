import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import { useAuth } from '../context';
import api from '../api';
import '../styles/Setting.css'

export default function Settings() {
	const [currentSection, setCurrentSection] = useState('USER'); // Default section is 'USER'

	const handleSectionChange = (section) => {
		setCurrentSection(section);
	};

	return (
		<div className='settings__flex'>
			<div className='settings'>
				<h1>Settings</h1>
				<img src="" alt="" />
				<div className='settings__container'>
					<div className="navigation">
						<button className={currentSection === 'USER' ? 'active' : ''} onClick={() => handleSectionChange('USER')}>User</button>
						<button className={currentSection === 'PRIVACY' ? 'active' : ''} onClick={() => handleSectionChange('PRIVACY')}>Privacy and Security</button>
						<button className={currentSection === 'ACCESSIBILITY' ? 'active' : ''} onClick={() => handleSectionChange('ACCESSIBILITY')}>Accessibility</button>
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
}

function UserSettings() {
	const { user, setUser } = useAuth();
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [bio, setBio] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (user) {
			console.log("user infos: ", user);
			setUsername(user.username);
			setEmail(user.email);
			setBio(user.bio);
		}
	}, [user]);

	const handleUpdate = async () => {
		try {
			//change link according to backend settings
			const response = await api.put(`/api/user/update/${user.username}/`, { username, email, bio });
			if (response.status >= 200 && response.status < 300) {
				const updatedUser = { ...user, name: username, email, bio };
				setUser(updatedUser);
				console.log("User updated successfully");
			} else {
				setError("Failed to update user");
			}
		} catch (error) {
			console.error("Error updating user:", error);
			setError("Error updating user");
		}
	};

	return (
		<div>
			<TextCardSettings property="Enter your pseudo"/>
            <TextCardSettings property="Enter a bio"/>
            <TextCardSettings property="Enter your email"/>
			{/** <button onClick={handleUpdate}>Save Changes</button> */}
		</div>
	);
}


function PrivacySettings() {
	return (
		<PasswordCardSettings />
		//<Activate2FA />
	);
}

function AccessibilitySettings() {
	return (
		/**Languages changes */
		/**Colorbling mode */
		<DeleteAccountCardSettings />
	);
}

export function TextCardSettings({ property } : {property: string}) {
    {/** Automatiser de maniere a ce que chaque 
        personne puisse avoir son propre avatar */}

    const [userInput, setUserInput] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [propertyChanged, setPropertyChange] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setUserInput(event.target.value); }
    
    const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (property !== 'email' ||
			(property === 'email' && validator.isEmail(userInput) === true)) {
			setErrorMsg("");
		}
		else {
			setErrorMsg("Email must be formatted mail@mail.mail");
		}
	};

    return (
        <div className="text_settings__card">
          <div className="text_settings_property">{property}</div>
          <div className="text_settings_input">
            <input  
              type="text"
              name={property}
              id={property}
              placeholder="Placeholder"
              onChange={handleChange}
              className="text_input"
            />
          </div>
          <div className="setting__line"></div>
          {propertyChanged &&
            <div className="settings__alert_ok">
              <h6>Your modification was success</h6>
            </div>
          }
          {errorMsg &&
            <div className="settings__alert_err">
              <h6>{errorMsg}</h6>
            </div>
          }
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
export function PasswordCardSettings() {
	const [userInput, setUserInput] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [passwordChanged, setPasswordChange] = useState<boolean>(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(event.target.value);
		if (validator.isStrongPassword(userInput, {
			minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
		})
			=== false) {
			setErrorMsg("Your password is not strong enough");
		} else {
			setErrorMsg("");
		}
	}

	const handleConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
		(event.target.value !== userInput) ?
			setErrorMsg("")
			: setErrorMsg("");
	}

	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (errorMsg === "") {
			//updatePassword.mutate();
			setPasswordChange(true);
		}
	};

	const [type, setType] = useState<string>("password");
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	}

	return (
		<div className="password__card">
			<h2>Change your password</h2>
			<h4>New password</h4>
			<div className="input_container">
				<input  type={type}
						name="password"
						id="password"
						onChange={handleChange}
						className="password__input"
			/>
				<span onClick={handleClick}>show password</span>
			</div>
			<h4>Confirm the new password</h4>
			<div className="input_container">
				<input  type={type} 
						name="password"
						id="password2"
						onChange={handleConfirmation}
						className="password__input"
				/>
					<span onClick={handleClick}>show password</span>
			</div>
			<button id="password__btn" onClick={handleUpdate}>Save password changes</button>
			<>
				{
					passwordChanged &&
					<div className="settings__alert_ok">
						<h6>Your modification was successful</h6>
					</div>
				}
			</>
		</div>
	);
}

export function Activate2FA() {
    const [is2FAActivated, setIs2FAActivated] = useState(false);

    return (
        // Use a React Fragment or a div to wrap all elements
        <>
            <div className="checkbox_2FA">
                <label>
                    Activate 2FA:
                    <input type="checkbox" checked={is2FAActivated} onChange={(e) => setIs2FAActivated(e.target.checked)} />
                </label>
            </div>
        </>
    );
}

export function DeleteAccountCardSettings() {

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
			<h2 className="delete_settings__title">Do you want to delete your account?</h2>
			<h4 className="delete_settings__subtitle">Beware, this action is irreversible.</h4>
			<button className="delete_settings__btn"
				onClick={handleDelete}>
				Delete
				<span>Delete your account</span>
			</button>
			<>
				{
					isDeleted &&
					<div className="delete_settings__alert">
						<h5>Your account was successfully deleted!</h5>
						<h6>You will now be redirected to the login page in a few seconds...</h6>
					</div>
				}
			</>
		</div>
	);
}

