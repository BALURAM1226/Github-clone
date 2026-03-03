import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import HomePage from './pages/HomePage';
import RepoDetailsPage from './pages/RepoDetailsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="bg-github-dark min-h-screen text-github-text font-sans">
        <Routes>
          <Route path="/repo/:user/:repoId" element={<RepoDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}
