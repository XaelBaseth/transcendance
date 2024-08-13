import React from 'react';
import './AvatarModal.css'; // Vous pouvez créer ce fichier pour styliser le modal

interface AvatarModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (avatar: string) => void;
}

const avatars = [
    require('../../assets/acharlot.jpg'), // Remplacez avec vos chemins d'avatar
    require('../../assets/aramier.jpg'),
    require('../../assets/rrault.jpg'),
];

export default function AvatarModal({ show, onClose, onSelect }: AvatarModalProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Choose your avatar</h2>
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
