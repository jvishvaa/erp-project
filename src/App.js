import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Layout from './containers/Layout';
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
          <ThemeProvider theme={theme}>
            <Layout>
              <Route path='/'>{() => <div>Landing page</div>}</Route>
            </Layout>
          </ThemeProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
