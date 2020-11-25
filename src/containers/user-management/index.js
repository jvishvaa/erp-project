import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import UserManagement from './user-management';
import CreateUser from './create-user';
import EditUser from './edit-user';
import Layout from '../Layout';
import ViewUsers from './view-users/view-users';
import AssignRole from '../communication/assign-role/assign-role';
import './styles.scss';

const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
    <div className='user-management-container'>
      <Switch>
        <Route path={`${match.url}/create-user`} exact>
          {({ match, history }) => <CreateUser match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/view-users`} exact>
          {({ match, history }) => <ViewUsers match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/assign-role`} exact>
          {({ match, history }) => <AssignRole match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/edit-user/:id`}>
          {({ match, history }) => <EditUser match={match} history={history} />}
        </Route>
        {/* <Route path={`${match.url}`} exact>
          {({ match, history }) => <UserManagement match={match} history={history} />}
        </Route> */}
      </Switch>
    </div>
  );
};

export default RoutesIndex;
