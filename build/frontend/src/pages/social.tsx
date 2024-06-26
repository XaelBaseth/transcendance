import React, { useState, useEffect } from 'react';
import { IUser } from '../type';
import DOMPurify from "isomorphic-dompurify"
import { useTranslation } from 'react-i18next';

import "../styles/Social.css"

export function Social() {
	const { t } = useTranslation();
    const [activeList, setActiveList] = useState<string | null>(null);

    const handleClickComponent = (listType: string) => {
        setActiveList(listType);
    }

    const activeFriends: IUser[] =  [];

    return (
        <div id='social-dashboard'>
            <SearchBar />
            <div className='social-btn'>
                <button onClick={() => handleClickComponent('allFriends')} className={activeList === 'allFriends' ? 'clicked-btn' : 'btn'}>
                    {t('social.all')}
                </button>
                <button onClick={() => handleClickComponent('activefriends')} className={activeList === 'activeFriends' ? 'clicked-btn' : 'btn'}>
                    {t('social.active')}
                </button>
                <button onClick={() => handleClickComponent('blocked')} className={activeList === 'blocked' ? 'clicked-btn' : 'btn'}>
				{t('social.blocked')}
                </button>
                <button onClick={() => handleClickComponent('pendingRequest')} className={activeList === 'pendingRequest' ? 'clicked-btn' : 'btn'}>
				{t('social.pending')}
                </button>
            </div>
            {/** set 'activeList' to show it */}
            {/**{activeList === 'allFriends' && loggedUser.friendsList ? (<AllFriends profilesToDisplay={loggedUser.friendsList} userIsSuccess={isSuccess} />) : null}*/}
            {activeList === 'activeFriends' && activeFriends ? (<ActiveFriends profilesToDisplay={activeFriends} />) : null}
        </div>
    );
}

/**Search bar*/
function SearchBar() {
	const { t } = useTranslation();

    const [userInput, setUserInput] = useState("");
    const [searchedUser, setSearchResults] = useState<IUser>();

    useEffect( () => {
        	if (userInput.length > 2){
                console.log('check this out!')
            	//postSearchQuery(userInput)
        		.then( (response) => {
        			const copy = {...response};
        			setSearchResults(copy.data.hits[0]._formatted);
     			})
     			.catch(() => {
       				setSearchResults(undefined);
    	    		});
        		}
         		if (userInput === "") {
         			setSearchResults(undefined);
         		}
         	}, [userInput]);

    return (
        <div>
            <p className='text_searchBar'>{t('social.search')}</p>
            <div className='search_bar'>
                <input type='text' id='search_input' name='search'
                    onChange={(event) => setUserInput(event.target.value)}
                    placeholder={t('social.type')}
                />
            <>
                { searchedUser && (<div key={searchedUser.id} className='searched_user'>
					<div className="search_user_infos">
							<img id="search_user_avatar" src={searchedUser.avatar} alt={searchedUser.username} />
							<h5 id="title" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchedUser.username)}}></h5>
							< button>{t('social.add')}</button>					
                    </div>
				 </div>)
                }
            </>
            </div>
        </div>
    )
}


function ActiveFriends(props: {profilesToDisplay: IUser[]}) {
    /**
     * Handle a real when the backend comm is ready!
     */

return (
<div className="all-current">
    <div className="profile_infos_activeFriends">
        <h5>Here a Nickname</h5>
    </div>
</div>
)
}

function AllFriends(props: {profilesToDisplay: IUser[], userIsSuccess:boolean}) {
    return (
        <div className="all-current">
            <div className="profile_infos_activeFriends">
                <h5>Here a Nickname</h5>
            </div>
        </div>
    )
}