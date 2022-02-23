import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import EditPeriod from './editPeriod/editPeriod';
import ViewAttendence from './dialogs/viewAttendance';
import ViewClassWork from './dialogs/viewClassWork';
import ViewHomeWork from './dialogs/viewHomeWork.js';
import ViewClassParticipate from './dialogs/viewClassParticipate.js';
import StudentSubmitHw from './dialogs/StudentSubmitHW';
import StudentCwSubmit from './editPeriod/studentClassWorkSubmit';
import ViewQuizClassWork from './dialogs/viewQuizClassWork';
const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.url}/edit-period/:id`} exact>
          {({ match, history }) => <EditPeriod match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/each-attendance/:id`} exact>
          {({ match, history }) => <ViewAttendence match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/view-participate/:id`} exact>
          {({ match, history }) => (
            <ViewClassParticipate match={match} history={history} />
          )}
        </Route>
        <Route path={`${match.url}/view-class-work`} exact>
          {({ match, history }) => <ViewClassWork match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/view-home-work/:homeWorkId`} exact>
          {({ match, history }) => <ViewHomeWork match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/submit-home-work/:homeWorkId`} exact>
          {({ match, history }) => <StudentSubmitHw match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/submit-class-work/:classWorkId`} exact>
          {({ match, history }) => <StudentCwSubmit match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/view-quiz-class-work`} exact>
          {({ match, history }) => <ViewQuizClassWork match={match} history={history} />}
        </Route>
      </Switch>
    </>
  );
};

export default RoutesIndex;
