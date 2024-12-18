import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DOMPurify from 'dompurify';

// Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 2rem auto;
  max-width: 900px;
  padding: 2rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
  border-radius: 10px;
  line-height: 1.6;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const EmailMeta = styled.div`
  margin-bottom: 1.5rem;

  p {
    margin: 0.5rem 0;
    font-size: 0.95rem;

    strong {
      color: #555;
    }
  }
`;

const EmailBody = styled.div`
  margin-top: 1rem;

  h2 {
    margin-top: 2rem;
    font-size: 1.5rem;
    text-align: center;
    color: #444;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 15px auto;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  p {
    margin: 15px 0;
    font-size: 1rem;
    color: #333;
    text-align: justify;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  a {
    color: #007bff;
    text-decoration: none;
    display: inline-block;
    margin-top: 10px;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const RepliesSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;

  h3 {
    margin-bottom: 1rem;
    color: #444;
  }

  hr {
    margin: 1rem 0;
    border: 0;
    border-top: 1px solid #ddd;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-top: 1rem;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const SubjectInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SendButton = styled.button`
  margin-top: 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }
`;

const EmailDetailsPage = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  const [emailDetails, setEmailDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [processedBody, setProcessedBody] = useState(null);

  const fetchThumbnail = async (url) => {
    try {
      const response = await axios.get(`http://localhost:5000/emails/api/thumbnail`, {
        params: { url },
      });
      return response.data.thumbnail;
    } catch (error) {
      console.error('Error fetching thumbnail:', error.message);
      return null;
    }
  };

  const processEmailBody = async (body) => {
    const regex = /https?:\/\/[^\s]+/g;
    const urls = body.match(regex);

    if (urls) {
      for (const url of urls) {
        const imageExtension = /\.(jpg|jpeg|png|gif)$/i;

        if (imageExtension.test(url)) {
          body = body.replace(
            url,
            `<h2>Image</h2><img src="${url}" alt="Embedded Image" />`
          );
        } else {
          const thumbnail = await fetchThumbnail(url);
          if (thumbnail) {
            body = body.replace(
              url,
              `<h2>Link Thumbnail</h2>
               <a href="${url}" target="_blank">
                 <img src="${thumbnail}" alt="Thumbnail" />
               </a>`
            );
          }
        }
      }
    }

    return DOMPurify.sanitize(body);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/emails/${id}`, {
          params: { accessToken },
        });
        setEmailDetails(data);
        setReplies(data.replies);
        const sanitizedBody = await processEmailBody(data.body);
        setProcessedBody(sanitizedBody);
      } catch (error) {
        console.error('Error fetching email details or replies:', error);
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
      await axios.post(
        `http://localhost:5000/emails/send-reply/${id}`,
        {
          subject: replySubject,
          message: replyText,
        },
        { params: { token: accessToken } }
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

      {emailDetails && processedBody ? (
        <>
          <EmailMeta>
            <p><strong>From:</strong> {emailDetails.from}</p>
            <p><strong>To:</strong> {emailDetails.to}</p>
            <p><strong>Subject:</strong> {emailDetails.subject}</p>
          </EmailMeta>

          <EmailBody dangerouslySetInnerHTML={{ __html: processedBody }}></EmailBody>
        </>
      ) : (
        <p>Loading email details...</p>
      )}

      {replies.length > 0 && (
        <RepliesSection>
          <h3>Previous Replies</h3>
          {replies.map((reply, index) => (
            <div key={index}>
              <p><strong>From:</strong> {reply.from}</p>
              <p><strong>Subject:</strong> {reply.subject}</p>
              <p>{reply.body}</p>
              <hr />
            </div>
          ))}
        </RepliesSection>
      )}

      <RepliesSection>
        <h3>Send a Reply</h3>
        <SubjectInput
          type="text"
          placeholder="Enter reply subject"
          value={replySubject}
          onChange={(e) => setReplySubject(e.target.value)}
        />
        <TextArea
          placeholder="Write your message here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <SendButton onClick={handleReply}>Send Reply</SendButton>
      </RepliesSection>
    </Container>
  );
};

export default EmailDetailsPage;
