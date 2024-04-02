import { useEffect, useState } from "react";
import './Setting.css'

export function TextCardSettings({ property } : {property: string}) {
    {/** Automatiser de maniere a ce que chaque 
        personne puisse avoir son propre avatar */}

    const [userInput, setUserInput] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setUserInput(event.target.value); }
    const [propertyChanged, setPropertyChange] = useState<boolean>(false);

    return (
            <>
            <div className="text_settings__card">
                <div className="text_settings_proper">property</div>
                <div className="text_setting_input">
                    <input  type="text"
                            name="property"
                            id="property"
                            placeholder="placeholder"
                            onChange={handleChange}
                            className="text_input"        
                    />
                    <button className="text_settings_btn">
                            Handle the update here!
                    </button>
                </div>
            </div>
            <>
                {
                    propertyChanged &&
                    <div className="settings__alert_ok">
                        <h6>Your modification was success</h6>
                    </div>
                }
            </>
            <>
                {
                    errorMsg &&
                    <div className="settings__alert_err">
                        <h6>{errorMsg}</h6>
                    </div>
                }
            </>
        </>
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
                <img src={process.env.PUBLIC_URL +'/assets/toothlessAvatar.png'} alt='user_avatar' id='user_avatar'/>
            </div>
            <div className='avatar_block'>
                <h5>Change your avatar :</h5>
                <input onChange={handleChange} type='file' accept='image/png, image/jpeg, image/gif' name="file" id='file' />
                <label htmlFor='file' id='choise_file'>
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

    const [type, setType] = useState<string>("password");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [passwordChanged, setPasswordChange] = useState<boolean>(false);


    return (
        <div className="password__card">
            <h2>Change your password</h2>
            <h4>New password</h4>
            <div className="input_container">
                <input  type={type}
                        name="password"
                        id="password"
                        //onChange={handleChange}
                        className="password__input"
            />
 
            </div>
        </div>
    )
}

export default function Settings() {
    return (
        <div className='settings__flex'>
            <div className='settings'>
                <h1>Settings</h1>
                <img src="" alt="" />
                <div className='settings__container'>
                    <AvatarCardSettings />
                    <TextCardSettings property="Test"/>
                    <TextCardSettings property="Test"/>
                    <TextCardSettings property="Test"/>
                </div>
            </div>
        </div>
    );
}