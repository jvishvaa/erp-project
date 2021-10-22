/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useContext, useEffect } from 'react';
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  // Modal,
  // Fade,
  // Backdrop,
  IconButton,
  // TextField,
  TableFooter,
  TablePagination,
  MenuItem,
  Select,
} from '@material-ui/core';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';
import PropTypes from 'prop-types';
import styles from './dashboard.style';
import Layout from 'containers/Layout';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';

const TeacherReport = ({ classes }) => {
  const [moduleId, setModuleId] = useState('');
  const [reportData, setReportData] = useState();
  const [branchId, setBranchId] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || [];
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const roleId = userDetails.role_details.role_id;
  const userId = udaanDetails.academic_profile.user.id;
  const moduleData = udaanDetails.role_permission.modules;
  console.log(moduleData, 'module');

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Reports') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(
          endpoints.sureLearning.getDetailedVisualReport +
            `?user=${userId}&role=${roleId}&course_type=1`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res.data, 'reportdata');
          setReportData(res.data);
          setAlert('success', 'report get successfully');
        })
        .catch((error) => {
          console.log('reportdata', error);
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

  const thirdTableData = () => {
    let thirdTable = null;
    thirdTable = (
      <>
        <Paper className={classes.paper} style={{ marginTop: '5%' }}>
          <Typography variant='div'>Name:</Typography>
          <Typography variant='div'>{reportData ? reportData.name : ''}</Typography>
          <div />
          <Typography variant='div'>ERP:</Typography>
          <Typography variant='div'>{reportData ? reportData.erp : ''}</Typography>
          {reportData &&
            reportData.result &&
            reportData.result.length !== 0 &&
            reportData.result.map((obj, i) => (
              <Table
                key={i}
                className={classes.table}
                size='small'
                aria-label='spanning table'
                style={{ border: '1.5px solid' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: 'bold', border: '1.5px solid' }}
                      colSpan={
                        obj.chapters.length !== 0 && obj.chapters.length !== 1
                          ? obj.chapters.length
                          : Object.values(
                              obj.chapters && obj.chapters.length !== 0 && obj.chapters[0]
                            ) &&
                            Object.values(
                              obj.chapters && obj.chapters.length !== 0 && obj.chapters[0]
                            ).length !== 0 &&
                            Object.values(
                              obj.chapters && obj.chapters.length !== 0 && obj.chapters[0]
                            )[0].length
                      }
                    >
                      {obj.name}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {obj.chapters.map((chapter) => (
                      <>
                        {Object.values(chapter)[0].map((res) => (
                          <>
                            {Object.entries(res).map(([key, value]) => {
                              if (key.toString().startsWith('title')) {
                                return (
                                  <TableCell>{`${Object.values(chapter)[1]}`}</TableCell>
                                );
                              }
                              return null;
                            })}
                          </>
                        ))}
                      </>
                    ))}
                  </TableRow>
                  <TableRow>
                    {obj.chapters.map((chapter) => (
                      <>
                        {Object.values(chapter)[0].map((res) => (
                          <>
                            {Object.entries(res).map(([key, value]) => {
                              if (key.toString().startsWith('title')) {
                                return (
                                  <TableCell>
                                    {value !== ''
                                      ? `${value}`
                                      : `Quiz ${parseInt(key.split('title')[1], 10) + 1}`}
                                  </TableCell>
                                );
                              }
                              return null;
                            })}
                          </>
                        ))}
                      </>
                    ))}
                  </TableRow>
                  <TableRow>
                    {obj.chapters.map((chapter) => (
                      <>
                        {Object.values(chapter)[0].map((res) => (
                          <>
                            {Object.entries(res).map(([key, value]) => {
                              if (key.toString().startsWith('quiz')) {
                                return <TableCell>{value}</TableCell>;
                              }
                              return null;
                            })}
                          </>
                        ))}
                      </>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            ))}
        </Paper>
      </>
    );
    return thirdTable;
  };

  return (
    <Layout>
      <div style={{ padding: '2%' }}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Teacher Report'
          isAcademicYearVisible={true}
        />

        {thirdTableData()}
      </div>
    </Layout>
  );
};

TeacherReport.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(TeacherReport);
