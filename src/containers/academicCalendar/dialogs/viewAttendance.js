import axiosInstance from '../../../config/axios';
import React, { useEffect, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VideocamIcon from '@material-ui/icons/Videocam';
import AppBar from '@material-ui/core/AppBar';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import apiRequest from '../../../config/apiRequest';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileSaver from 'file-saver';
import { AlertNotificationContext } from '../../../../src/context-api/alert-context/alert-state';
import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableContainer,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import Pagination from 'components/PaginationComponent';
import endpoints from 'config/endpoints';
import CloseIcon from '@material-ui/icons/Close';
import Loader from '../../../components/loader/loader';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#EEEEEE',
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      padding: '5px !important',
      backgroundColor: '#E7EFF6',
    },
    '&:nth-of-type(even)': {
      padding: '5px !important',
      backgroundColor: '#E6E6E6',
    },
  },
  table: {
    minWidth: 1120,
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
}));

const ViewAttendence = withRouter(({ history, ...props }) => {
  const { periodId, online_class_id, date, grade, section, periodName, is_att_confirm} =
    props?.location?.state;
  const classes = useStyles();
  const [attConfirmData,setAttConfirmData] = useState(is_att_confirm)
  const [checkedPresent, setCheckedPresent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [studentData, setStudentData] = useState({});
  const limit = 15;
  const [totalGenre, setTotalGenre] = useState(0);
  const [count, setCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const { setAlert } = useContext(AlertNotificationContext);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [enablehandler, setEnablehandler] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmSubmit = () => {
    confirmAttendance();
    setOpen(false);
  };

  const studentList = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.period.getAttendance.replace(
          '<period-id>',
          periodId
        )}?page=${pageNumber}&page_size=${limit}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setStudentData(result);
          setTotalGenre(result?.data?.result?.count);
          setCount(result?.data?.result?.count);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const studentListUpdate = (e, id, status) => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.period.updateAttendance.replace('<period-id>', periodId)}`, {
        erp_id: id,
        is_present: status,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setCheckedPresent(!checkedPresent);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const confirmAttendance = () => {
    setLoading(true);
    const confirmData = { is_attendance_confirmed: true };
    axiosInstance
      .put(
        `${endpoints.period.confirmAttendance}${periodId}/confirm-attendance/?is_attendance_confirm=True`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setCheckedPresent(!checkedPresent);
          attendanceConfirm();
          setAttConfirmData(!attConfirmData)
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };
  const attendanceConfirm = () => {
    console.log('aaa2', periodId);
    axiosInstance
      .get(`/period/teacher_retrieve_period_details/?period_id=${periodId}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setEnablehandler(res?.data?.result?.is_attendance_confirm);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    attendanceConfirm();
  }, [enablehandler]);
  useEffect(() => {
    studentList();
  }, [history, checkedPresent, pageNumber]);

  const handleExcel = () => {
    setLoading(true);
    apiRequest(
      'get',
      `/oncls/v1/oncls-attendeelist/?online_class_id=${online_class_id}&class_date=${date}&type=excel&page_number=${pageNumber}&page_size=${limit}`,
      null,
      'arraybuffer'
    )
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'user_list.xls');
        setLoading(false);
      })
      .catch((error) => setAlert('error', 'Something Wrong!'));
  };

  const handleback = () => {
    history.goBack();
  };
  const handleEdit = () => {
    setDisabled(!disabled);
  };

  const { data } = studentData;
  return (
    <Layout>
      {loading && <Loader />}
      <div
        style={{
          display: 'flex',
          padding: 20,
          justifyContent: 'space-between',
          alignItems: window.innerWidth < 500 ? 'left' : 'center',
          flexDirection: window.innerWidth < 500 ? 'column' : 'row',
          marginTop: '-30px',
        }}
      >
        <div style={{ marginTop: '20px' }}>
          <span style={{ fontSize: '20px' }}>
            <b>Attendance</b>
          </span>
          <br />
          <span>
            <b>
              {grade} {section} - {periodName}
            </b>
          </span>
        </div>
        <div onClick={handleExcel} style={{ marginTop: '20px', cursor: 'pointer' }}>
          <VideocamIcon />
          <br />
          <span>Verify</span>
        </div>
        { attConfirmData ? '' : <div
          style={{
            marginTop: '30px',
            cursor: 'pointer',
          }}
        >
          <b onClick={handleEdit}>
            Edit
            <span style={{ visibility: disabled ? 'visible' : 'hidden' }}> Enabled</span>
          </b>
        </div> }
        <div
          onClick={handleEdit}
          style={{ marginTop: '20px', visibility: disabled ? 'visible' : 'hidden' }}
        >
          <Button variant='contained' color='primary' onClick={handleClickOpen}>
            Confirm
          </Button>
        </div>
        <CloseIcon onClick={handleback} style={{ cursor: 'pointer' }} />
      </div>
      <Grid container xs={12} sm={12} md={12} style={{ padding: '0px 20px' }}>
        <AppBar position='static'></AppBar>
        <Grid item={12} xs={12} sm={12} md={12} spacing={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='customized table'>
              <TableHead style={{ backgroundColor: 'white' }}>
                <TableRow>
                  <StyledTableCell
                    align='left'
                    style={{ display: 'flex', justifyContent: 'start' }}
                  >
                    Student
                  </StyledTableCell>
                  <StyledTableCell align='right'>Present</StyledTableCell>
                  <StyledTableCell align='right'>Absent</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.result?.results?.map((row, index) => (
                  <>
                    <div style={{ margin: 5, background: 'red' }}></div>
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component='th' scope='row'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            textAlign: 'left',
                          }}
                        >
                          <AccountCircleIcon
                            style={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              marginRight: '10px',
                            }}
                          />
                          {row?.name}
                          <br />
                          {`Erp ID: ${row?.erp_id}`}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {row?.participant?.is_present ? (
                          <Checkbox
                            checked={row?.participant?.is_present}
                            iconStyle={{ fill: 'red' }}
                            onChange={(e) =>
                              studentListUpdate(e, row.id, !row?.participant?.is_present)
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={!disabled}
                          />
                        ) : disabled ? (
                          <Checkbox
                            checked={row?.participant?.is_present}
                            iconStyle={{ fill: 'red' }}
                            onChange={(e) =>
                              studentListUpdate(e, row.id, !row?.participant?.is_present)
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={!disabled}
                          />
                        ) : (
                          ''
                        )}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {!row?.participant?.is_present ? (
                          <Checkbox
                            checked={!row?.participant?.is_present}
                            onChange={(e) =>
                              studentListUpdate(e, row.id, !row?.participant?.is_present)
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={!disabled}
                          />
                        ) : disabled ? (
                          <Checkbox
                            checked={!row?.participant?.is_present}
                            onChange={(e) =>
                              studentListUpdate(e, row.id, !row?.participant?.is_present)
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={!disabled}
                          />
                        ) : (
                          ''
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container justify='center'>
            <Pagination
              totalPages={Math.ceil(totalGenre / limit)}
              currentPage={pageNumber}
              setCurrentPage={setPageNumber}
            />
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to lock the attendanc for period {periodId} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' variant='contained'>
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color='primary' variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
});
export default ViewAttendence;
