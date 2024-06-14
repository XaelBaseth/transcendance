import React from 'react';
import SidebarElem from './SidebarElem';	
import historyIcon from "../../assets/historyIcon.png";
import settingsIcon from "../../assets/settingsIcon.png";
import leaderboardIcon from "../../assets/leaderboardIcon.png";
import socialIcon from "../../assets/socialIcon.png";
import profilIcon from "../../assets/profilIcon.png";
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Sidebar () {
	const { t } = useTranslation();
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title={t('navbar.profile')} path="/profile" image={profilIcon} />
			<SidebarElem title={t('navbar.social')} path="/social" image={socialIcon} />
		  	<SidebarElem title={t('navbar.about')} path="/about" image={leaderboardIcon} />
			<SidebarElem title={t('navbar.mHistory')} path="/" image={historyIcon} />
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title={t('navbar.settings')} path="/settings" image={settingsIcon} />
		  </ul>
		</nav> 
	);
}