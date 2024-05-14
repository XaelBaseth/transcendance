import React, { useState, useEffect, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

interface ProtectedRouteProps {
	children: ReactNode;
  }
  
function ProtectedRoute({ children }: ProtectedRouteProps) {
  console.log("This is ProtectedRoute working!");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
	console.log("About to call auth function");
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
	console.log("This is the auth function starting point.");
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
	  console.log("No token was found!");
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  return isAuthorized? children : <Navigate to="/login" state={{ from: location }} />;
}

export default ProtectedRoute;import React, { useEffect, ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const location = useLocation();
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		auth().catch(() => setIsAuthorized(false))
	},);


	const refreshToken = async () => {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN);
	try {
		const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
		if (res.status >= 200 && res.status < 300) {
			localStorage.setItem(ACCESS_TOKEN, res.data.access);
			setIsAuthorized(true);
		} else {
			setIsAuthorized(false);
		}
	} catch (error) {
		console.error("Error refreshing token:", error);
		setIsAuthorized(false);
	}
	};

	const auth = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setIsAuthorized(false);
			return;
		}
		const decoded = jwtDecode(token);
		const tokenExpiration = decoded.exp;
		const now = Date.now() / 1000;

		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			setIsAuthorized(true);
		}
	}

	if (isAuthorized === null) {
		return <div>Loading...</div>;
	}

	return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;