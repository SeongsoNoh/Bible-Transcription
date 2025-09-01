import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import TranscriptionPage from './components/TranscriptionPage';
import ProgressPage from './components/ProgressPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write/:lang/:book/:chapter" element={<TranscriptionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;