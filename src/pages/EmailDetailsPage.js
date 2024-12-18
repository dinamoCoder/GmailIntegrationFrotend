import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 2rem auto;
  max-width: 800px;
  padding: 2rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 10px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

const EmailDetailsSection = styled.div`
  margin-bottom: 2rem;

  p {
    margin: 0.5rem 0;
  }

  strong {
    font-weight: bold;
  }
`;

const RepliesSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;

  h3 {
    margin-bottom: 1rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
`;

const SubjectInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SendButton = styled.button`
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const EmailDetailsPage = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken'); // Retrieve token

  const [emailDetails, setEmailDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');

  // Fetch email details by ID
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/emails/${id}`, {
          params: { accessToken }, // Pass accessToken in query params
        });
        setEmailDetails(data); // Set full response
        setReplies(data.replies || []); // Set replies array
      } catch (error) {
        console.error('Error fetching email details:', error);
      }
    };
    fetchDetails();
  }, [id, accessToken]);

  const handleReply = async () => {
    if (!replySubject || !replyText) {
      alert('Please enter both a subject and message!');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5000/emails/send-reply/${id}`,
        {
          subject: replySubject,
          message: replyText,
        },
        {
          params: {
            token: accessToken, // Send the access token from localStorage or session
          },
        }
      );
      alert('Reply sent successfully!');
      setReplyText('');
      setReplySubject('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply.');
    }
  };
  

  return (
    <Container>
      <Title>Email Details</Title>

      {/* Email Details */}
      {emailDetails && (
        <EmailDetailsSection>
          <p>
            <strong>From:</strong> {emailDetails.from}
          </p>
          <p>
            <strong>To:</strong> {emailDetails.to}
          </p>
          <p>
            <strong>Subject:</strong> {emailDetails.subject}
          </p>
          <p>
            <strong>Body:</strong>
          </p>
          <p>{emailDetails.body}</p>
        </EmailDetailsSection>
      )}

      {/* Replies Section */}
      {replies.length > 0 && (
        <RepliesSection>
          <h3>Previous Replies</h3>
          {replies.map((reply, index) => (
            <div key={reply.id || index}>
              <p>
                <strong>From:</strong> {reply.from}
              </p>
              <p>
                <strong>Subject:</strong> {reply.subject}
              </p>
              <p>{reply.body}</p>
              <hr />
            </div>
          ))}
        </RepliesSection>
      )}

      {/* Reply Section */}
      <div>
        <h3>Reply to this Email</h3>
        <SubjectInput
          placeholder="Subject"
          value={replySubject}
          onChange={(e) => setReplySubject(e.target.value)}
        />
        <TextArea
          placeholder="Type your reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <SendButton onClick={handleReply}>Send Reply</SendButton>
      </div>
    </Container>
  );
};

export default EmailDetailsPage;
