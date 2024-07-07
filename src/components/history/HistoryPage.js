import React, { useState, useEffect } from "react";
import { Container, Header, List, Icon, Message, MessageHeader, Tab } from "semantic-ui-react";
import { movieApi } from "../misc/MovieApi"; // Update the path as necessary
import { useAuth } from "../context/AuthContext";
import "./History.css";

const HistoryPage = () => {
  const Auth = useAuth();
  const user = Auth.getUser();

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await movieApi.getHistory(user, user.data.email);
        console.log(data.data);
        if (data != null && data != undefined) {
          setRecords(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after records are fetched
      }
    };

    fetchHistory();
  }, []);

  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.type]) {
      acc[record.type] = [];
    }
    acc[record.type].push(record);
    return acc;
  }, {});

  const renderRecords = (records) => (
    <List divided relaxed>
      {records.map((record, index) => (
        <div className="p-20" key={record.id}>
          <List.Item
            className={`list-item-style ${hoveredIndex === index ? "list-item-style-hover" : ""}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #ddd", borderRadius: "8px" }}
          >
            <div className="record-item">
              <List.Content className="list-item-content">
                <List.Header className="header-style">{record.title}</List.Header>
                <List.Description>
                  <p className="description-style">
                    <Icon name="linkify" />
                    <strong> Web URL: </strong>
                    <a href={record.webUrl} target="_blank" rel="noopener noreferrer">
                      {record.webUrl}
                    </a>
                  </p>
                  <p className="description-style">
                    <Icon name="calendar alternate" />
                    <strong> Created On:</strong>{" "}
                    {new Date(record.createdOnIsoFormat).toLocaleString("en-US", {
                      timeZone: "UTC",
                      hour12: false,
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </p>
                  <p className="description-style">
                    <Icon name="mail" />
                    <strong> User Email:</strong> {record.userEmail}
                  </p>
                  {/* <p className="description-style">
                    <Icon name="tag" />
                    <strong> Type:</strong> {record.type}
                  </p> */}
                </List.Description>
              </List.Content>
            </div>
          </List.Item>
        </div>
      ))}
    </List>
  );

  const renderFailedRecords = (records) => (
    <List divided relaxed>
      {records.map((record, index) => (
        <div className="p-20" key={record.id}>
          <List.Item
            className={`list-item-style ${hoveredIndex === index ? "list-item-style-hover" : ""}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #ddd", borderRadius: "8px" }}
          >
            <div className="record-item">
              <List.Content className="list-item-content">
                <List.Header className="header-style">{record.title}</List.Header>
                <List.Description>
                  <p className="description-style">
                    <Icon name="mail" />
                    <strong> User Email:</strong> {record.userEmail}
                  </p>
                  <p className="description-style">
                    <Icon name="file text" />
                    <strong> Content:</strong> {record.content}
                  </p>
                  <p className="description-style">
                    <Icon name="tag" />
                    <strong> Type:</strong> {record.type}
                  </p>
                </List.Description>
              </List.Content>
            </div>
          </List.Item>
        </div>
      ))}
    </List>
  );

  const [docsLoading, setDocsLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(true);
  const [failedLoading, setFailedLoading] = useState(true);

  useEffect(() => {
    if (groupedRecords["DOCS"] && groupedRecords["DOCS"].length > 0) {
      setDocsLoading(false);
    } else {
      setDocsLoading(false);
    }
  }, [groupedRecords["DOCS"]]);

  useEffect(() => {
    if (groupedRecords["FORMS"] && groupedRecords["FORMS"].length > 0) {
      setFormsLoading(false);
    } else {
      setFormsLoading(false);
    }
  }, [groupedRecords["FORMS"]]);

  useEffect(() => {
    const hasFailedRecords = Object.values(groupedRecords).some(records => 
      records.some(record => record.isCreated === false)
    );
    setFailedLoading(false); // Set loading to false regardless
  }, [groupedRecords]);

  const successfulDocs = groupedRecords["DOCS"]?.filter(record => record.isCreated === true) || [];
  const successfulForms = groupedRecords["FORMS"]?.filter(record => record.isCreated === true) || [];
  const failedRecords = Object.values(groupedRecords)
    .flat()
    .filter(record => record.isCreated === false);

  const panes = [
    {
      menuItem: { content: "Documents", icon: "file word outline" },
      render: () => (
        <Tab.Pane loading={docsLoading}>
          {successfulDocs.length > 0 ? (
            renderRecords(successfulDocs)
          ) : (
            <Message icon>
              <Icon name="info circle" />
              <Message.Content>
                <Message.Header>No documents history yet.</Message.Header>
              </Message.Content>
            </Message>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: { content: "Forms", icon: "clipboard list" },
      render: () => (
        <Tab.Pane loading={formsLoading}>
          {successfulForms.length > 0 ? (
            renderRecords(successfulForms)
          ) : (
            <Message icon>
              <Icon name="info circle" />
              <Message.Content>
                <Message.Header>No forms history yet.</Message.Header>
              </Message.Content>
            </Message>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: { content: "Failed", icon: "times circle outline" },
      render: () => (
        <Tab.Pane loading={failedLoading}>
          {failedRecords.length > 0 ? (
            renderFailedRecords(failedRecords)
          ) : (
            <Message icon>
              <Icon name="info circle" />
              <Message.Content>
                <Message.Header>No failed records which means GPT didn't disappoint. 😎</Message.Header>
              </Message.Content>
            </Message>
          )}
        </Tab.Pane>
      ),
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
      ) : Object.keys(groupedRecords).length === 0 ? (
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
