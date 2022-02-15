import React, { useEffect, useState, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableContainer,
  SvgIcon,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import Layout from '../../Layout';
import VisibilityIcon from '@material-ui/icons/Visibility';
import apiRequest from '../../../config/apiRequest'
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../../src/context-api/alert-context/alert-state';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';
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
  const { periodId, online_class_id, date } = props?.location?.state;
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getSubmittedList();
    getPendingList();
  }, []);

  const getSubmittedList = () => {
    setLoading(true);
    apiRequest('get', `/oncls/v1/classwork-submitted-list/?date=${date}&online_class_id=${online_class_id}`)
      .then((result) => {
        if (result?.status === 200) {
          setAlert('success', result?.data?.message);
          setSubmittedData(result?.data);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', 'No Submitted Data found');
        setLoading(false);
      });
  };

  const getPendingList = () => {
    setLoading(true);
    axiosInstance
      .get(
        `/period/classwork_submitted_pending_list/?date=${date}&online_class_id=${online_class_id}&period_id=${periodId}`
      )
      .then((result) => {
        if (result?.status === 200) {
          setAlert('success', 'Pending data fetched successfully');
          setPendingData(result?.data);

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

  return (
    <Layout>
      {loading && <Loader />}
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
              <b>View Class Work</b>
            </span>
            <div>
              <CloseIcon
                style={{ cursor: 'pointer' }}
                onClick={(e) => history.goBack()}
              />
            </div>
          </div>
        </Grid>
        <AppBar position='static' style={{ width:"95%",margin:"auto" }}>
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
              label={`Attended (${submittedData?.length})`}
              style={{ color: 'black !important' }}
              {...a11yProps(0)}
            />
            <Tab label={`Pending (${pendingData?.length})`} {...a11yProps(1)} />
            {/* <Tab label='Avg. Marks' {...a11yProps(2)} /> */}
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
                    <StyledTableCell align='right'>Uploaded File</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submittedData.map((row) => (
                    <>
                      <div style={{ margin: 5, background: 'red' }}></div>
                      <StyledTableRow key={row.name}>
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
                              {row.student_name}
                              <br />
                              {row.erp_id}
                            </div>
                          </StyledTableCell>
                        </div>
                        <StyledTableCell align='right'>
                          {row.uploaded_at.slice(0, 10)} {row.uploaded_at.slice(11, 19)}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <a
                              className='underlineRemove'
                              onClick={() => {
                                const fileSrc = row.submitted_files[0];
                                openPreview({
                                  currentAttachmentIndex: 0,
                                  attachmentsArray: [
                                    {
                                      src: fileSrc,
                                      name: `demo`,
                                      extension: '.png',
                                    },
                                  ],
                                });
                              }}
                            >
                              <SvgIcon component={() => <VisibilityIcon />} />
                            </a>
                          </div>
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
                  {pendingData?.map((row) => (
                    <>
                      <div style={{ margin: 5, background: 'red' }}></div>
                      <StyledTableRow key={row.name}>
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
                              {row?.name}
                              <br />
                              {row?.erp_id}
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
        </Grid>
      </Grid>
    </Layout>
  );
});
export default ViewClassWork;
