import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ReactComponent as OpenAiIcon } from '../../assets/openai-svgrepo-com.svg';
import { ReactComponent as GoogleIcon } from '../../assets/google-178-svgrepo-com.svg';
import { ReactComponent as GoogleDriveIcon } from '../../assets/google-drive-svgrepo-com.svg';

const Home = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <Container text>
      <Header as='h2' textAlign='center' style={{ marginTop: '20px' }}>
        Welcome to AI Tools for Google Drive
        <Header.Subheader>Utilization of the following services</Header.Subheader>
      </Header>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2500}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          containerClass="carousel-container"
          itemClass="carousel-item"
          customTransition="transform 500ms ease-in-out"
          dotListClass="custom-dot-list-style"
          draggable={false}
          keyBoardControl
        >
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
            <OpenAiIcon width={100} height={100} />
            <p style={{ marginTop: '15px' }}>OpenAI - Powered by advancing artificial intelligence for all. Utilize OpenAI to create content for your files.</p>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
            <GoogleIcon width={100} height={100} />
            <p style={{ marginTop: '15px' }}>Google - Innovating the future of technology. Use Google OAuth2 for authentication and Google Drive for file storage.</p>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
            <GoogleDriveIcon width={100} height={100} />
            <p style={{ marginTop: '15px' }}>Google Drive - Your cloud storage solution. Upload and manage files securely with Google Drive integration.</p>
          </div>
        </Carousel>
      </div>
    </Container>
  );
};

export default Home;
