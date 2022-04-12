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
const SubjectWiseDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [sectionSelected, setSectionSelected] = useState('');
  const [test, setTest] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [allTestType, setAllTestType] = useState(null);
  const [allSubject, setAllSubject] = useState(null);
  const [allSubjectWiseStat, setAllSubjectWiseStat] = useState(null);
  const [totalStudent, setTotalStudent] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const {
    match: {
      params: { branchId, gradeId, sectionId },
    },
  } = props;
  const {
    payload: {
      acad_session,
      gradewise: { grade_name },
      section: { section_name },
    },
  } = history.location.state;
  useEffect(() => {
    getAllTestTypes();
    getAllSubjects({
      session_year: acad_session,
      grade: gradeId,
    });
    getSubjectWiseStat({
      academic_session: acad_session, 
      grade: gradeId,
      subjects: subject === '' ? null : subject,
      test_type: test === '' ? null : test,
      is_completed: 'True',
      end_date: date,
      sectionmapping_id: sectionId,
    });
  }, []);

  useEffect(() => {
    getSubjectWiseStat({
      academic_session: 1, //hardcore
      grade: gradeId,
      subjects: subject === '' ? null : subject,
      test_type: test === '' ? null : test,
      is_completed: 'True',
      end_date: date,
      sectionmapping_id: sectionId,
    });
  }, [test, subject, date]);

  const getSubjectWiseStat = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.subjectWiseTestStudentReportStat}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': "dev.olvorchidnaigaon.letseduvate.com",
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res);
        setAllSubjectWiseStat(res.data.result.stats);
        setTotalStudent(res.data.result.total_students);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTestTypes = (params = {}) => {
    axiosInstance
      .get(`${endpoints.assessmentErp.examTypeList}`, { params: { ...params } })
      .then((res) => {
        console.log(res);
        setAllTestType(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllSubjects = (params = {}) => {
    axiosInstance
      .get(`${endpoints.assessmentErp.subjectList}`, { params: { ...params } })
      .then((res) => {
        console.log(res);
        setAllSubject(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSectionChange = (event) => {
    setSectionSelected(event.target.value);
  };
  const handleTestChange = (event) => {
    setTest(event.target.value);
  };
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
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
                Test
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={12} spacing={3} alignItems='center'>
            <Grid item xs={1}>
              <Typography>{`${grade_name}`}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant='body1'>{section_name}</Typography>
              {/* <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel id='section'>Section</InputLabel>
                <Select
                  labelId='section'
                  value={sectionSelected}
                  label='Section'
                  onChange={handleSectionChange}
                >
                  <MenuItem value={10}>Section 1</MenuItem>
                  <MenuItem value={20}>Section 2</MenuItem>
                  <MenuItem value={30}>Section 3</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel id='testType'>Test Type</InputLabel>
                <Select
                  labelId='testType'
                  value={test}
                  label='Test Type'
                  onChange={handleTestChange}
                >
                  <MenuItem value={''}>All Test Type</MenuItem>
                  {allTestType &&
                    allTestType.map((each, index) => {
                      return (
                        <MenuItem value={each.id} key={index}>
                          {each.exam_name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel id='subject'>Subject</InputLabel>
                <Select
                  labelId='subject'
                  value={subject}
                  label='Subject'
                  onChange={handleSubjectChange}
                >
                  <MenuItem value={''}>All Subject</MenuItem>
                  {allSubject &&
                    allSubject.map((each, index) => {
                      return (
                        <MenuItem value={each.subject_id} key={index}>
                          {each.subject_name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={2}>
              <TextField
                label='Till Date'
                type='date'
                variant='outlined'
                margin='dense'
                value={date}
                // defaultValue="2017-05-24"
                // sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>Total Students : {totalStudent}</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={clsx(classes.tableCellLeftAlign)}
                        ></TableCell>
                        <TableCell>Attended</TableCell>
                        <TableCell>Avg. Marks</TableCell>
                        <TableCell
                          className={clsx(classes.tableCellRightAlign)}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allSubjectWiseStat &&
                        allSubjectWiseStat.map((each, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className={clsx(classes.tableCellLeftAlign)}>
                                {each.test__test_name}
                              </TableCell>
                              <TableCell>{each.attended}</TableCell>
                              <TableCell>{each.avg_score}</TableCell>
                              <TableCell className={clsx(classes.tableCellRightAlign)}>
                                <IconButton
                                  size='small'
                                  onClick={() =>
                                    history.push(
                                      `/student-report/test-student-wise/${branchId}/${gradeId}/${sectionId}/${
                                        each.subjectId === undefined ? 6 : each.subjectId
                                      }/${each.test_id}`
                                    )
                                  }
                                >
                                  <ArrowForwardIcon />
                                </IconButton>
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

export default withRouter(SubjectWiseDetails);
