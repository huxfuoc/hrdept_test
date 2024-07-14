import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import Users from './pages/Users';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Emails from './pages/Emails';
import Images from './pages/Image';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/user" />} />
              <Route path="/user" element={<Users />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/images" element={<Images />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
