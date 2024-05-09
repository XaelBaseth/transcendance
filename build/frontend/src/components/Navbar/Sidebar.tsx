import React from 'react';
import SidebarElem from './SidebarElem';
import './Navbar.css';

export default function Sidebar () {
    return (
		<nav className={'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Profil" path="/profile" image='assets/icone_profil.png'/>
			<SidebarElem title="Social" path="/social" image='assets/social_icone.png'/>
		  	<SidebarElem title="Leaderboard" path="/leaderboard" image='assets/leaderboard_icone.png'/>
			<SidebarElem title="Match History" path="/" image='assets/history_icone.png'/>
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title="Settings" path="/settings" image='assets/icone_settings.png'/>
		  </ul>
		</nav> 
	);
}