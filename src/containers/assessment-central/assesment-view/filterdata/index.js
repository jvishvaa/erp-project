import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect, useSelector } from 'react-redux';
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
  setClearFlag
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [qpValue, setQpValue] = useState('');
  const is_ERP_CENTRAL = [
    { id: 1, flag: false, name: 'ERP' },
    { id: 2, flag: true, name: 'CENTRAL' },
  ];
  const [isErpCategory , setIsErpCategory] = useState(false)
  const [erpCategoryDropdown, setErpGradeDropdown] = useState([]);
  let selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);

  const filterDataQP = JSON.parse(sessionStorage.getItem('filter')) || [];
  const [filterData, setFilterData] = useState({
    academic: '',
    branch: [],
    grade: '',
    subject: '',
    is_erp_central: is_ERP_CENTRAL[0],
    erp_category : ''
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

  // useEffect(() => {
  //   if(selectedBranch && branchDropdown){
  //     let branch = branchDropdown.filter((item) => item?.id === selectedBranch?.id)
  //     handleBranch('',branch)

  //   }
  // },[selectedBranch,branchDropdown])

const getErpCategory = () => {
  axiosInstance
      .get(`${endpoints.questionBank.erpCategory}`)
      .then((result) => {
        setErpGradeDropdown(result?.data?.result)
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
}
 

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      handleAcademicYear();
      getErpCategory()
      if(history?.location?.state?.isSet == 'true'){
      if(filterDataQP?.branch){
        handleBranch(filterDataQP , filterDataQP?.branch)
      }
      setFilterData({
        branch : filterDataQP?.branch,
        grade: filterDataQP?.grade,
        subject: filterDataQP?.subject,
        is_erp_central: filterDataQP?.type,
        academic : selectedAcademicYear,
      })
      if(filterDataQP?.subject){
        setSub()
      }
      if(filterDataQP?.qpValue){
        setQpValue(filterDataQP?.qpValue)
      }
      handlePeriodList(
        filterDataQP?.type,
        selectedAcademicYear,
        filterDataQP?.branch,
        filterDataQP?.grade,
        filterDataQP?.subject,
        filterDataQP?.qpValue,
      );
      }
    }
  }, [moduleId, selectedAcademicYear]);

  const setSub = () => {
    const acadSessionIds = filterDataQP?.branch.map(({ id }) => id) || [];
    axiosInstance
    .get(
      `${endpoints.assessmentErp.subjectList}?session_year=${acadSessionIds}&grade=${filterDataQP?.grade?.grade_id}`
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

  const handleClear = () => {
    setClearFlag((prev) => !prev);
    setFilterData({
      academic: '',
      branch: [],
      grade: '',
      subject: '',
      erp_category: '',
    });
    setPeriodData([]);
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
    // if (value) {
    setFilterData({
      ...filterData,
      academic: selectedAcademicYear,
    });
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const selectAllObject = {
            session_year: {},
            id: 'all',
            branch: { id: 'all', branch_name: 'Select All' },
          };
          const data = [selectAllObject, ...result?.data?.data?.results];
          // let branch = data.filter((item) => item?.id === selectedBranch?.id)
          // handleBranch('',branch)
          setBranchDropdown(data);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
    // }
  };
  const handleerpCategory = (event, value) => {
    setFilterData({ ...filterData, erp_category: '',  });
    // setLoading(true);
    setIsErpCategory(false)
    if (value) {
      setIsErpCategory(true)
      setFilterData({ ...filterData, erp_category: value });
      // setLoading(false);
    } else {
      // setLoading(false);
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
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchIds}&module_id=${moduleId}`
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
  const handleIsErpCentral = (event, value) => {
    if (value) {
      setFilterData({ ...filterData, is_erp_central: value });
    }
  }

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
    if (filterData?.branch.length === 0) {
      setAlert('error', 'Select Branch!');
      return;
    }
    if (!filterData?.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    if (isErpCategory === false && !filterData?.subject) {
      setAlert('error', 'Select Subject!');
      return;
    }
    if (!qpValue) {
      setAlert('error', 'Select QP Level!');
      return;
    }
    if (!filterData?.is_erp_central) {
      setAlert('error', `Select Question Paper From! ${filterData?.is_erp_central.name}`);
      return;
    }
    setSelectedIndex(-1);
    handlePeriodList(
      filterData.is_erp_central,
      filterData.academic || selectedAcademicYear,
      filterData.branch,
      filterData.grade,
      filterData.subject,
      qpValue,
      filterData?.erp_category,
    );
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      {/* <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
      </Grid> */}
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
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleerpCategory}
            id='Category'
            className='dropdownIcon'
            value={filterData?.erp_category || {}}
            options={erpCategoryDropdown || []}
            getOptionLabel={(option) => option?.erp_category_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='ERP Category'
                placeholder='ERP Category'
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
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' required/>
          )}
        />
      </Grid>
      {!isErpCategory && <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
              required
            />
          )}
        />
      </Grid>}
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
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleIsErpCentral}
          id='Question Type'
          className='dropdownIcon'
          value={filterData?.is_erp_central || {}}
          options={is_ERP_CENTRAL || []}
          getOptionLabel={(option) => option?.name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Question Paper From'
              placeholder='Question Paper From'
              required
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
          style={{ width: '100%' }}
          className='cancelButton labelColor'
          size='medium'
          onClick={handleClear}
        >
          Clear All
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          color='primary'
          style={{ color: 'white', width: '100%' }}
          size='medium'
          onClick={handleFilter}
        >
          Filter
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
          style={{ color: 'white', width: '100%' }}
          color='primary'
          onClick={() =>
            history.push({
              pathname: '/create-question-paper',
              search: 'show-question-paper=true',
              state: { refresh: true },
            })
          }
          size='medium'
        >
          Create
        </Button>
      </Grid>
      {isMobile && <Grid item xs={3} sm={0} />}
    </Grid>
  );
};

export default AssessmentFilters;
