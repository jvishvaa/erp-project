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
import { headerRefreshed } from '@syncfusion/ej2-grids';

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
            setDropdownData((prev) => ({
              ...prev,
              academic: result?.data?.data,
            }));
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  }, [moduleId]);

  const handleAcademicYear = (event = {}, value = '') => {
    setFilterData(() => ({
      academic: '',
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    }));
    setDropdownData((prev) => ({
      ...prev,
      branch: [],
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    }));
    if (value) {
      setFilterData((prev) => ({
        ...prev,
        academic: value,
        branch: '',
        grade: '',
        subject: '',
        chapter: '',
        topic: '',
      }));
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${value?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setDropdownData((prev) => ({
              ...prev,
              branch: result?.data?.data?.results,
            }));
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData((prev) => ({
      ...prev,
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    }));
    setDropdownData((prev) => ({
      ...prev,
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    }));
    if (value) {
      setFilterData((prev) => ({
        ...prev,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
        topic: '',
      }));
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${filterData.academic?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData((prev) => ({
              ...prev,
              grades: result?.data?.data,
            }));
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };

  const handleGrade = (event, value) => {
    setFilterData((prev) => ({
      ...prev,
      grade: '',
      subject: '',
      chapter: '',
      topic: '',
    }));
    setDropdownData((prev) => ({
      ...prev,
      subjects: [],
      chapters: [],
      topics: [],
    }));
    if (value) {
      setFilterData((prev) => ({
        ...prev,
        grade: value,
        subject: '',
        chapter: '',
        topic: '',
      }));
      axiosInstance
        .get(
          `${endpoints.assessmentErp.subjectList}?session_year=${filterData.branch?.id}&grade=${value?.grade_id}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setDropdownData((prev) => ({
              ...prev,
              subjects: result?.data?.result,
            }));
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };

  const handleSubject = (event, value) => {
    setFilterData((prev) => ({
      ...prev,
      subject: '',
      chapter: '',
      topic: '',
    }));
    setDropdownData((prev) => ({
      ...prev,
      chapters: [],
      topics: [],
    }));
    if (value) {
      setFilterData((prev) => ({ ...prev, subject: value, chapter: '', topic: '' }));
      axiosInstance
        .get(`${endpoints.assessmentErp.chapterList}?subject=${value?.subject_id}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData((prev) => ({
              ...prev,
              chapters: result.data?.result,
            }));
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleChapter = (event, value) => {
    setFilterData((prev) => ({ ...prev, chapter: '', topic: '' }));
    setDropdownData((prev) => ({ ...prev, topics: [] }));
    if (value) {
      setFilterData((prev) => ({ ...prev, chapter: value, topic: '' }));
      if (value?.is_central) {
        axios
          .get(`${endpoints.createQuestionApis.topicList}?chapter=${value?.id}`, {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          })
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setDropdownData((prev) => ({ ...prev, topics: result?.data?.result }));
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error?.message);
          });
      } else {
        axiosInstance
          .get(`${endpoints.assessmentErp.topicList}?chapter=${value?.id}`)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setDropdownData((prev) => ({ ...prev, topics: result?.data?.result }));
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error?.message);
          });
      }
    }
  };

  const handleTopic = (event, value) => {
    setFilterData((prev) => ({ ...prev, topic: '' }));
    if (value) {
      setFilterData((prev) => ({ ...prev, topic: value }));
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
    setDropdownData((prev) => ({
      ...prev,
      branches: [],
      grades: [],
      subjects: [],
      chapters: [],
      topics: [],
    }));
    setIsFilter(false);
  };

  const handleFilter = () => {
    let filterObject = {
      Topic: filterData?.topic,
      Chapter: filterData?.chapter,
      Subject: filterData?.subject,
      Grade: filterData?.grade,
      Branch: filterData?.branch,
      Academic: filterData?.academic,
    };
    let filterFlag = Object.values(filterObject).every(Boolean);
    if (filterFlag) {
      setIsFilter(true);
      setFilterDataDisplay(filterData);
      setIsTopFilterOpen(false);
    } else {
      for (const [key, value] of Object.entries(filterObject)) {
        if (!value) setAlert('error', `Please select ${key}!`);
      }
    }
  };
  const handleBack = () => {
    history.push({
      pathname: '/question-bank',
    });
    // window.location.href = '/question-bank';
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
          getOptionLabel={(option) => option?.grade__grade_name || ''}
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
          onClick={handleBack}
        >
          BACK
        </Button>
      </Grid>
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
