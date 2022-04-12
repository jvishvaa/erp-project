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
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Link,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Loader from '../../../../../../components/loader/loader';
import axiosInstance from '../../../../../../config/axios';
import endpoints from '../../../../../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    // marginTop: '15px',
  },
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
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '60vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
      borderRadius: '10px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
    },
    //   ::-webkit-scrollbar {
    //     width: 12px;
    // }
  },
  // link:{

  // },
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
  accordion: {
    margin: '10px 0 !important',
    border: '1px solid black',
    '&::before': {
      backgroundColor: 'black',
    },
  },
  accordianSummaryDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableCellLeftAlign: {
    textAlign: 'left !important',
  },
  tableCellRightAlign: {
    textAlign: 'right !important',
  },
}));

const StudentWiseDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [allStudentWiseData, setAllStudentWiseData] = useState(null);
  const [allStudentWiseRes, setAllStudentWiseRes] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const {
    match: {
      params: { branchId, gradeId, sectionId, subjectId, testId },
    },
  } = props;

  useEffect(() => {
    getStudentWiseStat({
      academic_session: 1, //hardcore
      grade: gradeId,
      // subjects: subjectId,
      test_id: testId,
      is_completed: 'True',
      end_date: moment(new Date()).format('YYYY-MM-DD'),
      sectionmapping_id: sectionId,
    });
  }, []);

  const getStudentWiseStat = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.studentWiseTestStudentReportStat}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': "dev.olvorchidnaigaon.letseduvate.com",
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res);
        setAllStudentWiseData(res.data.result.user_response);
        setAllStudentWiseRes(res.data.result);
        // setTotalStudent(res.data.result.total_students);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                {allStudentWiseRes?.test?.test_name}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            container
            xs={12}
            spacing={3}
            alignItems='center'
            justifyContent='space-between'
          >
            <Grid item>
              <Typography>{allStudentWiseRes?.grade?.grade_name}</Typography>
              <Typography variant='caption'>
                Total Student : {allStudentWiseRes?.total_students}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{allStudentWiseRes?.subject?.subject_name}</Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <Typography>Avg. Score : {allStudentWiseRes?.avg_score}</Typography>
              {/* <Link>View Test Questions</Link> */}
            </Grid>

            {/* <Grid item xs={12}>
              <Typography variant='body1'>Total Students 120</Typography>
            </Grid> */}
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={clsx(classes.tableCellLeftAlign)}>
                          Student Details
                        </TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell className={clsx(classes.tableCellRightAlign)}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allStudentWiseData &&
                        allStudentWiseData.map((each, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className={clsx(classes.tableCellLeftAlign)}>
                                {each.name}
                              </TableCell>
                              <TableCell>{each.total_mark}</TableCell>
                              <TableCell className={clsx(classes.tableCellRightAlign)}>
                                <Link
                                  component='button'
                                  onClick={() => console.log('link')}
                                >
                                  View Report
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(StudentWiseDetails);
