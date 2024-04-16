import { useState, useEffect } from 'react';
import { IUser } from '../../api/types';
import MessageUserBtn from './MessageUserBtn';
import { toast } from "react-hot-toast";
import { fetchMe } from "../../api/APIHandler";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";


import "../../pages/profile/UserProfile.css"

export default function UserInfos( {user} : {user: IUser}) {
    const [enableSocials, setEnableSocials] = useState<boolean>(true);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    const creationDate = new Date(user.createdAt).toLocaleDateString('en-US', options);
    const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });
    const queryClient = useQueryClient();
    const [currentStatus, setCurrentStatus] = useState<string>('OFFLINE');

	useEffect(() => {
		if (userQuery.data && userQuery.data.username && user && user.username) {
			(userQuery.data.username === user.username)
			? setEnableSocials(false)
			: setEnableSocials(true);
		}
	}, [userQuery.isSuccess, userQuery.data, user, user.username, setEnableSocials]);	
	
	useEffect(() => {
		if (user && user.isActive === 'ONLINE') {
			setCurrentStatus('ONLINE');
		} else if (user && user.isActive === 'INGAME') {
			setCurrentStatus('INGAME');
		}
	}, [user]);


	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}
	
	if (userQuery.error){
		return <div>Error</div>
    }

/*#ADD FRIENDS AND BLOCK USER*/

    return (
        <div className='user-infos'>
            <div className='titles'>
                <h2>{user.username}</h2>
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