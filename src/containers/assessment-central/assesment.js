import React, { useEffect, useState, useContext } from 'react';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import selectfilter from '../../assets/images/selectfilter.svg';
import unfiltered from '../../assets/images/unfiltered.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import FilterTabs from './tabsFilter';
import Store from './Store';
import ViewMoreCard from './view-more-card';
import axios from 'axios';
// http://127.0.0.1:8000/qbox/assessment/list-question-paper/?grade=1&paper_level=1
// http://127.0.0.1:8000/qbox/assessment/list-question-paper/?grade=1&paper_level=1&is_draft=True
// http://127.0.0.1:8000/qbox/assessment/list-question-paper/?grade=1&paper_level=1&is_verified=True

const qpLevel = [
  { id: 1, level: 'easy' },
  { id: 2, level: 'medium' },
  { id: 3, level: 'tough' },
];

const Assesmentquestion = () => {
  const [academicDropdown,setAcademicDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSujectDropdown] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeValue, setGradeValue] = useState(null);
  const [subjectDropdownValue, setSujectDropDownValue] = useState(null);
  const [qpValue, setQpLevel] = useState(null);
  const [filterResult, setFilterResult] = React.useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [draftResult, setDraftResult] = React.useState([]);
  const [verifiedValue, setVerifiedValue] = React.useState([]);
  const [publishedValue, setPublishedValue] = React.useState([]);
  //view more data
  const [viewMoreData, setViewMoreData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.lessonPlan.gradeList}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setGradeDropdown(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  const handleAcademicYear = (event, value) => {
    setFilterData({
      academic: '',
      branch: '',
      grade: '',
      subject: '',
    });
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSubjectDropdown([]);
    if (value) {
      setFilterData({
        ...filterData,
        academic: value,
      });
      axiosInstance
        .get(`${endpoints.academics.branches}?session_year=${value.id}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setBranchDropdown(result.data?.data?.results);
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
    });
    setGradeDropdown([]);
    setSubjectDropdown([]);
    if (value) {
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(`${endpoints.assessmentApis.gradesList}?branch=${value.branch.id}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data?.result?.results);
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
    });
    setQpValue('');
    setPeriodData([]);
    setSubjectDropdown([]);
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(`${endpoints.assessmentApis.gradesList}?gs_id=${value.id}&branch=${filterData.branch.branch.id}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result.data?.result?.results);
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  // const handleGrade = (event, value) => {
  //   if (value) {
  //     setGradeValue(value);
  //     axiosInstance
  //       .get(`${endpoints.lessonPlan.gradeSubjectMappingList}?grade=${value.id}`)
  //       .then((result) => {
  //         if (result.data.status_code === 200) {
  //           setSujectDropdown(result.data.result.results);
  //         } else {
  //           setAlert('error', result.data.message);
  //         }
  //       })
  //       .catch((error) => {
  //         setAlert('error', error.message);
  //       });
  //   } else {
  //     setGradeValue(null);
  //   }
  // };

  const handleSubject = (event, value) => {
    if (value) {
      setSujectDropDownValue(value);
    } else {
      setSujectDropDownValue(null);
    }
  };

  const handleQpLevel = (event, value) => {
    if (value) {
      setQpLevel(value);
    } else {
      setQpLevel(null);
    }
  };

  const callfilter = () => {
    if (gradeValue !== null || qpValue !== null) {
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${gradeValue.id}&paper_level=${qpValue.id}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setFilterResult(result.data.result.results);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    } else {
      setAlert('error', 'Please select a value');
    }
  };

  const handleTabs = (TabLevel) => {
    // console.log(TabLevel, "TabLevel")
    if (TabLevel === 0) {
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${gradeValue.id}&paper_level=${qpValue.id}`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setFilterResult(result.data.result.results);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
    if (TabLevel === 1) {
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${gradeValue.id}&paper_level=${qpValue.id}is_draft=True`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setDraftResult(result.data.result.results);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
    if (TabLevel === 2) {
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${gradeValue.id}&paper_level=${qpValue.id}is_review=True`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setVerifiedValue(result.data.result.results);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
    if (TabLevel === 3) {
      axios
        .get(
          `${endpoints.assementQP.assementFilter}?grade=${gradeValue.id}&paper_level=${qpValue.id}is_verified=True`,
          {
            headers: { 'x-api-key': 'vikash@12345#1231' },
          }
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setPublishedValue(result.data.result.results);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const cleaeAll = () => {
    setGradeValue(null);
    setSujectDropDownValue(null);
    setQpLevel(null);
    setFilterResult([]);
  };
  return (
    <Layout>
      <Store>
        <div className='question-assement-cont'>
          <div className='assesment-breadcrum' style={{ paddingLeft: 20 }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName={'Question Paper'}
            />
          </div>
          <div className='assesment-question-input'>
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
                  options={academicDropdown || []}
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
                  options={branchDropdown || []}
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
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleGrade}
                  id='Grade'
                  className='Grade'
                  value={gradeValue||''}
                  options={gradeDropdown||[]}
                  getOptionLabel={(option) => option?.grade_name||''}
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
                  onChange={handleSubject}
                  id='Subject'
                  className='Subject'
                  value={subjectDropdownValue?.subject||''}
                  options={subjectDropdown||[]}
                  getOptionLabel={(option) => option?.subject.subject_name||''}
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
                  onChange={handleQpLevel}
                  id='questionpaperLevel'
                  className='questionpaperLevel'
                  value={qpValue||''}
                  options={qpLevel||[]}
                  getOptionLabel={(option) => option?.level||''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      disabled={true}
                      {...params}
                      variant='outlined'
                      label='Question Paper Level'
                      placeholder='Question Paper Level'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={10} sm={12}>
                <Divider />
              </Grid>
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  className='custom_button_master labelColor'
                  size='medium'
                  style={{ borderRadius: '10px' }}
                  onClick={cleaeAll}
                >
                  CLEAR ALL
                </Button>
              </Grid>
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  style={{ color: 'white', borderRadius: '10px' }}
                  color='primary'
                  className='custom_button_master'
                  size='medium'
                  type='submit'
                  onClick={callfilter}
                >
                  FILTER
                </Button>
              </Grid>
              <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                  variant='contained'
                  style={{ color: 'white', borderRadius: '10px' }}
                  color='primary'
                  className='custom_button_master'
                  size='medium'
                  type='submit'
                  // onClick={handleFilter}
                >
                  CREATE NEW
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className='assesment-tabs'>
            <div className='qp_tabs'>
              {filterResult && filterResult.length > 0 ? (
                <div>
                  <FilterTabs
                    filterResult={filterResult}
                    draftResult={draftResult}
                    verifiedValue={verifiedValue}
                    publishedValue={publishedValue}
                    handleTabs={handleTabs}
                  />
                  <ViewMoreCard />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </Store>
    </Layout>
  );
};

export default Assesmentquestion;
