import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { IsLoggedInContext } from './context/context';
import { UserProfile } from './pages/profile/Profile';
import { Social } from './pages/social/Social';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import GamePage from './pages/gamepage/Gamepage';
import './App.css';
import Settings from './pages/settings/Settings';
import ErrorPage from './pages/error/Error';
import { Leaderboard } from './pages/leaderboard/Leaderboard';
import Pong from './pages/pong/Pong';
import SignUp from './pages/signUp/signUp';


function App() {

  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
 
  return (
    <div id='app'>
      <section id="main_content">
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <Navbar setLoggedIn={setLoggedIn} />
        <div id="videoContainer">
          <video className='videobg' autoPlay loop muted preload='auto' content='width=device-width, initial-scale=1.0'>
          <source src={process.env.PUBLIC_URL + '/assets/BG(2).mp4'} type='video/mp4' />
          </video>
        </div>
        <Toaster/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
            <Route path="/profile" element={<UserProfile />} />
			      <Route path='/gamepage' element={<GamePage />} />
            <Route path='/social' element={<Social />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/Pong' element={<Pong />} />
            <Route path='/*' element={<ErrorPage />} />
            <Route path='/signup' element={<SignUp />} />
          </Routes>
        </IsLoggedInContext.Provider>  
      </section>
      
    </div>
  );
}

export default App