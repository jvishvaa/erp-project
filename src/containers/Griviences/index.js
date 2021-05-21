import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Divider, Grid, makeStyles, Paper, withStyles } from '@material-ui/core';
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
import './greviences.scss';

const useStyles = makeStyles({
  grivienceDiv: {
    '@media (max-width: 600px)': {
      marginBottom: '70px'
    }
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
})

const StyledFilterButton = withStyles({
  root: {
    color: '#014B7E',
    marginBottom: '5px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconSize: {},
})(Button);

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
  const [filters, setFilters] = React.useState({
    year: '',
    branch: '',
    grade: '',
    section: '',
    types: '',
  });

  const handleFilterData = (years, branchs, grades, sections, types) => {
    setFilters({
      year: years,
      branch: branchs,
      grade: grades,
      section: sections,
      types: types
    });
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
    // acadamicYear_ID,
    // grade_ID,
    // branch_ID,
    // section_ID,
    // academic_Year,
    // grade_Name,
    // branch_Name,
    // section_Name,
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
      // setAcadamicYear(acadamicYearID[0]);
      // setGradeID(gradeID[0]);
      // setBranchID(branchID[0]);
      // setSectionID(sectionID[0]);
      // setGrievanceTypeID(temp);
      setUserID(userID);
      setStudentView(studentView);
    }
    // setAcadamicYearName(academic_Year);
    // setGradeName(grade_Name);
    // setBranchName(branch_Name);
    // setSectionName(section_Name);
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
    if (path === '/griviences/admin-view') {
      await axiosInstance.get(
          `${endpoints.grievances.getGrivienceList}?academic_year=${acadamicYearID[0]}&branch=${branchID[0]}&grade=${gradeID[0]}&section=${sectionID[0]}&grievance_type=${temp}`
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
    } else if (path === '/griviences/student-view') {
      // await axiosInstance
      // .get(`${endpoints.grievances.getGrievenceErpList}?erp_id=${userName.user_id}`)
      //   .then((result) => {
      //     console.log(result, 'list data');
      //     if (result.status == 200) {
      //       console.log(result, 'list-tickets ddata');
      //       setGravienceList(result.data.data.results);
      //     } else {
      //       setAlert('error', result.data.message);
      //     }
      //   })
      //   .catch((error) => {
      //     setAlert('error', error.message);
      //   });
    }
  };

  useEffect(() => {
    console.log(filters,'filters');
    if (path === '/griviences/admin-view'){
      if(filters.year !== '' && filters.branch !== '' && filters.grade !== '' && filters.section !== '' && filters.types !== ''){
        axiosInstance.get(
          `${endpoints.grievances.getGrivienceList}?academic_year=${filters.year?.id}&branch=${filters.branch?.id}&grade=${filters.grade?.id}&section=${filters.section?.id}&grievance_type=${filters.types?.id}`
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
        // add 
        // axiosInstance.get(
        //   `${endpoints.grievances.getGrivienceList}`
        // )
        // .then((result) => {
        //   console.log(result, 'list data');
        //   if (result.status == 200) {
        //     console.log(result, 'list-tickets ddata');
        //     setGravienceList(result.data.data.results);
        //   } else {
        //     setAlert('error', result.data.message);
        //   }
        // })
        // .catch((error) => {
        //   //setAlert('error', error.message);
        //   setAlert('warning', 'Please select filter');
        // });
      }
    }
  },[filters])

  useEffect(() => {
    if(path === '/griviences/student-view'){
      axiosInstance
      .get(`${endpoints.grievances.getGrievenceErpList}?erp_id=${userName.user_id}`)
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
    }
  },[]);
  const showFilters = () => {
    console.log('sameera');
    setStudentView(!studentView);
    console.log(studentView, 'studentVieww');
  };

  return (
    <Layout>
      <div className='griviences-breadcrums-container'>
        <CommonBreadcrumbs componentName='Griviences' />
      </div>
      <div className={classes.grivienceDiv}>
        {location.pathname !== '/griviences/student-view' && (
          <div>
            <Collapse in={expanded}>
              <Filters handleFilterData={handleFilterData}/>
            </Collapse>
          </div>
        )}

        {/* {setMobileView ? (
          <UpperGrade handlePassData={handlePassData} getGrivienceData={getGrivienceData} />
        ) : (
          <></>
        )} */}
        <div className='Greviences-container'>
          <Grid
            container
            className={classes.buttonContainer}
          >
            <Grid item xs={12} sm={8}>
              <span style={{ color: '#014B7E' }}>
                <strong>All</strong>
              </span>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    color='primary'
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                </Grid>
                {location.pathname !== '/griviences/student-view' && (
                  <Grid item xs={6}>
                    <StyledFilterButton onClick={handleExpandClick} startIcon={<FilterFilledIcon />}>
                      Show filters
                    </StyledFilterButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Divider style={{ backgroundColor: '#78B5F3', width: '90%', marginLeft: '5%' }} />
          <div
            style={{
              maxWidth: '80%',
              margin: 'auto',
            }}
          >
            {gravienceList != undefined && gravienceList.length != 0
              ? gravienceList.map((result) => (
                  <GriviencesDetailContainer list_tickets={result} />
                ))
              : null}
          </div>
        </div>
      </div>
      {!setMobileView && (
          <div className='create-report-box'>
            <div className='create-report-button'>
              <Link to='/greviences/createnew'>
                <EmojiObjectsSharpIcon />
                CREATE REPORT
              </Link>
            </div>
          </div>
        )}
    </Layout>
  );
};

export default GravienceHome;
