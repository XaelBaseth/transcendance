import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { IsLoggedInContext } from './context/context';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';

import './App.css';
import { UserProfile } from './pages/profile/Profile';


function App() {

  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
 
  return (
    <div id='app'>
      <section id="main_content">
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <Navbar setLoggedIn={setLoggedIn} />
        <div id="videoContainer">
          <video className='videobg' autoPlay loop muted preload='auto' content='width=device-width, initial-scale=1.0'>
          <source src={process.env.PUBLIC_URL + '/assets/toothlessDancing.mp4'} type='video/mp4' />
          </video>
        </div>
        <Toaster/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </IsLoggedInContext.Provider>  
      </section>
      
    </div>
  )
}

export default App

