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
        setAvatarSrc(avatar);
        localStorage.setItem('userAvatar', avatar);
        setUser({ ...user, avatar });
    };

    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' to="/settings" onClick={handleAvatarClick}>
                <img src={avatarSrc || defaultAvatar} alt={user?.username || 'Default Avatar'} id='nav--avatar'/>
            </NavLink>
            <div id="active-dot"></div>
            <AvatarModal show={showModal} onClose={handleCloseModal} onSelect={handleAvatarSelect} />
        </div>
    );
}
