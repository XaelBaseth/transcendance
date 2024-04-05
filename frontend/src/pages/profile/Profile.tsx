import "./UserProfile.css"
import WinrateCircularBar from "../../components/profile/WinrateCircularBar"
import StatDisplay from "../../components/profile/StatDisplay"
import MainStat from "../../components/profile/MainStat"
import { Achievement } from "../../components/profile/Achievement"

export function UserProfile() {
    return (
        <div id="whole-profile-container">
            <div id="whole-profile">
                <section id="main-dashboard">
                    <div id="top-dashboard">
                        <div id="bio-container">
                            <article id="bio">
                                <div>
                                    <h5>Small bio and avatar</h5>
                                </div>
                            </article>
                            <article className="user__bio">
                                <h1>BIO</h1>
                                <span>{/**user.bio */}</span>
                            </article>
                            <hr />
                            <article id="main-stats">
                                <MainStat title="Total Matches" stat={15} />
                                <MainStat title="Victories" stat={10}/>
                                <MainStat title="Friends" stat={3}/>
                            </article>
                            <hr />
                        </div>
                        <div id="stats">
                            <h1>COMPETITIVE OVERVIEW</h1>
                            <div className="winratio__stats">
                                <WinrateCircularBar winRate={50} />
                                <div className="stat__display">
                                    <StatDisplay title={"Wins"} stat={10} />
                                </div>
                            </div>
                            <div className="stat__display">
                                <StatDisplay title={"(Rank)"} stat={3} />
                                <StatDisplay title={"(Aces)"} stat={0} />
                            </div>
                            <button className="challenge-btn">Challenge</button>
                        </div>
                    </div>
                    <Achievement user={"me"} />
                </section>
                {/**Match History goes here */}
            </div>
        </div>
    );
}