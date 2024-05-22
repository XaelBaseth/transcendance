import React from 'react';
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import '../styles/Setting.css'

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
			//updateProperty.mutate();
			setErrorMsg("");
			if (property === 'email')
				toast.success("Please check your mails");
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
              placeholder="placeholder"
              onChange={handleChange}
              className="text_input"
            />
            <button 
              className="text_settings_btn"
              onClick={handleUpdate}>
            </button>
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
                <img src={'/src/assets/pokeball.png'} alt='user_avatar' id='user_avatar'/>
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

/*return (
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
}*/

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
				navigate('/');
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
						<h6>You will now be redirected to the home page in a few seconds...</h6>
					</div>
				}
			</>
		</div>
	);
}

export default function Settings() {
    return (
        <div className='settings__flex'>
            <div className='settings'>
                <h1>Settings</h1>
                <img src="" alt="" />
                <div className='settings__container'>
                    <AvatarCardSettings />
                    <TextCardSettings property="Enter your pseudo"/>
                    <TextCardSettings property="Enter a bio"/>
                    <TextCardSettings property="Enter your email"/>
                    <PasswordCardSettings />
                    <DeleteAccountCardSettings />
                </div>
            </div>
        </div>
    );
}