import "../../pages/profile/Profile.css"

export default function MainStat({title, stat} : {title: string, stat: number}) {
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