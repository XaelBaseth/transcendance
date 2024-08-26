import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AvatarModal.css'; // Import your custom styles

import avatar1 from '../../assets/acharlot.jpg';
import avatar2 from '../../assets/aramier.jpg';
import avatar3 from '../../assets/rrault.jpg';
import giratina from '../../assets/giratina.png';
import amphinobi from '../../assets/amphinobi.png';
import emolga from '../../assets/emolga.png';
import pingoleon from '../../assets/pingoleon.png';
import mimiqui1 from '../../assets/mimiqui1.png';
import mimiqui2 from '../../assets/mimiqui2.png';
import manaphy from '../../assets/manaphy.png';
import momartik from '../../assets/momartik.png';
import simiabraz from '../../assets/simiabraz.png';
import florizarre from '../../assets/florizarre.png';
import flapple from '../../assets/flapple.gif';


const avatars = [
    avatar1, avatar2, avatar3, giratina, amphinobi, emolga,
    pingoleon, mimiqui1, mimiqui2, manaphy, florizarre, momartik, simiabraz, flapple
];

interface AvatarModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (avatar: string) => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ show, onClose, onSelect }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!show) {
        return null;
    }

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return avatars.length - 3;
            }
            return Math.max(prevIndex - 3, 0);
        });
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex + 3 >= avatars.length) {
                return 0; // Réinitialiser au début
            }
            return prevIndex + 3;
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="avatar-text">
                    <h2>{t('avatar.chooseAvatar')}</h2>
                </div>
                <div className="avatar-carousel">
                    <button onClick={handlePrevClick} className="carousel-button">◀</button>
                    <div className="avatar-options">
                        {avatars.slice(currentIndex, currentIndex + 3).map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="avatar-option"
                                onClick={() => onSelect(avatar)}
                            />
                        ))}
                    </div>
                    <button onClick={handleNextClick} className="carousel-button">▶</button>
                </div>
            </div>
        </div>
    );
};

export default AvatarModal;
