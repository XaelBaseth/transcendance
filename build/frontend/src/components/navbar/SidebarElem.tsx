import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function SidebarElem(props : { 
	title: string,
	path: string,
	image: string}) {
	return (
		<>
			<ul className='nav-text'>
				<NavLink to={props.path} >
					<img src={props.image} alt='{props.title}' className='sidebar_image'/>
					<span className='item_title'> {props.title}</span>	
				</NavLink>
			</ul>
		</>
	);
}