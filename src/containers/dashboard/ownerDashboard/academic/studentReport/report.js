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
import Loader from 'components/loader/loader';
// import axiosInstance from '../../config/axios';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { connect, useSelector } from 'react-redux';
import { useRef } from 'react';
import axios from 'axios';
import '../style.scss';


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
}));

const StudentReport = (props) => {
  const classes = useStyles();
  const {
    match: {
      params: { branchId, gradeId, sectionId, subjectId },
    },
  } = props;
  const [volume, setVolume] = React.useState('');
  const [expanded, setExpanded] = useState(true);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [moduleId, setModuleId] = useState('');
  const [gradeList, setGradeList] = useState();
  const [branchList, setBranchList] = useState([]);
  const [acadId, setAcadId] = useState()
  let selectedBranchId;
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const [testData, setTestData] = useState([])
  const [cwdata, setCwData] = useState([])
  const [hwdata, setHwData] = useState([])
  const [cpdata, setCpData] = useState([])
  const history = useHistory();
  // let myRef = React.createRef()
  const refs = gradeList?.reduce((acc, value) => {
    acc[value?.id] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Blogs' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Principal Blogs') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);


  useEffect(() => {
    // getGrades(branchId);
    getBranches()
  }, [moduleId])

  useEffect(() => {
    getGrades(branchId);
  }, [acadId])


  const getBranches = () => {
    if (moduleId != '' || null || undefined) {
      axiosInstance.get(`${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`)
        .then((res) => {
          setBranchList(res.data.data.results)
          let branches = res?.data?.data?.results;
          if (branchId) {
            branches.forEach((item) => {
              if (item?.branch?.id == branchId) {
                setAcadId(item?.id)
              }
            })
          }
        })
        .catch(() => { });
    }
  }

  const getGrades = (branchId) => {
    console.log(branchList, "branchL");
    if (moduleId != '' || null || undefined) {
      axiosInstance.get(`${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&module_id=${moduleId}`)
        .then((res) => {
          setGradeList(res.data.data)
          TestData(res?.data?.data[0]?.grade_id)
          CwData(res?.data?.data[0]?.grade_id)
          HwData(res?.data?.data[0]?.grade_id)
          CPData(res?.data?.data[0]?.grade_id)
        })
        .catch(() => { });
    }
  }

  const TestData = async (each) => {
    await axios.get(`${endpoints.ownerDashboard.getTestData}?academic_session=${acadId}&grade=${each}`, {
      headers: {
        'X-DTS-Host': window.location.host,
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res, 'testData');
        setTestData(res?.data?.result?.stats)
      })
      .catch(() => { setTestData([]) });
  }

  const CwData = async (each) => {
    await axios.get(`${endpoints.ownerDashboard.getCWData}?acad_session_id=${acadId}&grade_id=${each}`, {
      headers: {
        'X-DTS-Host': window.location.host,
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res, 'cw');
        setCwData(res.data.result)
      })
      .catch(() => { 
        setCwData([])
      });
  }


  const HwData = async (each) => {
    await axios.get(`${endpoints.ownerDashboard.getHWData}?acad_session=${acadId}&grade_id=${each}`, {
      headers: {
        'X-DTS-Host': window.location.host,
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res, 'hw');
        setHwData(res.data.result)
      })
      .catch(() => { 
        setHwData([])
      });
  }

  const CPData = async (each) => {
    await axios.get(`${endpoints.ownerDashboard.getCPData}?acad_session=${acadId}&grade=${each}`, {
      headers: {
        'X-DTS-Host': window.location.host,
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res, 'cp');
        setCpData(res.data.result)
      })
      .catch(() => { 
        setCpData([])
      });
  }

  const handleChange = (each ,value) => (e, isExpanded) => {
    console.log('hello');
    setExpanded(isExpanded ? value : false);
    TestData(each?.grade_id)
    CwData(each?.grade_id)
    HwData(each?.grade_id)
    CPData(each?.grade_id)
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleTab = (each, tab) => {
    const payload = {
      acadId: acadId,
      grade: each,
      gradeList: gradeList,
      tab: tab,
      branch: branchId,
    }
    history.push({
      pathname: '/student-report/report-tab',
      state: {
        payload: payload
      }
    })
  }




  const handleScroll = (each , index) => {
    // console.log(myRef[each.id]);
   
    // myRef.current.scrollIntoView(index)
    // let element = document.getElementsByClassName(`acc${index}`).scrollIntoView({ behavior: 'smooth' })
    // element.scrollIntoView({ behavior: 'smooth' })
    refs[each?.id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()} >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Student Details
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
            <Grid item xs={12}>
              <Typography variant='body1'>Overview of All Grades</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}  >
                {gradeList &&
                  gradeList.map((each, index) => {
                    return (
                      <div className={`acc${index + 1}`}  ref={refs[each?.id]} >
                        {each ? (
                        <Accordion
                          elevation={0}
                          className={clsx(classes.accordion)}
                          // {...{
                          //   ...(index === 0 && {
                          //     expanded: expanded,
                          //   }),
                          // }}
                          id={index}
                          expanded={expanded === index + 1}
                          onChange={handleChange(each, index + 1)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={clsx(classes.accordianSummaryDiv)}>
                              <Typography>{each.grade_name}</Typography>
                              <Typography variant='caption'>
                                {/* T. Section : {each.totalSection} */}
                              </Typography>
                            </div>
                          </AccordionSummary>
                          {expanded && (
                          <AccordionDetails>
                            <div style={{ width: '100%', border: '1px solid black' }}>
                              <TableContainer>
                                <Table size='small'>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell></TableCell>
                                      <TableCell>T. Students</TableCell>
                                      <TableCell>St. below threshold</TableCell>
                                      <TableCell>Avg.Marks</TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {testData?.map((eachdetails, index) => {
                                      return (
                                        <TableRow key={index} onClick={() => handleTab(each, 0)} >
                                          <TableCell>Test</TableCell>
                                          <TableCell>{eachdetails?.total_students}</TableCell>
                                          <TableCell>
                                            {eachdetails?.below_threshold}
                                          </TableCell>
                                          <TableCell>{ eachdetails?.avg_score > 0 ? <>{`${Math.round(eachdetails?.avg_score)}%`} </> : <>0%</> }</TableCell>
                                          <TableCell>
                                            <IconButton size='small'>
                                              <ArrowForwardIcon />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                  <TableBody>


                                    <TableRow key={index} onClick={() => handleTab(each, 1)} >
                                      <TableCell>H.W.</TableCell>
                                      <TableCell>{hwdata?.total_students}</TableCell>
                                      <TableCell>
                                        {hwdata?.no_stud_below_threshold}
                                      </TableCell>
                                      <TableCell> { hwdata?.avg_marks > 0 ? <>{`${Math.round(hwdata?.avg_marks)}%`} </> : <>0%</> }</TableCell>
                                      <TableCell>
                                        <IconButton size='small'>
                                          <ArrowForwardIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>

                                  </TableBody>
                                  <TableBody>

                                    <TableRow key={index} onClick={() => handleTab(each, 2)} >
                                      <TableCell>C.W.</TableCell>
                                      <TableCell>{cwdata?.total_students}</TableCell>
                                      <TableCell>
                                        {cwdata?.students_below_threshold}
                                      </TableCell>
                                      <TableCell>{ cwdata?.avg_marks > 0 ? <>{`${Math.round(cwdata?.avg_marks)}%`}</> : <>0%</> }</TableCell>
                                      <TableCell>
                                        <IconButton size='small'>
                                          <ArrowForwardIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>

                                  </TableBody>
                                  <TableBody>
                                    {cpdata?.map((eachdetails, index) => {
                                      return (
                                        <TableRow key={index} onClick={() => handleTab(each, 3)} >
                                          <TableCell>C.P.</TableCell>
                                          <TableCell>{eachdetails?.total_students_count}</TableCell>
                                          <TableCell>
                                            {eachdetails?.below_threshold}
                                          </TableCell>
                                          <TableCell>{eachdetails?.avg_score > 0 ? <> {`${Math.round(eachdetails?.avg_score)}%`} </> : <>0%</> } </TableCell>
                                          <TableCell>
                                            <IconButton size='small'>
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
                          </AccordionDetails>
                          )}
                        </Accordion>
                        ) : <></>}
                      </div>
                    );
                  })}
              </div>
            </Grid>
          </Grid>
          <div className='button-grade-scroll'>
              <Typography style={{fontWeight: '600' , padding: '2%'}}>View Gradewise {'>'}</Typography>
              <div className='button-container'>
                {gradeList &&
                  gradeList.map((each, index) => {
                    return (
                      <>
                        <div className='button-area-div' >
                          <Button variant='contained' onClick={() => handleScroll(each , index)}  style={{minWidth: '100px'}} className='grade-button-hover' >
                            {each.grade_name}
                          </Button>
                        </div>
                      </>
                    );
                  })}
              </div>
          </div>
        </Grid>

        {/* {loading && <Loader />} */}
      </div>
    </Layout>
  );
};

export default withRouter(StudentReport);
