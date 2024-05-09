export interface User {
	id: string;
	name: string;
	// Add other user properties as needed
  }

export interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
  }