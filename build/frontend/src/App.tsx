import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import BGVideo from './assets/BG.mp4'
import Home from "./pages/home"
import Error from "./pages/error"
import GamePage from "./pages/gamepage"
import { Leaderboard } from "./pages/leaderboard"
import Login from "./pages/login"
import Pong from "./pages/pong"
import { Profile } from "./pages/profile"
import Settings from "./pages/setting"
import SignUp from "./pages/signUp"
import { Social } from "./pages/social"
import Navbar from "./components/Navbar/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context"

import './App.css'
import PongHomePage from "./pages/PongHome"
import JoinPongRoomPage from "./pages/JoinPongRoomPage"
import CreatePongRoomPage from "./pages/CreatePongRoomPage"

/**Register the user, gives him a jwt and login 
 * cleanly so that we can avoid error */
function RegisterAndLogout() {
	localStorage.clear()
	return <SignUp />
}

function App() {
	return (
		<div id='app'>
			<section id="main_content">
				<div id="videoContainer">
					<video className='videobg' autoPlay loop muted preload='auto' content='width=device-width, initial-scale=1.0'>
						<source src={BGVideo} type='video/mp4' />
					</video>
				</div>
				<BrowserRouter>
					<AuthProvider>
						<div className="Navbar">
							<Navbar />
						</div>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="*" element={<Error />} />
							<Route path="/signup" element={<RegisterAndLogout />} />

							<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
							<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
							<Route path="/gamepage" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
							<Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
							<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
							<Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
							{/* PONG */}
							<Route path="/pong" element={<ProtectedRoute><PongHomePage /></ProtectedRoute>} />
							<Route path="/pong-join" element={<ProtectedRoute><JoinPongRoomPage /></ProtectedRoute>} />
							<Route path="/pong-create" element={<ProtectedRoute><CreatePongRoomPage /></ProtectedRoute>} />
							<Route path="/pong/:roomCode" element={<ProtectedRoute><Pong /></ProtectedRoute>} />
						</Routes>
					</AuthProvider>
				</BrowserRouter>
			</section>
		</div>
	)
}

export default App
