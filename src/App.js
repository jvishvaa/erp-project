import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Layout from './containers/layout';
import RoleManagement from './containers/role-management';
import store from './redux/store';
import './assets/styles/styles.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#014b7e',
    },
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
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Switch>
              <Route path='/role-management'>
                {({ match }) => <RoleManagement match={match} />}
              </Route>
              <Route exact path='/'>
                {() => {
                  return <div>Landing page</div>;
                }}
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
