import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context';
import './Avatar.css';
import defaultAvatar from '../../assets/profilIcon.png';
import AvatarModal from './AvatarModal'; // Import du modal

export default function Avatar() {
    const { user, setUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const avatarSrc = user?.avatar ? user.avatar : defaultAvatar;

    const handleAvatarClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAvatarSelect = (avatar: string) => {
        setShowModal(false);
        // Mettre à jour l'avatar de l'utilisateur
        setUser({ ...user, avatar });
        // Vous pouvez aussi faire une requête API pour sauvegarder cet avatar sur le serveur
    };

    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' to="/settings" onClick={handleAvatarClick}>
                <img src={avatarSrc} alt={user?.username || 'Default Avatar'} id='nav--avatar'/>
            </NavLink>
            <div id="active-dot"></div>
            <AvatarModal show={showModal} onClose={handleCloseModal} onSelect={handleAvatarSelect} />
        </div>
    );
}
