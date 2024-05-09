import React from 'react'
import "../styles/Home.css"
import { Link, useNavigate } from "react-router-dom";

export default function Home() {

    return (
    <div id="play-screen">
        <button className="btn__play" data-text="PRESS TO PLAY">
            <Link className='link' to='/gamepage'>PRESS HERE TO PLAY </Link>
        </button>
    </div>
);
}
