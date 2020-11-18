/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import MomentUtils from '@date-io/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Pagination from '@material-ui/lab/Pagination';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import './message-log.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '100%',
    marginLeft: '5px',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '87vw',
      margin: 'auto',
    },
  },
  container: {
    maxHeight: 440,
  },
}));

const MessageLog = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [messageRows, setMessageRows] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [smsTypeList, setSmsTypeList] = useState([]);
  const [selectedSmsType, setSelectedSmsType] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState();
  const [selectedToDate, setSelectedToDate] = useState();
  const [messageCurrentPageno, setMessageCurrentPageno] = useState(1);
  const [messageTotalPage, setMessageTotalPage] = useState();
  const [usersCurrentPageno, setUsersCurrentPageno] = useState(1);
  const [usersTotalPage, setUsersTotalPage] = useState();
  const [isEmail, setIsEmail] = useState(false);
  const [clearAll, setClearAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [clearAllActive, setClearAllActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moduleId, setModuleId] = useState();
  const [modulePermision, setModulePermision] = useState(true);

  const handleFromDateChange = (event, value) => {
    setSelectedFromDate(value);
  };

  const handleToDateChange = (event, value) => {
    setSelectedToDate(value);
  };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.branches);
      if (result.status === 200) {
        setBranchList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getSmsTypeApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.getMessageTypes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setSmsTypeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleSmsType = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedSmsType(ids);
    } else {
      setSelectedSmsType([]);
    }
  };
  const handleBranch = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedBranches(ids);
    } else {
      setSelectedBranches([]);
    }
  };

  const getMessages = async () => {
    let getMessagesUrl = `${endpoints.communication.getMessages}?page=${messageCurrentPageno}&page_size=15&module_id=${moduleId}`;
    if (selectedBranches.length) {
      const selectedBranchId = selectedBranches.map((el) => el.id);
      getMessagesUrl += `&branch=${selectedBranchId.toString()}`;
    }
    getMessagesUrl += `&message_type=${isEmail ? '1' : '2'}`;
    if (selectedSmsType.length) {
      const selectedSmsTypeId = selectedSmsType.map((el) => el.id);
      getMessagesUrl += `&sms_type=${selectedSmsTypeId.toString()}`;
    }
    if (selectedFromDate && selectedToDate) {
      getMessagesUrl += `&from_date=${selectedFromDate}&to_date=${selectedToDate}`;
    }
    try {
      setLoading(true);
      const result = await axiosInstance.get(getMessagesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.status_code === 200) {
        const tempLogArray = [];
        result.data.data.results.forEach((items) => {
          tempLogArray.push({
            id: items.id,
            message: isEmail ? items.email_subject : items.message_content,
            type: items.communicate_type.category_name,
            sendBy: items.created_by ? items.created_by.first_name : 'null',
            sendOn: items.created_at,
            totalCount: items.total_count,
            sent: items.is_sent ? 'Yes' : 'No',
          });
        });
        setMessageRows(tempLogArray);
        setMessageTotalPage(result.data.data.total_pages);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleMessagePagination = (event, page) => {
    setMessageCurrentPageno(page);
  };

  const getUserDatails = async (id) => {
    setSelectedRow(id);
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.editGroup}${id}/user-logs/?page=${usersCurrentPageno}&page_size=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        const tempLogArray = [];
        result.data.data.results.forEach((items) => {
          tempLogArray.push({
            name: `${items.sent_to.first_name} ${items.sent_to.last_name}`,
            number: isEmail ? items.email : items.contact_no,
            sent: 'Yes',
          });
          setUserLogs(tempLogArray);
          setUsersTotalPage(result.data.data.total_pages);
          setLoading(false);
        });
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleUsersPagination = (event, page) => {
    setUsersCurrentPageno(page);
  };

  const handleClearAll = () => {
    if (clearAllActive) {
      setSelectedBranches([]);
      setSelectedFromDate();
      setSelectedSmsType([]);
      setSelectedToDate();
      setUsersTotalPage();
      setUsersCurrentPageno(1);
      setUserLogs([]);
      setClearAll(true);
      setClearAllActive(false);
    }
  };
  const handleTypeChange = () => {
    setSelectedBranches([]);
    setSelectedSmsType([]);
    setSelectedToDate();
    setSelectedFromDate();
    setIsEmail(!isEmail);
    setUsersTotalPage();
    setUsersCurrentPageno(1);
    setUserLogs([]);
  };
  const handleUserDetails = (id) => {
    setUsersCurrentPageno(1);
    setUsersTotalPage();
    getUserDatails(id);
  };
  const handleFilterCheck = () => {
    if (selectedSmsType || selectedBranches) {
      setUsersCurrentPageno(1);
      setUsersTotalPage();
      setUserLogs([]);
      getMessages();
    }
    if (selectedFromDate && selectedToDate) {
      setUsersCurrentPageno(1);
      setUsersTotalPage();
      setUserLogs([]);
      getMessages();
    }
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  useEffect(() => {
    if (!branchList.length) {
      getBranchApi();
      getSmsTypeApi();
    }
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Communication' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'SMS&Email Log') {
              setModuleId(item.child_id);
              setModulePermision(true);
            } else {
              setModulePermision(false);
            }
          });
        } else {
          setModulePermision(false);
        }
      });
    } else {
      setModulePermision(false);
    }
  }, []);
  useEffect(() => {
    if (clearAll) {
      setClearAll(false);
    }
    getMessages();
  }, [messageCurrentPageno, isEmail, clearAll]);
  useEffect(() => {
    if (usersCurrentPageno > 1) {
      getUserDatails();
    }
  }, [usersCurrentPageno]);
  useEffect(() => {
    if (
      selectedBranches.length ||
      selectedSmsType.length ||
      selectedToDate ||
      selectedFromDate
    ) {
      setClearAllActive(true);
    }
  }, [selectedBranches, selectedSmsType, selectedToDate, selectedFromDate]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='message_log_wrapper'>
          <div className='message_log_breadcrumb_wrapper'>
            <CommonBreadcrumbs
              componentName='Communication'
              childComponentName='SMS/Email Log'
            />
          </div>
          <div className='create_group_filter_container'>
            <Grid container className='message_log_container' spacing={5}>
              <Grid xs={12} lg={6} item>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleBranch}
                  value={selectedBranches}
                  id='message_log-branch'
                  className='message_log_branch'
                  options={branchList}
                  getOptionLabel={(option) => option?.branch_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} lg={6} item>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleSmsType}
                  value={selectedSmsType}
                  id='message_log-smsType'
                  className='message_log_branch'
                  options={smsTypeList}
                  getOptionLabel={(option) => option?.category_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='SMS Type'
                      placeholder='SMS Type'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
          <div className='create_group_filter_container'>
            <Grid container spacing={5} className='message_log_container'>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid item xs={12} sm={3}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='From'
                    className='message_log_date_piker'
                    format='YYYY-MM-DD'
                    value={selectedFromDate}
                    onChange={handleFromDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='To'
                    className='message_log_date_piker'
                    format='YYYY-MM-DD'
                    value={selectedToDate}
                    onChange={handleToDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
          </div>
          <div className='create_group_filter_container'>
            <Grid container className='message_log_container' spacing={5}>
              <Grid xs={12} lg={3} item>
                <input
                  className='deactive_clearAll'
                  type='button'
                  onClick={handleClearAll}
                  value='Clear All'
                />
              </Grid>
              <Grid xs={12} lg={3} item>
                <input
                  className='message_log_filter_button'
                  type='button'
                  onClick={handleFilterCheck}
                  value='Filter'
                />
              </Grid>
            </Grid>
          </div>
          <div className='message_log_white_wrapper'>
            <div className='message_type_block_wrapper'>
              <div
                className={`message_type_block ${
                  isEmail ? null : 'message_type_block_selected'
                }`}
                onClick={handleTypeChange}
              >
                SMS Logs
              </div>
              <div
                className={`message_type_block ${
                  isEmail ? 'message_type_block_selected' : null
                }`}
                onClick={handleTypeChange}
              >
                Email Logs
              </div>
            </div>
            {isHidden ? (
              <span className='message_log_expand_manage' onClick={toggleHide}>
                view more
              </span>
            ) : (
              <span className='message_log_expand_manage' onClick={toggleHide}>
                view less
              </span>
            )}
            <div className='create_group_filter_container'>
              <Grid container className='message_log_container' spacing={2}>
                <Grid xs={12} lg={9} item>
                  <Paper className={`message_log_table_wrapper ${classes.root}`}>
                    <TableContainer
                      className={`table table-shadow message_log_table ${classes.container}`}
                    >
                      <Table stickyHeader aria-label='sticky table'>
                        <TableHead className='view_groups_header'>
                          <TableRow>
                            <TableCell>Message</TableCell>
                            <TableCell className='message_log_send_by'>Sent by</TableCell>
                            <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                              Type
                            </TableCell>
                            <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                              Sent on
                            </TableCell>
                            <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                              Count
                            </TableCell>
                            <TableCell>Sent</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className='table_body'>
                          {messageRows.map((row, i) => (
                            <TableRow
                              className={
                                selectedRow === row.id ? 'selectedRow' : 'notSelected'
                              }
                              onClick={() => handleUserDetails(row.id)}
                              key={`message_log_details${i}`}
                            >
                              <TableCell align='right'>{row.message}</TableCell>
                              <TableCell align='right'>{row.sendBy}</TableCell>
                              <TableCell
                                align='right'
                                className={`${isHidden ? 'hide' : 'show'}`}
                              >
                                {row.type}
                              </TableCell>
                              <TableCell
                                align='right'
                                className={`${isHidden ? 'hide' : 'show'}`}
                              >
                                {row.sendOn}
                              </TableCell>
                              <TableCell
                                align='right'
                                className={`${isHidden ? 'hide' : 'show'}`}
                              >
                                {row.totalCount}
                              </TableCell>
                              <TableCell align='right'>
                                {row.sent ? (
                                  <CheckCircleIcon
                                    style={{ color: 'green', marginLeft: '15px' }}
                                  />
                                ) : (
                                  <CancelIcon
                                    style={{ color: 'red', marginLeft: '15px' }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className={`${classes.root} pagenation_view_groups`}>
                      <Pagination
                        page={Number(messageCurrentPageno)}
                        size='large'
                        className='books__pagination'
                        onChange={handleMessagePagination}
                        count={messageTotalPage}
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid xs={12} lg={3} item>
                  {userLogs.length ? (
                    <div className={isMobile ? 'view_details_mobile' : 'desktop'}>
                      {isMobile ? (
                        <span
                          className='close_icon_view_details_mobile'
                          onClick={() => {
                            setSelectedRow();
                            setUserLogs([]);
                          }}
                        >
                          <CloseIcon />
                        </span>
                      ) : null}
                      <Paper className={`message_log_table_wrapper ${classes.root}`}>
                        <TableContainer
                          className={`table table-shadow message_log_table ${classes.container}`}
                        >
                          <Table stickyHeader aria-label='sticky table'>
                            <TableHead className='view_groups_header'>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{isEmail ? 'Email Id' : 'Number'}</TableCell>
                                <TableCell>Sent</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {userLogs.map((row, i) => (
                                <TableRow key={`message_details${i}`}>
                                  <TableCell align='right'>{row.name}</TableCell>
                                  <TableCell align='right'>{row.number}</TableCell>
                                  <TableCell align='right'>
                                    {row.sent ? (
                                      <CheckCircleIcon
                                        style={{ color: 'green', marginLeft: '15px' }}
                                      />
                                    ) : (
                                      <CancelIcon
                                        style={{ color: 'red', marginLeft: '15px' }}
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <div className={`${classes.root} pagenation_view_groups`}>
                          <Pagination
                            page={Number(usersCurrentPageno)}
                            size='large'
                            className='books__pagination'
                            onChange={handleUsersPagination}
                            count={usersTotalPage}
                          />
                        </div>
                      </Paper>
                    </div>
                  ) : null}
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default MessageLog;
