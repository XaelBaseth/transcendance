import { IAchievement, IUser } from "../../api/types";
import "../../pages/profile/UserProfile.css"

let achievementNumber = 0;

export function Achievement(props: {user: IUser}) {
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
            <h1>ACHIEVEMENTS </h1>
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