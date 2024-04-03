import axios from "axios";
import users from './login.json'; //DEV ONLY! IMPLEMENT BACK-END LAZY CUNT


const BASE_URL = "localhost:3000"

/*#######################*/
/*##    INTERCEPTORS   ##*/
/*#######################*/

/*
    An interceptor in Axios is a function that Axios calls for every 
    request or response. Interceptors can be used to transform the 
    request before Axios sends it or to transform the response before 
    Axios returns the response to your code.
*/

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': BASE_URL,
    }
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //in case of error, returns to the login page.
        if (error.response && error.response.status === 401){
            window.location.href = '/login';
        }
        else if (error.response === 500) {
            window.location.href = '/Error/' + error.response.status;
        }
        return Promise.reject(error);
    },
);

/*#######################*/
/*##        AUTH       ##*/
/*#######################*/

/*
    An interceptor in Axios is a function that Axios calls for every 
    request or response. Interceptors can be used to transform the 
    request before Axios sends it or to transform the response before 
    Axios returns the response to your code.
*/

export async function signUp(newNickname: string, password: string) {
    try {
        // Check if a user with the newNickname already exists
        const existingUser = users.users.find(user => user.nickname === newNickname);
        if (existingUser) {
            throw new Error('An user with this nickname already exists');
        }
        // If not, you can simulate a successful sign-up by adding the new user to the JSON file
        // This is a simplified example; in a real scenario, you would update your backend
        const newUser = { nickname: newNickname, password: password };
        users.users.push(newUser);
        return newUser;
    } catch (error) {
        throw new Error('An user with this nickname already exists');
    }
}

export async function logIn(newNickname: string, password: string) {
    try {
        // Find the user with the provided nickname
        const user = users.users.find(user => user.nickname === newNickname);
        if (!user) {
            throw new Error('No such nickname');
        }
        if (user.password !== password) {
            throw new Error('Password does not match');
        }
        // Simulate a successful login by returning the user data
        return user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message === 'No such nickname') {
                    throw new Error('No such nickname');
                } else {
                    throw new Error('Password does not match');
                }
            }
        }
        throw new Error('An error occurred');
    }
}

export async function logOut() {
    try {
        // Simulate a logout operation by resetting the user data
        // This is a simplified example; in a real scenario, you would handle session management differently
        const index = users.users.findIndex(user => user.nickname !== '');
        if (index !== -1) {
            users.users[index].nickname = '';
            users.users[index].password = '';
        }
        return { message: 'Logged out successfully' };
    } catch (error) {
        console.log("Error signing out: ", error);
    }
}



/*#######################*/
/*##        USER       ##*/
/*#######################*/

/*
    An interceptor in Axios is a function that Axios calls for every 
    request or response. Interceptors can be used to transform the 
    request before Axios sends it or to transform the response before 
    Axios returns the response to your code.
*/

export async function checkIfLogged(): Promise<boolean> {

	const response = await axios.get<boolean>(`${BASE_URL}`);
	return response.data;
}