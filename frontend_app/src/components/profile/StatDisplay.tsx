import "../../pages/profile/Profile.css"

export default function StatDisplay(props : {title: string, stat: number}) {
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
        <div className={`stat__container ${stat_theme}`} >
            <span>{props.stat} {props.title}</span>
        </div>
    );
}