import React, { useEffect, useState, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { useParams, withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import orchids1 from '../../../assets/images/orchids.png';
import orchids2 from '../../../assets/images/orchids.png';

import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableContainer,
  SvgIcon,
  Button,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import Layout from '../../Layout';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axiosInstance from '../../../config/axios';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import moment from 'moment';
import EvaluateHomeWork from './evaluateHomeWork';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EvaluateHomeworkNew from './evaluateHomeworkNew';
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
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
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
const ViewClassWork = withRouter(({ history, ...props }) => {
  const { homeWorkId } = useParams();
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [submitted, setSubmitted] = useState([]);
  const [pending, setPending] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [isredirect, setisredirect] = useState(false);
  const [studentData, setStudentData] = useState();
  const [evaluatedList, setevaluatedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const callSubmittedDetail = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.homework.HwSubmittedDetail}?homework=${homeWorkId}`)
      .then((result) => {
        if (result?.data?.status_code === 200 || result?.data?.status_code === 201) {
          setAlert('success', result?.data?.message);
          setSubmitted(result?.data?.submitted_list);
          setPending(result?.data?.un_submitted_list);
          setevaluatedList(result?.data?.evaluated_list);
        } else {
          setAlert('error', result.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    callSubmittedDetail();
  }, [homeWorkId, isredirect]);

  const redirect = (data) => {
    setStudentData(data);
    setisredirect(!isredirect);
  };

  return (
    <Layout>
      {loading && <Loader />}
      {!isredirect && (
        <Grid container xs={12} sm={12} md={12} spacing={2}>
          <Grid item xs={12} sm={12} md={12} spacing={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <span style={{ paddingLeft: 40, paddingTop: 10 }}>
                <b>View Home Work</b>
              </span>
              {/* <CenterPart>
              <div>Question Bank 1</div>
              <div>Duration : 10min</div>
              <div>Grade 3A</div>
            </CenterPart> */}
              <div>
                <CloseIcon
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => history.goBack()}
                />
              </div>
            </div>
          </Grid>
          <AppBar position='static' style={{ width: '95%', margin: 'auto' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              textColor='primary'
              style={{ background: 'white' }}
              variant='fullWidth'
              aria-label='full width tabs example'
              centered
            >
              <Tab
                label={`Submitted (${submitted?.length})`}
                style={{ color: 'black !important' }}
                {...a11yProps(0)}
              />
              <Tab label={`pending (${pending?.length})`} {...a11yProps(1)} />
              <Tab label='Avg. Marks' {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <Grid item={12} xs={12} sm={12} md={12} spacing={1}>
            <TabPanel value={value} index={0}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                      >
                        <AccountCircleIcon style={{ visibility: 'hidden' }} />
                        Student Name
                      </StyledTableCell>
                      <StyledTableCell align='right'>Submitted At</StyledTableCell>
                      <StyledTableCell align='right'>Uploaded HomeWork</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submitted?.length !== 0 &&
                      submitted?.map((row) => (
                        <>
                          <div style={{ margin: 5, background: 'red' }}></div>
                          <StyledTableRow key={row?.student_name}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '0 !important',
                                padding: 0,
                              }}
                            >
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
                                  {row?.first_name} {row?.last_name}
                                  <br />
                                  Erp id: {row?.erp_id}
                                </div>
                              </StyledTableCell>
                            </div>
                            <StyledTableCell align='right'>
                              {moment(row?.submitted_at).format(
                                'MMMM Do YYYY, h:mm:ss a'
                              )}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              {/* {row?.uploaded_file.map((e)=>{ */}
                              {/* return(   */}
                              <div
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                <a
                                  className='underlineRemove'
                                  onClick={() => redirect(row)}
                                >
                                  <SvgIcon
                                    component={() => <FileCopyIcon />}
                                    fontSize='xx-large'
                                  />
                                </a>
                              </div>
                              {/* ) */}

                              {/* })} */}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                  <TableBody>
                    {pending?.length !== 0 &&
                      pending.map((row) => (
                        <>
                          <div style={{ margin: 5, background: 'red' }}></div>
                          <StyledTableRow key={row?.student_name}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                  {row?.first_name} {row?.last_name}
                                  <br />
                                  Erp id: {row?.erp_id}
                                </div>
                              </StyledTableCell>
                            </div>
                          </StyledTableRow>
                        </>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                      >
                        <AccountCircleIcon style={{ visibility: 'hidden' }} />
                        Student Name
                      </StyledTableCell>
                      <StyledTableCell align='right'>Score</StyledTableCell>
                      <StyledTableCell align='right'>Remarks</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evaluatedList?.length !== 0 &&
                      evaluatedList?.map((row) => (
                        <>
                          <div style={{ margin: 5, background: 'red' }}></div>
                          <StyledTableRow key={row?.student_name}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '0 !important',
                                padding: 0,
                              }}
                            >
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
                                  {row?.first_name} {row?.last_name}
                                  <br />
                                  Erp id: {row?.erp_id}
                                </div>
                              </StyledTableCell>
                            </div>
                            <StyledTableCell align='right'>{row?.score}</StyledTableCell>
                            <StyledTableCell align='right'>
                              {row?.remarks}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </Grid>
        </Grid>
      )}
      {isredirect && (
        <EvaluateHomeworkNew
          redirect={redirect}
          studentData={studentData}
          homeWorkId={homeWorkId}
        />
      )}
    </Layout>
  );
});
export default ViewClassWork;
