import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "../styles/Profile.css";
import { toast } from 'react-hot-toast'; // Assurez-vous d'installer et configurer react-hot-toast pour les notifications
import api from '../api'; // Assurez-vous que ce chemin est correct

export function Profile() {
    const { t } = useTranslation();

    // État pour les informations utilisateur
    const [user, setUser] = useState({
        bio: "User bio goes here",
        total: 50,
        victories: 50,
        friends: 90000,
        winRate: 0,
        wins: 50,
        losses: 50,
        rank: 1,
        aces: 0,
        email: "",
        avatar: null
    });

    // État pour les informations modifiables
    const [editableUser, setEditableUser] = useState(user);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/api/user/');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user data", error);
            toast.error("Failed to load user data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            avatar: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(user).forEach(key => {
            formData.append(key, user[key]);
        });

        try {
            await api.put('/api/user/update-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error("Failed to update profile");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Sauvegarder les modifications (API call, etc.)
        setUser(editableUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableUser(user);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await api.delete('/api/user/delete/', {
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Assurez-vous que l'authentification est correctement configurée
                    }
                });
                toast.success("Account deleted successfully");
                // Vous devrez rediriger l'utilisateur après la suppression
                window.location.href = '/'; // Redirige vers la page d'accueil ou une autre page appropriée
            } catch (error) {
                console.error("Failed to delete account", error);
                toast.error("Failed to delete account");
            }
        }
    };

    return (
        <div className="profile">
            <h1>{t('profile.title')}</h1>
            <img src={user.avatar || "/default-avatar.png"} alt="User Avatar" />
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleAvatarChange} accept="image/*" />
                    <input type="text" name="username" value={user.username} onChange={handleChange} />
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                    <textarea name="bio" value={user.bio} onChange={handleChange}></textarea>
                    <button type="submit">{t('profile.save')}</button>
                    <button type="button" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</button>
                </form>
            ) : (
                <>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                    <p>{user.bio}</p>
                    <p>{t('profile.wins')}: {user.wins}</p>
                    <p>{t('profile.losses')}: {user.losses}</p>
                    <p>{t('profile.winRate')}: {user.winRate}%</p>
                    <button onClick={() => setIsEditing(true)}>{t('profile.edit')}</button>
                </>
            )}
        </div>
    );
}
// COMPONENTS //

function WinrateCircularBar(props: { winRate: number }) {
    const { t } = useTranslation();

    let circularProgress = document.querySelector<HTMLElement>(".circular-progress");
    let progressValue = document.querySelector<HTMLElement>(".progress-value");

    let progressStartValue = 0;
    let speed = 50;

    if (props.winRate !== 0) {
        let progress = setInterval(() => {
            if (progressStartValue !== 100) {
                progressStartValue++;
            }

            if (progressValue)
                progressValue.innerHTML = `${progressStartValue}%`;
            if (circularProgress)
                circularProgress.style.background = `conic-gradient(rgba(98, 20, 104, 0.7) ${progressStartValue * 3.6}deg, #ededed 0deg)`;

            if (progressStartValue === props.winRate) {
                clearInterval(progress);
            }
        }, speed);
    }

    return (
        <div className='circular__progress'>
            <div className='winrate__content'>
                <h5 className='winrate__title'>{t('profile.winrate')}</h5>
                <span className='progress-value'>0%</span>
            </div>
        </div>
    );
}

function MainStat({ title, stat }: { title: string, stat: number }) {
    return (
        <div className="one-stat">
            <div>
                {/** Icons ? */}
            </div>
            <div className="one-stat__txt">
                <h2 className="one_stat_stat">{stat}</h2>
                <h5 className="one_stat_title">{title}</h5>
            </div>
        </div>
    );
}

function StatDisplay(props: { title: string, stat: number }) {
    let stat_theme: string | undefined = undefined;

    switch (props.title) {
        case "Wins":
            stat_theme = "stat_win";
            break;
        case "Lose":
            stat_theme = "stat_lose"
            break;
        default:
            stat_theme = "stat_default"
            break;
    }
    return (
        <div className={`stat_container ${stat_theme}`} >
            <span>{props.stat} {props.title}</span>
        </div>
    );
}
