import React, { useState, useEffect } from "react";
import { Container, Header, Icon, Message, MessageHeader, Tab } from "semantic-ui-react";
import { movieApi } from "../misc/MovieApi"; // Update the path as necessary
import { useAuth } from "../context/AuthContext";
import DocumentsTab from "./tabs/DocumentsTab";
import FormsTab from "./tabs/FormsTab";
import FailedTab from "./tabs/FailedTab";
import "./History.css";

const HistoryPage = () => {
  const Auth = useAuth();
  const user = Auth.getUser();

  const [docs, setDocs] = useState([]);
  const [forms, setForms] = useState([]);
  const [failed, setFailed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [docsResponse, formsResponse, failedResponse] = await Promise.all([
          movieApi.getDocsHistory(user, user.data.email),
          movieApi.getFormsHistory(user, user.data.email),
          movieApi.getFailedRecordsHistory(user, user.data.email),
        ]);

        console.log("Docs:", docsResponse.data);
        console.log("Forms:", formsResponse.data);
        console.log("Failed:", failedResponse.data);

        setDocs(docsResponse.data || []);
        setForms(formsResponse.data || []);
        setFailed(failedResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const panes = [
    {
      menuItem: { content: "Documents", icon: "file word outline" },
      render: () => <DocumentsTab records={docs} />,
    },
    {
      menuItem: { content: "Forms", icon: "clipboard list" },
      render: () => <FormsTab records={forms} />,
    },
    {
      menuItem: { content: "Failed", icon: "times circle outline" },
      render: () => <FailedTab records={failed} />,
    },
  ];

  return (
    <Container style={{ paddingBottom: '25px' }}>
      <Message style={{ marginBottom: '45px' }}>
        <MessageHeader>
          <Header as="h1" textAlign="center">
            Google API Records History
          </Header>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            History of successful and unsuccessful records
          </p>
        </MessageHeader>
      </Message>

      {isLoading ? (
        <p>
          <Icon name="spinner" loading /> Loading...
        </p>
      ) : docs.length === 0 && forms.length === 0 && failed.length === 0 ? (
        <p>
          <Icon name="info circle" /> No history yet.
        </p>
      ) : (
        <Tab panes={panes} />
      )}
    </Container>
  );
};

export default HistoryPage;
