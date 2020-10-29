import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import UserManagement from './user-management';
import CreateUser from './create-user';

const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
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
  );
};

export default RoutesIndex;
