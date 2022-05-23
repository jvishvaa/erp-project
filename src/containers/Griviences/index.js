import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  Typography
} from '@material-ui/core';
import Layout from '../Layout';
import GriviencesDetailContainer from './GriviencesDetailContainer/GriviencesDetailContainer';
import Axios from 'axios';
// import FilterIcon from '../../assets/images/FilterIcon.png';
import CallIcon from '@material-ui/icons/Call';
import Filters from './UpperGrid/Filters';
import Collapse from '@material-ui/core/Collapse';
// import FilterAltIcon from '@material-ui/icons/FilterAlt';

// import FilterAltIcon from '@material-ui/icons/FilterAlt';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import Filter_Icon from '../../assets/images/Filter_Icon.svg';

import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GenerateReport from './GenerateReportForm/generateReportForm';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import UpperGrade from './UpperGrid/upperGrid';
import EmojiObjectsSharpIcon from '@material-ui/icons/EmojiObjectsSharp';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import { connect, useSelector } from 'react-redux';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import './greviences.scss';

const useStyles = makeStyles({
  grivienceDiv: {
    '@media (max-width: 600px)': {
      marginBottom: '70px',
    },
  },
  buttonContainer: {
    marginTop: '20px',
    '@media (min-width: 601px)': {
      display: 'flex',
      justifyContent: 'space-between',
      marginLeft: '50px',
      marginRight: '50px',
      paddingLeft: '50px',
      paddingRight: '50px',
      alignItems: 'center',
    },
    '@media (max-width: 600px)': {
      display: 'flex',
      marginLeft: '20px',
      marginRight: '20px',
      alignItems: 'center',
    },
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
});

const StyledFilterButton = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    marginBottom: '5px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
    '&:hover': {
      // backgroundColor: 'transparent !important',
    },
  },
  iconSize: {},
}))(Button);

const GravienceHome = () => {
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const location = useLocation();
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const setMobileView = useMediaQuery('(min-width:800px)');
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [gravienceList, setGravienceList] = useState([]);
  const [studentView, setStudentView] = useState(false);
  const [userID, setUserID] = useState();
  const [acadamicYearID, setAcadamicYear] = useState();
  const [gradeID, setGradeID] = useState();
  const [sectionID, setSectionID] = useState();
  const [branchID, setBranchID] = useState();
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const [sectionName, setSectionName] = useState();
  const [openGrievanceReportForm, setOpenGrievanceReportForm] = useState(false);
  const [flag, setFlag] = useState(false);
  const [grievanceTypeID, setGrievanceTypeID] = useState();
  let userName = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [expanded, setExpanded] = React.useState(true);
  const [limit, setLimit] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [postFlag, setPostFlag] = useState(false)
  const [filters, setFilters] = React.useState({
    year: '',
    branch: '',
    grade: '',
    section: '',
    types: '',
  });
  const [filterFlag, setFilterFlag] = useState(false)
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [minStartDate, setMinStartDate] = useState();
  const [maxStartDate, setMaxStartDate] = useState();
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const history = useHistory()


  const [dateFlag, setDateFlag] = useState(false)

  const handleRefresh = () => {
    if (postFlag) {
      setPostFlag(false)
    } else {
      setPostFlag(true)
    }
  }

  const handleFilerFlag = () => {
    setFilters({
      year: '',
      branch: '',
      grade: '',
      section: '',
      types: ''
    })
    if (filterFlag) {
      setFilterFlag(false)
    } else {
      setFilterFlag(true)
    }
  }

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleFilterData = (years, branchs, grades, sections, types) => {
    setFilters({
      year: years,
      branch: branchs,
      grade: grades,
      section: sections,
      types: types,
    });
    if (path === '/griviences/admin-view') {
      if (
        years !== '' &&
        branchs !== '' &&
        grades !== '' &&
        sections !== '' &&
        types !== ''
      ) {
        axiosInstance
          .get(
            `${endpoints.grievances.getGrivienceList}?academic_year=${years?.id}&branch=${branchs?.id}&grade=${grades?.id}&section=${sections?.id}&grievance_type=${types?.id}&page_size=${limit}&page=${currentPage}`
          )
          .then((result) => {
            console.log(result, 'list data');
            if (result.status == 200) {
              console.log(result, 'list-tickets ddata');
              setGravienceList(result.data.data.results);
              setCurrentPage(result?.data?.data?.current_page)
              setTotalCount(result?.data?.data?.count)
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        // add
        axiosInstance
          .get(`${endpoints.grievances.getGrivienceList}?academic_year=${selectedAcademicYear.id}&page_size=${limit}&page=${currentPage}`)
          .then((result) => {
            console.log(result, 'list data');
            if (result.status == 200) {
              console.log(result, 'list-tickets ddata');
              setGravienceList(result.data.data.results);
              setCurrentPage(result?.data?.data?.current_page)
              setTotalCount(result?.data?.data?.count)
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            //setAlert('error', error.message);
            setAlert('warning', 'Please select filter');
          });
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(userName.user_id, 'userName');
  const handleOpenForm = () => {
    setOpenGrievanceReportForm(true);
  };

  const handleCloseForm = () => {
    setOpenGrievanceReportForm(false);
  };

  const handleDownload = async () => {
    await axiosInstance
      .get(endpoints.grievances.downloadTicket, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.status == 200) {
          setAlert('success', 'Download Started');
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };
  let path = window.location.pathname;
  console.log(path, 'path');

  const handlePassData = (
    acadamicYearID,
    gevienceTypeID,
    branchID,
    gradeID,
    sectionID,
    temp,
    userID,
    studentView,

    open_Dialog
  ) => {
    if (path === '/griviences/admin-view') {
      setAcadamicYear(acadamicYearID[0]);
      setGradeID(gradeID[0]);
      setBranchID(branchID[0]);
      setSectionID(sectionID[0]);
      setGrievanceTypeID(temp);
      setUserID(userID);
      if (open_Dialog && acadamicYearID && branchID && gradeID && sectionID && temp) {
        handleOpenForm();
      }
    } else if (path === '/griviences/student-view') {

      setUserID(userID);
      setStudentView(studentView);
    }

  };

  useEffect(() => {
    if (path === '/griviences/admin-view') {
      console.log(path, 'path');
      setStudentView(false);
    }
    if (path === '/griviences/student-view') {
      // console.log(path, 'path');
      let userName = JSON.parse(localStorage.getItem('userDetails')) || {};
      console.log(userName.user_id, 'userName');
      setUserID(userName.user_id);
      setStudentView(true);
    }
  }, []);

  const getGrivienceData = async (
    acadamicYearID,
    gevienceTypeID,
    branchID,
    gradeID,
    sectionID,
    temp,

    userID
  ) => {

  };

  useEffect(() => {
    console.log(filters, 'filters');
    if (path === '/griviences/admin-view') {
      if (filters.year !== '' && filters.branch !== '' && filters.grade !== '' && filters.section !== '' && filters.types !== '') {
        axiosInstance.get(
          `${endpoints.grievances.getGrivienceList}?academic_year=${filters.year?.id}&branch=${filters.branch?.id}&grade=${filters.grade?.id}&section=${filters.section?.id}&grievance_type=${filters.types?.id}&page_size=${limit}&page=${currentPage}`
        )
          .then((result) => {
            console.log(result, 'list data');
            if (result.status == 200) {
              console.log(result, 'list-tickets ddata');
              setGravienceList(result.data.data.results);
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        axiosInstance.get(
          `${endpoints.grievances.getGrivienceList}?academic_year=${selectedAcademicYear.id}&page_size=${limit}&page=${currentPage}`
        )
          .then((result) => {
            console.log(result, 'list data');
            if (result.status == 200) {
              console.log(result, 'list-tickets ddata');
              setGravienceList(result.data.data.results);
              setCurrentPage(result?.data?.data?.current_page)
              setTotalCount(result?.data?.data?.count)
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            //setAlert('error', error.message);
            setAlert('warning', 'Please select filter');
          });
      }
    }
  }, [currentPage, postFlag])

  useEffect(() => {
    if (path === '/griviences/admin-view') {
      axiosInstance.get(
        `${endpoints.grievances.getGrivienceList}?academic_year=${selectedAcademicYear.id}&page_size=${limit}&page=${currentPage}`
      )
        .then((result) => {
          console.log(result, 'list data');
          if (result.status == 200) {
            console.log(result, 'list-tickets ddata');
            setGravienceList(result.data.data.results);
            setCurrentPage(result?.data?.data?.current_page)
            setTotalCount(result?.data?.data?.count)
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          //setAlert('error', error.message);
          setAlert('warning', 'Please select filter');
        });
    }
  }, [filterFlag])

  useEffect(() => {
    if (path === '/griviences/student-view') {
      axiosInstance
        .get(`${endpoints.grievances.getGrievenceStudent}?user_id=${userName?.user_id}&page_size=${limit}&page=${currentPage}&academic_year=${selectedAcademicYear?.id}`)
        .then((result) => {
          if (result.status == 200) {
            console.log(result, 'sameeraaaaaaa');
            setGravienceList(result.data.data.results);
            setCurrentPage(result?.data?.data?.current_page)
            setTotalCount(result?.data?.data?.count)
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [currentPage, postFlag]);

  useEffect(() => {
    if (path === '/griviences/student-view') {
      const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
      if (endDateTechPer && dateFlag) {
        axiosInstance
          .get(`${endpoints.grievances.getGrievenceStudent}?user_id=${userName?.user_id}&page_size=${limit}&page=${currentPage}&start_date=${moment(startDateTechPer)?.format('YYYY-MM-DD')}&end_date=${moment(endDateTechPer)?.format('YYYY-MM-DD')}&academic_year=${selectedAcademicYear?.id}`)
          .then((result) => {
            if (result.status == 200) {
              console.log(result, 'sameeraaaaaaa');
              setGravienceList(result.data.data.results);
              setCurrentPage(result?.data?.data?.current_page)
              setTotalCount(result?.data?.data?.count)
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      }
    }
  }, [dateRangeTechPer]);
  const showFilters = () => {
    console.log('sameera');
    setStudentView(!studentView);
    console.log(studentView, 'studentVieww');
  };

  const createGrev = () => {
    history.push('/greviences/createnew')
  }

  return (
    <Layout>
      <div className='griviences-breadcrums-container'>
        <CommonBreadcrumbs componentName='Grievance'
          childComponentName={studentView ? 'Grievance Student' : 'Grievance teacher'}
          isAcademicYearVisible={true}
        />
      </div>
      <div className={classes.grivienceDiv}>
        {location.pathname !== '/griviences/student-view' && (
          <div>
            <Collapse in={expanded}>
              <Filters handleFilterData={handleFilterData} handleFilerFlag={handleFilerFlag} />
            </Collapse>
          </div>
        )}
        {location.pathname == '/griviences/student-view' && (
          <Grid style={{ margin: '0 5%', display: 'flex', justifyContent: 'space-between' }}>
            <LocalizationProvider dateAdapter={MomentUtils}   >
              <DateRangePicker
                // minDate={minStartDate ? new Date(minStartDate) : undefined}
                // maxDate={maxStartDate ? new Date(maxStartDate) : undefined}
                startText='Select-date-range'
                value={dateRangeTechPer}
                onChange={(newValue) => {
                  console.log(newValue, 'new');
                  setDateRangeTechPer(newValue);
                  setDateFlag(true);
                }}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        inputProps={{
                          ...inputProps,
                          value: `${moment(inputProps.value).format(
                            'DD/MM/YYYY'
                          )} - ${moment(endProps.inputProps.value).format(
                            'DD/MM/YYYY'
                          )}`,
                          readOnly: true,
                          endAdornment: (
                            <IconButton>
                              <DateRangeIcon
                                style={{ width: '35px' }}
                                color='primary'
                              />
                            </IconButton>
                          ),
                        }}
                        size='small'
                      />
                    </>
                  );
                }}
              />
            </LocalizationProvider>
            {studentView ?
              <div >
                <Button onClick={createGrev} >
                  <EmojiObjectsSharpIcon />
                  CREATE GRIEVANCE
                </Button>
              </div>
              : ''}
          </Grid>
        )}

        {/* {setMobileView ? (
          <UpperGrade handlePassData={handlePassData} getGrivienceData={getGrivienceData} />
        ) : (
          <></>
        )} */}
        <div className='Greviences-container'>
          <Grid container className={classes.buttonContainer}>
            <Grid item xs={12} sm={8}>

            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container>
                {/* <Grid item xs={6}>
                  <Button color='primary' onClick={handleDownload}>
                    Download
                  </Button>
                </Grid> */}
                {location.pathname !== '/griviences/student-view' && (
                  <Grid item xs={6}>
                    <StyledFilterButton
                      onClick={handleExpandClick}
                      startIcon={<FilterFilledIcon />}
                      style={{ fontSize: '18px', fontWeight: '600', background: '#E2E2E2' }}
                    >
                      {expanded ? 'Hide Filters ' : ' Show filters '}
                    </StyledFilterButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Divider
            style={{ backgroundColor: '#78B5F3', width: '90%', marginLeft: '5%' }}
          />
          <div
            style={{
              maxWidth: '80%',
              margin: 'auto',
            }}
          >
            {gravienceList != undefined && gravienceList.length > 0
              ? gravienceList.map((result) => (
                <GriviencesDetailContainer
                  list_tickets={result}
                  handleFilterData={handleFilterData}
                  FilterData={filters}
                  setPostFlag={setPostFlag}
                  handleRefresh={handleRefresh}
                />
              ))
              : null}
          </div>
        </div>
      </div>

      <TablePagination
        component='div'
        count={totalCount}
        rowsPerPage={limit}
        page={Number(currentPage) - 1}
        onChangePage={(e, page) => {
          setCurrentPage(page + 1)
        }}
        rowsPerPageOptions={false}
        className='table-pagination'
        classes={{
          spacer: classes.tablePaginationSpacer,
          toolbar: classes.tablePaginationToolbar,
        }}
      />
    </Layout>
  );
};

export default GravienceHome;
