import SidebarElem from './SidebarElem';
import './Navbar.css';

export default function Sidebar (props :{sidebar:boolean}) {
    return (
		<nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Social"			path="/social"		/>
			<SidebarElem title="Settings"		path="/settings"	/>
			<SidebarElem title="Profile"		path="/profile"		/>
			<SidebarElem title="Chat"			path="/chat"		/>
		  </ul>
		</nav> 
	);
}