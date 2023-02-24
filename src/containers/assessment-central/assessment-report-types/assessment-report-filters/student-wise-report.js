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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextareaAutosize,
} from '@material-ui/core';
import { connect, useSelector } from 'react-redux';

import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { generateQueryParamSting } from 'utility-functions';
import apiRequest from 'containers/dashboard/StudentDashboard/config/apiRequest';
import Modal from '@material-ui/core/Modal';
import NoFilterData from 'components/noFilteredData/noFilterData';
import EypReportCard from 'containers/assessment-central/assesment-report-card/eypReportCard';

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

const StudentWiseReport = ({
  setisstudentList,
  isstudentList,
  setIsPreview,
  filterData,
  setReportCardDataNew,
  setIsFilter,
  isFilter,
  eypConfig,
}) => {
  const [studentList, setStudentList] = useState([]);
  const classes = useStyles();
  const [loading, setIsLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [openModal, setOpenModal] = useState(false);
  const [studentId, setStudentId] = useState();
  const [teacherRemark, setTeacherRemark] = useState('');
  const { user_id: teacher_id } = JSON.parse(localStorage.getItem('userDetails'));
  const [isEditRemark, setIsEditRemark] = useState(false);
  const [editId, setEditId] = useState();

  useEffect(() => {
    if (isFilter || isstudentList) getERP();
  }, [isFilter, isstudentList]);

  useEffect(() => {
    setStudentList([]);
  }, [filterData]);

  const getERP = () => {
    setIsLoading(true);
    setIsFilter(false);
    // const {
    //   personal_info: { role = '' },
    // } = userDetails || {};
    let params = `?branch=${filterData?.branch?.branch?.id}&session_year=${selectedAcademicYear?.id}&grade=${filterData.grade?.grade_id}&section=${filterData.section?.section_id}`;
    // if (role) params += `&role=${role}`;
    axiosInstance
      .get(`${endpoints.communication.studentUserList}${params}`)
      .then((result) => {
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
          setisstudentList(false);
          console.log(result);
          setReportCardDataNew(result?.data?.result);
          setIsPreview(true);
          //   setPreviewButton(true);
          setIsLoading(false);
        }
        setIsLoading(false);
        setisstudentList(false);
      })

      .catch((error) => {
        setAlert(
          'error',
          error.response.data.message || 'Error while fetching Report card'
        );
        setIsLoading(false);
        setisstudentList(false);
      });
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleRemark = (id) => {
    setOpenModal(true);
    setStudentId(id);
    setIsLoading(true);
    let remarks = '';
    axiosInstance
      .get(
        `assessment/teacher-remarks/?teacher=${teacher_id}&student=${id}&acad_session=${filterData?.branch?.id}&grade=${filterData?.grade?.grade_id}`
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.data?.status_code === 200) {
          if (res?.data?.result?.length > 0) {
            setTeacherRemark(res?.data?.result[0].remarks);
            setIsEditRemark(true);
            setEditId(res?.data?.result[0].id);
          } else {
            setTeacherRemark('');
            setIsEditRemark(false);
          }
        } else {
          return setAlert('error', 'Something went wrong , fetching Remark Failed !');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setAlert(
          'error',
          error?.response?.data?.message ||
            error?.response?.data?.msg ||
            'fetching Remark Failed !'
        );
      });
  };

  const handleRemarkSubmit = () => {
    setIsLoading(true);
    let params = {
      student: studentId,
      teacher: teacher_id,
      remarks: teacherRemark,
      acad_session: filterData?.branch?.id,
      grade: filterData?.grade?.grade_id,
    };
    if (isEditRemark) {
      axiosInstance
        .put(`assessment/teacher-remarks/${editId}/`, params)
        .then((res) => {
          setIsLoading(false);
          if (res?.data?.status_code !== 200) {
            setAlert('error', res?.data?.message || 'Remarks Submittion Failed !');
          } else {
            handleClose();
            setAlert('success', res?.data?.message || 'Remarks Submitted Successfully !');
            setIsEditRemark(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setAlert(
            'error',
            error?.response?.data?.message ||
              error?.response?.data?.msg ||
              'Submiting Remarks Failed !'
          );
        });
    } else {
      axiosInstance
        .post(`assessment/teacher-remarks/`, params)
        .then((res) => {
          setIsLoading(false);
          if (res?.data?.status_code !== 200) {
            setAlert('error', res?.data?.message || 'Remarks Submittion Failed !');
          } else {
            handleClose();
            setAlert('success', res?.data?.message || 'Remarks Submitted Successfully !');
            setIsEditRemark(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setAlert(
            'error',
            error.response.data.message ||
              error.response.data.msg ||
              'Submiting Remarks Failed !'
          );
        });
    }
  };

  return (
    <Paper className={`${classes.root} common-table`}>
      {/* {loading && <Loader />} */}
      {loading ? <Loader /> : null}
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
                  {eypConfig.includes(String(filterData.grade?.grade_id)) ? null : (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleRemark(items?.user?.id)}
                      style={{ margin: '0 10%' }}
                    >
                      Remark
                    </Button>
                  )}
                  {eypConfig.includes(String(filterData.grade?.grade_id)) ? (
                    <EypReportCard
                      erpId={items.erp_id}
                      gradeId={filterData.grade?.grade_id}
                      acadSessionId={filterData?.branch?.id}
                      branchName={filterData?.branch?.branch?.branch_name}
                    />
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleNewPreview(items.erp_id)}
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openModal && (
        <Dialog open={openModal} fullWidth onClose={handleClose}>
          <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>
            Remarks
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
            {/* <TextField
            autoFocus
            margin="dense"
            id="remark"
            label="Remarks"
            type="text"
            fullWidth
            variant="outlined"
          /> */}
            <textarea
              id='standard-multiline-flexible'
              rowsMax={4}
              aria-label='minimum height'
              type='text'
              placeholder='Teacher Remarks'
              style={{ width: '100%', height: '100px' }}
              value={teacherRemark}
              onChange={(e) => setTeacherRemark(e?.target?.value)}
              maxLength='400'
              InputProps={{ inputProps: { min: 0, maxLength: 400 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='primary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleRemarkSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {studentList.length === 0 && <NoFilterData data='No Data Found' />}

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
