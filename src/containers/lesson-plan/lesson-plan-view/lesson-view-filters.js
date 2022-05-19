import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';
import VisibilityIcon from '@material-ui/icons/Visibility';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import './lesson.css';
import { useLocation } from 'react-router-dom';
import { getModuleInfo } from '../../../utility-functions';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  overviewSynopsisTag : {
    fontSize: "16px",
    fontWeight:"600",
     color: theme.palette.secondary.main,
  }

 }))

const LessonViewFilters = ({
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
  setLoading,
  setCentralGradeName,
  setCentralSubjectName,
}) => {
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [studentModuleId, setStudentModuleId] = useState();
  const [teacherModuleId, setTeacherModuleId] = useState();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const location = useLocation();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [defaultAcademicYear, setDefaultAcademicYear] = useState([]);
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
  const [boardDropdown, setBoardDropdown] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState([]);
  const [moduleDropdown, setModuleDropdown] = useState([]);
  const [selectedKeyConceptId, setSelectedKeyConceptId] = useState([]);
  const [keyConceptDropdown, setKeyConceptDropdown] = useState([]);
  let token = JSON.parse(localStorage.getItem('userDetails'))?.token || {};
  const [erpYear, setErpYear] = useState({});
  const classes = useStyles();
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com'
  ]

  const [filterData, setFilterData] = useState({
    academic: '',
    branch: '',
    year: '',
    volume: '',
    grade: '',
    subject: '',
    chapter: '',
    board: '',
    module: '',
    keyconcept: '',
  });

  const handleClear = () => {
    setFilterData({
      academic: '',
      branch: '',
      year: '',
      volume: '',
      grade: '',
      subject: '',
      chapter: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setFilterDataDown({});
    setOverviewSynopsis([]);
    setSelectedIndex(-1);
    setCentralGsMappingId();
    setCentralSubjectName('');
    setCentralGradeName('');
    // if (defaultAcademicYear) {
    //   handleAcademicYear('', defaultAcademicYear);
    // }
  };

  useEffect(() => {
    setLoading(true);
    handleClear();
    setLoading(false);
  }, [location.pathname]);

  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '',volume : '',branch : '',grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: '' });
    setBranchDropdown([])
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setGradeDropdown([])
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    if (value) {
      setFilterData({ ...filterData, year: value, volume : '',branch : '',grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: '' });
      setBranchDropdown([])
    }
  };

  const handleVolume = (event, value) => {
    setFilterData({ ...filterData, volume: '',branch : '',grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: ''});
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setGradeDropdown([])
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    if (value) {
      setFilterData({ ...filterData, volume: value ,branch : '',grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: '' });
    }
  };

  useEffect(() => {
    if (!boardFilterArr.includes(window.location.host)) {
      if (filterData?.subject && boardDropdown.length > 0) {
        let data = boardDropdown?.filter((item) => item?.board_name === 'CBSE');
        handleBoard('', data);
      }
    } 
},[filterData?.subject,boardDropdown])

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Lesson Plan' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              location.pathname === '/lesson-plan/student-view' &&
              item.child_name === 'Student View'
            ) {
              setStudentModuleId(item?.child_id);
            } else if (
              location.pathname === '/lesson-plan/teacher-view' &&
              item.child_name === 'Teacher View'
            ) {
              setTeacherModuleId(item?.child_id);
            }
          });
        }
      });
    }
  }, [location.pathname]);

  function getModuleId() {
    const tempObj = {
      '/lesson-plan/teacher-view/': 'Teacher View',
      '/lesson-plan/teacher-view': 'Teacher View',
      '/lesson-plan/student-view': 'Student View',
      '/lesson-plan/student-view/': 'Student View',
      default: 'Teacher View',
    };
    const moduleName = tempObj[location.pathname] || tempObj['default'];
    return getModuleInfo(moduleName).id;
  }
  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: '', });
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setGradeDropdown([])
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
        board: '', module: '', keyconcept: '',
      });
      setSubjectDropdown([]);
    setChapterDropdown([]);
    setGradeDropdown([])
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
      axiosInstance
        .get(
          `${endpoints.communication.grades}?session_year=${erpYear?.id}&branch_id=${
            value.id
          }&module_id=${
            location.pathname === '/lesson-plan/student-view'
              ? studentModuleId
              : teacherModuleId
          }`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setGradeDropdown(result?.data?.data);
          } else {
            setAlert('error', result?.data?.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', subject: '', chapter: '',board: '', module: '', keyconcept: '', });
    setChapterDropdown([]);
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
    if (value && filterData.branch) {
    setFilterData({ ...filterData, grade: value, subject: '', chapter: '',board: '', module: '', keyconcept: '', });
    setChapterDropdown([]);
    setBoardDropdown([])
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
      axiosInstance
        .get(
          `${endpoints.lessonPlan.gradeSubjectMappingList}?session_year=${
            erpYear?.id
          }&branch=${filterData.branch.id}&grade=${value.grade_id}&module_id=${
            location.pathname === '/lesson-plan/student-view'
              ? studentModuleId
              : teacherModuleId
          }`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setSubjectDropdown(result?.data?.result);
          } else {
            setAlert('error', result?.data?.message);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: '', chapter: '', board: '', module: '', keyconcept: ''});
    setChapterDropdown([]);
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
    if (filterData.grade && filterData.year && filterData.volume && value) {
      setLoading(true)
      setFilterData({ ...filterData, subject: value, chapter: '', board: '', module: '', keyconcept: '' });
      setChapterDropdown([]);
    setSelectedBoardId([])
    setModuleDropdown([])
    setKeyConceptDropdown([])
    setOverviewSynopsis([]);
      if (
        value &&
        filterData.branch &&
        filterData.year &&
        filterData.volume &&
        filterData.volume?.id
      ) {
        axiosInstance
          .get('academic/get-board-list/')
          .then((result) => {
            if (result?.data?.status_code === 200) {
              if(!boardFilterArr.includes(window.location.host)){
                setBoardDropdown(result?.data?.result)
              }
              setLoading(false)
              setBoardDropdown(result?.data?.result)
            } else {
              setLoading(false)
              setAlert('error', result.data.message);
              setBoardDropdown([]);
              setChapterDropdown([]);
            }
          })
          .catch((error) => {
            setLoading(false)
            setAlert('error', error.message);
            setChapterDropdown([]);
            setBoardDropdown([]);
          });
      }
    } else {
      setLoading(false)
      setChapterDropdown([]);
      setBoardDropdown([]);
    }
  };

  const handleChapter = (event, value) => {
    setLoading(true)
        setFilterData({ ...filterData, chapter: '', keyconcept: '' });
        setOverviewSynopsis([]);
        if (value) {
            setLoading(true)
            setSelectedKeyConceptId(value)
            setFilterData({ ...filterData, chapter: value, keyconcept: '' });
            if (filterData.year && filterData.volume && value.length !== 0) {
                axiosInstance.get(`academic/get-key-concept-list/?chapter=${value?.id}`)
                    .then(result => {
                        if (result.data.status_code === 200) {
                            setLoading(false)
                            setKeyConceptDropdown(result.data.result);
                        }
                        else {
                            setLoading(false)
                            setAlert('error', result.data.message);
                            setKeyConceptDropdown([]);
                        }
                    })
                    .catch(error => {
                        setLoading(false)
                        setAlert('error', error.message);
                        setKeyConceptDropdown([]);
                    })
            }
        }
        else {
            setLoading(false)
            setKeyConceptDropdown([]);
        }
  };

  const handleFilter = () => {
    setSelectedIndex(-1);
    if (filterData.chapter && filterData.keyconcept) {
      handlePeriodList(filterData.chapter?.id,filterData.keyconcept?.id);
      setFilterDataDown(filterData);
      axiosInstance
        .get(
          `${endpoints.lessonPlan.overviewSynopsis}?volume=${filterData.volume.id}&grade_subject_mapping_id=${centralGsMappingId}&academic_year_id=${filterData.year.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setOverviewSynopsis(result?.data?.result);
          } else {
            setOverviewSynopsis([]);
          }
        })
        .catch((error) => {
          if (error.message === 'Request failed with status code 402') {
            setAlert('error', 'Access Error');
          } else {
            setAlert('error', error?.message);
          }
        });
    } else {
      setAlert('warning', 'Please select chapter and Key Concept !');
      setFilterDataDown({});
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${getModuleId()}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setAcademicYear(res?.data?.data);
        }
      })
      .catch((error) => {
        setAlert('error ', error?.message);
      });
    axios
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAcademicYearDropdown(result?.data?.result?.results);
          setDefaultAcademicYear(result?.data?.current_acad_session_data[0]);
          if (academicYear && academicYearDropdown) {
            handleAcademicYear('', result?.data?.current_acad_session_data[0]);
          }
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });

    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeDropdown(result?.data?.result?.results);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  }, []);

  useEffect(() => {
    if (academicYear.length && filterData.year?.id) {
      let erp_year;
      const acad = academicYear.map((year) => {
        if (year?.session_year === filterData.year?.session_year) {
          erp_year = year;
          setErpYear(year);
          setFilterData({ ...filterData, academic: year });
          return year;
        }
        return {};
      });
      if(erp_year && erp_year?.id){
        axiosInstance
        .get(
          `${endpoints.communication.branches}?session_year=${
            erp_year?.id
          }&module_id=${getModuleId()}`
        )
        .then((response) => {
          if (response?.data?.status_code === 200) {
            setBranchDropdown(
              response?.data?.data?.results
                .map((item) => (item && item.branch) || false)
                .filter(Boolean)
            );
          } else {
            setAlert('error', response.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
      }else{
        setAlert('error', `No Data Found For The Academic Year ${filterData.year?.session_year}`)
      }
      
    }
  }, [filterData.year, academicYear]);

  const handleKeyConcept = (event, value) => {
    // setFilterData({ ...filterData, subject: '', chapter: '', board: '', module: '', keyconcept: ''});
    setFilterData({ ...filterData, keyconcept: '' });
    setOverviewSynopsis([]);
    if (value) {
        setFilterData({ ...filterData, keyconcept: value });
    }



};


const handleModule = (event = {}, value = []) => {
  setLoading(true)
  setFilterData({ ...filterData, module: '',chapter: '', keyconcept: ''});
  setKeyConceptDropdown([])
  setOverviewSynopsis([]);
  if (value) {
    setLoading(true)
    setSelectedModuleId(value?.id)
    setKeyConceptDropdown([])
    setFilterData({ ...filterData, chapter: '', module: value, keyconcept: '' });
      axiosInstance
        .get(
          `${`/academic/central-chapters-list-v3/`}?subject_id=${
            filterData?.subject?.subject_id
          }&volume=${filterData.volume.id}&academic_year=${
            filterData.year.id
          }&grade_id=${filterData.grade.grade_id}&branch_id=${filterData.branch.id}&board=${selectedBoardId}&module_id=${value?.id}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false)
            setChapterDropdown(result?.data?.result?.chapter_list);
          } else {
            setLoading(false)
            setAlert('error', result.data.message);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', error.message);
          setChapterDropdown([]);
        });
  } else {
    setLoading(false)
    setChapterDropdown([]);
  }


};

const handleBoard = (event = {}, values = []) => {
  setFilterData({ ...filterData, board: '', module: '',chapter: '', keyconcept: ''});
  setChapterDropdown([]);
    setKeyConceptDropdown([])
    setModuleDropdown([])
    setOverviewSynopsis([]);
  if (values.length > 0) {
    setChapterDropdown([]);
    setKeyConceptDropdown([])
    setLoading(true)
    const ids = values.map((el) => el);
    const selectedId = values.map((el) => el?.id)
    setSelectedBoardId(selectedId)
    setFilterData({ ...filterData,  chapter: '', board: ids, module: '', keyconcept: '' });
      axiosInstance
        .get(
          `${`academic/get-module-list/`}?subject_id=${
            filterData?.subject?.subject_id
          }&volume=${filterData.volume.id}&academic_year=${
            filterData.year.id
          }&grade_id=${filterData.grade.grade_id}&branch_id=${filterData.branch.id}&board=${selectedId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false)
            setModuleDropdown(result?.data?.result?.module_list);
            setCentralGsMappingId(result?.data?.result?.central_gs_mapping_id);
            setCentralSubjectName(result?.data?.result?.central_subject_name);
            setCentralGradeName(result?.data?.result?.central_grade_name);
          } else {
            setAlert('error', result?.data?.message);
            setChapterDropdown([]);
            setLoading(false)
            setSelectedBoardId([])
            setModuleDropdown([])
          }
        })
        .catch((error) => {
          setLoading(false)
          setAlert('error', error.message);
          setSelectedBoardId([]);
          setModuleDropdown([])

        });
    
  } else {
    setChapterDropdown([]);
    setLoading(false)
    setSelectedBoardId([]);
    setModuleDropdown([])

  }
}

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleAcademicYear}
          id='academic-year'
          className='dropdownIcon'
          value={filterData?.year || ''}
          options={academicYearDropdown || []}
          getOptionLabel={(option) => option?.session_year || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Lesson Plan Acad Year'
              placeholder='Lesson Plan Acad Year'
            />
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleVolume}
          id='volume'
          className='dropdownIcon'
          value={filterData?.volume || ''}
          options={volumeDropdown || []}
          getOptionLabel={(option) => option?.volume_name || ''}
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
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='branch'
          className='dropdownIcon'
          value={filterData.branch || ''}
          options={branchDropdown || []}
          getOptionLabel={(option) => option?.branch_name || ''}
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
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className='dropdownIcon'
          value={filterData?.grade || ''}
          options={gradeDropdown || []}
          getOptionLabel={(option) => option?.grade__grade_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSubject}
          id='subject'
          className='dropdownIcon'
          value={filterData?.subject || ''}
          options={subjectDropdown || []}
          getOptionLabel={(option) => option?.subject_name || ''}
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
      {(boardFilterArr.includes(window.location.host)) && <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          multiple
          style={{ width: '100%' }}
          size='small'
          onChange={handleBoard}
          id='board'
          className='dropdownIcon'
          value={filterData.board || []}
          options={boardDropdown || []}
          getOptionLabel={(option) => option?.board_name || ''}
          // filterSelectedOptions
          getOptionSelected={(option, value) => option?.id == value?.id}
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Board' placeholder='Board' />
          )}
        />
      </Grid>}
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          // multiple
          style={{ width: '100%' }}
          size='small'
          onChange={handleModule}
          id='module'
          className='dropdownIcon'
          value={filterData.module || []}
          options={moduleDropdown || []}
          getOptionLabel={(option) => option?.lt_module_name || ''}
          filterSelectedOptions
          // getOptionSelected={(option, value) =>
          //     option?.id == value?.id
          //   }
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Module'
              placeholder='Module'
            />
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleChapter}
          id='chapter'
          className='dropdownIcon'
          value={filterData?.chapter || ''}
          options={chapterDropdown || []}
          getOptionLabel={(option) => option?.chapter_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Chapter'
              placeholder='Chapter'
            />
          )}
        />
      </Grid>
      <Grid item
        xs={12}
        sm={4}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleKeyConcept}
            id='keyConcept'
            className='dropdownIcon'
            value={filterData.keyconcept}
            options={keyConceptDropdown}
            getOptionLabel={(option) => option?.topic_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='KeyConcept'
                placeholder='KeyConcept'
              />
            )}
          />
        </Grid>
      {!isMobile && (
        <Grid item xs={12} sm={12}>
          <Divider />
        </Grid>
      )}
      {isMobile && <Grid item xs={12} />}
      <Grid
        item
        xs={12}
        sm={2}
        className={isMobile ? '' : 'addButtonPadding'}
        style={{ paddingBottom: '0px' }}
      >
        <Button
          variant='contained'
          className='labelColor cancelButton'
          style={{ width: '100%' }}
          size='medium'
          onClick={handleClear}
        >
          Clear All
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} />}
      {isMobile && <Grid item xs={3} />}
      <Grid item xs={12} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white', width: '100%' }}
          color='primary'
          size='medium'
          onClick={handleFilter}
        >
          Filter
        </Button>
      </Grid>
      {overviewSynopsis?.map((obj) => (
        <Grid item xs={6} sm={4} className={isMobile ? '' : 'addButtonPadding'}>
          <a
            className='underlineRemove'
            onClick={() => {
              const fileSrc = `${endpoints.lessonPlan.s3}${obj?.media_file[0]}`;
              openPreview({
                currentAttachmentIndex: 0,
                attachmentsArray: [
                  {
                    src: fileSrc,
                    name: `${
                      obj.lesson_type === '1'
                        ? 'Portion Document'
                        : 'Yearly Curriculum on the ERP (new)'
                    }`,
                    extension: '.' + fileSrc.split('.')[fileSrc.split('.').length - 1],
                  },
                ],
              });
            }}
          >
            <div className='overviewSynopsisContainer'>
              <div className={classes.overviewSynopsisTag}>
                {obj.lesson_type === '1'
                  ? 'Portion Document'
                  : 'Yearly Curriculum on the ERP (new)'}
              </div>
              <div className='overviewSynopsisIcon'>
                <SvgIcon component={() => <VisibilityIcon color='primary' />} />
              </div>
            </div>
          </a>
        </Grid>
      ))}
    </Grid>
  );
};

export default LessonViewFilters;
