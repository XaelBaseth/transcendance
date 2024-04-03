import { useState } from 'react';

import "./Social.css"

export function Social() {
    const [activeList, setActiveList] = useState<string | null>(null);

    const handleClickComponent = (listType: string) => {
        setActiveList(listType);
    }

    return (
        <div id='social-dashboard'>
            <div className='social-btn'>
                <button onClick={() => handleClickComponent('allFriends')} className={activeList === 'allFriends' ? 'clicked-btn' : 'btn'}>
                    All friends
                </button>
                <button onClick={() => handleClickComponent('activeriends')} className={activeList === 'activeFriends' ? 'clicked-btn' : 'btn'}>
                    Active friends
                </button>
                <button onClick={() => handleClickComponent('blocked')} className={activeList === 'blocked' ? 'clicked-btn' : 'btn'}>
                    Blocked users
                </button>
                <button onClick={() => handleClickComponent('pendingRequest')} className={activeList === 'pendingRequest' ? 'clicked-btn' : 'btn'}>
                    Pending request
                </button>
            </div>
            {/** set 'activeList' to show it */}
        </div>
    );
}

