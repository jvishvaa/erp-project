import React, { useEffect, useState, useRef } from 'react';
import Layout from '../Layout/index';
import { makeStyles, useTheme } from '@material-ui/core/styles'; 
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
import FilterMobile from './filterMobile/filterMobile';
import './timetable.scss';
const TimeTable = (props) => {
  const themeContext = useTheme();
  const setMobileView  = !useMediaQuery(themeContext.breakpoints.down('sm')); 
  const [loading, setLoading] = useState(false);
  // const setMobileView = useMediaQuery('(min-width:768px)');
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
  const [loopMax, setLoopMax] = useState([0, 1, 2, 3, 4, 5]);
  const [lengthMonday, setLengthMonday] = useState();
  const [lengthTuesday, setLengthTuesday] = useState();
  const [lengthWednesday, setLengthWednesday] = useState();
  const [lengthThursday, setLengthThursday] = useState();
  const [lengthFriday, setLengthFriday] = useState();
  const [maxLength, setMaxLength] = useState();
  const [moduleId, setModuleId] = useState();
  const [sectinName, setSectionName] = useState();
  const [teacherView, setTeacherView] = useState(false);
  const [openCloseTable, setOpenCloseTable] = useState(false);
  const [ids, setIDS] = useState(false);
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Time Table' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              location.pathname === '/time-table/student-view' &&
              item.child_name === 'Student Time Table'
            ) {
              setModuleId(item?.child_id);
              setTeacherView(false);
              setOpenCloseTable(false);
            } else if (
              location.pathname === '/time-table/teacher-view' &&
              item.child_name === 'Teacher Time Table'
            ) {
              setModuleId(item?.child_id);
              setTeacherView(true);
              setOpenCloseTable(false);
            }
          });
        }
      });
    }
  }, [location.pathname]);
  useEffect(() => {
    if (openCloseTable) {
      callGetTimeTableAPI();
    } else {
      setIDS(true);
    }
  }, [branchID]);
  const callGetTimeTableAPI = async () => {
    setLoading(true);
    await axiosInstance
      .get('/academic/time_table/', {
        params: {
          academic_year_id: acadamicYearID,
          branch_id: branchID,
          grade_id: gradeID,
          section_id: sectionID,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (tableData) {
            setLoading(false);
          }
          console.log('calculateLength();');
          calculateLength();
          setTableData(response.data.result);
        }
      })
      .catch((error) => {
        setLoading(false);
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
    setIDS({
      ...ids,
      academic_year_id: acadamicYear_ID,
      branch_id: grade_ID,
      grade_id: grade_ID,
      section_id: section_ID,
    });
  };
  const calculateLength = () => {
    if (tableData.Monday) {
      let lengthData = tableData.Monday.length;
      if (lengthData > 6) {
        setLengthMonday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Tuesday) {
      let lengthData = tableData.Tuesday.length;
      if (lengthData > 6) {
        setLengthTuesday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Wednesday) {
      let lengthData = tableData.Wednesday.length;
      if (lengthData > 6) {
        setLengthWednesday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Thursday) {
      let lengthData = tableData.Thursday.length;
      if (lengthData > 6) {
        setLengthThursday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Friday) {
      let lengthData = tableData.Friday.length;
      if (lengthData > 6) {
        setLengthFriday(lengthData);
      }
      console.log(lengthData);
    }
    // if(monday)
    let arrayLength = [
      lengthMonday,
      lengthTuesday,
      lengthWednesday,
      lengthThursday,
      lengthFriday,
    ];
    let sortedArray = arrayLength.sort();
    setMaxLength(lengthMonday);
    console.log(sortedArray, 'sorted array');
    console.log(maxLength, 'max length');
    let mappingArray = Array.from(Array(maxLength).keys());
    if (maxLength > 6) {
      setLoopMax(mappingArray);
    }
  };

  const handleClickAPI = () => {
    callGetTimeTableAPI();
  };
  const handleFilter = (value) => {
    setFilter(value);
  };
  const handleCloseTable = (value) => {
    setOpenCloseTable(value);
    if (!value) {
      setGradeName(null);
      setAcadamicYearName(null);
      setBranchName(null);
      setSectionName(null);
    }
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
                    moduleId={moduleId}
                    handleCloseTable={handleCloseTable}
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
                {openCloseTable ? (
                  <UserProvider value={ids}>
                    <DateAndCalander
                      passId={ids}
                      section_ID={sectionID}
                      grade_ID={gradeID}
                      branch_ID={branchID}
                      acadamicYear_ID={acadamicYearID}
                      teacherView={teacherView}
                      handlePassData={handlePassData}
                      callGetAPI={callGetTimeTableAPI}
                      tableData={tableData}
                    />
                  </UserProvider>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className='mobile-table-view'>
            <div className='time-table-breadcrums-container'>
              <CommonBreadcrumbs componentName='Time Table' />
            </div>
            {/* <FilterMobile
              moduleId={moduleId}
              handleCloseTable={handleCloseTable}
              handlePassData={handlePassData}
              handleClickAPI={handleClickAPI}
            /> */}
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
