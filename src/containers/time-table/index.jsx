import React, { useEffect, useState } from 'react';
import Layout from '../Layout/index';
import Loader from '../../components/loader/loader';
import FilterImage from '../../assets/images/Filter_Icon.svg';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import UpperGrade from './uppergrade/upper-grade.jsx';
import DateAndCalander from './date-and-calander/date-and-calander.jsx';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../config/axios';
import { useLocation } from 'react-router-dom';
import { UserProvider } from './tableContext/userContext';
import TimeTableMobile from './time-table-mobile-view/time-table-mobile';
import './timetable.scss';
const TimeTable = (props) => {
  const [loading, setLoading] = useState(false);
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [tableData, setTableData] = useState([]);
  const [Filter, setFilter] = useState(true);
  const [acadamicYearID, setAcadamicYear] = useState();
  const [gradeID, setGradeID] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const location = useLocation();
  const [sectionID, setSectionID] = useState();
  const [branchID, setBranchID] = useState();
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const [sectinName, setSectionName] = useState();
  const [teacherView, setTeacherView] = useState(false);
  const [ids, setIDS] = useState({
    academic_year_id: acadamicYearID,
    branch_id: branchID,
    grade_id: gradeID,
    section_id: sectionID,
  });
  console.log(location.pathname, 'url');
  // useEffect(() => {
  //   callGetTimeTableAPI();
  //   console.log('calling parent componet');
  // }, [gradeID]);
  useEffect(() => {
    if (NavData && NavData.length) {
      if (location.pathname === '/time-table/student-view') {
        setTeacherView(false);
      } else if (location.pathname === '/time-table/teacher-view') {
        setTeacherView(true);
      }
    }
  }, [location.pathname]);
  console.log(teacherView, 'find result teacherview');
  const callGetTimeTableAPI = async () => {
    setLoading(true);
    await axiosInstance
      .get('/academic/time_table/', {
        params: {
          academic_year_id: acadamicYearID,
          branch_id: branchID,
          grade_id: gradeID,
          section_id: sectionID,
          // academic_year_id: 1,
          // branch_id: 1,
          // grade_id: 3,
          // section_id: 1,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (tableData) {
            setLoading(false);
          }
          setTableData(response.data.result);
          console.log(response, 'table data');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const handlePassData = (
    acadamicYear_ID,
    grade_ID,
    section_ID,
    branch_ID,
    academic_Year,
    grade_Name,
    branch_Name,
    sectin_Name
  ) => {
    setAcadamicYear(Number(acadamicYear_ID));
    setGradeID(Number(grade_ID));
    setBranchID(Number(branch_ID));
    setSectionID(Number(section_ID));
    setGradeName(grade_Name);
    setAcadamicYearName(academic_Year);
    setBranchName(branch_Name);
    setSectionName(sectin_Name);
  //   setIDS( ...ids, academic_year_id: acadamicYear_ID,
  //     branch_id: grade_ID,
  //     grade_id: grade_ID,
  //     section_id: section_ID )
  // };
  }
  
  const handleClickAPI = () => {
    callGetTimeTableAPI();
  };
  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <>
      <Layout>
        {setMobileView ? (
          <>
            <div className='time-table-container'>
              <div className='time-table-breadcrums-container'>
                <CommonBreadcrumbs componentName='Time Table' />
                <div
                  className={Filter ? 'filter-container-hidden' : 'filter-container-show'}
                  onClick={() => {
                    handleFilter(true);
                  }}
                >
                  <div className='table-top-header'>
                    <div className='table-header-data'>{academicYear}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{branchName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{gradeName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{sectinName}</div>
                  </div>
                  <div className='filter-show'>
                    <div className='filter'>SHOW FILTER</div>
                    <img className='filterImage' src={FilterImage} />
                  </div>
                </div>
              </div>
              {Filter ? (
                <>
                  <UpperGrade
                    handlePassData={handlePassData}
                    handleClickAPI={handleClickAPI}
                  />
                  <div
                    className='filter-container'
                    onClick={() => {
                      handleFilter(false);
                    }}
                  >
                    <div className='filter'>HIDE FILTER</div>
                    <img src={FilterImage} />
                  </div>
                  <div className='devider-top'>
                    <Divider variant='middle' />
                  </div>
                  <div className='table-top-header'>
                    <div className='table-header-data'>{academicYear}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{branchName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{gradeName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{sectinName}</div>
                  </div>
                </>
              ) : (
                <> </>
              )}

              <div className='date-container'>
                <UserProvider value={ids}>
                  <DateAndCalander
                    passId={ids}
                    teacherView={teacherView}
                    handlePassData={handlePassData}
                    callGetAPI={callGetTimeTableAPI}
                    tableData={tableData}
                  />
                </UserProvider>
              </div>
            </div>
          </>
        ) : (
          <div className='mobile-table-view'>
            <div className='time-table-breadcrums-container'>
              <CommonBreadcrumbs componentName='Time Table' />
            </div>
            <TimeTableMobile
              teacherView={teacherView}
              callGetAPI={callGetTimeTableAPI}
              tableData={tableData}
            />
          </div>
        )}
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default TimeTable;
