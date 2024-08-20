import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "../styles/Profile.css";
import api from '../api'; // Make sure to import your API utility

export function Profile() {
    const { t } = useTranslation();
    const [user, setUser] = useState({
        username: "",
        email: "",
        bio: "",
        avatar: null,
        wins: 0,
        losses: 0,
        friends: [],
        matches: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/api/user/');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/user/update-profile', user);
            setIsEditing(false);
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const addFriend = async () => {
        try {
            await api.post('/api/user/friend-request', { username: newFriendUsername });
            setNewFriendUsername('');
            fetchUserData(); // Refresh user data to show new friend
        } catch (error) {
            console.error("Failed to add friend", error);
        }
    };

    return (
        <div id="whole-profile-container">
            <div id="whole-profile">
                <section id="main-dashboard">
                    <div id="top-dashboard">
                        <div id="bio-container">
                            <article id="bio">
                                <div id="hexagon-avatar">
                                    {user.avatar && <img src={user.avatar} alt="User Avatar" />}
                                </div>
                            </article>
                            <article className="user__bio">
                                <h1>{t('profile.bio')}</h1>
                                {isEditing ? (
                                    <textarea name="bio" value={user.bio} onChange={handleChange} />
                                ) : (
                                    <span>{user.bio}</span>
                                )}
                            </article>
                            <hr />
                            <article id="main-stats">
                                <MainStat title={t('profile.total')} stat={user.wins + user.losses} />
                                <MainStat title={t('profile.victories')} stat={user.wins} />
                                <MainStat title={t('profile.friends')} stat={user.friends.length} />
                            </article>
                            <hr />
                        </div>
                        <div id="stats">
                            <h1>{t('profile.overview')}</h1>
                            <div className="winratio__stats">
                                <WinrateCircularBar winRate={user.wins / (user.wins + user.losses) * 100 || 0} />
                                <div className="stat__display">
                                    <StatDisplay title={t('profile.wins')} stat={user.wins} />
                                </div>
                                <div className="stat__display">
                                    <StatDisplay title={t('profile.loss')} stat={user.losses} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="username" value={user.username} onChange={handleChange} />
                            <input type="email" name="email" value={user.email} onChange={handleChange} />
                            <button type="submit">{t('profile.save')}</button>
                            <button type="button" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</button>
                        </form>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>{t('profile.edit')}</button>
                    )}
                </section>
                <section id="friends-list">
                    <h2>{t('profile.friends')}</h2>
                    <ul>
                        {user.friends.map(friend => (
                            <li key={friend.id}>{friend.username} - {friend.is_online ? t('profile.online') : t('profile.offline')}</li>
                        ))}
                    </ul>
                    <div>
                        <input 
                            type="text" 
                            value={newFriendUsername} 
                            onChange={(e) => setNewFriendUsername(e.target.value)}
                            placeholder={t('profile.addFriendPlaceholder')}
                        />
                        <button onClick={addFriend}>{t('profile.addFriend')}</button>
                    </div>
                </section>
                <section id="match-history">
                    <h2>{t('profile.matchHistory')}</h2>
                    <ul>
                        {user.matches.map(match => (
                            <li key={match.id}>
                                {match.player1.username} vs {match.player2.username} - 
                                {t('profile.winner')}: {match.winner.username} - 
                                {t('profile.score')}: {match.score}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

// Keep the existing MainStat, StatDisplay, and WinrateCircularBar components as they are