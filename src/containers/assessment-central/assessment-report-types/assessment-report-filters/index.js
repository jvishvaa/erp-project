import React, { useEffect, useState, useContext } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import { fetchAssessmentReportList, setClearFilters } from '../../../../redux/actions';
import { generateQueryParamSting } from '../../../../utility-functions';
import axiosInstance from 'config/axios';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { getSubDomainName } from '../../../../utility-functions';
import './assessment-report-filters.css';

const subDomain = getSubDomainName();
let url = '';
const AssessmentReportFilters = ({
  widerWidth,
  isMobile,
  fetchAssessmentReportList,
  selectedReportType,
  isFilter,
  setIsFilter,
  classTopicAverage,
  page,
  setPage,
  pageSize,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [classTopicAvg, setClassTopicAvg] = useState(classTopicAverage);
  const [dropdownData, setDropdownData] = useState({
    academic: [],
    branch: [],
    grade: [],
    section: [],
    subject: [],
    test: [],
    chapter: [],
    topic: [],
  });

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Assessment Report') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const [filterData, setFilterData] = useState({
    academic: '',
    branch: '',
    grade: '',
    section: '',
    subject: '',
    test: '',
    chapter: '',
    topic: '',
  });

  useEffect(() => {
    if (page && isFilter) handleFilter();
  }, [page]);

  useEffect(() => {
    url = '';
    setIsFilter(false);
    setPage(1);
    if (selectedReportType?.id) {
      if (dropdownData.academic.length === 0 && moduleId) getAcademicYear();
      setDropdownData({
        ...dropdownData,
        branch: [],
        grade: [],
        section: [],
        subject: [],
        test: [],
        chapter: [],
        topic: [],
      });

      setFilterData({
        academic: '',
        branch: '',
        grade: '',
        section: '',
        subject: '',
        test: '',
        chapter: '',
        topic: '',
      });
    }
  }, [selectedReportType?.id, moduleId]);

  const handleFilter = () => {
    let paramObj = {
      school: subDomain,
      // academic_year_id: filterData.academic?.id,
      // branch: filterData.branch?.branch?.id,
      // grade: filterData.grade?.central_grade_id,
      // subject: filterData.subject?.subject?.central_subject_id,
      test: filterData.test?.id,
    };
    if (selectedReportType?.id === 1) {
      paramObj = {
        ...paramObj,
        central_gs_id: filterData.subject?.subject?.central_mp_id,
      };
    }
    if (selectedReportType?.id === 3) {
      paramObj = { ...paramObj, section_mapping: filterData.section?.id };
    }
    if (selectedReportType?.id === 4) {
      paramObj = {
        ...paramObj,
        section_mapping: filterData.section?.id,
        topic: filterData.topic?.id,
      };
    }
    const filterFlag = Object.values(paramObj).every(Boolean);
    if (filterFlag) {
      paramObj = { ...paramObj, page: page, page_size: pageSize };
      url = `?${generateQueryParamSting(paramObj)}`;
      fetchAssessmentReportList(selectedReportType, url);
      setIsFilter(true);
    } else {
      for (const [key, value] of Object.entries(paramObj).reverse()) {
        // if (key === 'academic_year_id' && !Boolean(value))
        // setAlert('error', `Please select Academic Year.`);
        if (key === 'central_gs_id' && !Boolean(value))
          setAlert('error', `Please select Subject.`);
        if (key === 'section_mapping' && !Boolean(value))
          setAlert('error', `Please select Section.`);
        else if (!Boolean(value)) setAlert('error', `Please select ${key}.`);
      }
    }
  };

  function getAcademicYear() {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              academic: result.data?.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getBranch(acadId) {
    axiosInstance
      .get(`${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              branch: result.data?.data?.results,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getGrade(branchId) {
    axiosInstance
      .get(`${endpoints.assessmentApis.gradesList}?branch=${branchId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              grade: result.data?.result?.results,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getSection(acadId, branchId, mappingId) {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchId}&grade_id=${mappingId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              section: result.data?.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getSubject(mappingId, branchId) {
    axiosInstance
      .get(`${endpoints.assessmentApis.gradesList}?gs_id=${mappingId}&branch=${branchId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              subject: result.data?.result?.results,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getTest(subjectId) {
    axios
      .get(`${endpoints.assessmentApis.testList}?subject=${subjectId}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              test: result.data.data,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getChapter(centralMpId) {
    axios
      .get(`${endpoints.lessonPlan.chapterListCentral}?grade_subject=${centralMpId}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              chapter: result.data?.result,
            };
          });
        }
      })
      .catch((error) => {});
  }

  function getTopic(chapterId) {
    setDropdownData({ ...dropdownData, topic: [] });
    axios
      .get(`${endpoints.createQuestionApis.topicList}?chapter=${chapterId}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              topic: result.data?.result,
            };
          });
        }
      })
      .catch((error) => {});
  }

  const handleAcademicYear = (event, value) => {
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      academic: '',
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, academic: value });
    }
  };

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getGrade(value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
    }
  };

  const handleGrade = (event, value) => {
    setDropdownData({
      ...dropdownData,
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getSubject(value?.id, filterData.branch?.branch?.id);
      if (selectedReportType.id === 3 || selectedReportType.id === 4) {
        getSection(filterData.academic?.id, filterData.branch?.branch?.id, value?.id);
      }
      setFilterData({ ...filterData, grade: value });
    }
  };

  const handleSubject = (event, value) => {
    setDropdownData({
      ...dropdownData,
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getTest(value?.subject?.central_subject_id);
      if (selectedReportType.id === 4) getChapter(value?.subject?.central_mp_id);
      setFilterData({ ...filterData, subject: value });
    }
  };

  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };

  const handleTest = (event, value) => {
    setFilterData({ ...filterData, test: '' });
    if (value) {
      setFilterData({ ...filterData, test: value });
    }
  };

  const handleChapter = (event, value) => {
    setDropdownData({ ...dropdownData, topic: [] });
    setFilterData({ ...filterData, chapter: '', topic: '' });
    if (value) {
      getTopic(value?.id);
      setFilterData({ ...filterData, chapter: value });
    }
  };

  const handleTopic = (event, value) => {
    setFilterData({ ...filterData, topic: '' });
    if (value) {
      setFilterData({ ...filterData, topic: value });
    }
  };

  const handleClear = () => {
    url = '';
    setPage(1);
    setIsFilter(false);
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      section: [],
      subject: [],
      test: [],
      chapter: [],
      topic: [],
    });

    setFilterData({
      academic: '',
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
  };

  return (
    <>
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleAcademicYear}
            id='academic-year'
            className='dropdownIcon'
            value={filterData.academic || {}}
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
            value={filterData.branch || {}}
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
            value={filterData.grade || {}}
            options={dropdownData.grade || []}
            getOptionLabel={(option) => option?.grade_name || ''}
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
        {(selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSection}
              id='section'
              className='dropdownIcon'
              value={filterData.section || {}}
              options={dropdownData.section || []}
              getOptionLabel={(option) => option?.section__section_name || ''}
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
        )}
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleSubject}
            id='subject'
            className='dropdownIcon'
            value={filterData.subject || {}}
            options={dropdownData.subject || []}
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
            onChange={handleTest}
            id='test'
            className='dropdownIcon'
            value={filterData.test || {}}
            options={dropdownData.test || []}
            getOptionLabel={(option) => option?.test_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} variant='outlined' label='Test' placeholder='Test' />
            )}
          />
        </Grid>
        {selectedReportType?.id === 4 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleChapter}
              id='chapter'
              className='dropdownIcon'
              value={filterData.chapter || {}}
              options={dropdownData.chapter || []}
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
        )}
        {selectedReportType?.id === 4 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleTopic}
              id='topic'
              className='dropdownIcon'
              value={filterData.topic || {}}
              options={dropdownData.topic || []}
              getOptionLabel={(option) => option?.topic_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Topic'
                  placeholder='Topic'
                />
              )}
            />
          </Grid>
        )}
        {isFilter &&
          classTopicAverage &&
          (selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
            <Grid item xs={12} sm={3}>
              <div className='classTopicContainer'>
                <div className='classTopicTag'>
                  {selectedReportType?.id === 3 ? 'Class Average' : 'Topic Average'}:
                </div>
                <div className='classTopicIcon'>{classTopicAverage}</div>
              </div>
            </Grid>
          )}
      </Grid>
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            className='custom_button_master labelColor modifyDesign'
            size='medium'
            style={{ borderRadius: '10px' }}
            onClick={handleClear}
          >
            CLEAR ALL
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            className='custom_button_master modifyDesign'
            size='medium'
            color='primary'
            style={{ borderRadius: '10px', color: 'white' }}
            onClick={handleFilter}
          >
            FILTER
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setClearFilters: () => dispatch(setClearFilters()),
  fetchAssessmentReportList: (reportType, params) =>
    dispatch(fetchAssessmentReportList(reportType, params)),
});

export default connect(null, mapDispatchToProps)(AssessmentReportFilters);
