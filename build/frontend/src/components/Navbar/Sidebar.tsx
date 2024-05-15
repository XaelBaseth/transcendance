import React from 'react';
import SidebarElem from './SidebarElem';	
import historyIcon from "../../assets/historyIcon.png";
import settingsIcon from "../../assets/settingsIcon.png";
import leaderboardIcon from "../../assets/leaderboardIcon.png";
import socialIcon from "../../assets/socialIcon.png";
import profilIcon from "../../assets/profilIcon.png";
import './Navbar.css';

export default function Sidebar () {
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Profil" path="/profile" image={profilIcon} />
			<SidebarElem title="Social" path="/social" image={socialIcon} />
		  	<SidebarElem title="Leaderboard" path="/leaderboard" image={leaderboardIcon} />
			<SidebarElem title="Match History" path="/" image={historyIcon} />
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title="Settings" path="/settings" image={settingsIcon} />
		  </ul>
		</nav> 
	);
}