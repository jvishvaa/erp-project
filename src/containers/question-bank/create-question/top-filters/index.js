import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import './top-filters.css';

const TopFilters = ({ setFilterDataDisplay, setIsFilter, setIsTopFilterOpen }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const [filterData, setFilterData] = useState({
    academic: '',
    branch: '',
    grade: '',
    subject: '',
    chapter: '',
    topic: '',
  });

  const [dropdownData, setDropdownData] = useState({
    academic: [],
    branch: [],
    grades: [],
    subjects: [],
    chapters: [],
    topics: [],
  });

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Question Bank') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData({
              academic: result.data?.data,
              branch: [],
              grades: [],
              subjects: [],
              chapters: [],
              topics: [],
            });
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  // useEffect(() => {
  // axiosInstance
  //   .get(`${endpoints.lessonPlan.gradeListCentral}`, {
  //     headers: { 'x-api-key': 'vikash@12345#1231' },
  //   })
  //   .then((result) => {
  //     if (result.data.status_code === 200) {
  //       setDropdownData({
  //         ...dropdownData,
  //         grades: result.data?.result?.results,
  //         subjects: [],
  //         chapters: [],
  //         topics: [],
  //       });
  //     } else {
  //       setAlert('error', result.data?.message);
  //     }
  //   })
  //   .catch((error) => {
  //     setAlert('error', error.message);
  //   });
  // }, []);

  const handleAcademicYear = (event, value) => {
    setFilterData({
      academic: '',
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    });
    setDropdownData({
      ...dropdownData,
      branch: [],
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    });
    if (value) {
      setFilterData({
        ...filterData,
        academic: value,
      });
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${value.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData({
              ...dropdownData,
              branch: result.data?.data?.results,
            });
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    });
    setDropdownData({
      ...dropdownData,
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    });
    if (value) {
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(`${endpoints.assessmentApis.gradesList}?branch=${value.branch.id}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData({
              ...dropdownData,
              grades: result.data?.result?.results,
            });
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({
      ...filterData,
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    });
    setDropdownData({
      ...dropdownData,
      subjects: [],
      chapters: [],
      topics: [],
    });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(
          `${endpoints.assessmentApis.gradesList}?gs_id=${value.id}&branch=${filterData.branch.id}`
        ) //new_changes
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData({
              ...dropdownData,
              subjects: result.data?.result?.results,
            });
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleSubject = (event, value) => {
    setFilterData({
      ...filterData,
      subject: '',
      chapter: '',
      topic: '',
    });
    setDropdownData({
      ...dropdownData,
      chapters: [],
      topics: [],
    });
    if (value) {
      setFilterData({ ...filterData, subject: value });
      if (value) {
        console.log(value, '===============');
        axios
          .get(
            `${endpoints.lessonPlan.chapterListCentral}?grade_subject=${value.subject.central_mp_id}`,
            {
              //new_changes
              headers: { 'x-api-key': 'vikash@12345#1231' },
            }
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setDropdownData({
                ...dropdownData,
                chapters: result.data?.result,
                topics: [],
              });
            } else {
              setAlert('error', result.data?.message);
              setDropdownData({ ...dropdownData, chapters: [], topics: [] });
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setDropdownData({ ...dropdownData, chapters: [], topics: [] });
          });
      }
    }
  };

  const handleChapter = (event, value) => {
    setFilterData({ ...filterData, chapter: '', topic: '' });
    setDropdownData({ ...dropdownData, topics: [] });
    if (value) {
      setFilterData({ ...filterData, chapter: value, topic: '' });
      if (value) {
        axios
          .get(`${endpoints.createQuestionApis.topicList}?chapter=${value.id}`, {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          })
          .then((result) => {
            if (result.data.status_code === 200) {
              setDropdownData({ ...dropdownData, topics: result.data?.result });
            } else {
              setAlert('error', result.data?.message);
              setDropdownData({ ...dropdownData, topics: [] });
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setDropdownData({ ...dropdownData, topics: [] });
          });
      }
    }
  };

  const handleTopic = (event, value) => {
    setFilterData({ ...filterData, topic: '' });
    if (value) {
      setFilterData({ ...filterData, topic: value });
    }
  };

  const handleClear = () => {
    setFilterData({
      academic: '',
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    });
    setFilterDataDisplay({
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    });
    setDropdownData({
      ...dropdownData,
      branches: [],
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    });
    setIsFilter(false);
  };

  const handleFilter = () => {
    // if (!filterData?.academic || !filterData?.branch) {
    //   setAlert('warning', 'Please select academic and branch');
    //   return;
    // }
    if (
      filterData?.grade &&
      filterData?.subject &&
      filterData?.chapter &&
      filterData?.topic &&
      filterData?.academic &&
      filterData?.branch
    ) {
      setIsFilter(true);
      setFilterDataDisplay(filterData);
      setIsTopFilterOpen(false);
    } else if (!filterData?.academic) setAlert('warning', 'Please select Academic Year!');
    else if (!filterData?.branch) setAlert('warning', 'Please select Branch!');
    else if (!filterData?.grade) setAlert('warning', 'Please select grade!');
    else if (!filterData?.subject) setAlert('warning', 'Please select subject!');
    else if (!filterData?.chapter) setAlert('warning', 'Please select chapter!');
    else if (!filterData?.topic) setAlert('warning', 'Please select topic!');
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleAcademicYear}
          id='academic-year'
          className='dropdownIcon'
          value={filterData.academic || ''}
          options={dropdownData.academic || []}
          getOptionLabel={(option) => option?.session_year || ''}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='branch'
          className='dropdownIcon'
          value={filterData.branch || ''}
          options={dropdownData.branch || []}
          getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className='dropdownIcon'
          value={filterData.grade || ''}
          options={dropdownData.grades || []}
          getOptionLabel={(option) => option?.grade_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSubject}
          id='subject'
          className='dropdownIcon'
          value={filterData.subject || ''}
          options={dropdownData.subjects || []}
          getOptionLabel={(option) => option?.subject?.subject_name || ''}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleChapter}
          id='chapter'
          className='dropdownIcon'
          value={filterData.chapter || ''}
          options={dropdownData.chapters || []}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleTopic}
          id='topic'
          className='dropdownIcon'
          value={filterData.topic || ''}
          options={dropdownData.topics || []}
          getOptionLabel={(option) => option?.topic_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Topic' placeholder='Topic' />
          )}
        />
      </Grid>
      {!isMobile && (
        <Grid item xs={12} sm={12}>
          <Divider />
        </Grid>
      )}
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          className='custom_button_master labelColor modifyDesign'
          size='medium'
          onClick={handleClear}
        >
          CLEAR ALL
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master modifyDesign'
          size='medium'
          onClick={handleFilter}
        >
          NEXT
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
    </Grid>
  );
};

export default TopFilters;
