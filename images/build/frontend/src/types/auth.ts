export interface User {
	id: string;
	name: string;
	email: string;
	bio: string;
	//update along
  }

export interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
  }