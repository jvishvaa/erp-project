/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  Button,
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import '../../../../master-management/master-management.css';
import useStyles from '../../useStyles';
import { getReportCardStatus, updateReportCardStatus } from '../../apis';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { isSuccess, getStatusLabel } from '../../report-card-utils';
import { reportStatusTableColumns as columns } from './report-card-constants';

const ReportStatusTable = ({ setLoading }) => {
  const classes = useStyles();
  const [updateFlag, setUpdateFlag] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const [mappingList, setMappingList] = useState();

  const handlePublish = async (id) => {
    setLoading(true);
    try {
      const payload = { id, status: 2 };
      const { status_code: status = 400, message = 'Error' } =
        await updateReportCardStatus(payload);
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
      if (isSuccesful) {
        setUpdateFlag((prev) => !prev);
      }
    } catch (err) {}
    setLoading(false);
  };

  const handleUnpublish = async (id) => {
    setLoading(true);
    try {
      const payload = { id, status: 1 };
      const { status_code: status = 400, message = 'Error' } =
        await updateReportCardStatus(payload);
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
      if (isSuccesful) {
        setUpdateFlag((prev) => !prev);
      }
    } catch (err) {}
    setLoading(false);
  };

  const renderButtons = (id, status) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            color='primary'
            style={{
              color: 'white',
              padding: '2px px',
              fontSize: '0.9rem',
              height: '100%',
              width: '100%',
            }}
            color='primary'
            variant='contained'
            disabled={status === '1'}
            onClick={() => history.push('/assessment-reports/?report-card=true')}
            title='View'
          >
            View
          </Button>
        </Grid>
        {status === '1' && (
          <Grid item xs={6}>
            <Button
              color='primary'
              style={{
                color: 'white',
                padding: '2px px',
                fontSize: '0.9rem',
                height: '100%',
                width: '100%',
                backgroundColor: '#228B22',
              }}
              variant='contained'
              onClick={() => handlePublish(id)}
              title='Publish'
            >
              Publish
            </Button>
          </Grid>
        )}
        {status === '2' && (
          <Grid item xs={6}>
            <Button
              style={{
                color: 'white',
                padding: '2px px',
                fontSize: '0.9rem',
                height: '100%',
                width: '100%',
                backgroundColor: '#FF2E2E',
              }}
              variant='contained'
              onClick={() => handleUnpublish(id)}
              title='Unpublish'
            >
              Unpublish
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };

  const fetchReportCardStatus = async () => {
    setLoading(true);
    try {
      const {
        result = [],
        message = 'Error',
        status_code: status = 400,
      } = await getReportCardStatus();
      setMappingList(result);
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchReportCardStatus();
  }, [updateFlag]);

  return (
    <Paper className={`${classes.root} common-table`}>
      <TableContainer className={classes.containerGenerated}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead className='table-header-row'>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column?.minWidth }}
                  className={classes.columnHeader}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingList?.map(
              (
                {
                  id,
                  status,
                  grade_details: gradeDetails = {},
                  branch_details: branchDetails = {},
                },
                index
              ) => {
                const { grade_name: gradeName } = gradeDetails;
                const { branch_name: branchName } = branchDetails;
                return (
                  <TableRow hover academicyear='checkbox' tabIndex={-1} key={index}>
                    <TableCell className={classes.tableCell}>{branchName}</TableCell>
                    <TableCell className={classes.tableCell}>{gradeName}</TableCell>
                    <TableCell className={classes.tableCell}>
                      {getStatusLabel(status)}
                    </TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}>
                      {renderButtons(id, status)}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReportStatusTable;
