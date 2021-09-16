import React, { useState, useEffect } from 'react';
import WebAsset from '@material-ui/icons/WebAsset';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { Grid } from '@material-ui/core';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import { reportTypeConstants, responseConverters } from '../dashboard-constants';
import { useDashboardContext } from '../dashboard-context';

const PrincipalDashboard = () => {
  const { branchIds = {}, getReport = () => {} } = useDashboardContext();
  const { attendanceResponse, classworkResponse, homeworkResponse, blogResponse } =
    responseConverters;
  const { attendance, classwork, homework, blog } = reportTypeConstants || {};

  const [reports, setReports] = useState({
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
    blogReport: [],
  });

  const getAttendanceReport = (params) => {
    getReport(attendance, params)
      .then(([response]) => {
        const attendanceReport = Object.entries(response).map(([key, value]) => ({
          detail: attendanceResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, attendanceReport }));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  const getClassworkReport = (params) => {
    getReport(classwork, params)
      .then(([response]) => {
        const classworkReport = Object.entries(response).map(([key, value]) => ({
          detail: classworkResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, classworkReport }));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  const getHomeworkReport = (params) => {
    getReport(homework, params)
      .then(([response]) => {
        const homeworkReport = Object.entries(response).map(([key, value]) => ({
          detail: homeworkResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, homeworkReport }));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  const getBlogReport = (params) => {
    getReport(blog, params)
      .then(([response]) => {
        const blogReport = Object.entries(response).map(([key, value]) => ({
          detail: blogResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, blogReport }));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (branchIds.length > 0) {
      getAttendanceReport(params);
      getClassworkReport(params);
      getHomeworkReport(params);
      getBlogReport(params);
    }
  }, [branchIds]);

  const {
    attendanceReport = [],
    classworkReport = [],
    homeworkReport = [],
    blogReport = [],
  } = reports || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <DashFilterWidget />
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
        <ReportStatsWidget title='Blog Report' data={blogReport} avatar={WebAsset} />
      </Grid>
    </Grid>
  );
};

export default PrincipalDashboard;
