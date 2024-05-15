import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function SidebarElem(props : { 
	title: string,
	path: string,
	image: string}) {
	return (
		<>
			<ul className='nav-text'>
				<Link to={props.path} >
					<img src={props.image} alt='{props.icones}' className='sidebar_image'/>
					<span className='item_title'> {props.title}</span>	
				</Link>
			</ul>
		</>
	);
}