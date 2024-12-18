import axios from 'axios';

const API_URL = 'http://localhost:5000/emails';

export const fetchEmails = async (token) => {
  const response = await axios.get(`${API_URL}?accessToken=${token}`);
  return response.data;
};

export const sendEmail = async (email, rawMessage) => {
  await axios.post(`${API_URL}/send`, { email, rawMessage });
};
