import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import Protected from './pages/Protected';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onOtpSent={setEmail} />} />
        <Route path="/verify" element={<VerifyOtp email={email} />} />
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  );
}
