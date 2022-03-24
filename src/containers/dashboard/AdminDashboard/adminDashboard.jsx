import React, { useEffect } from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { Grid } from '@material-ui/core';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import { reportTypeConstants } from '../dashboard-constants';
import { useDashboardContext } from '../dashboard-context';
import StudentRightDashboard from './../StudentDashboard/StudentRightDashboard/StudentRightDashboard';

const AdminDashboard = () => {
  const { attendance, classwork, homework, login, role, referral } = reportTypeConstants;
  const {
    branchIds = [],
    getReport = () => { },
    reports,
    setReports,
    card,
  } = useDashboardContext();

  const dashboardData = {
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
    loginReport: [],
    roleReport: [],
    referralReport: [],
  };
  const getAttendanceReport = (params) => {
    getReport(attendance, params)
      .then((response) => {
        const attendanceReport = response.map(
          ({ grade = '', subject = '', present = 0, absent = 0 }) => ({
            detail: `${grade} - ${subject}`,
            positive: present,
            negative: absent,
          })
        );
        setReports((prev) => ({ ...prev, attendanceReport }));
        dashboardData.attendanceReport = attendanceReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getClassworkReport = (params) => {
    getReport(classwork, params)
      .then((response) => {
        const classworkReport = response.map(
          ({ grade = '', subject = '', submitted = 0, un_submitted = 0 }) => ({
            detail: `${grade} - ${subject}`,
            positive: submitted,
            negative: un_submitted,
          })
        );
        setReports((prev) => ({ ...prev, classworkReport }));
        dashboardData.classworkReport = classworkReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getHomeworkReport = (params) => {
    getReport(homework, params)
      .then((response) => {
        const homeworkReport = response.map(
          ({
            grade = '',
            subject_name: subject = '',
            submitted = 0,
            total_students = 0,
          }) => ({
            detail: `${grade} - ${subject}`,
            positive: submitted,
            negative: total_students - submitted,
          })
        );
        setReports((prev) => ({ ...prev, homeworkReport }));
        dashboardData.homeworkReport = homeworkReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getLoginReport = (params) => {
    getReport(login, params)
      .then((response) => {
        const loginReport = response.map(
          ({
            grade = '',
            subject_name: subject = '',
            submitted = 0,
            total_students = 0,
          }) => ({
            detail: `${grade} - ${subject}`,
            positive: submitted,
            negative: total_students - submitted,
          })
        );
        setReports((prev) => ({ ...prev, loginReport }));
        dashboardData.loginReport = loginReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getRoleReport = (params) => {
    getReport(role, params)
      .then((response) => {
        const roleReport = response.map(({ count = 0, role_name = ' ' }) => ({
          detail: role_name,
          info: count,
        }));
        setReports((prev) => ({ ...prev, roleReport }));
        dashboardData.roleReport = roleReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getReferralReport = (params) => {
    getReport(referral, params)
      .then((response) => {
        const totalReferral = response.pop();
        const remainingResponse = response;
        const referralReport = [totalReferral, ...remainingResponse].map(
          ({ branch_name = '', total_referals = '' }) => ({
            detail: branch_name === 'total_referals' ? 'Total Referrals' : branch_name,
            info: total_referals,
          })
        );
        setReports((prev) => ({ ...prev, referralReport }));
        dashboardData.referralReport = referralReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch(() => { });
  };

  const getAllReports = () => {
    const params = { branch_ids: branchIds.join(',') };
    getAttendanceReport(params);
    getClassworkReport(params);
    getHomeworkReport(params);
    getLoginReport(params);
    getRoleReport(params);
    getReferralReport(params);
    if (reports.refreshAll) {
      setReports((prev) => ({ ...prev, refreshAll: false }));
    }
  };

  useEffect(() => {
    let data = sessionStorage.getItem('dashboardData');
    if (branchIds.length > 0) {
      if (data) {
        setReports(JSON.parse(data));
      } else {
        getAllReports();
      }
    }
  }, [branchIds]);

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (card) {
      switch (card) {
        case 'attendance':
          return getAttendanceReport(params);
        case 'classwork':
          return getClassworkReport(params);
        case 'homework':
          return getHomeworkReport(params);
        case 'login':
          return getLoginReport(params);
        case 'role':
          return getRoleReport(params);
        case 'referral':
          return getReferralReport(params);
      }
    }
  }, [card]);

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (reports.refreshAll) getAllReports(params);
  }, [reports.refreshAll]);

  const {
    attendanceReport = [],
    classworkReport = [],
    homeworkReport = [],
    loginReport = [],
    roleReport = [],
    referralReport = [],
  } = reports || {};

  return (
    <Grid container>
      <Grid container xs={12} sm={9} md={9} spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <DashFilterWidget />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <ReportStatsWidget
            title='Attendance Report'
            data={attendanceReport}
            avatar={SpellcheckIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <ReportStatsWidget
            title='Classwork Report'
            data={classworkReport}
            avatar={OndemandVideoIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <ReportStatsWidget
            title='Homework Report'
            data={homeworkReport}
            avatar={MenuBookIcon}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <ReportStatsWidget
            title='Login Report'
            data={loginReport}
            avatar={MenuBookIcon}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={6}>
          <ReportStatsWidget
            title='Role Report'
            data={roleReport}
            avatar={AssignmentIndIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <ReportStatsWidget
            title='Referral Report'
            data={referralReport}
            avatar={GroupAddIcon}
          />
        </Grid>
      </Grid>
      <Grid container xs={0} sm={3} md={3}>
        <Grid item style={{ marginLeft: "5px"}}>
          <StudentRightDashboard />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
