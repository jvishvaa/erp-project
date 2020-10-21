import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreateGroup from './container/communication/component/create-group/create-group';
import ViewGroup from './container/communication/component/view-group/view-group';
import store from './redux/store';

function App() {
  useEffect(() => {
    store.dispatch({ type: 'SAMPLE_ACTION' });
  }, []);

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/'>
            {() => <div>Landing page</div>}
          </Route>
          <Route exact path='/addgroup'>
            {() => <CreateGroup />}
          </Route>
          <Route exact path='/viewgroup'>
            {() => <ViewGroup />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
