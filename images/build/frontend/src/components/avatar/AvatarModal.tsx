import React from 'react';
import './AvatarModal.css'; // Import your custom styles

import avatar1 from '../../assets/acharlot.jpg';
import avatar2 from '../../assets/aramier.jpg';
import avatar3 from '../../assets/rrault.jpg';

interface AvatarModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (avatar: string) => void;
}

// Array of imported avatars
const avatars = [avatar1, avatar2, avatar3];

export default function AvatarModal({ show, onClose, onSelect }: AvatarModalProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="avatar-text">
                    <h2>Choose your avatar</h2>
                </div>
                <div className="avatar-options">
                    {avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="avatar-option"
                            onClick={() => onSelect(avatar)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
