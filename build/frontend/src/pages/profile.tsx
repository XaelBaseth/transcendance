import React from "react";
import "../styles/Profile.css"
import { useParams } from 'react-router-dom';
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { IUser } from "../type";
import { IAchievement } from "../type";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"

export function Profile() {
    const { username } = useParams<{ username?: string }>();

    const userQuery: UseQueryResult<IUser> = useQuery({
        queryKey: ['user', username],
        queryFn: () => {
            if (username) {
                return {/*fetchUserByusername(username)*/}
            }
        }
    });

    if (userQuery.error instanceof Error) {
        return <div>Error: {userQuery.error.message}</div>
    }
    if (userQuery.isLoading || !userQuery.isSuccess) {
        return <div>Loading</div>
    }

    const user: IUser = userQuery.data;
    const userTotalMatches: number = (user.matchAsP1 && user.matchAsP2) ? user.matchAsP1.length + user.matchAsP2.length : 0;
    const userWinrate: number = userTotalMatches !== 0 ? user.matchAsP1.length * 100 / userTotalMatches : 0;
    const userFriendsCount: number = (user.friendsList && user.friendsList?.length >= 1) ? user.friendsList.length : 0;

    return (
        <div id="whole-profile-container">
            <div id="whole-profile">
                <section id="main-dashboard">
                    <div id="top-dashboard">
                        <div id="bio-container">
                            <article id="bio">
                                <div style={{ backgroundImage: `url(${user.avatar})` }} id="hexagon-avatar"></div>
                                {user && user.username && <UserInfos user={user} />}
                            </article>
                            <article className="user__bio">
                                <h1>BIO</h1>
                                <span>{/**user.bio */}</span>
                            </article>
                            <hr />
                            <article id="main-stats">
                                <MainStat title="Total Matches" stat={userTotalMatches} />
                                <MainStat title="Victories" stat={user.matchAsP1 ? user.matchAsP1.length : 0} />
                                <MainStat title="Friends" stat={userFriendsCount} />
                            </article>
                            <hr />
                        </div>
                        <div id="stats">
                            <h1>COMPETITIVE OVERVIEW</h1>
                            <div className="winratio__stats">
                                <WinrateCircularBar winRate={userWinrate} />
                                <div className="stat__display">
                                    <StatDisplay title={"Wins"} stat={user.matchAsP1 ? user.matchAsP1.length : 0} />
                                    <StatDisplay title={"Lose"} stat={user.matchAsP1 ? user.matchAsP1.length : 0} />
                                </div>
                            </div>
                            <div className="stat__display">
                                <StatDisplay title={"(Rank)"} stat={user.rank} />
                                <StatDisplay title={"(Aces)"} stat={user.aces} />
                            </div>
                            <button className="challenge-btn">Challenge</button>
                        </div>
                    </div>
                    <Achievement user={user} />
                </section>
                {/**Match History goes here */}
            </div>
        </div>
    );
}

                                //////////////////////
                                //                  //
                                //   COMPONENTS     //
                                //                  //
                                //////////////////////

function WinrateCircularBar(props : {winRate: number}) {
    let circularProgress = document.querySelector<HTMLElement>(".circular-progress");
    let progressValue = document.querySelector<HTMLElement>(".progress-value");

    let progressStartValue = 0;
    let speed = 50;

    if (props.winRate !== 0){
        let progress = setInterval(() => {
            if (progressStartValue !== 100){
                progressStartValue++;
            }

            if (progressValue)
                progressValue.innerHTML = `${progressStartValue}%`;
            if (circularProgress)
                circularProgress.style.background = `conic-gradient(rgba(98, 20, 104, 0.7) ${progressStartValue * 3.6}deg, #ededed 0deg)`;

            if (progressStartValue === props.winRate){
                clearInterval(progress);
            }
        }, speed);
    }

    return (
        <div className='circular__progress'>
            <div className='winrate__content'>
                <h5 className='winrate__title'>Win Rate</h5>
                <span className='progress-value'>0%</span>
            </div>
        </div>
    );
}

function MainStat({title, stat} : {title: string, stat: number}) {
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

function MessageUserBtn() {
    return (
     <>
         <button className='msgUserBtn'> Contact the User</button>
     </>
    ) 
 }

 function StatDisplay(props : {title: string, stat: number}) {
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

function UserInfos( {user} : {user: IUser}) {
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

let achievementNumber = 0;

function Achievement(props: {user: IUser}) {
    achievementNumber = 0;
    const userAchievements: IAchievement[] = props.user.achievements;
    const displayAchivements = userAchievements?.map(achievement => {
        return 	<div key={achievement.id} 
					className="one-achievement"
					id={isAchievementCompleted(props.user, achievement.title) === true ? "completed_achievement" : "one-achievement"}>
					<h3>{achievement.title}</h3>
					<h4>{achievement.description}</h4>
				</div>
	})
    return (
        <article id="achievements">
            <h1>ACHIEVEMENTS ({achievementNumber}/{userAchievements?.length})</h1>
            <div className="all-achievements">
                {displayAchivements}
            </div>
        </article>
    );
}

function isAchievementCompleted (user: IUser, title: string): boolean{
    switch(title){
        case "Easy peasy lemon squeezy":
        {
            if (!user.matchAsP1)
                return false;
            const userWinCount = user.matchAsP1.length;
            if (userWinCount >= 3)
            {
                achievementNumber++;
                return true;
            }
            return false; 
        }
        case "Writer soul":
        {
            if (!user.bio)
                return false;

            achievementNumber++;
            return true; 
        }
        case "Roland Garros":
        {
            if (!user.aces)
                return false
            const userHasAce = user.aces;
            if (userHasAce >= 3)
            {
                achievementNumber++;
                return true
            }
                return false 
        }
        default:
            return false;
    }
}