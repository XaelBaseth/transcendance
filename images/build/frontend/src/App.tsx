import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import BGVideo from './assets/BG.mp4'
import CookieConsent from "react-cookie-consent"
import Home from "./pages/home"
import Error from "./pages/error"
import GamePage from "./pages/gamepage"
import About from "./pages/about"
import Login from "./pages/login"
import Settings from "./pages/setting"
import SignUp from "./pages/signUp"
import Navbar from "./components/Navbar/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LocalPongPage from "./pages/LocalPongPage"
import PongHomePage from "./pages/PongHome"
import { AuthProvider } from "./context"
import { useTranslation } from 'react-i18next';

import './App.css'

function RegisterAndLogout() {
	localStorage.clear()
	return <SignUp />
}

function App() {
	const { t } = useTranslation();

	return (
		<div id='app'>
			<section id="main_content">
				<div id="videoContainer">
					<video className='videobg' autoPlay loop muted preload='auto' content='width=device-width, initial-scale=1.0'>
						<source src={BGVideo} type='video/mp4' />
					</video>
				</div>
				<div cookie_setting>
					<CookieConsent location="bottom" cookieName="RGPD Compliant" expires={999}>
						{t('cookie.banner')}
						<span>You can manage your preferences in our <a href="/settings" target="_blank" rel="noopener noreferrer">Settings</a>.</span>
					</CookieConsent>
				</div>
				<BrowserRouter>
					<AuthProvider>
						<div className="Navbar">
							<Navbar />
						</div>
							<Routes>
								<Route path="/login" element={<Login />} />
								<Route path="/*" element={<Error />} />
								<Route path="/signup" element={<RegisterAndLogout />} />
								{/** PROTECTED */}
								<Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
								<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
								<Route path="/gamepage" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
								<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
								{/* PONG */}
								<Route path="/pong" element={<ProtectedRoute><PongHomePage /></ProtectedRoute>} />
								<Route path="/localpong" element={<ProtectedRoute><LocalPongPage /></ProtectedRoute>} />
							</Routes>
					</AuthProvider>
				</BrowserRouter>
			</section>
		</div>
	)
}

export default App

