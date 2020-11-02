import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Button,
  Typography,
  Chip,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@material-ui/core';
import './attendee-list.scss';
import { Pagination } from '@material-ui/lab';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';

const AttendeeList = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const pageSize = 10;

  const { setAlert } = useContext(AlertNotificationContext);

  const getAttendeeList = async () => {
    const { match } = props;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.attendeeList}?page_number=${currentPage}&page_size=${pageSize}&zoom_meeting_id=${match.params.id}&type=json`
      );
      setTotalPages(data.total_pages);
      setAttendeeList(data.data);
      setTotalAttended(data.attended_count);
      setTotalAbsent(data.notattended_count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert('error', 'Failed to load attendee list');
    }
  };

  useEffect(() => {
    getAttendeeList();
  }, [currentPage]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleChange = (event, checked) => {
    setIsEdit(checked);
  };

  const handleCheck = async (index, checked, student) => {
    setIsUpdating(true);
    const { match } = props;
    try {
      const data = {
        online_class_id: match.params.id,
        student_id: student.user.id,
        is_attended: checked,
      };
      await axiosInstance.put('/erp_user/mark_attendance/', data);
      const stateCopy = attendeeList;
      const copy = stateCopy.map((el, ind) => {
        if (ind === index) {
          return { ...el, is_attended: checked };
        }
        return el;
      });
      setAttendeeList(copy);
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      setAlert('error', 'Failed to mark attendance');
    }
  };

  const handleExcelDownload = async () => {
    const { match } = props;
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.attendeeList}?zoom_meeting_id=${match.params.id}&type=excel`
      );
      debugger;
    } catch (error) {
      setAlert('error', 'Failed to load attendee list');
    }
  };

  return (
    <Layout>
      <Card style={{ marginBottom: 30, padding: 30 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Button onClick={handleExcelDownload}>Download Excel</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEdit}
                  onChange={handleChange}
                  name='Edit attendance'
                />
              }
              label={<Typography variant='h6'>Edit attendance</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'green' }}>
              Attended count
              <Chip
                label={<Typography variant='h6'>{totalAttended}</Typography>}
                style={{ marginLeft: 10 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' style={{ color: 'red' }}>
              Absent count
              <Chip
                label={<Typography variant='h6'>{totalAbsent}</Typography>}
                style={{ marginLeft: 10 }}
              />
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <div className='attendee__management-table'>
        <TableContainer>
          <Table className='viewclass__table' aria-label='simple table'>
            <TableHead className='styled__table-head'>
              <TableRow>
                <TableCell align='center'>SL_NO.</TableCell>
                <TableCell align='center'>Student name</TableCell>
                <TableCell align='center'>Erp</TableCell>
                <TableCell align='center'>Acceptance status</TableCell>
                <TableCell align='center'>Attended status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='styled__table-body'>
              {attendeeList.map((el, index) => {
                return (
                  <TableRow key={el.id}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{el.user.user.first_name}</TableCell>
                    <TableCell align='center'>{el.user.erp_id}</TableCell>
                    <TableCell align='center'>
                      {el.is_accepted ? 'Accepted' : 'Not accepted'}
                    </TableCell>
                    <TableCell align='center'>
                      {isEdit ? (
                        <Switch
                          disabled={isUpdating}
                          checked={el.is_attended}
                          onChange={(event, checked) => {
                            handleCheck(index, checked, el);
                          }}
                          name='checked'
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      ) : el.is_attended ? (
                        'Attended'
                      ) : (
                        'Not attended'
                      )}
                      {}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid
          className='pagination__container'
          container
          direction='column'
          alignItems='center'
          justify='center'
        >
          <Grid item xs={12}>
            <Pagination
              onChange={handlePagination}
              style={{ marginTop: 25 }}
              count={totalPages}
              color='primary'
              page={currentPage}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default AttendeeList;
