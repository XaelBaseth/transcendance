import { useState, useEffect } from 'react';
import { IUser } from '../../api/types';
import MessageUserBtn from './MessageUserBtn';

import "../../pages/profile/UserProfile.css"

export default function UserInfos( {user} : {user: IUser}) {
    const [enableSocials, setEnableSocials] = useState<boolean>(true);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    const creationDate = new Date(user.createdAt).toLocaleDateString('en-US', options);
    const [currentStatus, setCurrentStatus] = useState<string>('OFFLINE');


    return (
        <div className='user-infos'>
            <div className='titles'>
                <h2>{user.nickname}</h2>
            </div>
            {
                enableSocials === true &&
                <>
                    <button>Friend Request</button>
                    <button>Block User</button>
                   <MessageUserBtn />
                </>
            }
            <h5>Member since {creationDate}</h5>
        </div>
    )
}