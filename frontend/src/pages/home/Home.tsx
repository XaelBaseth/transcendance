import { Link, useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../context/context";
import { useContext, useState } from "react";
import "./Home.css";

export default function Home() {
        const [open, setOpen] = useState(false);
        const navigate = useNavigate();
        const isLogin = useContext(IsLoggedInContext);

        function handleClick() {
            if (!isLogin)
                navigate('/login');
            setOpen(!open);
        }

    return (

        <div id="play-screen">
            <button className="btn__play" data-text="PRESS TO PLAY" onClick={handleClick} >
                <Link className="link-login" to='/gamepage'> PRESS TO PLAY </Link>
            </button>
        </div>
    );
}
