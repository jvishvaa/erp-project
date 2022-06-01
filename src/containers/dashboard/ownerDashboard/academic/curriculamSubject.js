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
  // ChevronRightIcon as ArrowCircleRightIcon
} from '@material-ui/icons';
import ChevronRightIcon from '@material-ui/icons/ChevronRightRounded';
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
import { TableHeader } from 'semantic-ui-react';
import '../academic/style.scss';

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
    backgroundColor: '#f3edee'

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
    backgroundColor: 'white'
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
  }
}));

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
  const [totalGrade, setTotalGrade] = useState([])
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [subjectHeader, setSubjectHeader] = useState([]);
  const [moduleId, setModuleId] = useState('')
  const [errorValue,setErrorValue] = useState(true)
  const [clicked, setClicked] = useState(false)
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
    // console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    setHistoryGrade(history.location.state);
  }, [history]);

  // console.log(historyGrade, 'LAMP====>');

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
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        // console.log(res.data.result, 'TK');
        setSubject(res.data.result);
        // setSubjectId(res?.data?.result[0]?.subject_id);
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
    subjectList()
  }, [gradeId])

  // useEffect(()=> {
  //   subjectList()
  // },[gradeId])

  const subjectList = (params) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.subjectListGradeFilter}?session_year=${selectedAcademicYear?.id}&branch=${branchId}&grade=${gradeId}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
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

  }


  useEffect(() => {
    if (historyGrade?.acad_session_id) {
      gradeListTable({
        acad_session_id: historyGrade?.acad_session_id,
      })
    }

  }, [historyGrade?.acad_session_id])


  const gradeListTable = (params = {}) => {
    setLoading(true)
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        // setTableData(res?.data?.result)
        setTotalGrade(res?.data?.result)
        setLoading(false)

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      });
  };

  //   console.log(subjectId,'ID====>')

  useEffect(() => {
    if (subjectId && gradeId && date) {
      gradeWiseSubjectList({
        branch_id: branchId,
        grade_id: gradeId,
        subject_id: subjectId,
        date:date
      });
    }
  }, [subjectId, gradeId, date]);

  const gradeWiseSubjectList = (params = {}) => {
    setGradeWiseSubjectTable([])
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeSubjectReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        setErrorValue(true);
        setSubjectHeader(res.data.result.grand_dict)

        setGradeWiseSubjectTable(res?.data?.result?.data);
        // setTableData(res?.data?.result)
        setLoading(false);
        if (res.data.result.length === 0){
          setErrorValue(false);
        }

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        setErrorValue(false)
        setSubjectHeader([])
        setGradeWiseSubjectTable([])
        console.log(err);
        setLoading(false);
      });
  };

  const handleAccordion = (params, value) => (e, isExpanded) => {
    const testclick = document.querySelectorAll('#branchWise');
    setLoading(true)
    setClicked(true)
    setExpanded(isExpanded ? value : false)
    setSubjectId(null)
    if (params) {
      setSubjectId(params?.id);
      setLoading(false)
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
        acad_session_id: historyGrade?.acad_session_id
      },
    });
  };

  const handleScroll = (each, index) => {
    console.log(each, 'gradeId==>')
    // history.push(`/curriculum-completion-subject/${branchId}/${1}`)
    history.goBack()
  }


  // const handleRoute = (id,name) => {
  //   console.log(id,name, 'IIIII')
  // }



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
                Curriculum Completion
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={9} spacing={3}>
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
            <Grid item xs={3}>
              <TextField
                id='date'
                label='Select Date'
                type='date'
                value={date}
                size='small'
                variant='outlined'
                // defaultValue={dateToday}
                onChange={(e) => setDate(e.target.value)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>Overview of All Subject</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '95%',
                    margin: 'auto',
                  }}
                >

                  <div
                  >
                    <Typography variant='body1' className={clsx(classes.eachGradeName)}>
                      {' '}
                      {historyGrade?.gradeName}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '35%',
                      marginRight: '7%',
                    }}
                  >
                    {/* <div>Total</div>
                    <div>Total</div>
                    <div>Total</div> */}
                  </div>
                </div>
                {subject &&
                  subject.map((each, index) => {
                    return (

                      <div className={`acc${index + 1}`} >
                        {each ? (
                          <Accordion
                            elevation={0}
                            className={clsx(classes.accordion)}
                            expanded={expanded === index + 1}
                            onChange={handleAccordion(each, index + 1)}
                            id='branchWise'

                            style={{
                              margin: '10px 0',
                              border: '1px solid',
                              borderRadius: '10px',
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              style={{ display: 'flex', justifyContent: 'space-between', textTransform:'capitalize' }}
                            >
                              <Typography
                                className={clsx(classes.eachGradeName, classes.cursorUI)}
                                onClick={() =>
                                  handleHistory(each?.id, each?.subject_name)
                                }
                              >
                                {each?.subject_name}
                                {/* Dummy */}
                              </Typography>



                            </AccordionSummary>
                            <AccordionDetails>
                              {/* <div style={{ width: '100%' }}>
                                {subjectHeader && subjectHeader.map((data, index) => {
                                  return (

                                    <div
                                      style={{
                                        display: 'flex',
                                        width: '35%',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <Typography>
                                       
                                        {data?.grand_total_material}
                                      </Typography>
                                      <Typography>
                                       
                                        {data?.grand_total_material_completed}
                                      </Typography>
                                      <Typography>
                                       
                                        {data?.percentage_completed_all}%
                                      </Typography>
                                    </div>
                                  )

                                })}
                              </div> */}
                                      {errorValue ? (
          <>
                              <TableContainer>
                                <Table size='small'>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell></TableCell>
                                      <TableCell>
                                        <b>Total Periods</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          Completed Periods
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          Percentage Completed
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {subjectHeader &&
                                      subjectHeader.map((item, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell> <b>Overall</b></TableCell>
                                            <TableCell><b>{item?.grand_total_material} </b>  </TableCell>
                                            <TableCell> <b>{item?.grand_total_material_completed} </b>  </TableCell>
                                            <TableCell><b>  {item?.percentage_completed_all !== null ? (
                                              item?.percentage_completed_all
                                            ) : (
                                              <b
                                                style={{
                                                  color: 'red',
                                                  fontWeight: 'bolder',
                                                }}
                                              >
                                                NA
                                              </b>
                                            )} </b> {' '} <b> % </b>  </TableCell>
                                            <TableCell></TableCell>
                                          </TableRow>
                                        )
                                      })}
                                    {gradeWiseSubjectTable &&
                                      gradeWiseSubjectTable.map((item, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell> {item?.period__subject_mapping__section_mapping__section__section_name}</TableCell>
                                            <TableCell> {item?.total_material}</TableCell>
                                            <TableCell> {item?.total_material_completed}</TableCell>
                                            <TableCell> {item?.percentage_completed !== null ? (
                                              item?.percentage_completed
                                            ) : (
                                              <b
                                                style={{
                                                  color: 'red',
                                                  fontWeight: 'bolder',
                                                }}
                                              >
                                                NA
                                              </b>
                                            )} {' '} %</TableCell>
                                            <TableCell>
                                            </TableCell>
                                          </TableRow>
                                        )
                                      })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              </>
        ) : (
          <Grid
            xs={6}
            style={{ textAlign: 'center', margin: 'auto ', padding: '10px' }}
            spacing={6}
          >
            <Card elevation={0}>
              <CardContent>
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  No Data for Selected Subject
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
                              {/* <div style={{ width: '100%' }}>
                                {gradeWiseSubjectTable &&
                                  gradeWiseSubjectTable.map((item) => (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '95%',
                                          border: '1px solid',
                                          borderRadius: '4px',
                                          margin: '1% auto',
                                          padding: '7px',
                                        }}
                                      >
                                        <div
                                          style={{ fontSize: '15px', fontWeight: '600' }}
                                        >
                                          {item?.section_mapping__section__section_name}
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '35%',
                                            marginRight: '4%',
                                          }}
                                        >
                                          <div>{item?.total_material}</div>
                                          <div>{item?.total_material_completed}</div>
                                          <div>
                                            {item?.percentage_completed !== null ? (
                                              item?.percentage_completed
                                            ) : (
                                              <b
                                                style={{
                                                  color: 'red',
                                                  fontWeight: 'bolder',
                                                }}
                                              >
                                                NA
                                              </b>
                                            )} {' '} %
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ))}
                              </div> */}
                            </AccordionDetails>
                          </Accordion>

                        ) : (<></>)}

                      </div>

                    );
                  })}
              </div>
            </Grid>
          </Grid>
          <div className='button-grade-scroll'>
            <Typography style={{ fontWeight: '600', padding: '2%' }}>View Gradewise {'>'}</Typography>
            <div className='button-container'>
              {totalGrade &&
                totalGrade.map((each, index) => {
                  return (
                    <>
                      <div className='button-area-div' >
                        <Button variant='contained' onClick={() => handleScroll(each, index)} style={{ minWidth: '100px' }} className='grade-button-hover' >
                          {each.period__subject_mapping__section_mapping__grade__grade_name}
                        </Button>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>

        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionSubject);
