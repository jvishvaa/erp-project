import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Layout from './containers/Layout';
import store from './redux/store';
import AlertNotificationProvider from './context-api/alert-context/alert-state';
import './assets/styles/styles.scss';
import OnlineClass from './containers/online-class';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#014b7e',
    },
  },

  overrides: {},
});

function App() {
  useEffect(() => {
    store.dispatch({ type: 'SAMPLE_ACTION' });
  }, []);

  return (
    <div className='App'>
      <Router>
        <Switch>
          <AlertNotificationProvider>
            <ThemeProvider theme={theme}>
              <Layout>
                <Route path='/'><OnlineClass /></Route>
              </Layout>
            </ThemeProvider>
          </AlertNotificationProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
