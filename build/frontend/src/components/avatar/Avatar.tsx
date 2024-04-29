import { NavLink } from 'react-router-dom'
import { IsLoggedInContext } from '../../context/context'
import React, { useEffect } from 'react';
import { checkIfLogged, fetchMe } from '../../api/APIHandler';
import { useContext } from "react";
import { useQuery } from '@tanstack/react-query';

import './Avatar.css'

export default function Avatar ( {setLoggedIn}: {setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
    const isLoggedIn = useContext(IsLoggedInContext);

    useEffect( () => {
        const fetchData = async () => {
            const userStatus = await checkIfLogged();
            setLoggedIn(userStatus);
        };
        fetchData();
    }, [setLoggedIn, isLoggedIn]);

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchMe(),
    });

    if (userQuery.isError) {
		return <div>Error</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

    return (
        <div id='navicon--avatar'>
            <NavLink className='link-profile' to="/settings">
                <img src={userQuery.data?.avatar} alt={userQuery.data?.username} id='nav--avatar'/>
            </NavLink>
            <div id="active-dot"></div>
        </div>
    )
}
