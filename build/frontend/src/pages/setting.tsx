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
						{/* Add more buttons for other sections if needed */}
					</div>
					<div className="settings_grid">
						{currentSection === 'USER' && <UserSettings />} {/* Render User settings component */}
						{currentSection === 'PRIVACY' && <PrivacySettings />} {/* Render Privacy settings component */}
						{currentSection === 'ACCESSIBILITY' && <AccessibilitySettings />} {/* Render Accessibility settings component */}
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
			<TextCardSettings
				property="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				onSubmit={(newUsername) => setUsername(newUsername)} // Example onSubmit for username
			/>
			<TextCardSettings
				property="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				onSubmit={(newEmail) => setEmail(newEmail)} // Example onSubmit for username
			/>
			<TextCardSettings
				property="Bio"
				value={bio}
				onChange={(e) => setBio(e.target.value)}
				onSubmit={(newBio) => setBio(newBio)} // Example onSubmit for username
			/>
			<button onClick={handleUpdate}>Save Changes</button>
		</div>
	);
}


function PrivacySettings() {
	return (
		<PasswordCardSettings />
		
		/**Activate 2FA: https://tinyurl.com/2s7exvvj */
	);
}

function AccessibilitySettings() {
	return (
		/**Languages changes */
		/**Colorbling mode */
		<DeleteAccountCardSettings />
	);
}

export function TextCardSettings({
    property,
    value,
    onChange,
    onSubmit, // Accept onSubmit as a prop
}: {
    property: string;
    value: any;
    onChange: (e: any) => any;
    onSubmit: (newValue: any) => any; // Define the type for onSubmit
}) {
    const [userInput, setUserInput] = useState(value || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (event) => {
        setUserInput(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="text_settings__card">
            <div className="text_settings_property">{property}</div>
            <div className="text_settings_input">
                {!isEditing? (
                    <>
                        <div className="text_input_value">{value}</div>
                        <button onClick={handleEdit}>Edit</button>
                    </>
                ) : (
                          <button type="submit">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
}


export function AvatarCardSettings() {
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

/*
return (
		<div className="password__card">
			<h2>Change your password</h2>
			<h4>New password</h4>
			<div className="input_container">
				<input
					type={type}
					name="password"
					id="password"
					onChange={handleChange}
					className="password__input"
				/>
				<span onClick={handleClick}>show password</span>
			</div>
			<h4>Confirm the new password</h4>
			<div className="input_container">
				<input
					type={type}
					name="password"
					id="password2"
					onChange={handleConfirmation}
					className="password__input"
				/>
				<span onClick={handleClick}>show password</span>
			</div>
			<button id="password__btn" onClick={handleUpdate}>Save password changes</button>
			<>
				{passwordChanged && (
					<div className="settings__alert_ok">
						<h6>Your modification was successful</h6>
					</div>
				)}
				{errorMsg && (
					<div className="settings__alert_error">
						<h6>{errorMsg}</h6>
					</div>
				)}
			</>
		</div>
	);
}
*/

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

