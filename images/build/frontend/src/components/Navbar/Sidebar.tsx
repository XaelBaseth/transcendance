import React from 'react';
import { useTranslation } from 'react-i18next';
import SidebarElem from './SidebarElem';	
import settingsIcon from "../../assets/icone_setting.webp"
import aboutIcon from "../../assets/icone_about.webp";
import localIcon from "../../assets/icone_local.webp";
import networkIcon from "../../assets/icone_online.webp"
import tournamentIcon from "../../assets/icone_tournament.webp"
import socialIcon from "../../assets/icone_social.png"
import profileIcon from "../../assets/icone_profile.png"
import './Navbar.css';

export default function Sidebar () {
	const { t } = useTranslation();
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
		  	<SidebarElem title={t('navbar.profile')} path="/profile" image={profileIcon} /> 
			<SidebarElem title={t('navbar.local')} path="/localpong" image={localIcon} />
			<SidebarElem title={t('navbar.network')} path="/pong" image={networkIcon} />
			<SidebarElem title={t('navbar.tournament')} path="" image={tournamentIcon} />
			<SidebarElem title={t('navbar.social')} path="/social" image={socialIcon} />
			<SidebarElem title={t('navbar.about')} path="/about" image={aboutIcon} />
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title={t('navbar.settings')} path="/settings" image={settingsIcon} />
		  </ul>
		</nav> 
	);
}