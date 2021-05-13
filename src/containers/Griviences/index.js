import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Divider, Grid, Paper, withStyles } from '@material-ui/core';
import Layout from '../Layout';
import GriviencesDetailContainer from './GriviencesDetailContainer/GriviencesDetailContainer';
import Axios from 'axios';
// import FilterIcon from '../../assets/images/FilterIcon.png';
import CallIcon from '@material-ui/icons/Call';
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
import {useLocation} from 'react-router-dom';
import './greviences.scss';

const StyledFilterButton = withStyles({
  root: {
    color: '#014B7E',
    marginLeft: '50px',
    marginBottom: '6px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    float: 'right',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconSize: {},
})(Button);

const GravienceHome = () => {
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
      await axiosInstance
        // .get(
        //   endpoints.grievances.listTickets +
        //     // `?academic_year_id=${36}&branch_id=${75}&grievance_type_id${1}`,
        //     `?academic_year_id=${1}&branch_id=${1}&grievance_type_id${1}`,
        //   {
        //     // .get(endpoints.grievances.listTickets, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // )

        .get(
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
      console.log(path, '********Student-view***********');
      await axiosInstance
        // .get(
        //   endpoints.grievances.listTickets +
        //     // `?academic_year_id=${36}&branch_id=${75}&grievance_type_id${1}`,
        //     `?academic_year_id=${1}&branch_id=${1}&grievance_type_id${1}`,
        //   {
        //     // .get(endpoints.grievances.listTickets, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // )

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
  };
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
      {studentView && setMobileView ? (
        <UpperGrade handlePassData={handlePassData} getGrivienceData={getGrivienceData} />
      ) : (
        <></>
      )}
      <div className='Greviences-container'>
        {/* {setMobileView ? } */}
        {/* <Dialog
          open={openGrievanceReportForm}
          onClose={handleCloseForm}
          aria-labelledby='form-dialog-title'
        >
          <GenerateReport close={handleCloseForm} />
        </Dialog> */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            marginLeft: '50px',
            marginRight: '50px',
            paddingLeft: '50px',
            paddingRight: '50px',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ color: '#014B7E' }}>
              <strong>All</strong>
            </span>
          </div>

          <div>
            {location.pathname !== '/griviences/student-view' && (
              <StyledFilterButton
                onClick={showFilters}
                startIcon={<FilterFilledIcon />}
              >
                Show filters
              </StyledFilterButton>
            )}
            {/* <Grid
              style={{
                marginBottom: '50px',
                color: 'pink',
                cursor: 'pointer',
              }}
              onClick={showFilters}
            >
              {/* <img src={Filter_Icon} className='filterIcon' /> */}
              {/* <img src={FilterIcon} color='primary' fontSize='medium' clss />  */}
              <FilterFilledIcon />
<<<<<<< HEAD
=======

>>>>>>> cd4472abc7745721fa29b36b4a20621099683df7
              <strong>Show filters</strong>
            </Grid> */}
            <Button
              color='primary'
              size='small'
              style={{
                position: 'relative',
                top: '-16px',
                // marginRight: '15%',
                // marginTop: '5%',
              }}
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
          {/* {setMobileView ? (
            <Button
              color='primary'
              size='small'
              style={{ position: 'relative', marginRight: '5%' }}
            >
              <Link to='/greviences/createnew'>Add New</Link>
            </Button>
          ) : (
            <></>
          )} */}
        </div>
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
      {!setMobileView ? (
        <div className='create-report-box'>
          <div className='create-report-button'>
            <Link to='/greviences/createnew'>
              <EmojiObjectsSharpIcon />
              CREATE REPORT
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default GravienceHome;
