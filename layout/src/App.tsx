import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserLogin from './features/User/UserLogin';
import UserRegister from './features/User/UserRegister';
import AdminLogin from './features/Admin/AdminLogin';
import AdminDashboard from './features/Admin/AdminDashboard';
import UserDashboard from './features/User/UserDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
