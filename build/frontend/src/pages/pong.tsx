import React from 'react';
import '../styles/Pong.css';

const Pong = () => {
    return (
        <div>
            {/* Fond d'arrière-plan */}
            <div className="background" />

            {/* Terrain de football */}
            <div className="football-field">
                {/* Lignes de marquage (pseudos-éléments ::before et ::after) */}
            </div>

            {/* Contenu du jeu (texte, etc.) */}
        </div>
    );
}

export default Pong;