import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import RoleManagement from './containers/role-management';
import store from './redux/store';
import AlertNotificationProvider from './context-api/alert-context/alert-state';
import './assets/styles/styles.scss';
import UserManagement from './containers/user-management';
import Login from './containers/login';
import Dashboard from './containers/dashboard';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#014b7e',
    },
    text: {
      default: '#014b7e',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9f9f9',
    },
  },
  typography: {
    fontSize: 16,
    color: '#014b7e',
  },

  overrides: {
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        color: '#ffffff',
        backgroundColor: ' #ff6b6b',
      },
    },
  },
});

function App() {
  useEffect(() => {
    store.dispatch({ type: 'SAMPLE_ACTION' });
  }, []);

  return (
    <div className='App'>
      <Router>
        <AlertNotificationProvider>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route path='/role-management'>
                {({ match }) => <RoleManagement match={match} />}
              </Route>
              <Route path='/user-management'>
                {({ match }) => <UserManagement match={match} />}
              </Route>
              <Route path='/dashboard'>
                {({ match }) => <Dashboard match={match} />}
              </Route>
              <Route exact path='/'>
                {({ match, history }) => <Login match={match} history={history} />}
              </Route>
            </Switch>
          </ThemeProvider>
        </AlertNotificationProvider>
      </Router>
    </div>
  );
}

export default App;
