import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context';
import './Avatar.css';
import defaultAvatar from '../../assets/profilIcon.png';
import AvatarModal from './AvatarModal';

export default function Avatar() {
    const { user, setUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

    useEffect(() => {
        // Charger l'avatar depuis le localStorage si disponible
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            setAvatarSrc(savedAvatar);
        } else {
            setAvatarSrc(user?.avatar || defaultAvatar);
        }
    }, [user]);

    const handleAvatarClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAvatarSelect = (avatar: string) => {
        setShowModal(false);
        // Mettre à jour l'avatar de l'utilisateur dans l'état et localStorage
        setAvatarSrc(avatar);
        localStorage.setItem('userAvatar', avatar);
        setUser({ ...user, avatar });
        // Vous pouvez aussi faire une requête API pour sauvegarder cet avatar sur le serveur
    };

    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' onClick={handleAvatarClick}>
                <img src={avatarSrc || defaultAvatar} alt={user?.username || 'Default Avatar'} id='nav--avatar'/>
            </NavLink>
            <AvatarModal show={showModal} onClose={handleCloseModal} onSelect={handleAvatarSelect} />
        </div>
    );
}
