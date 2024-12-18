import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

// Styled components for modern UI
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 10px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const StyledDataTable = styled(DataTable)`
  margin-top: 1rem;
  border-radius: 10px;
  overflow: hidden;

  .rdt_Table {
    border-radius: 10px;
  }

  .rdt_TableRow {
    cursor: pointer; /* Add pointer cursor to table rows */
    &:hover {
      background-color: #f1f1f1; /* Light background on hover */
    }
  }
`;

const EmailListPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage] = useState(10); // Emails per page

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    fetchEmails(page, perPage);
  }, [page, perPage, token]);

  const fetchEmails = async (page, perPage) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/emails`, {
        params: { token, page, perPage },
      });
      setEmails(data.emails); // Updated to expect paginated response
      setTotalRows(data.totalCount); // Total count for pagination
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Navigate to EmailDetailsPage with email ID
  const handleRowClick = (row) => {
    console.log(row);
    navigate(`/email-details/${row.id}`);
  };

  const columns = [
    { name: 'Subject', selector: (row) => row.subject, sortable: true },
    { name: 'From', selector: (row) => row.from, sortable: true },
  ];

  return (
    <Container>
      <Title>Email List</Title>
      <StyledDataTable
        columns={columns}
        data={emails}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        highlightOnHover
        striped
        onRowClicked={handleRowClick} // Trigger row click navigation
      />
    </Container>
  );
};

export default EmailListPage;
