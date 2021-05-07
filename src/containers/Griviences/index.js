import { Avatar, Button, Divider, Grid, Paper } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout';
import GriviencesDetailContainer from './GriviencesDetailContainer/GriviencesDetailContainer';
import Axios from 'axios';
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
import './greviences.scss';

const GravienceHome = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const setMobileView = useMediaQuery('(min-width:800px)');
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [gravienceList, setGravienceList] = useState([]);
  const [acadamicYearID, setAcadamicYear] = useState(1);
  const [gradeID, setGradeID] = useState(1);
  const [sectionID, setSectionID] = useState(1);
  const [branchID, setBranchID] = useState(1);
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const [sectionName, setSectionName] = useState();
  const [openGrievanceReportForm, setOpenGrievanceReportForm] = useState(false);
  const [flag, setFlag] = useState(false);

  const handleOpenForm = () => {
    setOpenGrievanceReportForm(true);
  };

  const handleCloseForm = () => {
    setOpenGrievanceReportForm(false);
  };

  const getGrivienceData = async () => {
    await axiosInstance
      .get(
        endpoints.grievances.listTickets +
          `?academic_year_id=${1}&branch_id=${1}&grievance_type_id${1}`,
        {
          // .get(endpoints.grievances.listTickets, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  const handlePassData = (
    acadamicYear_ID,
    grade_ID,
    branch_ID,
    section_ID,
    academic_Year,
    grade_Name,
    branch_Name,
    section_Name,
    open_Dialog
  ) => {
    setAcadamicYear(acadamicYear_ID);
    setGradeID(grade_ID);
    setBranchID(branch_ID);
    setSectionID(section_ID);
    setAcadamicYearName(academic_Year);
    setGradeName(grade_Name);
    setBranchName(branch_Name);
    setSectionName(section_Name);
    if (open_Dialog && acadamicYear_ID && branch_ID && grade_ID && section_ID) {
      handleOpenForm();
    }
  };

  useEffect(() => {
    // getGrivienceData();
  }, []);

  return (
    <Layout>
      <div className='griviences-breadcrums-container'>
        <CommonBreadcrumbs componentName='Griviences' />
      </div>
      {setMobileView ? (
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
            <Button
              color='primary'
              size='small'
              style={{
                position: 'relative',
                top: '-16px',
                // marginRight: '5%',
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
