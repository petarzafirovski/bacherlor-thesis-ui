import React, { useState } from "react";
import { List, Icon, Message, Tab } from "semantic-ui-react";

const FailedTab = ({ records }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
                    <strong> Type:</strong> <strong style={{ color: record.type === 'FORMS' ? 'purple' : 'blue', fontWeight: 'bold' }}>{record.type}</strong>
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
        renderFailedRecords(records)
      ) : (
        <Message icon>
          <Icon name="info circle" />
          <Message.Content>
            <Message.Header>No failed records which means GPT didn't disappoint. 😎</Message.Header>
          </Message.Content>
        </Message>
      )}
    </Tab.Pane>
  );
};

export default FailedTab;
