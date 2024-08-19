export interface User {
	id: string;
	name: string;
	email: string;
  }

export interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
  }