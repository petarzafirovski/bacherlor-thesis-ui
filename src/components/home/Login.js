import React from 'react';
import { Grid, Menu, Icon, Header, Segment } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import { getSocialLoginUrl } from '../misc/Helpers';
import { Navigate } from 'react-router-dom';

function Login() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();

  if (isLoggedIn) {
    return <Navigate to='/' />;
  }

  return (
    <Grid textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment padded='very'>
          <Header as='h2' icon textAlign='center'>
            <Icon name='user circle' size='huge' />
            Welcome Back!
            <Header.Subheader>
              Please log in to access your account.
            </Header.Subheader>
          </Header>
          <Menu compact icon='labeled' vertical>
            <Menu.Item name='google' href={getSocialLoginUrl('google')}>
              <Icon name='google' size='big' /> Login with Google
            </Menu.Item>
          </Menu>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
