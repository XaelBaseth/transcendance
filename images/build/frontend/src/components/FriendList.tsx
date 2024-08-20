import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

export function FriendList() {
    const { t } = useTranslation();
    const [friends, setFriends] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await api.get('/api/user/friends');
            setFriends(response.data);
        } catch (error) {
            console.error("Failed to fetch friends", error);
        }
    };

    const addFriend = async () => {
        try {
            await api.post('/api/user/friend-request', { username: newFriendUsername });
            fetchFriends();
            setNewFriendUsername('');
        } catch (error) {
            console.error("Failed to add friend", error);
        }
    };

    return (
        <div className="friend-list">
            <h2>{t('friends.title')}</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.username} - {friend.is_online ? t('friends.online') : t('friends.offline')}
                    </li>
                ))}
            </ul>
            <div>
                <input 
                    type="text" 
                    value={newFriendUsername} 
                    onChange={(e) => setNewFriendUsername(e.target.value)}
                    placeholder={t('friends.addFriendPlaceholder')}
                />
                <button onClick={addFriend}>{t('friends.addFriend')}</button>
            </div>
        </div>
    );
}