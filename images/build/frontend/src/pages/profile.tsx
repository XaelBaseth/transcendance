import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "../styles/Profile.css"

export function Profile() {
	const { t } = useTranslation();

	// État pour les informations utilisateur
	const [user, setUser] = useState({
		bio: "User bio goes here",
		total: 50,
		victories: 50,
		friends: 90000,
		winRate: 0,
		wins: 50,
		losses: 50,
		rank: 1,
		aces: 0
	});

	// État pour les informations modifiables
	const [editableUser, setEditableUser] = useState(user);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		setEditableUser(user);
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setEditableUser(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		// Sauvegarder les modifications (API call, etc.)
		setUser(editableUser);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditableUser(user);
		setIsEditing(false);
	};

	return (
		<div id="whole-profile-container">
			<div id="whole-profile">
				<section id="main-dashboard">
					<div id="top-dashboard">
						<div id="bio-container">
							<article id="bio">
								<div id="hexagon-avatar"></div>
							</article>
							<article className="user__bio">
								<h1>{t('profile.bio')}</h1>
								{isEditing ? (
									<textarea
										name="bio"
										value={editableUser.bio}
										onChange={handleChange}
									/>
								) : (
									<span>{user.bio}</span>
								)}
							</article>
							<hr />
							<article id="main-stats">
								<MainStat title={t('profile.total')} stat={user.total} />
								<MainStat title={t('profile.victories')} stat={user.victories} />
								<MainStat title={t('profile.friends')} stat={user.friends} />
							</article>
							<hr />
						</div>
						<div id="stats">
							<h1>{t('profile.overview')}</h1>
							<div className="winratio__stats">
								<WinrateCircularBar winRate={user.winRate} />
								<div className="stat__display">
									<StatDisplay title={t('profile.wins')} stat={user.wins} />
								</div>
								<div className="stat__display">
									<StatDisplay title={t('profile.loss')} stat={user.losses} />
								</div>
							</div>
							<div className="stat__display">
								<StatDisplay title={t('profile.rank')} stat={user.rank} />
							</div>
							<div className="stat__display">
								<StatDisplay title={t('profile.aces')} stat={user.aces} />
							</div>
							<button className="challenge-btn">{t('profile.challenge')}</button>
						</div>
					</div>
					<div id="edit-buttons">
						{isEditing ? (
							<>
								<button onClick={handleSave}>{t('profile.save')}</button>
								<button onClick={handleCancel}>{t('profile.cancel')}</button>
							</>
						) : (
							<button onClick={handleEdit}>{t('profile.edit')}</button>
						)}
					</div>
				</section>
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
	const { t } = useTranslation();

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
				<h5 className='winrate__title'>{t('profile.winrate')}</h5>
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

/*
function UserInfos( {} : {}) {
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

	#ADD FRIENDS AND BLOCK USER

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
*/