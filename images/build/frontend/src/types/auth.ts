
import React from 'react';

export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

export interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	successMsg: string;
	errorMsg: string;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, username: string, password: string, confirmPassword: string) => Promise<void>;
	logout: () => void;
	updateProfile: (username: string, email: string, currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<void>;
}
