// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import UserDetails from './pages/UserDetails';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/edit-user" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;