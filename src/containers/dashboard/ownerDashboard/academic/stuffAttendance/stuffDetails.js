/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  PersonSharp as PersonSharpIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Layout from '../../../../Layout';
import clsx from 'clsx';
import moment from 'moment';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';

const useStyles = makeStyles((theme) => ({
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },

  cardContantFlex: {
    display: 'flex',
    alignItems: 'center',
  },
  cardLetter: {
    padding: '6px 10px',
    borderRadius: '8px',
    margin: '0 10px 0 0',
    fontSize: '1.4rem',
  },
  absentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid red',
    padding: '0 5px',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  colorBlue: {
    color: 'blue',
  },
  colorRed: {
    color: 'lightpink',
  },
  colorWhite: {
    color: 'white',
  },
  backgrounColorGreen: {
    backgroundColor: 'lightgreen',
  },
  backgrounColorBlue: {
    backgroundColor: 'lightblue',
  },
  backgrounColorRed: {
    backgroundColor: 'lightpink',
  },
}));

const StuffDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
//   const [branchName, setBranchName] = useState(history.location.state.payload.branchName);
//   const [userName, setUserName] = useState(history.location.state.payload.userName);
  const [totalStaff, setTotalStaff] = useState(0);
  const [userData, setUserData] = useState(null);
  const {
    match: {
      params: { branchId, erpId },
    },
  } = props;

  const {branchName,userName} = history.location.state.payload

  const getGradeWiseState = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.staff.staffWiseStates}?erpuser_id=${erpId}&branch_id=${branchId}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setUserData(res?.data?.result?.[0]);
        setTotalStaff(
          res?.data?.result?.[0]?.total_absent + res?.data?.result?.[0]?.total_present
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getGradeWiseState();
  }, []);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
          <Grid container spacing={3} justifyContent='space-between'>
            <Grid item xs={12}>
              <div className={clsx(classes.breadcrumb)}>
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Dashboard
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Attendance
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  {branchName}
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  {userName}
                </Typography>
                <ArrowForwardIosIcon />
                <Typography
                  variant='h6'
                  className={clsx(classes.textBold, classes.colorBlue)}
                >
                  {userData?.erp_user__name}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={1}>
                <CardContent style={{ padding: '0' }}>
                  <div
                    style={{
                      borderRadius: '4px 4px 0 0',
                      backgroundColor: 'lightblue',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        height: '50px',
                        width: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'lightgray',
                        margin: '0 15px 0 0',
                      }}
                    ></div>
                    <div>
                      <Typography>{userData?.erp_user__name}</Typography>
                      <Typography>ERP No. : {userData?.erp_user__erp_id}</Typography>
                    </div>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Card elevation={1}>
                          <CardContent>
                            <Typography variant='body1'>Total Days</Typography>
                            <Typography variant='h6' className={clsx(classes.textBold)}>
                              {userData?.total_days}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={3}>
                        <Card elevation={1}>
                          <CardContent className={clsx(classes.cardContantFlex)}>
                            <span
                              className={clsx(
                                classes.cardLetter,
                                classes.backgrounColorGreen,
                                classes.colorWhite,
                                classes.textBold
                              )}
                            >
                              P
                            </span>
                            <div>
                              <Typography variant='h6'>
                                {userData?.total_present}/{userData?.total_days}
                              </Typography>
                              <Typography variant='body1'>Total Present</Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={3}>
                        <Card elevation={1}>
                          <CardContent className={clsx(classes.cardContantFlex)}>
                            <span
                              className={clsx(
                                classes.cardLetter,
                                classes.backgrounColorRed,
                                classes.colorWhite,
                                classes.textBold
                              )}
                            >
                              A
                            </span>
                            <div>
                              <Typography variant='h6'>
                                {userData?.total_absent}/{userData?.total_days}
                              </Typography>
                              <Typography variant='body1'>Total Absent</Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={3}>
                        <Card elevation={1}>
                          <CardContent className={clsx(classes.cardContantFlex)}>
                            <span
                              className={clsx(
                                classes.cardLetter,
                                classes.backgrounColorBlue,
                                classes.colorWhite,
                                classes.textBold
                              )}
                            >
                              %
                            </span>
                            <div>
                              <Typography variant='h6'>
                                {userData?.percentage_present}
                              </Typography>
                              <Typography variant='body1'>
                                % Admin Staff Present
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </Layout>
  );
};

export default withRouter(StuffDetails);
