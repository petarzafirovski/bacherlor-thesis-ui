import React, { useState, useEffect } from "react";
import { List, Icon, Message, Tab } from "semantic-ui-react";

const FormsTab = ({ records }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
                </List.Description>
              </List.Content>
            </div>
          </List.Item>
        </div>
      ))}
    </List>
  );

  return (
    <Tab.Pane>
      {records.length > 0 ? (
        renderRecords(records)
      ) : (
        <Message icon>
          <Icon name="info circle" />
          <Message.Content>
            <Message.Header>No forms history yet.</Message.Header>
          </Message.Content>
        </Message>
      )}
    </Tab.Pane>
  );
};

export default FormsTab;
