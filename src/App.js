import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import PrivateRoute from './components/misc/PrivateRoute';
import Navbar from './components/misc/Navbar';
import Home from './components/home/Home';
import Login from './components/home/Login';
import OAuth2Redirect from './components/home/OAuth2Redirect';
import AdminPage from './components/admin/AdminPage';
import GeneratePage from './components/generate/GeneratePage';
import HistoryPage from './components/history/HistoryPage';
import './App.css'; // Import your custom CSS file

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/oauth2/redirect' element={<OAuth2Redirect />} />
            <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="/generate" element={<PrivateRoute><GeneratePage /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
