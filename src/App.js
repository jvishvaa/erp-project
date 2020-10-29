import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CreateGroup from './container/communication/component/create-group/create-group';
import ViewGroup from './container/communication/component/view-group/view-group';
import MessageCredit from './container/communication/component/message-credit/message-credit';
import SendMessage from './container/communication/component/send-message/send-message';
import Layout from './containers/Layout';
import store from './redux/store';
import AlertNotificationProvider from './context-api/alert-context/alert-state';
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
          <AlertNotificationProvider>
            <ThemeProvider theme={theme}>
              <Layout>
                {/* <Route exact path='/'>
                {() => <div>Landing page</div>}
              </Route> */}
                {/* <Route exact path='/addgroup'>
                {() => <CreateGroup />}
              </Route> */}
                <Route exact path='/smscredit'>
                  {() => <MessageCredit />}
                </Route>
                {/* <Route exact path='/viewgroup'>
                  {() => <ViewGroup />}
                </Route> */}
                {/* <Route exact path='/sendmessage'>
                  {() => <SendMessage />}
                </Route> */}
              </Layout>
            </ThemeProvider>
          </AlertNotificationProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
