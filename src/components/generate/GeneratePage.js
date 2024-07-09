import React, { useState } from 'react';
import { Container, Grid, Segment, Header, Form, Checkbox, Radio, Button, Modal, Dimmer, Loader } from 'semantic-ui-react';
import { movieApi } from '../misc/MovieApi'; // Update the path as necessary
import { useAuth } from '../context/AuthContext';

function GeneratePage() {
  const Auth = useAuth();
  const user = Auth.getUser();

  const [selectedOption, setSelectedOption] = useState(null); // Use null to hide both forms initially
  const [formsData, setFormsData] = useState({
    forms: {
      title: '',
      content: '',
      isPublic: false,
      numberOfQuestions: 0,
      requestedType: 'QUIZ'
    },
    docs: {
      title: '',
      content: '',
      isPublic: false,
      requestedType: 'DOCS'
    }
  });
  const [loading, setLoading] = useState(false); // State to manage loading state in modal
  const [formErrors, setFormErrors] = useState({
    forms: {},
    docs: {}
  }); // State to hold validation errors for each form

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ header: '', message: '', color: '' }); // Added color state

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Reset validation errors for the selected form
    setFormErrors({ ...formErrors, [option]: {} });
  };

  const handleInputChange = (e, { name, value }) => {
    const updatedFormData = {
      ...formsData,
      [selectedOption]: {
        ...formsData[selectedOption],
        [name]: value
      }
    };
    setFormsData(updatedFormData);
    // Clear error message when user starts typing again
    setFormErrors({ ...formErrors, [selectedOption]: { ...formErrors[selectedOption], [name]: null } });
  };

  const handleRadioChange = (e, { value }) => {
    const updatedFormData = {
      ...formsData,
      forms: {
        ...formsData.forms,
        requestedType: value
      }
    };
    setFormsData(updatedFormData);
  };

  const handleCheckboxChange = (e, { name, checked }) => {
    const updatedFormData = {
      ...formsData,
      [selectedOption]: {
        ...formsData[selectedOption],
        [name]: checked
      }
    };
    setFormsData(updatedFormData);
  };

  const validateForm = () => {
    const { title, content, numberOfQuestions } = formsData[selectedOption];
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Please enter a title.';
    }
    if (!content.trim()) {
      errors.content = 'Please enter content.';
    }
    if (numberOfQuestions < 0) {
      errors.numberOfQuestions = 'Number of questions cannot be less than zero.';
    }
    if (numberOfQuestions === 0) {
      errors.numberOfQuestions = 'Number of questions must be greater than zero.';
    }
    setFormErrors({ ...formErrors, [selectedOption]: errors });
    return Object.keys(errors).length === 0; // Return true if no errors found
  };

  const resetForm = () => {
    setSelectedOption(null);
    setFormsData({
      forms: {
        title: '',
        content: '',
        isPublic: false,
        numberOfQuestions: 0,
        requestedType: 'QUIZ'
      },
      docs: {
        title: '',
        content: '',
        isPublic: false,
        requestedType: 'DOCS'
      }
    });
    setFormErrors({ forms: {}, docs: {} });
    setLoading(false);
  };

  const handleFormsSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true); // Start loading
    setTimeout(async () => {
      try {
        const response = await movieApi.generateForms(user, user.data.email, {
          ...formsData.forms,
          requestedType: formsData.forms.requestedType.toUpperCase()
        });
        handleResponse(response, 'Forms');
      } catch (error) {
        setModalContent({ header: 'Error', message: 'There was an error while sending the request for generating forms.', color: 'red' });
        setModalOpen(true);
      } finally {
        setLoading(false); // Stop loading
        resetForm(); // Reset the form after submission
      }
    }, 2000); // Simulate a delay of 2 seconds
  };

  const handleDocsSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true); // Start loading
    setTimeout(async () => {
      try {
        const response = await movieApi.generateDocs(user, user.data.email, {
          ...formsData.docs,
          requestedType: 'DOCS'
        });
        handleResponse(response, 'Docs');
      } catch (error) {
        setModalContent({ header: 'Error', message: 'There was an error while sending the request for generating docs.', color: 'red' });
        setModalOpen(true);
      } finally {
        setLoading(false); // Stop loading
        resetForm(); // Reset the form after submission
      }
    }, 2000); // Simulate a delay of 2 seconds
  };

  const handleResponse = (response, type) => {
    if (response.status === 202) {
      setFormErrors({ ...formErrors, [selectedOption]: {} }); // Clear any previous form errors for the selected form
      setModalContent({
        header: 'Success',
        message: `${type} request was successfully sent for processing. Check your history in a while.`,
        color: 'green'
      });
    } else {
      handleSubmissionError(type.toLowerCase());
    }
    setModalOpen(true); // Open modal regardless of success or failure
  };

  const handleSubmissionError = (type) => {
    // Handle submission error as per your application logic
    setModalContent({
      header: 'Error',
      message: `There was an error while processing the ${type}. Please try again.`,
      color: 'red'
    });
    setModalOpen(true); // Open modal to display error
  };

  const renderForms = () => (
    <Grid.Row centered>
      <Grid.Column width={8}>
        <Segment>
          <Form>
            <Form.Input
              label="Enter Title"
              name="title"
              value={formsData.forms.title}
              onChange={handleInputChange}
              error={formErrors.forms.title ? { content: formErrors.forms.title } : null}
            />
            <Form.Input
              label="Enter Content"
              name="content"
              value={formsData.forms.content}
              onChange={handleInputChange}
              error={formErrors.forms.content ? { content: formErrors.forms.content } : null}
            />
            <Form.Input
              label="Enter Number of Questions"
              name="numberOfQuestions"
              type="number"
              value={formsData.forms.numberOfQuestions}
              onChange={handleInputChange}
              error={formErrors.forms.numberOfQuestions ? { content: formErrors.forms.numberOfQuestions } : null}
            />
            <Form.Field>
              <Checkbox
                label="Is Public"
                name="isPublic"
                checked={formsData.forms.isPublic}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Quiz"
                name="requestedType"
                value="QUIZ"
                checked={formsData.forms.requestedType === 'QUIZ'}
                onChange={handleRadioChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Survey"
                name="requestedType"
                value="SURVEY"
                checked={formsData.forms.requestedType === 'SURVEY'}
                onChange={handleRadioChange}
              />
            </Form.Field>
            <Button primary onClick={handleFormsSubmit}>Generate for Forms</Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  );

  const renderDocs = () => (
    <Grid.Row centered>
      <Grid.Column width={8}>
        <Segment>
          <Form>
            <Form.Input
              label="Enter Title"
              name="title"
              value={formsData.docs.title}
              onChange={handleInputChange}
              error={formErrors.docs.title ? { content: formErrors.docs.title } : null}
            />
            <Form.Input
              label="Enter Content"
              name="content"
              value={formsData.docs.content}
              onChange={handleInputChange}
              error={formErrors.docs.content ? { content: formErrors.docs.content } : null}
            />
            <Form.Field>
              <Checkbox
                label="Is Public"
                name="isPublic"
                checked={formsData.docs.isPublic}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
            <Button primary onClick={handleDocsSubmit}>Generate for Docs</Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  );

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid columns={2} stackable centered>
        <Grid.Row>
          <Grid.Column>
            <Segment textAlign="center" padded color={selectedOption === 'forms' ? 'teal' : null} onClick={() => handleOptionClick('forms')} style={{ cursor: 'pointer' }}>
              <Header as="h2">Google Forms</Header>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" padded color={selectedOption === 'docs' ? 'teal' : null} onClick={() => handleOptionClick('docs')} style={{ cursor: 'pointer' }}>
              <Header as="h2">Google Docs</Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        {selectedOption === 'forms' && renderForms()}
        {selectedOption === 'docs' && renderDocs()}
      </Grid>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size='small'
      >
        <Modal.Header style={{ color: modalContent.color === 'green' ? 'green' : 'red' }}>{modalContent.header}</Modal.Header>
        <Modal.Content>
          <p>{modalContent.message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)} primary>OK</Button>
        </Modal.Actions>
      </Modal>
      <Dimmer active={loading} inverted>
        <Loader inverted content='Processing request...' />
      </Dimmer>
    </Container>
  );
}

export default GeneratePage;