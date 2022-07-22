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
  Paper,
  Box,
  Collapse,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  // ChevronRightIcon as ArrowCircleRightIcon
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import './style.scss';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
// import { TableHeader } from 'semantic-ui-react';
import '../academic/style.scss';
import { TableHeader } from 'semantic-ui-react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    marginTop: '10px',
    overflow: 'auto',
    // height: '250px',
    height: 'inherit',
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
    backgroundColor: '#f3edee',

    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
    textAlign: 'center',
    borderRadius: '5px',
    fontSize: '15px',
    backgroundColor: 'white',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '55vh',
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
    fontWeight: 'bolder',
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
  cursorUI: {
    cursor: 'pointer',
  },
  tableStateMent: {
    color: '#F39494',
    fontWeight: 'bolder',
    fontSize: '20px',
    textAlign: 'left',
  },
  TableHeaderColor: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
    border: '1px solid #D7E0E7',
    borderRadius: '8px 8px 0px 0px',
    fontWeight: 'bolder',
    fontSize: '20px',
  },
  textAlignLeft: {
    textAlign: 'left !important',
  },
  textAlignRight: {
    textAlign: 'right !important',
  },
}));

function Row(props) {
  const classes = useStyles();
  const {
    row,
    params: { branchId, gradeId },
    acad_session_id,
    selectedAcademicYear
  } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [propsData, setPropsData] = useState([]);
  const history = useHistory();
  const [grade, setGrade] = useState(null);
  const [gradeName, setGradeName] = useState('');
  const [subjectIdProps, setSubjectIdProps] = useState(null);
  const [subjectNameProps, setSubjectNameProps] = useState('');

  const [collapseData, setCollapseData] = useState([]);

  const { session_year: sessionYearId = '' } =
    JSON.parse(sessionStorage.getItem('acad_session')) || {};

  // useEffect(() => {
  //   setPropsData(history.location.state);
  // }, [history]);

  const handleOpen = (e, name) => {
    if (open === true) {
      setOpen(!open);
    } else {
      setSubjectIdProps(e);
      setSubjectNameProps(name);
      setLoading(true);
      setOpen(!open);
      axiosInstance
        .get(
          `${endpoints.ownerDashboard.curriculumGradeSubjectReport}?acad_session_id=${acad_session_id}&grade_id=${gradeId}&subject_id=${e}&session_year=${selectedAcademicYear?.session_year}`,
          {
            headers: {
              'X-DTS-Host': window.location.host,
              // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
              // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
            },
          }
        )
        .then((res) => {
          // setSubjectHeader(res.data.result.grand_dict);
          setCollapseData(res?.data?.result);
          // setSubTable(res.data);
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
        });
    }
  };

  const handleHistory = () => {
    history.push({
      pathname: `/curriculum-completion-section/${branchId}/${gradeId}/${subjectIdProps}/`,
      state: {
        gradeId: gradeId,
        // gradeName: historyGrade?.gradeName,
        subject: subjectIdProps,
        subjectName: subjectNameProps,
        acad_session_id: sessionYearId,
        branchId: branchId,
        // branchName: historyGrade?.branchName,
      },
    });
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell className={clsx(classes.textAlignLeft)} component='th' scope='row'>
          {row?.subject_name}
        </TableCell>
        <TableCell align='right'></TableCell>
        <TableCell align='right'></TableCell>
        <TableCell align='right'></TableCell>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => handleOpen(row?.subject_id, row?.subject_name)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* <TableCell align="right">{row?.protein}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'></Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Sections</TableCell>
                    <TableCell>Total Periods</TableCell>
                    <TableCell align='right'>Completed Periods</TableCell>
                    <TableCell align='right'>Avg. Completion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collapseData &&
                    collapseData.map((item, index) => (
                      <TableRow
                        key={
                          item?.section_name
                        }
                      >
                        <TableCell component='th' scope='row'>
                          <b style={{ color: '#4768A1' }}>
                            {
                              item?.section_name
                            }
                          </b>
                        </TableCell>
                        <TableCell>{item?.total_topics}</TableCell>
                        <TableCell align='right'>
                          {item?.completed_topics}
                        </TableCell>
                        <TableCell align='right'>
                          {item?.percentage_completed !== null ? (
                            item?.percentage
                          ) : (
                            <b
                              style={{
                                color: 'red',
                                fontWeight: 'bolder',
                              }}
                            >
                              NA
                            </b>
                          )}{' '}
                          {' '}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {/* <Grid item xs={12} style={{ float: 'right' }}>
                <Button
                  onClick={() => handleHistory()}
                  style={{
                    borderRadius: '4px',
                    background: '#BADAF9',
                    color: '#3D6CDB',
                    fontWeight: 'bold',
                    margin: '10px',
                  }}
                  endIcon={<ChevronRightIcon style={{ color: '#3D6CDB' }} />}
                  size='small'
                >
                  Compare Topics
                </Button>
              </Grid> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const CurriculumCompletionSubject = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gradeWiseSubjectTable, setGradeWiseSubjectTable] = useState([]);
  const [subject, setSubject] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [historyGrade, setHistoryGrade] = useState({});
  const [totalGrade, setTotalGrade] = useState([]);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [subjectHeader, setSubjectHeader] = useState([]);
  const [moduleId, setModuleId] = useState('');
  // const [branchName,setBranchName] = useState('')
  const [errorValue, setErrorValue] = useState(true);
  const [clicked, setClicked] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const {
    match: {
      params: { branchId, gradeId },
    },
  } = props;

  const handleDateClass = (e) => {
    setDate(e.target.value);
  };

  const handleChange = () => {
    setExpanded(expanded ? false : true);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    setHistoryGrade(history.location.state);
  }, [history]);

  useEffect(() => {
    gradeList({
      session_year: selectedAcademicYear?.id,
      grade: gradeId,
    });
  }, [gradeId]);

  const gradeList = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeList}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        setSubject(res.data.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    subjectList();
  }, [gradeId]);

  // useEffect(()=> {
  //   subjectList()
  // },[gradeId])

  const subjectList = (params) => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.ownerDashboard.subjectListGradeFilter}?session_year=${selectedAcademicYear?.id}&branch=${branchId}&grade=${gradeId}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-Host': window.location.host,
            // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
            // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
          },
        }
      )
      .then((res) => {
        // console.log(res?.data?.result, 'Subject');
        setSubject(res.data.result);
        setSubjectId(res?.data?.result[0]?.id);
        // setGradeWiseSubjectTable(res.data.result)
        // setTableData(res?.data?.result)
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (historyGrade?.acad_sess_id) {
      gradeListTable({
        acad_session_id: historyGrade?.acad_sess_id,
      });
    }
  }, [historyGrade?.acad_session_id]);

  const gradeListTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        // setTableData(res?.data?.result)
        setTotalGrade(res?.data?.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };

  //   console.log(subjectId,'ID====>')

  useEffect(() => {
    if (subjectId && gradeId && date) {
      gradeWiseSubjectList({
        acad_session_id : historyGrade?.acad_sess_id,
        grade_id: gradeId,
        subject_id: subjectId,
        date: date,
      });
    }
  }, [subjectId, gradeId, date]);

  const gradeWiseSubjectList = (params = {}) => {
    setGradeWiseSubjectTable([]);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeSubjectReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        setErrorValue(true);
        setSubjectHeader(res?.data?.result?.grand_dict);

        setGradeWiseSubjectTable(res?.data?.result?.data);
        // setTableData(res?.data?.result)
        setLoading(false);
        if (res?.data?.result?.length === 0) {
          setErrorValue(false);
        }

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        setErrorValue(false);
        setSubjectHeader([]);
        setGradeWiseSubjectTable([]);
        // console.log(err);
        setLoading(false);
      });
  };

  const handleAccordion = (params, value) => (e, isExpanded) => {
    const testclick = document.querySelectorAll('#branchWise');
    setLoading(true);
    setClicked(true);
    setExpanded(isExpanded ? value : false);
    setSubjectId(null);
    if (params) {
      setSubjectId(params?.id);
      setLoading(false);
    }
  };

  const handleHistory = (subjectId, subjectName) => {
    history.push({
      pathname: `/curriculum-completion-section/${branchId}/${gradeId}/${subjectId}/`,
      state: {
        gradeId: gradeId,
        gradeName: historyGrade?.gradeName,
        subject: subjectId,
        subjectName: subjectName,
        acad_session_id: historyGrade?.acad_session_id,
        branchName: historyGrade?.branchName,
      },
    });
  };

  const handleScroll = (each, index) => {
    // history.push(`/curriculum-completion-subject/${branchId}/${1}`)
    history.goBack();
  };

  return (
    <Layout>
      <div
        style={{ width: '100%', overflow: 'hidden', padding: '20px' }}
        className='whole-subject-curr'
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
          < CommonBreadcrumbs 
          componentName='Dashboard'
          childComponentName='Academic Performance' 
          childComponentNameNext = 'Curriculum Completion'
          />
          </Grid>
          <Grid item container xs={12} spacing={3}>
            {/* <Grid item xs={3}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel id='volume'>Volume</InputLabel>
                <Select
                  labelId='volume'
                  value={volume}
                  label='Volume'
                  onChange={handleVolumeChange}
                >
                  <MenuItem value={10}>Volume 1</MenuItem>
                  <MenuItem value={20}>Volume 2</MenuItem>
                  <MenuItem value={30}>Volume 3</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={3}>
              <TextField
                id='date'
                label='Select Date'
                type='date'
                value={date}
                size='small'
                variant='outlined'
                inputProps={{ max: new Date().toISOString().slice(0, 10) }}
                // defaultValue={dateToday}
                onChange={(e) => setDate(e.target.value)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Typography variant='body1' className={clsx(classes.tableStateMent)}>
                Curriculum Completion Details :{' '}
                <b style={{ color: 'black' }}>{historyGrade.branchName}</b>{' '}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                  <TableHead className={clsx(classes.TableHeaderColor)} >
                    <TableRow>
                      <TableCell className={clsx(classes.textAlignLeft)}>
                        {' '}
                        <b style={{ color: 'black' }}>{historyGrade.gradeName}</b> :
                        Overview of All Subjects
                      </TableCell>
                      <TableCell className={clsx(classes.textAlignRight)} align='right'>
                        {/* Total Topics */}
                      </TableCell>
                      <TableCell className={clsx(classes.textAlignRight)} align='right'>
                        {/* Completed Topics */}
                      </TableCell>
                      <TableCell className={clsx(classes.textAlignRight)} align='right'>
                        {/* Avg.Completion */}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subject &&
                      subject.map((row, index) => (
                        <Row
                          key={row?.subject_id}
                          row={row}
                          params={props.match.params}
                          acad_session_id = {historyGrade?.acad_sess_id}
                          selectedAcademicYear = {selectedAcademicYear}
                        />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionSubject);
