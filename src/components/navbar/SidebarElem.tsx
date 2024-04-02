import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function SidebarElem(props : { 
	title: string,
	path: string}) {
	return (
		<>
			<li className='nav-text'>
				<NavLink to={props.path} >
				<span className='item_title'> {props.title}</span>	
				</NavLink>
			</li>
		</>
	);
}