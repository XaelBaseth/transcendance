import { Link } from 'react-router-dom';
import './LoginBtn.css';

export default function Loginbtn() {
    return (
        <button className='login__button'>
            <Link className='link__login' to="/login">Log in</Link>
        </button>
    );
}