import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import TeacherDashboardSecond from './DashboardTeacher/TeacherDashboard2';
import ClassworkThree from './ClassworkHomework/ClassworkThree';
import HomeworkClasswork from './ClassworkHomework/ClassworkAndHomework';
import HomeworkClassworkTwo from './ClassworkHomework/ClassworkAndHomeworkTwo';
import CurriculumCompletionDetails from './DashboardTeacher/CurriculumCompletionDetails';
import ChapterAndTopics from './DashboardTeacher/CurriculumChaptersAndTopic';
import AttendanceOverview from './ClassworkHomework/TeacherDashboard-New/AttendanceOverview';
const RoutesIndex = () => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.url}/teacherdashtwo`} exact>
          {({ match, history }) => (
            <TeacherDashboardSecond match={match} history={history} />
          )}
        </Route>
        <Route path={`${match.url}/slide3`} exact>
          {({ match, history }) => <ClassworkThree match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/homework_Classwork`} exact>
          {({ match, history }) => <HomeworkClasswork match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/homework_Classwork_two`} exact>
          {({ match, history }) => (
            <HomeworkClassworkTwo match={match} history={history} />
          )}
        </Route>
        <Route path={`${match.url}/curriculum/:branchId`} exact>
          {({ match, history }) => (
            <CurriculumCompletionDetails match={match} history={history} />
          )}
        </Route>
        <Route path={`${match.url}/chapter_Topics`} exact>
          {({ match, history }) => <ChapterAndTopics match={match} history={history} />}
        </Route>
        <Route path={`${match.url}/attendance_overview`} exact>
          {({ match, history }) => <AttendanceOverview match={match} history={history} />}
        </Route>
      </Switch>
    </>
  );
};

export default RoutesIndex;
