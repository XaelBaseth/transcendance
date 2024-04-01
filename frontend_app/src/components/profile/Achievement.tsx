import { IUser } from "../../api/types";
import "../../pages/profile/Profile.css"

let achievementNumber = 0;

export function Achievement(props: {user: string}) {
    achievementNumber = 0;
    return (
        <article id="achievements">
            <h1>ACHIEVEMENTS </h1>
            <div className="all-achievements">
                {/** display the achivements */}
            </div>
        </article>
    )
}