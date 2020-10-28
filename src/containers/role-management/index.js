import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import RoleManagement from './role-management';
import CreateRole from './create-role';
import EditRole from './edit-role';
// import { withStyles } from '@material-ui/core/styles';

const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.url}/create-role`}>
          {({ match, history }) => <CreateRole match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/edit-role/:id`}>
          {({ match, history }) => <EditRole match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/`}>
          {({ match, history }) => <RoleManagement match={match} history={history} />}
        </Route>
      </Switch>
    </div>
  );
};

export default RoutesIndex;
