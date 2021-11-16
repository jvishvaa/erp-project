import React, { useState, useEffect } from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { Grid } from '@material-ui/core';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import { reportTypeConstants } from '../dashboard-constants';
import { useDashboardContext } from '../dashboard-context';

const AdminDashboard = () => {
  const { attendance, classwork, homework, login, role, referral } = reportTypeConstants;
  const { branchIds = [], getReport = () => {} } = useDashboardContext();

  const [reports, setReports] = useState({
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
    loginReport: [],
    roleReport: [],
    referralReport: [],
  });

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
      })
      .catch(() => {});
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
      })
      .catch(() => {});
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
      })
      .catch(() => {});
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
      })
      .catch(() => {});
  };

  const getRoleReport = (params) => {
    getReport(role, params)
      .then((response) => {
        const roleReport = response.map(({ count = 0, role_name = ' ' }) => ({
          detail: role_name,
          info: count,
        }));
        setReports((prev) => ({ ...prev, roleReport }));
      })
      .catch(() => {});
  };

  const getReferralReport = (params) => {
    getReport(referral, params)
      .then((response) => {
        const referralReport = response.map(
          ({ branch_name = ' ', total_referals = '' }) => ({
            detail: branch_name,
            info: total_referals,
          })
        );
        setReports((prev) => ({ ...prev, referralReport }));
      })
      .catch(() => {});
  };

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (branchIds.length > 0) {
      getAttendanceReport(params);
      getClassworkReport(params);
      getHomeworkReport(params);
    }
  }, [branchIds]);

  useEffect(() => {
    getLoginReport();
    getRoleReport();
    getReferralReport();
  }, []);

  const {
    attendanceReport = [],
    classworkReport = [],
    homeworkReport = [],
    loginReport = [],
    roleReport = [],
    referralReport = [],
  } = reports || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <DashFilterWidget />
      </Grid>
      {/* <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Login Report'
          data={loginReport}
          avatar={LockOutlinedIcon}
        />
      </Grid> */}
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Role Report'
          data={roleReport}
          avatar={AssignmentIndIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Attendance Report'
          data={attendanceReport}
          avatar={SpellcheckIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Classwork Report'
          data={classworkReport}
          avatar={OndemandVideoIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Homework Report'
          data={homeworkReport}
          avatar={MenuBookIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          title='Referral Report'
          data={referralReport}
          avatar={MenuBookIcon}
        />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
