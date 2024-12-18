import React, { useState } from 'react';
import { sendEmail } from '../api/emailApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ComposeEmailPage = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const handleSend = async () => {
    const rawMessage = btoa(`To: ${to}\nSubject: ${subject}\n\n${body}`);
    await sendEmail(email, rawMessage);
    alert('Email sent!');
    navigate(`/emails?email=${email}`);
  };

  return (
    <div>
      <h1>Compose Email</h1>
      <input placeholder="To" onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Body" onChange={(e) => setBody(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ComposeEmailPage;
