export interface IUser {
	id: number;
	createdAt: Date;
	nickname: string;
	avatar: string;
	password: string;
	email: string;

	aces: number;
	score: number;
	rank: number;
	isActive: string;
}