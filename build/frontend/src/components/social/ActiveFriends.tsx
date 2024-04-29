import { IUser } from "../../api/types"
import "./Social_component.css"

export function ActiveFriends(props: {profilesToDisplay: IUser[]}) {
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

export default ActiveFriends