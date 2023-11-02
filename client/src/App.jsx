import React from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Schedule from './pages/Schedule';
import Editor from './pages/Editor';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PersonalSchedule from './pages/PersonalSchedule';
import Footer from './components/footer'



function App() {

    return (
    <div>
        <Navbar />
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/schedule" element={<Schedule />}/>
            <Route path="/editor" element={<Editor />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/personalschedule" element={<PersonalSchedule />}/>
        </Routes>
        <Footer />
    </div>
    );
  }

export default App;
