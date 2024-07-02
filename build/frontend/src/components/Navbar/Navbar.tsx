import React from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Avatar from '../Avatar/Avatar';
import { useAuth } from '../../context';
import "./Navbar.css";

export default function Navbar(){
	const { user, logout } = useAuth();
	
	const handleLogout = () => {
		logout();
	}	

 return (
	user &&
	<>
		<div className='navbar'>
			<label className="nav-elements" id="burger-menu" htmlFor="check">
				<input type="checkbox" id="check"/> 
				<span className='span1'></span>
				<span className='span2'></span>
				<span className='span3'></span> 
			</label>
			<div className="navbar__center">
				<NavLink to="/" className="navbar__title">POKEPONG</NavLink>
			</div>
			<>
				{
					<div className='nav--avatar'>
						<Avatar />
						<button className="logout_btn" onClick={handleLogout}>Logout</button>
					</div>
				}
			</>
		</div>
		<Sidebar />
  </>
  );
};