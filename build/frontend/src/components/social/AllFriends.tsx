import { IUser } from "../../api/types"

export function AllFriends(props: {profilesToDisplay: IUser[], userIsSuccess:boolean}) {
    return (
        <div className="all-current">
            <div className="profile_infos_activeFriends">
                <h5>Here a Nickname</h5>
            </div>
        </div>
    )
}

export default AllFriends