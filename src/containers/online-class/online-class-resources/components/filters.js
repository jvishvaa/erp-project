import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Loader from '../../../../components/loader/loader';
import '../../../teacherBatchView/style.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const Filter = (props) => {
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [filterList, setFilterList] = useState('');
  const [filterFullData, setFilterFullData] = useState('');
  const [selectedModule, setSelectedModule] = useState(15);
  const [selectedViewMore, setSelectedViewMore] = useState('');
  const [page, setPage] = useState(1);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [subSelectedId, setSubSelectedId] = useState([]);

  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' },
  ]);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Resources') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            setAcademicYear(result?.data?.data || []);

            const defaultYear = result?.data?.data?.[0];
            setSelectedAcadmeicYear(defaultYear);
            if (defaultYear) {
              callApi(
                `${endpoints.communication.branches}?session_year=${defaultYear?.id}&module_id=${moduleId}`,
                'branchList'
              );
            }
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'batchsize') {
            setBatchList(result.data.result || []);
          }
          if (key === 'course') {
            setCourseList(result.data.result || []);
          }
          if (key === 'subject') {
            setSubjectList(result?.data?.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'filter') {
            setFilterFullData(result.data || {});
            setFilterList(result.data.data || {});
            setSelectedViewMore('');
            props.getResourceData(result.data.data);
            props.totalCount(result.data.count);
            setTabValue(0);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }

  function handleClose(data) {
    setSelectedViewMore('');
    if (data === 'success') {
      setPage(1);
      callApi(
        `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
          selectedBatch && selectedBatch.id
        }&start_date=${startDateTechPer.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer.format(
          'YYYY-MM-DD'
        )}&page_number=${page}&page_size=12&module_id=${moduleId}&class_type=1&batch_limit=${
          selectedBatch.batch_size
        }`,
        'filter'
      );
    }
  }

  useEffect(() => {
    if (moduleId) {
      callApi(
        `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
        'academicYearList'
      );
    }
  }, [moduleId]);

  function handlePagination(e, page) {
    setPage(page);
    callApi(
      `${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
        selectedBatch && selectedBatch.id
      }&start_date=${startDateTechPer.format(
        'YYYY-MM-DD'
      )}&end_date=${endDateTechPer.format(
        'YYYY-MM-DD'
      )}&page_number=${page}&page_size=12&module_id=${moduleId}&class_type=1&batch_limit=${
        selectedBatch.batch_size
      }`,
      'filter'
    );
  }

  function handleClearFilter() {
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setSelectedClassType('');
    setEndDate('');
    setStartDate('');
    setSelectedBranch([]);
    setSelectedGrade([]);
    setCourseList([]);
    setSelectedCourse('');
    setBatchList([]);
    setSelectedSection([]);
    setSectionList([]);
    setSelectedBatch('');
    setSubjectList([]);
    setSelectedSubject([]);
    setSubSelectedId([]);
    setSelectedAcadmeicYear('');
    props.hendleDetails();
    props.getResourceData([]);
  }

  function handleFilter() {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;

    if (!selectedClassType) {
      setAlert('warning', 'Select Classtype');
      return;
    }
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (!endDateTechPer) {
      setAlert('warning', 'Select End Date');
      return;
    }
    if (!selectedBranch.length > 0) {
      setAlert('warning', 'Select Branch');
      return;
    }
    if (!selectedGrade.length > 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (!selectedSection.length > 0) {
      setAlert('warning', 'Select Section');
      return;
    }
    if (selectedClassType.id !== 0) {
      if (!selectedCourse) {
        setAlert('warning', 'Select Course');
        return;
      }
    } else {
      if (!selectedSubject.length > 0) {
        setAlert('warning', 'Select Subject');
        return;
      }
    }

    setLoading(true);
    setTabValue(0);
    setPage(1);
    if (window.location.host === endpoints?.aolConfirmURL) {
      callApi(
        `${endpoints.teacherViewBatches.getBatchList}?is_aol=1&course=${
          selectedCourse.id
        }&start_date=${startDateTechPer.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&page_number=${
          props.pages
        }&page_size=12&module_id=${moduleId}&class_type=1&batch_limit=${
          selectedBatch && selectedBatch.batch_size
        }`,
        'filter'
      );
    } else if (selectedCourse.id) {
      callApi(
        `${
          endpoints.aol.classesresources
        }?is_aol=0&section_mapping_ids=${selectedSection.map(
          (el) => el.id
        )}&session_year=${selectedAcademicYear.id}&class_type=${
          selectedClassType.id
        }&start_date=${startDateTechPer.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&course_id=${
          selectedCourse.id
        }&page_number=${props.pages}&page_size=12&class_status=${
          props.tabValue + 1
        }&module_id=${moduleId}`,
        'filter'
      );
    } else {
      callApi(
        `${
          endpoints.aol.classesresources
        }?is_aol=0&section_mapping_ids=${selectedSection.map(
          (el) => el.id
        )}&session_year=${
          selectedAcademicYear.id
        }&subject_id=${subSelectedId}&class_type=${
          selectedClassType.id
        }&start_date=${startDateTechPer.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&page_number=${
          props.pages
        }&page_size=12&class_status=${props.tabValue + 1}&module_id=${moduleId}`,
        'filter'
      );
    }
  }
  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    setDateRangeTechPer(v1);
  }
  useEffect(() => {
    if (selectedBranch.length > 0) {
      handleFilter();
    }
  }, [props.pages,props?.tabValue]);
  // useEffect(() => {
  //   handleFilter();
  // }, [props?.tabValue]);

  return (
    <>
      {loading && <Loader />}
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {window.location.host !== endpoints?.aolConfirmURL && (
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              limitTags={2} 
              onChange={(event, value) => {
                setSelectedClassType(value);
                setSelectedGrade([]);
                setCourseList([]);
                setSelectedCourse('');
                setBatchList([]);
                setSelectedBatch('');
                setFilterList([]);
                setSelectedViewMore('');
                setSectionList([]);
                setSelectedSection([]);
                setSubjectList([]);
                setSelectedSubject([]);
                setSelectedBranch([]);
                props.getResourceData([]);
              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedClassType}
              options={classTypes}
              getOptionLabel={(option) => option?.type}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Class Types'
                  placeholder='Class Types'
                />
              )}
            />
          </Grid>
        )}
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            limitTags={2} 
            onChange={(event, value) => {
              setSelectedAcadmeicYear(value);
              if (value) {
                callApi(
                  `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                  'branchList'
                );
              }
              setSelectedGrade([]);
              setCourseList([]);
              setSelectedCourse('');
              setBatchList([]);
              setSelectedBatch('');
              setFilterList([]);
              setSelectedViewMore('');
              setSectionList([]);
              setSelectedSection([]);
              setSubjectList([]);
              setSelectedSubject([]);
              setSelectedBranch([]);
              props.getResourceData([]);
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedAcademicYear}
            options={academicYear}
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
        <Grid item md={3} xs={12}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            size='small'
            limitTags={2} 
            onChange={(event, value) => {
              setSelectedBranch([]);
              if (value.length) {
                const ids = value.map((el) => el);
                const selectedId = value.map((el) => el.branch.id);
                setSelectedBranch(ids);
                callApi(
                  `${endpoints.academics.grades}?session_year=${
                    selectedAcademicYear.id
                  }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                  'gradeList'
                );
              }
              setSelectedGrade([]);
              setCourseList([]);
              setSelectedCourse('');
              setBatchList([]);
              setSelectedBatch('');
              setFilterList([]);
              setSectionList([]);
              setSelectedSection([]);
              setSubjectList([]);
              setSelectedSubject([]);
              props.getResourceData([]);
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch}
            options={branchList}
            getOptionLabel={(option) => option?.branch?.branch_name}
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
        <Grid item md={3} xs={12}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedGrade([]);
              if (value.length) {
                const ids = value.map((el) => el);
                const selectedId = value.map((el) => el.grade_id);
                const branchId = selectedBranch.map((el) => el.branch.id);
                setSelectedGrade(ids);
                callApi(
                  `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                  'section'
                );
              }
              if (value) {
                const gId = value.map((el) => el.grade_id);
                callApi(
                  `${endpoints.teacherViewBatches.courseListApi}?grade=${gId}`,
                  'course'
                );
              }
              setCourseList([]);
              setSelectedCourse('');
              setBatchList([]);
              setSelectedBatch('');
              setFilterList([]);
              setSectionList([]);
              setSelectedSection([]);
              setSubjectList([]);
              setSelectedSubject([]);
              props.getResourceData([]);
            }}
            id='grade_id'
            className='dropdownIcon'
            limitTags={2} 
            value={selectedGrade}
            options={gradeList}
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
        <Grid item md={3} xs={12}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            size='small'
            onChange={(event, value) => {
              setSelectedSection([]);
              if (value.length) {
                const ids = value.map((el) => el);
                const secId = value.map((el) => el.section_id);
                setSelectedSection(ids);
                setSecSelectedId(secId);
                callApi(
                  `${endpoints.academics.subjects}?branch=${selectedBranch.map(
                    (el) => el.branch.id
                  )}&session_year=${selectedAcademicYear.id}&grade=${selectedGrade.map(
                    (el) => el.grade_id
                  )}&section=${secId}&module_id=${moduleId}`,
                  'subject'
                );
              }
              setBatchList([]);
              setSelectedBatch('');
              setSelectedCourse('');
              setSubjectList([]);
              setSelectedSubject([]);
              props.getResourceData([]);
            }}
            id='section_id'
            className='dropdownIcon'
            value={selectedSection}
            options={sectionList}
            limitTags={2} 
            getOptionLabel={(option) =>
              option?.section__section_name || option?.section_name
            }
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
        {selectedClassType?.id === 0 && gradeList.length > 0 ? (
          <Grid item md={3} xs={12}>
            <Autocomplete
              multiple
              style={{ width: '100%' }}
              limitTags={2} 
              size='small'
              onChange={(event, value) => {
                setSelectedSubject([]);
                if (value.length) {
                  const ids = value.map((el) => el);
                  const subId = value.map((el) => el.subject__id);
                  setSelectedSubject(ids);
                  setSubSelectedId(subId);
                }
                setBatchList([]);
                setSelectedBatch('');
                props.getResourceData([]);
              }}
              id='course_id'
              className='dropdownIcon'
              value={selectedSubject}
              options={subjectList}
              getOptionLabel={(option) => option?.subject__subject_name}
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
        ) : (
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              limitTags={2} 
              onChange={(event, value) => {
                setSelectedCourse(value);
                if (value) {
                  callApi(
                    `${endpoints.teacherViewBatches.batchSizeList}?course_id=${
                      value && value.id
                    }`,
                    'batchsize'
                  );
                }
                setBatchList([]);
                setSelectedBatch('');
                props.getResourceData([]);
              }}
              id='course_id'
              className='dropdownIcon'
              value={selectedCourse}
              options={courseList}
              limitTags={2} 
              getOptionLabel={(option) => option?.course_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Course'
                  placeholder='Course'
                />
              )}
            />
          </Grid>
        )}
        {window.location.host === endpoints?.aolConfirmURL && (
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedBatch(value);
              }}
              id='batch_size_id'
              className='dropdownIcon'
              value={selectedBatch}
              options={batchList}
              limitTags={2} 
              getOptionLabel={(option) =>
                option ? `1 : ${JSON.stringify(option.batch_size)}` : ''
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Batch Limit'
                  placeholder='Batch Limit'
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={MomentUtils}>
            <DateRangePicker
              startText='Select-date-range'
              value={dateRangeTechPer}
              onChange={(newValue) => {
                setDateRangeTechPer(newValue);
              }}
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
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                size='large'
                className='BatchViewfilterButtons'
                onClick={() => handleClearFilter()}
              >
                Clear All
              </Button>
            </Grid>
            <Grid item md={3} xs={12}>
              <Button
                variant='contained'
                size='large'
                color='primary'
                onClick={() => handleFilter()}
              >
                Get Resources
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Filter;
