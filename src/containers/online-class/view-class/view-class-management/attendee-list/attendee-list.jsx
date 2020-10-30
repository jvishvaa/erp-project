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
} from '@material-ui/core';
import './attendee-list.scss';
import { Pagination } from '@material-ui/lab';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import Layout from '../../../../layout';

const AttendeeList = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  const { setAlert } = useContext(AlertNotificationContext);

  const getAttendeeList = async () => {
    const { match } = props;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.attendeeList}?page_number=${currentPage}&page_size=${pageSize}&zoom_meeting_id=${match.params.id}`
      );
      setTotalPages(data.total_pages);
      setAttendeeList(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert('Failed to load attendee list');
    }
  };

  useEffect(() => {
    getAttendeeList();
  }, [currentPage]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className='attendee__management-table'>
        <TableContainer>
          <Table className='viewclass__table' aria-label='simple table'>
            <TableHead className='styled__table-head'>
              <TableRow>
                <TableCell align='center'>SL_NO.</TableCell>
                <TableCell align='center'>Student name</TableCell>
                <TableCell align='center'>Erp</TableCell>
                <TableCell align='center'>Attended status</TableCell>
                <TableCell align='center'>Acceptance status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='styled__table-body'>
              {attendeeList.map((el, index) => {
                return (
                  <TableRow key={el.id}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{el.user.user.name}</TableCell>
                    <TableCell align='center'>{el.user.erp_id}</TableCell>
                    <TableCell align='center'>
                      {el.is_accepted ? 'Accepted' : 'Not accepted'}
                    </TableCell>
                    <TableCell align='center'>
                      {el.is_attended ? 'Attended' : 'Not attended'}
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
