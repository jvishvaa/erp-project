import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './redux/store';

function App() {
  useEffect(() => {
    store.dispatch({ type: 'SAMPLE_ACTION' });
  }, []);

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/'>{() => <div>Landing page</div>}</Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
