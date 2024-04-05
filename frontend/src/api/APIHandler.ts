import axios from "axios";
//import { IUser } from "./types";


const BASE_URL = "localhost:3000"

axios.defaults.withCredentials = true;

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
        else if (error.response && error.response.status === 500) {
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
		const response = await api.post(`${BASE_URL}/auth/signup`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error('A user with this nickname already exists');
	}
}

export async function logIn(newNickname: string, password: string) {
    try {
        // Make a POST request to your backend's login endpoint
        const response = await api.post(`${BASE_URL}/auth/login`, 
		{ 
			nickname: newNickname, 
			password: password 
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': BASE_URL,
			},
		},
		);
        
        // Assuming the backend returns user data on successful login
        return response.data;
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
		const response = await axios.delete(`${BASE_URL}/auth/logout`);
		return response.data;

	} catch (error) {
		console.log("Error signup: ", error);
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