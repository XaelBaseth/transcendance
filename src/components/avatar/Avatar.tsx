import { NavLink } from 'react-router-dom'
import './Avatar.css'

export default function Avatar () {
    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' to="/profile">
                <img src={process.env.PUBLIC_URL +'/assets/toothlessAvatar.png'} alt='toothlessAvatar'id='nav--avatar'/>
            </NavLink>
            {/* User status */}
            {/* <div id='active--dot' /> */}
        </div>
    )
}
