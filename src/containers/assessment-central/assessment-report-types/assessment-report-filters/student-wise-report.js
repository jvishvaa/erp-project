import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { connect, useSelector } from 'react-redux';

import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { generateQueryParamSting } from 'utility-functions';
import APIREQUEST from 'config/apiRequest';
import apiRequest from 'containers/dashboard/StudentDashboard/config/apiRequest';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: 440,
  },
  cardsPagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
    color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  downloadExcel: {
    float: 'right',
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 400,
    textDecoration: 'none',
    backgroundColor: '#fe6b6b',
    color: '#ffffff',
  },
}));

const StudentWiseReport = ({ setisstudentList, setIsPreview, filterData, setReportCardDataNew }) => {
  const [studentList, setStudentList] = useState([]);
  const classes = useStyles();
  const [loading, setIsLoading] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    getERP();
  }, []);

  const getERP = () => {
    setIsLoading(true);
    // const {
    //   personal_info: { role = '' },
    // } = userDetails || {};
    let params = `?branch=${filterData?.branch?.branch?.id}&session_year=${selectedAcademicYear?.id}&grade=${filterData.grade?.grade_id}&section=${filterData.section?.section_id}`;
    // if (role) params += `&role=${role}`;
    axiosInstance
      .get(`${endpoints.communication.studentUserList}${params}`)
      .then((result) => {
        debugger;
        if (result.data.status_code === 200) {
          setStudentList(result.data?.data?.results);
        }
        setIsLoading(null);
      })
      .catch((error) => {
        setIsLoading(null);
      });
  };

  const handleNewPreview = (erpId) => {
    let paramObj = {
      acad_session_id: filterData.branch?.id,
      erp_id: erpId,
      grade_id: filterData.grade?.grade_id,
      section_id: filterData.section?.section_id,
    };
    setisstudentList(false)
    const isPreview = Object.values(paramObj).every(Boolean);
    if (!isPreview) {
      for (const [key, value] of Object.entries(paramObj).reverse()) {
        if (key === 'acad_session_id' && !Boolean(value))
          setAlert('error', `Please select Branch`);
        else if (!Boolean(value)) setAlert('error', `Please select ${key}.`);
      }
      return;
    } else {
        setIsLoading(true);
      let params = `?${generateQueryParamSting({ ...paramObj })}`;
      fetchNewReportCardData(params);
    }
  };

  const fetchNewReportCardData = (params) => {
    setIsLoading(true);
    apiRequest(
      'get',
      `${endpoints.assessmentReportTypes.reportCardDataNew}${params}`,
      null,
      null,
      false,
      10000
    )
      .then((result) => {
        if (result) {
          console.log(result);
          setReportCardDataNew(result?.data?.result);
          setIsPreview(true);
        //   setPreviewButton(true);
          setIsLoading(false);
        }
        setIsLoading(false);
      })

      .catch((error) => {
        setAlert('error', 'Error While Fetching Report Card');
        setIsLoading(false);
      });
  };

  return (
    <Paper className={`${classes.root} common-table`}>
      {loading && <Loader />}
      <TableContainer
        className={`table table-shadow view_users_table ${classes.container}`}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead className={`${classes.columnHeader} table-header-row`}>
            <TableRow>
              <TableCell className={classes.tableCell}>Student Name</TableCell>
              <TableCell className={classes.tableCell}>ERP Id</TableCell>
              <TableCell className={classes.tableCell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentList?.map((items, i) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={`user_table_index${i}`}>
                <TableCell className={classes.tableCell}>
                  {`${items?.user?.first_name} ${items?.user?.last_name}`}
                </TableCell>
                <TableCell className={classes.tableCell}>{items.erp_id}</TableCell>
                <TableCell className={classes.tableCell}>
                  <Button variant='contained' color='primary' style={{margin:'0 10%'}}>
                    Remark
                  </Button>
                  <Button variant='contained' color='primary' onClick={() => handleNewPreview(items.erp_id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <TablePagination
              component='div'
              count={totalCount}
              rowsPerPage={limit}
              page={Number(currentPage) - 1}
              onChangePage={(e, page) => {
                handlePagination(e, page + 1);
              }}
              rowsPerPageOptions={false}
              className='table-pagination'
              classes={{
                spacer: classes.tablePaginationSpacer,
                toolbar: classes.tablePaginationToolbar,
              }}
            /> */}
    </Paper>
  );
};

export default StudentWiseReport;
