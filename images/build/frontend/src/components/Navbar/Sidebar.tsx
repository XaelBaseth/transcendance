import React from 'react';
import SidebarElem from './SidebarElem';	
import settingsIcon from "../../assets/settingsIcon.png";
import leaderboardIcon from "../../assets/leaderboardIcon.png";
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Sidebar () {
	const { t } = useTranslation();
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
		  	<SidebarElem title={t('navbar.about')} path="/about" image={leaderboardIcon} />
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title={t('navbar.settings')} path="/settings" image={settingsIcon} />
		  </ul>
		</nav> 
	);
}