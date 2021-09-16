import React, { useState, useEffect } from 'react';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { Grid } from '@material-ui/core';
import { getReport, reportTypeConstants } from '../apis';

const AdminDashboard = ({ branchIds, setBranchIds }) => {
  const { attendance, classwork, homework } = reportTypeConstants || {};
  const [reports, setReports] = useState({
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
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

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (branchIds.length > 0) {
      getAttendanceReport(params);
      getClassworkReport(params);
      getHomeworkReport(params);
    }
  }, [branchIds]);

  const {
    attendanceReport = [],
    classworkReport = [],
    homeworkReport = [],
  } = reports || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <DashFilterWidget setBranchIds={setBranchIds} />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          branchIds={branchIds}
          title='Attendance Report'
          data={attendanceReport}
          avatar={SpellcheckIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          branchIds={branchIds}
          title='Classwork Report'
          data={classworkReport}
          avatar={OndemandVideoIcon}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportStatsWidget
          branchIds={branchIds}
          title='Homework Report'
          data={homeworkReport}
          avatar={MenuBookIcon}
        />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
