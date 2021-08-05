import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import download from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
// import './lesson.css';

const AssessmentFilters = ({
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [qpValue, setQpValue] = useState('');

  const [filterData, setFilterData] = useState({
    academic: '',
    branch: [],
    grade: '',
    subject: '',
  });
  // question level input
  const qpLevel = [
    { id: 1, level: 'Easy' },
    { id: 2, level: 'Average' },
    { id: 3, level: 'Difficult' },
  ];

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
            if (item.child_name === 'Question Paper') {
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
            setAcademicDropdown(result.data?.data);
            const defaultValue = result.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  const handleClear = () => {
    setFilterData({
      academic: '',
      branch: [],
      grade: '',
      subject: '',
    });
    setPeriodData([]);
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSubjectDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setFilterDataDown({});
    setSelectedIndex(-1);
    setQpValue('');
  };

  const handleAcademicYear = (event, value) => {
    setFilterData({
      academic: '',
      branch: [],
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
        .get(
          `${endpoints.academics.branches}?session_year=${value?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            const selectAllObject = {
              session_year: {},
              id: 'all',
              branch: { id: 'all', branch_name: 'Select All' },
            };
            const data = [selectAllObject, ...result?.data?.data?.results];
            setBranchDropdown(data);
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
    setFilterData({
      ...filterData,
      branch: [],
      grade: '',
      subject: '',
    });
    setGradeDropdown([]);
    setSubjectDropdown([]);
    if (value?.length > 0) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchDropdown].filter(({ id }) => id !== 'all')
          : value;
      const branchIds = value.map((element) => element?.branch?.id) || [];
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${filterData.academic?.id}&branch_id=${branchIds}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setGradeDropdown(result?.data?.data);
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
      const acadSessionIds = filterData.branch.map(({ id }) => id) || [];
      axiosInstance
        .get(
          `${endpoints.assessmentErp.subjectList}?session_year=${acadSessionIds}&grade=${value?.grade_id}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setSubjectDropdown(result?.data?.result);
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
    setFilterData({ ...filterData, subject: '' });
    setQpValue('');
    setPeriodData([]);
    if (value) {
      setFilterData({ ...filterData, subject: value });
    }
  };

  const handleQpLevel = (event, value) => {
    setPeriodData([]);
    if (value) {
      setQpValue(value);
    }
  };

  const handleFilter = () => {
    if (!filterData.academic) {
      setAlert('error', 'Select Academic Year!');
      return;
    }
    if (filterData.branch.length === 0) {
      setAlert('error', 'Select Branch!');
      return;
    }
    if (!filterData.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    if (!filterData.subject) {
      setAlert('error', 'Select subject!');
      return;
    }
    if (!qpValue) {
      setAlert('error', 'Select QP Level!');
      return;
    }
    setSelectedIndex(-1);
    handlePeriodList(
      filterData.academic,
      filterData.branch,
      filterData.grade,
      filterData.subject,
      qpValue
    );
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
          multiple
          limitTags={2}
          className='dropdownIcon'
          value={filterData.branch || []}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className='dropdownIcon'
          value={filterData.grade || ''}
          options={gradeDropdown || []}
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleQpLevel}
          id='questionpaperLevel'
          className='dropdownIcon'
          value={qpValue || ''}
          options={qpLevel || []}
          getOptionLabel={(option) => option?.level || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              disabled
              {...params}
              variant='outlined'
              label='Question Paper Level'
              placeholder='Question Paper Level'
            />
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
          color='primary'
          className='custom_button_master modifyDesign'
          size='medium'
          style={{ color: 'white'}}
          onClick={handleFilter}
        >
          FILTER
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid
        item
        xs={6}
        sm={2}
        className={isMobile ? 'createButton' : 'createButton addButtonPadding'}
      >
        <Button
          startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master modifyDesign'
          onClick={() =>
            history.push({
              pathname: '/create-question-paper',
              search: 'show-question-paper=true',
              state: { refresh: true },
            })
          }
          size='medium'
        >
          CREATE
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
    </Grid>
  );
};

export default AssessmentFilters;
