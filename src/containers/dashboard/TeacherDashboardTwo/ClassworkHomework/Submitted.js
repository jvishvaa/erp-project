import React, { useEffect, useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalSubmitted from './ModalSubmitted';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Submitted({ section, subject, date }) {
  const [tableData, setTableData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [tableIndex, setIndex] = useState(null);
  const classes = useStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [open, setOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [popup, setPopup] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = (data) => {
    setOpen(true);
    setPopup(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCl = () => {
    setOn(false);
  };
  const pendingList = () => {
    axios
      .get(
        `${endpoints.teacherDashboard.submittedHWdata}?section_mapping=${section}&subject=${subject}`,
        {
          headers: {
            // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setTableData(result?.data?.result?.result);
        setIndex(result?.data?.result?.total_students);
        // if (result?.data?.status_code === 200) {
        //   setStudentData(result);
        // } else {
        //   setAlert('error', result?.data?.message);
        // }
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };
  const fileList = () => {
    axios
      .get(
        // https://dev.reports.letseduvate.com/api/acad_performance/v1/teacher-dashboard/submitted-cw-files/?section_mapping=2&subject=9&date=2022-02-01&erp=2101430143_OLV
        `${endpoints.teacherDashboard.fileHwData}?section_mapping=2&subject=9&date=2022-02-01&erp=2101430143_OLV`,
        {
          headers: {
            'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setFileData(result?.data?.result);

        // if (result?.data?.status_code === 200) {
        //   setStudentData(result);
        // } else {
        //   setAlert('error', result?.data?.message);
        // }
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    pendingList();
  }, [section, subject]);

  // useEffect(() => {
  //   fileList();
  // }, [on]);
  const handleClickOn = () => {
    setOn(true);
    fileList();
  };

  useEffect(() => {
    console.log('a');
  }, [open]);
  let inputRef = useRef(null);
  const [Ind, setInd] = useState(0);
  let inputImage = (ing) => {
    inputRef.current.src = ing;
  };
  return (
    <>
      <Grid container>
        <Typography style={{ fontSize: '10px', fontWeight: '700' }}>
          {tableIndex} studens (submitted)
        </Typography>
      </Grid>
      <Grid
        container
        xs={12}
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ border: '1px solid #E8E8E8', paddingRight: '20px', paddingLeft: '20px' }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            {tableData?.map((data, index) => {
              return (
                <TableBody>
                  <TableRow
                    // key=bonnie
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    // onClick={assessmentHandler}
                  >
                    <TableCell style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Avatar
                        style={{ height: '40px', paddingRight: '' }}
                        aria-label='recipe'
                      >
                        3
                      </Avatar>
                      <Grid item style={{ marginLeft: '10px' }}>
                        <Typography style={{ fontSize: '12px' }}>{data.name}</Typography>
                        <Typography style={{ fontSize: '12px' }}>{data.erp}</Typography>
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ color: '#061B2E', paddingRight: '50px', height: '22px ' }}
                    >
                      <Grid
                        item
                        style={{
                          border: '1px solid #FFC4C4',
                          borderRadius: '5px',
                          color: '#E33535',
                          padding: '2px 10px',
                          width: 'maxContent',
                        }}
                      >
                        <Typography onClick={() => handleOpen(index)}>
                          <span
                            style={{
                              fontSize: '12px',
                              paddingRight: '8px',
                              fontWeight: '800',
                              borderRadius: '57%',
                              backgroundColor: '#FFC4C4',
                              padding: '5px 8px',
                              marginRight: '15px',
                              width: 'maxContent',
                            }}
                          >
                            {data.not_submitted_count}
                          </span>
                          <span style={{ fontSize: '12px' }}>
                            Pending {data.not_submitted_count} more Tests
                          </span>
                        </Typography>
                      </Grid>
                    </TableCell>
                    <TableCell style={{ paddingRight: '15rem' }}></TableCell>
                    <TableCell align='right' style={{ color: '#061B2E', height: '22px' }}>
                      <Grid container direction='row' alignItems='center'>
                        <Typography
                          style={{
                            fontSize: '10px',
                            paddingRight: '40px',
                            paddingLeft: '10px',
                            width: 'maxContent',
                          }}
                        >
                          2 days ago
                        </Typography>
                      </Grid>
                    </TableCell>
                    <TableCell align='right' style={{ color: '#061B2E', height: '22px' }}>
                      <Grid container direction='row' alignItems='center'>
                        <Typography
                          onClick={handleClickOn}
                          style={{
                            fontSize: '12px',
                            paddingRight: '40px',
                            paddingLeft: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <PictureAsPdfIcon style={{ marginRight: 10 }} />
                          Files
                        </Typography>
                        {/* <Dialog
                          open={on}
                          onClose={handleCl}
                          aria-labelledby='alert-dialog-title'
                          aria-describedby='alert-dialog-description'
                        >
                          {fileData.map((data, index) => {
                            console.log('Files', data[index]);
                            console.log('Files1', data);
                            console.log('K', `${endpoints.lessonPlan.s3erp}`);

                            return (
                              <>
                                <img
                                  src={`${endpoints.lessonPlan.s3erp}${data}`}
                                  alt='random image'
                                ></img>
                              </>
                            );
                          })} */}

                        {/* <DialogActions>
                            <Button onClick={handleCl} color='primary' autoFocus>
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog> */}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>
      </Grid>
      <Dialog
        open={on}
        onClose={handleCl}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='fitContent'
      >
        <div
          style={{
            height: '100%',
            width: '80rem',
            margin: 'auto',
            display: 'flex',
          }}
        >
          <div
            style={{
              backgroundColor: 'grey',
              height: '400px',
              width: '20%',
            }}
          >
            <div>
              <p style={{ color: 'white' }}>Click to View</p>
            </div>
            {fileData.map((file, index) => {
              const filename = file.split('/')[6];
              return (
                <div>
                  <Card
                    style={{ display: 'flex' }}
                    onClick={() => inputImage(`${endpoints.lessonPlan.s3erp}${file}`)}
                  >
                    <FileCopyIcon />
                    <p>{filename}</p>
                  </Card>
                </div>
              );
              // <div><Card style={{ display: 'flex' }} onClick={setInd(index)}><FileCopyIcon /><p>{file.title}</p></Card></div>)
            })}
          </div>
          <div
            style={{
              backgroundColor: 'grey',
              height: '400px',
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src='' ref={inputRef}></img>
          </div>
        </div>
      </Dialog>
      {open && (
        <ModalSubmitted
          index1={tableIndex}
          row={tableData[popup]}
          open={open}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

export default Submitted;
