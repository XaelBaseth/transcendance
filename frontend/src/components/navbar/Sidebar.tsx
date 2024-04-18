import SidebarElem from './SidebarElem';
import './Navbar.css';

export default function Sidebar (props :{sidebar:boolean}) {
    return (
		<nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Social" path="/social" image='assets/social_icons.png'/>
			<SidebarElem title="Settings" path="/settings" image='assets/settings_icons.png'/>
		  	<SidebarElem title="Leaderboard" path="/leaderboard" image='assets/leaderboard_icons.webp'/>
		  </ul>
		</nav> 
	);
}