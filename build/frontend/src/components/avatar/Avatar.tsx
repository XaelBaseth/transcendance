import React from 'react';
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context';
import './Avatar.css'


export default function Avatar() {
    const { user } = useAuth(); // Use user state from context

    if (!user) {
        return <div>No user logged in</div>; // Display a message if no user is logged in
    }

    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' to="/settings">
                <img src={user.avatar} alt={user.username} id='nav--avatar'/>
            </NavLink>
            <div id="active-dot"></div>
        </div>
    )
}