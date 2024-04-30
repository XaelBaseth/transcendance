import "./UserProfile.css"
import { useParams } from 'react-router-dom';
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IUser } from "../../api/types";
import { fetchUserByusername } from '../../api/APIHandler'
import WinrateCircularBar from "../../components/profile/WinrateCircularBar"
import StatDisplay from "../../components/profile/StatDisplay"
import MainStat from "../../components/profile/MainStat"
import { Achievement } from "../../components/profile/Achievement"
import UserInfos from "../../components/profile/UserInfos";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useContext } from "react";
import { SocketContext } from "../../context/context";


export function UserProfile() {

    const { username } = useParams<{username?: string }>();
    const socket : Socket | null = useContext(SocketContext)

    const userQuery : UseQueryResult<IUser>= useQuery({
        queryKey: ['user', username],
        queryFn: () => {
            if (username) {
                return fetchUserByusername(username)}
            }
    });

    if (userQuery.error instanceof Error){
        return <div>Error: {userQuery.error.message}</div>
      }
      if (userQuery.isLoading || !userQuery.isSuccess){
        return <div>Loading</div>
      }
  
      const user: IUser = userQuery.data;
      const userTotalMatches: number = (user.matchAsP1 && user.matchAsP2) ? user.matchAsP1.length + user.matchAsP2.length : 0;
      const userWinrate: number = userTotalMatches !== 0 ? user.matchAsP1.length * 100 / userTotalMatches : 0;
      const userFriendsCount: number = (user.friendsList && user.friendsList?.length >= 1) ? user.friendsList.length : 0;

      const handleInvitation = () => {
        if (socket) {
            socket?.emit('invite match', user.username);
            toast.success('Invitation sent', {id: 'invite'});
        }
        socket?.on('match invitation declined', (username: string) => {
            toast.error('${username} declined your invitation.', {id: 'invite'});
        })
      }
    return (
        <div id="whole-profile-container">
            <div id="whole-profile">
                <section id="main-dashboard">
                    <div id="top-dashboard">
                        <div id="bio-container">
                            <article id="bio">
                                <div style={{ backgroundImage: `url(${user.avatar})` }} id="hexagon-avatar"></div>
                                {
                                    user && user.username &&
                                    <UserInfos user={user} />
                                }   
                            </article>
                            <article className="user__bio">
                                <h1>BIO</h1>
                                <span>{/**user.bio */}</span>
                            </article>
                            <hr />
                            <article id="main-stats">
                                <MainStat title="Total Matches" stat={userTotalMatches} />
                                <MainStat title="Victories" stat={user.matchAsP1 ? user.matchAsP1.length : 0}/>
                                <MainStat title="Friends" stat={userFriendsCount}/>
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
                            <button onClick={handleInvitation} className="challenge-btn">Challenge</button>
                        </div>
                    </div>
                    <Achievement user={user} />
                </section>
                {/**Match History goes here */}
            </div>
        </div>
    );
}