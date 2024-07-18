import React from 'react'
import "../styles/Home.css"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Home() {
	const { t } = useTranslation();

    return (
    <div id="play-screen">
        <button className="btn__play" data-text="PRESS TO PLAY">
            <Link className='link' to='/gamepage'>{t('home.play')}</Link>
        </button>
    </div>
);
}
