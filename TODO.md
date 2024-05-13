Setup on the Backend:
	Generate a unique secret key for each user during the setup of 2FA.
	Store this secret key securely in your database associated with the user's account.

Frontend Interaction:
	When a user attempts to log in and enters their username/password along with the TOTP code, the frontend collects this information.

Sending Data to the Backend:
	The frontend sends a request to the backend, including the username/password and the entered TOTP code.

Backend Verification:
	Upon receiving the request, the backend:
		Retrieves the user's secret key associated with the provided username.
		Uses the secret key to generate a TOTP code on the backend.
		Compares the generated TOTP code with the one provided by the user.

Response to the Frontend:
	If the codes match, the backend responds to the frontend with a success message indicating that the authentication is successful.
	If the codes do not match, the backend responds with an error message indicating that the authentication failed.

Feedback to the User:
	The frontend receives the response from the backend and displays appropriate feedback to the user based on whether the authentication was successful or not.

Optional: You might also consider implementing rate limiting or other security measures on both the frontend and backend to prevent brute force attacks or unauthorized access attempts.

NEW PAGES ON FRONT:

Settings: activate 2FA, send a code to the front via the mail adress to validate new access to login.
login: 	enter code to validate login
		Button to resend email