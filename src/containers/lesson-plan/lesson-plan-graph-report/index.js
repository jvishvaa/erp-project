import React, { useContext, useEffect, useState, useStyles } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import moment from 'moment';
import Layout from '../../Layout';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import '../lesson-plan-report/lesson-report.css';
import { CompassCalibrationOutlined } from '@material-ui/icons';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LessonPlanGraphReport = ({
  handleLessonList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [teacherDropdown, setTeacherDropdown] = useState([]);

  const [subjId, setSubjId] = useState([]);
  const [graphData, setGraphData] = useState([]);
  // let centralGsMappingId
  const [centralGsMappingId, setCentralGsMappingId] = useState('');
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedCol, setSelectedCol] = useState({});
  const [loading, setLoading] = useState(false);
  // const [moduleId, setModuleId] = useState();
  // const [modulePermision, setModulePermision] = useState(true);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));

  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
  const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);
  const [selectedTeacherUser_id, setSelectedTeacherUser_id] = useState();

  const [datePopperOpen, setDatePopperOpen] = useState(false);

  const [teacherModuleId, setTeacherModuleId] = useState(null);
  // const themeContext = useTheme();
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));

  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));

  const [noFilterLogo, setNoFilterLogo] = useState(true);
  const [subjectList, setSubjectList] = useState([]);

  const [mapId, setMapId] = useState('');

  const [filterData, setFilterData] = useState({
    year: '',
    volume: '',
    grade: '',
    branch: '',
    section: '',
    teacher: '',
  });

  function getDaysAfter(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  let a;
  const handleClear = () => {
    setFilterData({
      year: '',
      volume: '',
      grade: '',
      branch: '',
      section: '',
      teacher: '',
    });
    setDateRangeTechPer([
      moment().subtract(6, 'days'),
      moment(),
    ]);
  };

  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
    }
  };

  const handleVolume = (event, value) => {
    setFilterData({ ...filterData, volume: '' });
    if (value) {
      setFilterData({ ...filterData, volume: value });
    }
  };

  const handleDateRangePicker = (e, value) => {
    setDateRangeTechPer(e);
    const startDate = e[0].format('YYYY-MM-DD');
    const endDate = e[1]?.format('YYYY-MM-DD');

    // ><<<<<>>>>>>>>>>>NEED DISCUSSION WITH BACKEND<<<<<<<<<>>>>>>>>><<<
    // axiosInstance.get(
    //     `${endpoints.lessonReport.lessonList}?grade=${filterData.grade.grade_id}&page=${1}&subjects=${subjId}&volume_id=${filterData.volume.id}&start_date=${startDate}&end_date=${endDate}`)
    //     .then(result=>{
    //         if(result.data.status_code === 200){
    //         const a=result.data.result.results
    //         const aa=a?.map(a=>a.central_gs_mapping_id)
    //         // centralGsMappingId=aa?.pop()
    //         setCentralGsMappingId(aa?.pop())
    //         }else {
    //             setAlert('error', result.data.message);
    //         }
    //     })
    // ><<<<<>>>>>>>>>>>NEED DISCUSSION WITH BACKEND<<<<<<<<<>>>>>>>>><<<
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', section: '', subject: '' });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(
          `${endpoints.lessonReport.subjects}?branch=${filterData.branch.id}&grade=${value.grade_id}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
        });
        const {year:{school:schoolSectionYear}={}} = filterData||{}
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?branch_id=${filterData.branch.id}&grade_id=${value.grade_id}&session_year=${schoolSectionYear?.id}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            // setSubjectDropdown(result.data.result);
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            // setSubjectDropdown([]);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSubjectDropdown([]);
      setSectionDropdown([]);
    }
  };
  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };

  const handleSubject = (event, value) => {
    setSubjectList([]);
    if (value.length > 0) {
      const ids = value.map((el) => el.subject_id);
      setSubjectIds(ids);
      const sIds = value.map((el) => el.id);
      setSubjId(sIds);
      setSubjectList(value);
      const {year:{school:{id:schoolAcademicId}}={}}=filterData||{}
      axiosInstance
        .get(
          `${endpoints.lessonReport.teacherList}?branch=${filterData?.branch?.id}&grade=${filterData?.grade?.grade_id}&section=${filterData.section?.section_id}&subject=${ids}&academic_year=${schoolAcademicId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTeacherDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
            setTeacherDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setTeacherDropdown([]);
        });
    }
    axiosInstance
      .get(
        `${endpoints.lessonPlan.chapterList}?gs_mapping_id=${value[0].id}&volume=${filterData.volume.id}&academic_year=${filterData.year.id}&grade_id=${filterData.grade.grade_id}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setMapId(result.data.result.central_gs_mapping_id);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setTeacherDropdown([]);
      });
  };

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '' });
    if (value) {
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(`${endpoints.academics.grades}?branch_id=${value.id}&module_id=8`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };
  const handleTeacher = (event, value) => {
    setFilterData({ ...filterData, teacher: '' });
    if (value) {
      setFilterData({ ...filterData, teacher: value });
    }
  };

  const handleFilter = () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    setLoading(true);
    setNoFilterLogo(false);
    axiosInstance
      .get(
        `${endpoints.lessonReport.lessonViewMoreData
        }?central_gs_mapping_id=${mapId}&volume_id=${filterData.volume.id
        }&academic_year_id=${filterData.year.id}&completed_by=${filterData.teacher.user_id
        }&start_date=${startDateTechPer.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setGraphData(result.data.result);
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };
  const fetchCentralAndSchoolsSessions = ()=>{
    const headers= {headers: {'x-api-key': 'vikash@12345#1231'}}
    const schoolSessionApiURL = endpoints.masterManagement.academicYear
    const schoolSessionProm = axiosInstance.get(schoolSessionApiURL)

    const centralSessionsApiURL = `${endpoints.baseURLCentral}/lesson_plan/list-session/`
    const centralSessionProm = axios.get(centralSessionsApiURL, headers)
    const promises = [schoolSessionProm,centralSessionProm]
    Promise.all(promises).then(res=>{
      const academicYears= []
      const [schoolAcademicYearsObj, centralAcademicYearsObj]= res

      const {data:{result:{results:schoolAcademicYears}={}}={}}=schoolAcademicYearsObj||{}
      let {data:{result:{results:centralAcademicYears}={}}={}}=centralAcademicYearsObj||{}
      let schoolAcademicYearsObjMap = {}
      schoolAcademicYears.forEach(item=>{
        schoolAcademicYearsObjMap[item.session_year] = item
      })
      centralAcademicYears.forEach(item=>{
        const obj = {...item, school:schoolAcademicYearsObjMap[item.session_year]}
        academicYears.push(obj)
      })
      setAcademicYearDropdown(academicYears)
    }).catch(e=>{
        setAlert('error', 'Failed to fetch academic sessions.');
    })
//     axios
//       .get(`${endpoints.baseURLCentral}/lesson_plan/list-session/`, {
//         headers: {
//           'x-api-key': 'vikash@12345#1231',
//         },
//       })
//       .then((result) => {
//         if (result.data.status_code === 200) {
//           setAcademicYearDropdown(result.data.result.results);
//         } else {
//           setAlert('error', result.data.message);
//         }
//       })
//       .catch((error) => {
//         setAlert('error', error.message);
//       });
// // fetch erp academic years
      
//       axiosInstance
//       .get(apiURL)
//       .then((result) => {
//         if (result.data.status_code === 200) {
//           setAcademicYearDropdown(result.data.result.results);
//         } else {
//           setAlert('error', result.data.message);
//         }
//       })
//       .catch((error) => {
//         setAlert('error', error.message);
//       });
// 
  }

  useEffect(() => {
    fetchCentralAndSchoolsSessions()
    axios
      .get(`${endpoints.baseURLCentral}/lesson_plan/list-volume/`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setVolumeDropdown(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });

    axiosInstance
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          // setBranchDropdown(result.data.data);
          setBranchDropdown(result.data.data.results.map(item=>((item&&item.branch)||false)).filter(Boolean))
          // setBranchId(result.data.data[1].id);
          // a = result.data.data[0].id
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  useEffect(() => {
    // if (branchId) {
    //   axiosInstance
    //     .get(`${endpoints.academics.grades}?branch_id=${branchId}&module_id=8`)
    //     .then((result) => {
    //       if (result.data.status_code === 200) {
    //         setGradeDropdown(result.data.data);
    //       } else {
    //         setAlert('error', result.data.message);
    //       }
    //     })
    //     .catch((error) => {
    //       setAlert('error', error.message);
    //     });
    // }
  }, [branchId]);

  // DATA FOR GRAPH
  const configObj = {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Chapter Wise Details  ',
      style: {
        fontSize: '1.1rem',
        color: '#ff6b6b',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '15px 15px 10px 15px',
      },
    },
    subtitle: {
      // text: 'Source: WorldClimate.com'
    },
    xAxis: {
      categories: graphData.map((e) => e.chapter_name),
      labels: {
        style: {
          fontSize: '1rem',
          fontWeight: '600',
          color: '#014b7e',
          margin: '10px 0px 0px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        },
      },
      // crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total No. Of Periods',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat:
      //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Total No. Of Periods',
        data: graphData.map((e) => e.no_of_periods),
        color: '#ff6b6b',
      },
      {
        name: 'Completed Periods',
        data: graphData.map((e) => e.completed_periods),
        color: '#014b7e',
      },
    ],
  };
  const canFilter = () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    const {
      volume:{id:volumeId}={}, 
      year:{id:yeadId}={}, 
      teacher:{user_id: teacherId }={},
      startDateTechPer: startDateTechPerTempVar,
      endDateTechPer: endDateTechPerPerTempVar
    }={...(filterData||{}),startDateTechPer,endDateTechPer}
    return ![mapId, volumeId, yeadId, teacherId, startDateTechPerTempVar, endDateTechPerPerTempVar].map(Boolean).includes(false)
  }
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        {loading ? <Loading message='Loading...' /> : null}
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Lesson Plan'
              childComponentName='Graphical Report'
            />
          </div>
        </div>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleAcademicYear}
              id='academic-year'
              className='dropdownIcon'
              value={filterData?.year}
              options={academicYearDropdown}
              getOptionLabel={(option) => option?.session_year}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleVolume}
              id='academic-year'
              className='dropdownIcon'
              value={filterData?.volume}
              options={volumeDropdown}
              getOptionLabel={(option) => option?.volume_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Volume'
                  placeholder='Volume'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='academic-year'
              className='dropdownIcon'
              value={filterData?.branch}
              options={branchDropdown}
              getOptionLabel={(option) => option?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='volume'
              className='dropdownIcon'
              value={filterData?.grade}
              options={gradeDropdown}
              getOptionLabel={(option) => option?.grade__grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSection}
              id='Section'
              className='dropdownIcon'
              value={filterData?.section}
              options={sectionDropdown}
              getOptionLabel={(option) => option?.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Section'
                  placeholder='Section'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              multiple
              style={{ width: '100%' }}
              size='small'
              onChange={handleSubject}
              id='subject'
              className='dropdownIcon'
              options={subjectDropdown}
              getOptionLabel={(option) => option?.subject_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleTeacher}
              id='subj'
              className='dropdownIcon'
              value={filterData?.teacher}
              options={teacherDropdown}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Teacher'
                  placeholder='Teacher'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <LocalizationProvider dateAdapter={MomentUtils}>
              <DateRangePicker
                startText='Select-date-range'
                value={dateRangeTechPer}
                // onChange={(newValue) => {
                //   setDateRangeTechPer(newValue);
                // }}
                onChange={(e) => handleDateRangePicker(e)}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        inputProps={{
                          ...inputProps,
                          value: `${inputProps.value} - ${endProps.inputProps.value}`,
                          readOnly: true,
                        }}
                        size='small'
                        style={{ minWidth: '100%' }}
                      />
                    </>
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>

          {!isMobile && <Grid item xs sm={4} />}
          <Grid item xs={12} sm={12}>
            <Divider />
          </Grid>
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              className='custom_button_master labelColor'
              size='medium'
              onClick={handleClear}
            >
              CLEAR ALL
            </Button>
          </Grid>
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master'
              size='medium'
              type='submit'
              disabled={!canFilter()}
              onClick={handleFilter}
            >
              FILTER
            </Button>
          </Grid>
        </Grid>
        {noFilterLogo ? (
          <div className='periodDataUnavailable'>
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '100px', width: '200px' }
                      : { height: '160px', width: '290px' }
                  }
                  src={unfiltered}
                />
              )}
            />
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '20px', width: '250px' }
                      : { height: '50px', width: '400px', marginLeft: '5%' }
                  }
                  src={selectfilter}
                />
              )}
            />
          </div>
        ) : (
            <HighchartsReact highcharts={Highcharts} options={configObj} />
          )}
      </Layout>
    </>
  );
};

export default LessonPlanGraphReport;
