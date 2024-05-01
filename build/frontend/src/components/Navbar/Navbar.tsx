import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Avatar from '../avatar/Avatar';
import LoginBtn from '../LoginBtn/LoginBtn';
import "./Navbar.css";

export default function Navbar() {
  
		const [sidebar] = useState<boolean>(true);
		const navigate = useNavigate();


 return (
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
				isLoggedIn === false &&
				<div className='nav--avatar'>
					<LoginBtn />
				</div>
			}
		</>
		<>
			{
				isLoggedIn === true &&
				<div className='nav--avatar'>
					<Avatar setLoggedIn={setLoggedIn}/>
					<button className="logout_btn" onClick={handleLogout}>Logout</button>
				</div>
			}
		</>
	</div>
	<Sidebar sidebar={sidebar} />
  </>
  );
};