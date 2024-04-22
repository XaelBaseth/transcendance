import SidebarElem from './SidebarElem';
import './Navbar.css';

export default function Sidebar (props :{sidebar:boolean}) {
    return (
		<nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Profil" path="/" image='assets/icone_profil.png'/>
			<SidebarElem title="Social" path="/social" image='assets/social_icone.png'/>
		  	<SidebarElem title="Leaderboard" path="/leaderboard" image='assets/leaderboard_icone.png'/>
			<SidebarElem title="Match History" path="/" image='assets/history_icone.png'/>
		  </ul>
		  <ul className="flag_btn">
			<SidebarElem title="" path="/english" image='assets/UK.png'/>
			<SidebarElem title="" path="/french" image='assets/france.png'/>
			<SidebarElem title="" path="/portuguese" image='assets/portugal.png'/>
		  </ul>
		  <ul className="settings_btn">
			<SidebarElem  title="Settings" path="/settings" image='assets/icone_settings.png'/>
		  </ul>
		</nav> 
	);
}