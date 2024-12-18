import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmailListPage from './pages/EmailListPage';
import EmailDetailsPage from './pages/EmailDetailsPage';
import ComposeEmailPage from './pages/ComposeEmailPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/emails" element={<EmailListPage />} />
      <Route path="/email-details/:id" element={<EmailDetailsPage />} />
      <Route path="/compose" element={<ComposeEmailPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
