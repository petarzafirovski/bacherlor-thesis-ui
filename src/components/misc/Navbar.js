import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Icon } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();

  const logout = () => {
    userLogout();
  };

  const enterMenuStyle = () => {
    return userIsAuthenticated() ? { display: 'none' } : { display: 'block' };
  };

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { display: 'block' } : { display: 'none' };
  };

  const adminPageStyle = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'ADMIN' ? { display: 'block' } : { display: 'none' };
  };

  const userPageStyle = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'USER' ? { display: 'block' } : { display: 'none' };
  };

  const getUserName = () => {
    const user = getUser();
    return user ? user.data.name : '';
  };

  return (
      <Menu inverted color='teal' stackable size='massive' className="navbar-menu">
        <Container>
          <Menu.Item header>
          <Icon name='google drive' />
            Google AI Tool</Menu.Item>
          <Menu.Item as={Link} exact='true' to="/" className="navbar-item">Home</Menu.Item>
          <Menu.Item as={Link} to="/adminpage" style={adminPageStyle()} className="navbar-item">AdminPage</Menu.Item>
          {/*<Menu.Item as={Link} to="/userpage" style={userPageStyle()} className="navbar-item">UserPage</Menu.Item>*/}
          {userIsAuthenticated() && (
              <>
                <Menu.Item as={Link} to="/generate" className="navbar-item">Generate</Menu.Item>
                <Menu.Item as={Link} to="/history" className="navbar-item">History</Menu.Item>
              </>
          )}
          <Menu.Menu position='right'>
            <Menu.Item as={Link} to="/login" style={enterMenuStyle()} className="navbar-item">Login</Menu.Item>
            {/*<Menu.Item as={Link} to="/signup" style={enterMenuStyle()} className="navbar-item">Sign Up</Menu.Item>*/}
            <Menu.Item header style={logoutMenuStyle()} className="navbar-item">{`Hi ${getUserName()}`}</Menu.Item>
            <Menu.Item as={Link} to="/" style={logoutMenuStyle()} className="navbar-item" onClick={logout}>Logout</Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
  );
}

export default Navbar;
