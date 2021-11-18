import React, { useEffect } from 'react';
import WebAsset from '@material-ui/icons/WebAsset';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import ForumIcon from '@material-ui/icons/Forum';
import { Grid } from '@material-ui/core';
import { DashFilterWidget, ReportStatsWidget } from '../widgets';
import { reportTypeConstants, responseConverters } from '../dashboard-constants';
import { useDashboardContext } from '../dashboard-context';
import { Catalog } from 'pdfjs-dist/build/pdf.worker';
import { stringify } from 'qs';
import StudentRightDashboard from './../StudentDashboard/StudentRightDashboard/StudentRightDashboard';

const PrincipalDashboard = () => {
  const {
    branchIds = {},
    getReport = () => { },
    reports,
    setReports,
    card,
  } = useDashboardContext();

  const {
    attendanceResponse,
    classworkResponse,
    homeworkResponse,
    blogResponse,
    discussionResponse,
  } = responseConverters;

  const { attendance, classwork, homework, blog, discussion } = reportTypeConstants || {};

  const dashboardData = {
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
    blogReport: [],
    discussionReport: [],
  };

  const getAttendanceReport = (params) => {
    getReport(attendance, params)
      .then(([response]) => {
        const attendanceReport = Object.entries(response).map(([key, value]) => ({
          detail: attendanceResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, attendanceReport }));
        dashboardData.attendanceReport = attendanceReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
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
        dashboardData.classworkReport = classworkReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
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
        dashboardData.homeworkReport = homeworkReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
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
        dashboardData.blogReport = blogReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  const getDiscussionReport = (params) => {
    getReport(discussion, params)
      .then(([response]) => {
        const discussionReport = Object.entries(response).map(([key, value]) => ({
          detail: discussionResponse[key],
          info: value,
        }));
        setReports((prev) => ({ ...prev, discussionReport }));
        dashboardData.discussionReport = discussionReport;
        sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      })
      .catch((error) => {
        console.log('error', error?.response?.data?.description);
      });
  };

  const getAllReports = (params) => {
    getAttendanceReport(params);
    getClassworkReport(params);
    getHomeworkReport(params);
    getBlogReport(params);
    getDiscussionReport(params);

    if (reports.refreshAll) {
      setReports((prev) => ({ ...prev, refreshAll: false }));
    }
  };

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
        case 'blog':
          return getBlogReport(params);
        case 'discussion':
          return getDiscussionReport(params);
      }
    }
  }, [card]);

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    let data = sessionStorage.getItem('dashboardData');
    if (branchIds.length > 0) {
      if (data) {
        setReports(JSON.parse(data));
      } else {
        getAllReports(params);
      }
    }
  }, [branchIds]);

  useEffect(() => {
    const params = { branch_ids: branchIds.join(',') };
    if (reports.refreshAll) getAllReports(params);
  }, [reports.refreshAll]);

  const {
    attendanceReport = [],
    classworkReport = [],
    homeworkReport = [],
    blogReport = [],
    discussionReport = [],
  } = reports || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8} md={8} spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DashFilterWidget />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReportStatsWidget
              title='Attendance Report'
              data={attendanceReport}
              avatar={SpellcheckIcon}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReportStatsWidget
              title='Classwork Report'
              data={classworkReport}
              avatar={OndemandVideoIcon}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReportStatsWidget
              title='Homework Report'
              data={homeworkReport}
              avatar={MenuBookIcon}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReportStatsWidget title='Blog Report' data={blogReport} avatar={WebAsset} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReportStatsWidget
              title='Discussion Forum Report'
              data={discussionReport}
              avatar={ForumIcon}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={0} md={4}>
        <Grid container>
          <Grid item>
            <StudentRightDashboard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PrincipalDashboard;
