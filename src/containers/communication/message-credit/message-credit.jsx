/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, TextField, useTheme, Divider, Box, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SmsCreditCard from './log-card/sms-credit-card';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import './message-credit.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '95%',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
      margin: 'auto',
    },
  },
  container: {
    maxHeight: 440,
  },
}));

// eslint-disable-next-line no-unused-vars
const MessageCredit = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [openModal, setOpenModal] = useState(true);
  const [addCreditMobile, setAddCreditMobile] = useState(false);
  const [mobileAddCreditId, setMobileAddCreditId] = useState();
  const [selectedBranch, setSelectedBranch] = useState();
  const [smsCreditId, setSmsCreditId] = useState();
  const [branchList, setBranchList] = useState([]);
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (index) => {
    const addSmsCreditUrl = `${endpoints.communication.editGroup}${smsCreditId}/sms-credits/`;
    setLoading(true);
    try {
      const request = {
        sms_credit_amount: testData[index].AmountAdded,
      };
      const response = await axiosInstance.put(addSmsCreditUrl, request, {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          // See: http://bit.ly/text-json
          'content-type': 'application/json',
        },
      });
      if (response.data.status_code === 200) {
        setLoading(false);
        setAlert('success', 'Successfully Added Credit');
        const tempData = testData.slice();
        tempData[index].AvailableSMS += tempData[index].AmountAdded;
        tempData[index].AmountAdded = 0;
        tempData[index].Adding = false;
        setTestData(tempData);
      } else {
        setAlert('error', response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const handleAddingSms = (e, index) => {
    const creditToadd = Number(e.target.value);
    if (creditToadd >= 0) {
      const tempData = testData.slice();
      tempData[index].AmountAdded = creditToadd;
      setTestData(tempData);
    }
  };
  const handleCancel = (index) => {
    const tempData = testData.slice();
    tempData[index].AmountAdded = 0;
    tempData[index].Adding = false;
    setTestData(tempData);
  };
  const handleMobileCancel = () => {
    handleCancel(mobileAddCreditId);
    setMobileAddCreditId();
    setAddCreditMobile(false);
  };
  const handleMobileAdding = () => {
    handleSubmit(mobileAddCreditId);
    setMobileAddCreditId();
    setAddCreditMobile(false);
  };
  const handleStatusChange = (index) => {
    const tempData = testData.slice();
    setSmsCreditId(tempData[index].id);
    tempData[index].Adding = true;
    setTestData(tempData);
  };
  const getBranchApi = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(endpoints.communication.branches);
      if (result.status === 200) {
        setLoading(false);
        setBranchList(result.data.data.results);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const handleBranch = (event, value) => {
    if (value) {
      setSelectedBranch(value);
    } else {
      setSelectedBranch();
    }
  };
  const getSmsCreditApi = async () => {
    setLoading(true);
    try {
      let smsCreditUrl = endpoints.communication.getSmsCredit;
      if (selectedBranch) {
        smsCreditUrl += `?branch=${selectedBranch.branch.id}`;
      }
      const result = await axiosInstance.get(smsCreditUrl);
      const resultOptions = [];
      if (result.status === 200) {
        setLoading(false);
        result.data.data.map((items) =>
          resultOptions.push({
            id: items.id,
            BranchName: items.branch_fk.branch_name,
            AvailableSMS: Number(items.available_sms),
            useSMS: Number(items.used_sms),
            AmountAdded: 0,
            Adding: false,
          })
        );
        setTestData(resultOptions);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getSmsCreditApi();
  }, [selectedBranch]);
  useEffect(() => {
    if (!branchList.length) {
      getBranchApi();
    }
  }, []);
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      {addCreditMobile ? (
        <Dialog
          open={openModal}
          onClose={handleMobileCancel}
          aria-labelledby='draggable-dialog-title'
        >
          <div className='add_credit_mobile_form'>
            <span className='close_icon_add_message_credit' onClick={handleMobileCancel}>
              <CloseIcon />
            </span>
            <div className='add_credit_mobile_form_heading'>Add Amount</div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item container>
                <Grid item xs={8}>
                  <Box>
                    <Typography
                      className={classes.title}
                      variant='p'
                      component='p'
                      color='secondary'
                    >
                      Available SMS Credit
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <Typography
                      className={classes.content}
                      variant='p'
                      component='p'
                      color='secondary'
                      align='right'
                    >
                      {testData[mobileAddCreditId].AvailableSMS}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box>
                    <Typography
                      className={classes.title}
                      variant='p'
                      component='p'
                      color='secondary'
                    >
                      Used SMS Credit
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <Typography
                      className={classes.content}
                      variant='p'
                      component='p'
                      color='secondary'
                      align='right'
                    >
                      {testData[mobileAddCreditId].useSMS}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div className='add_credit_mobile_input'>
                  <input
                    type='number'
                    className='add_sms_credit_box change_sms_credit_box'
                    value={Number(testData[mobileAddCreditId].AmountAdded).toString()}
                    onChange={(e) => handleAddingSms(e, mobileAddCreditId)}
                  />
                </div>
              </Grid>
              <Grid item container>
                <Grid item xs={12}>
                  <input
                    type='button'
                    className='add_credit_mobile'
                    onClick={handleMobileAdding}
                    value='Add Credit'
                  />
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Dialog>
      ) : null}
      <Layout>
        <div className='message_credit__page'>
          <div className='bread_crumb_container'>
            <CommonBreadcrumbs
              componentName='Communication'
              childComponentName='Add SMS credit'
            />
          </div>
          <div className='create_group_filter_container'>
            <Grid container className='message_log_container' spacing={5}>
              <Grid xs={12} lg={3} item>
                <Autocomplete
                  size='small'
                  onChange={handleBranch}
                  value={selectedBranch}
                  id='message_log-branch'
                  className='sms_credit_branch'
                  options={branchList}
                  getOptionLabel={(option) => (option && option.branch && option.branch.branch_name) ? option.branch.branch_name : ''}
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
            </Grid>
          </div>
          {isMobile ? (
            <>
              {testData.map((items, index) => (
                <SmsCreditCard
                  data={items}
                  setMobileAddCreditId={setMobileAddCreditId}
                  setAddCreditMobile={setAddCreditMobile}
                  index={index}
                  handleStatusChange={handleStatusChange}
                />
              ))}
            </>
          ) : (
            <div className='sms_credit_white_space_wrapper'>
              <Paper className={`sms_credit_table_wrapper ${classes.root}`}>
                <TableContainer
                  className={`table table-shadow sms_credit_table ${classes.container}`}
                >
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='view_groups_header'>
                      <TableRow>
                        <TableCell>Branch</TableCell>
                        <TableCell>Available SMS Credit</TableCell>
                        <TableCell>Used SMS Credit</TableCell>
                        <TableCell>Amount to be Added</TableCell>
                        <TableCell>Add SMS Credit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className='table_body'>
                      {testData.map((items, index) => (
                        <TableRow key={`message_credit_table_${index}`}>
                          <TableCell align='right'>{items.BranchName}</TableCell>
                          <TableCell align='right'>{items.AvailableSMS}</TableCell>
                          <TableCell align='right'>{items.useSMS}</TableCell>
                          <TableCell align='right'>
                            {items.Adding ? (
                              <input
                                type='number'
                                className='add_sms_credit_box change_sms_credit_box'
                                value={Number(items.AmountAdded).toString()}
                                onChange={(e) => handleAddingSms(e, index)}
                              />
                            ) : (
                              <input
                                type='number'
                                className='add_sms_credit_box'
                                value={items.AmountAdded}
                                readOnly
                              />
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {items.Adding ? (
                              <div className='addcredit_button_wrapper'>
                                <Button
                                  type='submit'
                                  variant='contained'
                                  onClick={() => handleCancel(index)}
                                  className='custom_button_master labelColor'
                                  size='small'
                                >
                                  CANCEL
                                </Button>

                                <Button
                                  type='submit'
                                  variant='contained'
                                  color='primary'
                                  style={{ color: 'white', marginLeft: '10%' }}
                                  onClick={() => handleSubmit(index)}
                                  className='custom_button_master'
                                  size='small'
                                >
                                  SAVE
                                </Button>
                              </div>
                            ) : (
                              <AddCircleIcon
                                style={{ color: '#005c99' }}
                                variant='contained'
                                onClick={() => handleStatusChange(index)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
});

export default MessageCredit;
