import React from 'react'
import "../styles/Home.css"
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
	const { t } = useTranslation();
	const navigate = useNavigate();

    const buttonPressed = () => {
		navigate('/gamepage');
	}

    return (
    <div id="play-screen">
		<button className="btn__play" data-text="PRESS TO PLAY" onClick={buttonPressed}>
            {t('home.play')}
        </button>
    </div>
);
}
