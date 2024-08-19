import React, { useState, useEffect } from 'react';
import { IUser } from '../type';
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from 'react-i18next';

import "../styles/Social.css";

// Liste fictive pour les amis, les utilisateurs bloqués et les demandes en attente
const allFriendsList: IUser[] = [
    { id: '1', username: 'Alice', avatar: 'avatar1.png' },
    { id: '2', username: 'Bob', avatar: 'avatar2.png' }
];

const blockedUsersList: IUser[] = [
    { id: '3', username: 'Charlie', avatar: 'avatar3.png' }
];

const pendingRequestsList: IUser[] = [
    { id: '4', username: 'David', avatar: 'avatar4.png' }
];

export function Social() {
    const { t } = useTranslation();
    const [activeList, setActiveList] = useState<string | null>(null);

    const handleClickComponent = (listType: string) => {
        setActiveList(listType);
    };

    return (
        <div id='social-dashboard'>
            <SearchBar />
            <div className='social-btn'>
                <button onClick={() => handleClickComponent('allFriends')} className={activeList === 'allFriends' ? 'clicked-btn' : 'btn'}>
                    {t('social.all')}
                </button>
                <button onClick={() => handleClickComponent('blocked')} className={activeList === 'blocked' ? 'clicked-btn' : 'btn'}>
                    {t('social.blocked')}
                </button>
                <button onClick={() => handleClickComponent('pendingRequest')} className={activeList === 'pendingRequest' ? 'clicked-btn' : 'btn'}>
                    {t('social.pending')}
                </button>
            </div>
            <div className='list-container'>
                {activeList && <FriendsList listType={activeList} />}
            </div>
        </div>
    );
}

/**Search bar*/
function SearchBar() {
    const { t } = useTranslation();

    const [userInput, setUserInput] = useState("");
    const [searchedUser, setSearchResults] = useState<IUser>();

    useEffect(() => {
        if (userInput.length > 2) {
            // Simuler une requête API
            // postSearchQuery(userInput)
            // .then((response) => {
            //    const copy = {...response};
            //    setSearchResults(copy.data.hits[0]._formatted);
            // })
            // .catch(() => {
            //    setSearchResults(undefined);
            // });
            console.log('check this out!');
        }
        if (userInput === "") {
            setSearchResults(undefined);
        }
    }, [userInput]);

    return (
        <div>
            <p className='text_searchBar'>{t('social.search')}</p>
            <div className='search_bar'>
                <input
                    type='text'
                    id='search_input'
                    name='search'
                    onChange={(event) => setUserInput(event.target.value)}
                    placeholder={t('social.type')}
                />
                <>
                    {searchedUser && (
                        <div key={searchedUser.id} className='searched_user'>
                            <div className="search_user_infos">
                                <img id="search_user_avatar" src={searchedUser.avatar} alt={searchedUser.username} />
                                <h5 id="title" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(searchedUser.username) }}></h5>
                                <button>{t('social.add')}</button>
                            </div>
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}

function FriendsList({ listType }: { listType: string }) {
    let usersToDisplay: IUser[] = [];

    switch (listType) {
        case 'allFriends':
            usersToDisplay = allFriendsList;
            break;
        case 'blocked':
            usersToDisplay = blockedUsersList;
            break;
        case 'pendingRequest':
            usersToDisplay = pendingRequestsList;
            break;
        default:
            usersToDisplay = [];
    }

    return (
        <div className={`friends-list ${listType}`}>
            <h5>{`Displaying ${listType}`}</h5>
            <ul>
                {usersToDisplay.map((user) => (
                    <li key={user.id}>
                        <img src={user.avatar} alt={user.username} className='user-avatar' />
                        <span>{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
