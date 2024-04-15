import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Avatar from '../avatar/Avatar';
import LoginBtn from '../loginbtn/LoginBtn';
import { IsLoggedInContext } from '../../context/context';
import { logOut } from '../../api/APIHandler';
import "./Navbar.css";


export default function Navbar(props :{
		setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
  
		const [sidebar, setSidebar] = useState<boolean>(false);
  		const isLoggedIn = useContext(IsLoggedInContext);
		const { setLoggedIn } = props;
		const navigate = useNavigate();


		const handleLogout = async () => {
			try {
				await logOut();
				setLoggedIn(false);
				setTimeout(() => {
					navigate('/')
				}, 1000);
			} catch (error) {
				console.log("logout error");
			}
		}


		const showSidebar = () => setSidebar(!sidebar);

 return (
  <>
    <div className='navbar'>
		<label className="nav-elements" id="burger-menu" htmlFor="check">
			<input type="checkbox" id="check" onClick={showSidebar}/> 
			<span className='span1'></span>
			<span className='span2'></span>
			<span className='span3'></span> 
		</label>
		<div className="navbar__center">
			<NavLink to="/" className="navbar__title">PONG</NavLink>
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