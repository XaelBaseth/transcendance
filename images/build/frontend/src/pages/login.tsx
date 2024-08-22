import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, successMsg, errorMsg } = useAuth();
    const navigate = useNavigate();

    const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(email, password);
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="Login">
            <div className="background" />
            <form className="connection-form" onSubmit={handleLogIn}>
                <label className="login_label" htmlFor="email">{t('login.email')}</label>
                <input 
                    onChange={(event) => setEmail(event.target.value)} 
                    type="email" 
                    placeholder={t('login.email')} 
                    id="email" 
                    value={email}
                />

                <label className="login_label" htmlFor="password">{t('login.password')}</label>
                <input 
                    onChange={(event) => setPassword(event.target.value)} 
                    type="password" 
                    placeholder={t('login.password')} 
                    id="password" 
                    value={password}
                />

                {successMsg && (
                    <div className="login__alert_ok">
                        <h6>{successMsg}</h6>
                    </div>
                )}

                {errorMsg && (
                    <div className="login__alert_err">
                        <h6>{errorMsg}</h6>
                    </div>
                )}

                <button type="submit" id="login-btn">{t('login.login')}</button>

                <div className="social">
                    <div className="signup">
                        <button type="button" onClick={handleSignUp} id="signup_btn">{t('login.signup')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}