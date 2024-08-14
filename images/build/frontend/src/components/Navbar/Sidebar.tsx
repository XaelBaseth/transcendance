import React from 'react';
import SidebarElem from './SidebarElem';	
import settingsIcon from "../../assets/settingsIcon.png";
import aboutIcon from "../../assets/leaderboardIcon.png";
import localIcon from "../../assets/iconeLocal.png";
import networkIcon from "../../assets/iconeNetwork.png"
import tournamentIcon from "../../assets/iconeTournament.png"
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Sidebar () {
	const { t } = useTranslation();
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title={t('navbar.local')} path="/localpong" image={localIcon} />
			<SidebarElem title={t('navbar.network')} path="/pong" image={networkIcon} />
			<SidebarElem title={t('navbar.tournament')} path="" image={tournamentIcon} />
			<SidebarElem title={t('navbar.about')} path="/about" image={aboutIcon} />
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title={t('navbar.settings')} path="/settings" image={settingsIcon} />
		  </ul>
		</nav> 
	);
}