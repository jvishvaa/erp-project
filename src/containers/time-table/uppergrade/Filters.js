import React, { useContext, useState, useEffect, useRef } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { useSelector } from 'react-redux';

const Filters = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [gradeDisplay, setGradeDisplay] = useState(null);
  const [sectionDisplay, setSectionDisplay] = useState(null);
  const [addPeriodButton, setShowAddPeriodButton] = useState(false);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  useEffect(() => {
    if (selectedAcademicYear && props.teacherModuleId && branchList.length === 0) {
      callApi(
        `${endpoints.mappingStudentGrade.branch}?session_year=${selectedAcademicYear?.id}&module_id=${props.teacherModuleId}`,
        'branchList'
      );
    }
  }, [selectedAcademicYear, props.teacherModuleId]);

  useEffect(() => {
    if (Object.keys(props?.filteredData).length !== 0) {
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${props?.filteredData?.selectedBranch?.id}&module_id=${props.teacherModuleId}`,
        'gradeList'
      );
      callApi(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${props?.filteredData?.selectedBranch?.id}&grade_id=${props?.filteredData?.gradeDisplay?.grade_id}&module_id=${props.teacherModuleId}`,
        'sectionList'
      );
      setSelectedBranch(props?.filteredData?.selectedBranch);
      setGradeDisplay(props?.filteredData?.gradeDisplay);
      setSectionDisplay(props?.filteredData?.sectionDisplay);
    }
  }, [props.filteredData]);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'branchList') {
            setBranchList(
              result?.data?.data?.results.map((obj) => (obj && obj.branch) || {}) || []
            );
            setLoading(false);
          }
          if (key === 'gradeList') {
            setGradesList(result.data.data || []);
            setLoading(false);
          }
          if (key === 'sectionList') {
            setSectionsList(result.data.data || []);
            setLoading(false);
          }
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
  const handleBranch = (event, value) => {
    if (value) {
      setSelectedBranch(value);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${value.id}&module_id=${props.teacherModuleId}`,
        'gradeList'
      );
    } else {
      setSelectedBranch(null);
      setGradeDisplay(null);
      setSectionDisplay(null);
      setGradesList([]);
      setSectionsList([]);
    }
  };

  const handleGrade = (event, value) => {
    if (value) {
      setGradeDisplay(value);
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${selectedBranch.id}&grade_id=${value.grade_id}&module_id=${props.teacherModuleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSectionsList(result.data?.data);
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
    } else {
      setSectionDisplay(null);
      setSectionsList([]);
    }
  };

  const handleSection = (event, value) => {
    if (value) {
      setSectionDisplay(value);
    }
  };

  const handleFilter = () => {
    if (gradeDisplay === null || gradeDisplay === null || sectionDisplay === null) {
      setAlert('warning', 'please select all filters');
    } else {
      setShowAddPeriodButton(true);
      props.handlePassData(
        selectedAcademicYear?.id,
        gradeDisplay?.grade_id,
        sectionDisplay?.id,
        selectedBranch?.id,
        selectedAcademicYear?.session_year,
        gradeDisplay?.grade_name,
        selectedBranch?.branch_name,
        sectionDisplay?.section__section_name
      );
      props.handleFilteredData(
        gradeDisplay,
        sectionDisplay,
        selectedBranch,
        selectedAcademicYear
      );
      props.handleClickAPI();
      props.section_mapping_id(sectionDisplay?.id);
      handleClearData('generate');
      // props.handleAutoComplete(false)
    }
  };

  const handleClearData = (data) => {
    if (data === 'clear') {
      setShowAddPeriodButton(false);
      props.handleCloseTable(false);

      setSelectedBranch(null);
      setGradeDisplay(null);
      setSectionDisplay(null);

      setGradesList([]);
      setSectionsList([]);
    }
    if (data === 'generate') {
      props.handleCloseTable(true);
    }
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      {/* <Layout> */}
      {/* <div> */}
      {/* <CommonBreadcrumbs componentName='TimeTable' isAcademicYearVisible={true} /> */}
      <div id='filter'>
        <Grid
          container
          spacing={3}
          className='small-container'
          style={{ padding: '0px 0px 0px 50px' }}
        >
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch}
              options={branchList || []}
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
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              required
              value={gradeDisplay}
              options={gradesList || []}
              getOptionLabel={(option) => option?.grade_name || ''}
              filterSelectedOptions
              className='dropdownIcon'
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grades'
                  placeholder='Grades'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSection}
              id='section'
              required
              //multiple
              value={sectionDisplay}
              options={sectionsList || []}
              getOptionLabel={(option) => option?.section__section_name || ''}
              filterSelectedOptions
              className='dropdownIcon'
              renderInput={(params) => {
                return (
                  <TextField
                    title={sectionDisplay?.section__section_name}
                    {...params}
                    variant='outlined'
                    label='Sections'
                    placeholder='Sections'
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              onClick={handleFilter}
              style={{ marginRight: '17px' }}
              color='primary'
              variant='contained'
            >
              Filter
            </Button>
            {/* </Grid>
          <Grid item xs={12} sm={1}> */}
            <Button
              onClick={() => handleClearData('clear')}
              color='primary'
              variant='contained'
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </div>
      {/* </div> */}
      {/* </Layout> */}
    </>
  );
};
export default Filters;
