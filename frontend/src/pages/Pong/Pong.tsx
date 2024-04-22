import React from 'react';
import './Pong.css'; // Importe le fichier CSS pour le style du jeu

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
