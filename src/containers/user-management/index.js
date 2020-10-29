import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import UserManagement from './user-management';
import CreateUser from './create-user';
import Layout from '../layout';

const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
    <Layout>
      <div>
        <Switch>
          <Route path={`${match.url}/create-user`}>
            {({ match, history }) => <CreateUser match={match} history={history} />}
          </Route>
          <Route path={`${match.url}`}>
            {({ match, history }) => <UserManagement match={match} history={history} />}
          </Route>
        </Switch>
      </div>
    </Layout>
  );
};

export default RoutesIndex;
