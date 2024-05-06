import React, { useState } from "react"
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
			<div className="Navbar">
				{/**Add the fucking Navbar when it's ready */}
			</div>
			<div id="videoContainer">
				<video className='videobg' autoPlay loop muted preload='auto' content='width=device-width, initial-scale=1.0'>
					<source src={BGVideo} type='video/mp4' />
				</video>
			</div>
			<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Error />} />
				<Route path="/signup" element={<RegisterAndLogout />} />

				<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path="/gamepage" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
				<Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
				<Route path="/pong" element={<ProtectedRoute><Pong /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
				<Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
			</Routes>
			</BrowserRouter>
		</section>
	</div>
	)
}

export default App
