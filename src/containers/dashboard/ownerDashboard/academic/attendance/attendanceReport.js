import React, { useContext, useState, useEffect, Component } from 'react';
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
  TableBody,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';
import { useParams, withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../../../config/axios';
import axios from 'axios';
import endpoints from '../../../../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import '../style.scss';
import Loader from '../../../../../components/loader/loader';
// import Loading from '../../../../../components';
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
  accordion: {
    margin: '10px 0 !important',
    border: '1px solid black',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },
  eachGradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 8px',
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachGradeName: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '4px',
    borderRadius: '5px',
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
  colorRed: {
    color: 'red',
  },
}));
const AttendanceReport = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [gradeList, setGradeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gradeWiseState, setGradeWiseStat] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const {
    match: {
      params: { branchId },
    },
  } = props;

  const { acad_session_id, module_id } = history.location.state;

  const handleChange = () => {
    console.log('hello');
    setExpanded(expanded ? false : true);
  };
  useEffect(() => {
    getGradeList({
      session_year: selectedAcademicYear.id,
      branch_id: branchId,
      module_id: module_id,
    });
    setLoading(true);
  }, []);

  const getGradeList = async (params = {}) => {
    axiosInstance
      .get(`${endpoints.academics.grades}`, {
        params: { ...params },
      })
      .then((res) => {
        console.log(res);
        setGradeList(res.data.data);
        getGradeWiseState({
          acad_session_id: acad_session_id,
          grade_id: res.data.data[0].grade_id,
        });
        setLoading(false);
        // getAllGradeWiseStat(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getGradeWiseState = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.gradeWiseStudentAttendanceState}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
        },
      })
      .then((res) => {
        // console.log(res, 'utpal');
        let tempData = res.data.result.result;
        tempData.unshift({
          section_name: res.data.result.section_name,
          total_strength: res.data.result.total_strength,
          total_present: res.data.result.total_present,
          total_absent: res.data.result.total_absent,
          present_percentage: res.data.result.present_percentage,
          absent_percentage: res.data.result.absent_percentage,
        });
        setGradeWiseStat(tempData);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout>
      <div
        style={{ width: '100%', overflow: 'hidden', padding: '20px' }}
        className='whole-subject-curr'
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Attendance Report
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              elevation={0}
              className={clsx(classes.accordion)}
              expanded={expanded}
              onChange={handleChange}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{gradeList && gradeList[0]?.grade_name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: '100%' }}>
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Present</TableCell>
                          <TableCell>Absent</TableCell>
                          <TableCell>Absent for more than 5 continuous days.</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {gradeWiseState?.map((eachSection, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell align='center'>
                                {eachSection.section_name}
                              </TableCell>
                              <TableCell align='center'>
                                {eachSection.total_strength}
                              </TableCell>
                              <TableCell align='center'>
                                {eachSection.total_present}
                              </TableCell>
                              <TableCell align='center'>
                                {eachSection.total_absent}
                              </TableCell>
                              <TableCell
                                align='center'
                                className={clsx(classes.colorRed)}
                              >
                                {/* {eachSection.moreAbsent} */}0
                              </TableCell>
                              <TableCell align='center'>
                                {index !== 0 && (
                                  <IconButton
                                    size='small'
                                    disabled={index === 0}
                                    onClick={() =>
                                      history.push({
                                        pathname: `/student-attendance-report/subject-wise/${branchId}/${gradeList[0]?.grade_id}/${eachSection?.section_mapping_id}`,
                                        state: {
                                          grade_name: `${gradeList[0]?.grade_name}`,
                                          section_name: `${eachSection.section_name}`,
                                        },
                                      })
                                    }
                                  >
                                    <ArrowForwardIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </AccordionDetails>
            </Accordion>
            {gradeList &&
              gradeList
                ?.filter((each, index) => index !== 0)
                ?.map((each, index) => {
                  return (
                    <AccordionLable
                      key={index}
                      data={each}
                      acad_session_id={acad_session_id}
                      branchId={branchId}
                    />
                  );
                })}
          </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

const AccordionLable = ({ data, acad_session_id, branchId }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [gradeWiseState, setGradeWiseStat] = useState(null);

  const handleChange = () => {
    console.log('hello');
    if (!expanded) {
      getGradeWiseState({
        acad_session_id: acad_session_id,
        grade_id: data.grade_id,
      });
    }
    setExpanded(expanded ? false : true);
  };

  const getGradeWiseState = (params = {}) => {
    axiosInstance
      .get(`${endpoints.ownerDashboard.gradeWiseStudentAttendanceState}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
        },
      })
      .then((res) => {
        let tempData = res.data.result.result;
        tempData.unshift({
          section_name: res.data.result.section_name,
          total_strength: res.data.result.total_strength,
          total_present: res.data.result.total_present,
          total_absent: res.data.result.total_absent,
          present_percentage: res.data.result.present_percentage,
          absent_percentage: res.data.result.absent_percentage,
        });
        setGradeWiseStat(tempData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Accordion
      elevation={0}
      className={clsx(classes.accordion)}
      expanded={expanded}
      onChange={handleChange}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{data.grade_name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <AccordionTable
            data={gradeWiseState}
            details={{ grade: data, branchId: branchId }}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const AccordionTable = ({ data, details }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Present</TableCell>
            <TableCell>Absent</TableCell>
            <TableCell>Absent for more than 5 continuous days.</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((eachSection, index) => {
            return (
              <TableRow key={index}>
                <TableCell align='center'>{eachSection.section_name}</TableCell>
                <TableCell align='center'>{eachSection.total_strength}</TableCell>
                <TableCell align='center'>{eachSection.total_present}</TableCell>
                <TableCell align='center'>{eachSection.total_absent}</TableCell>
                <TableCell align='center' className={clsx(classes.colorRed)}>
                  {/* {eachSection.moreAbsent} */}0
                </TableCell>
                <TableCell align='center'>
                  {index !== 0 && (
                    <IconButton
                      size='small'
                      // disabled={index === 0}
                      onClick={() =>
                        history.push({
                          pathname: `/student-attendance-report/subject-wise/${details?.branchId}/${details?.grade?.grade_id}/${eachSection?.section_mapping_id}`,
                          state: {
                            grade_name: `${details?.grade?.grade_name}`,
                            section_name: `${eachSection.section_name}`,
                          },
                        })
                      }
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceReport;
