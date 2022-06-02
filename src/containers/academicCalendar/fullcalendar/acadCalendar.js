import React, { useContext, useState, useEffect } from 'react';
import Layout from '../../Layout';
import './acadCalendar.scss';
import MyCalendar from './monthly';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../.././../components/loader/loader';
import { useHistory } from 'react-router';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import { connect, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  outlined: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: '#fff',
    color: theme.palette.secondary.main,
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 16px !important',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
      background: '#fff',
      color: theme.palette.secondary.main,
      fontSize: '14px',
      fontWeight: 'bold',
      padding: '4px 16px !important',
    },
  },
}));

const AcadCalendar = () => {
  const classes = useStyles();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const user_level = userData?.user_level;
  const isStudent = user_level == 13 ? true : false;
  const [accordianOpen, setAccordianOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedbranchIds, setSelectedbranchIds] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [counter, setCounter] = useState(1);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const handleAcademicYear = (event, value) => {
    if (value) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedBranch([]);
  };

  const handleBranch = (event = {}, value = []) => {
    setSelectedBranch([]);
    setGradeList([]);
    setSelectedbranchIds(value?.branch?.id);
    setSelectedBranch(value);
    if (value !== null) {
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  };

  const handleGrade = (event = {}, value = []) => {
    setSelectedGrade([]);
    setSelectedSubject([]);
    setSelectedSection([]);
    if (value?.length) {
      value =
        value.filter(({ grade_id }) => grade_id === 'all').length === 1
          ? [...gradeList].filter(({ grade_id }) => grade_id !== 'all')
          : value;
      const ids = value.map((el) => el) || [];
      const selectedId = value.map((el) => el?.grade_id) || [];
      // const branchId = selectedBranch.map((el) => el?.branch?.id) || [];
      setSelectedGrade(ids);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedbranchIds}&grade_id=${selectedId.toString()}&module_id=${moduleId}`,
        'section'
      );
    }
  };

  const handleSection = (event = {}, value = []) => {
    setSelectedSection([]);
    console.log(value);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.section_id);
      setSelectedSection(ids);
      setSelectedSectionIds(selectedId);
      callApi(
        `${
          endpoints.academics.subjects
        }?branch=${selectedbranchIds}&grade=${selectedGradeIds}&session_year=${
          selectedAcademicYear?.id
        }&section=${selectedId.toString()}&module_id=${moduleId}`,
        'subject'
      );
    }
  };
  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject([]);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.id);
      setSelectedSubject(ids);
      setSelectedSubjectIds(selectedId);
    }
  };

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'subject') {
            setSubjectList(result.data.data);
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
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId && selectedAcademicYear?.id) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
  }, [selectedAcademicYear, moduleId]);

  const clearfilter = () => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setSelectedSubject([]);
    setSelectedbranchIds([]);
    setSelectedGradeIds([]);
    setSelectedSubjectIds([]);
    setSelectedSectionIds([]);
    setFiltered(false);
  };

  const statsView = () => {
    setLoading(true);
    history.push('/dashboard');
    setLoading(false);
  };

  const handleFilter = () => {
    setFiltered(true);
    setCounter(counter + 1);
  };

  return (
    <Layout className='acadyearCalendarContainer'>
      {isStudent ? (
        ''
      ) : (
        <Grid
          id
          item
          sm={8}
          md={10}
          xs={9}
          style={{
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Accordion expanded={accordianOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={() => setAccordianOpen(!accordianOpen)}
            >
              <Typography variant='h6' color='primary'>
                Filter
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item md={4} sm={4} xs={12}>
                  <Autocomplete
                    // multiple
                    style={{ width: '100%' }}
                    size='small'
                    //onChange={(e) => setSelectedBranch(e.target.value)}
                    onChange={handleBranch}
                    id='branch_id'
                    className='dropdownIcon'
                    value={selectedBranch || []}
                    options={branchList || []}
                    getOptionLabel={(option) => option?.branch?.branch_name || ''}
                    getOptionSelected={(option, value) =>
                      option?.branch?.id == value?.branch?.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Branch'
                        placeholder='Select Branch'
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4} xs={12} sm={3}>
                  <Autocomplete
                    //key={clearKey}
                    multiple
                    size='small'
                    onChange={handleGrade}
                    id='create__class-branch'
                    options={gradeList}
                    className='dropdownIcon'
                    getOptionLabel={(option) => option?.grade__grade_name}
                    filterSelectedOptions
                    value={selectedGrade}
                    renderInput={(params) => (
                      <TextField
                        className='create__class-textfield'
                        {...params}
                        variant='outlined'
                        label='Grades'
                        placeholder='Select Grades'
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    multiple
                    fullWidth
                    size='small'
                    onChange={handleSection}
                    id='role_id'
                    className='dropdownIcon'
                    value={selectedSection}
                    options={sectionList}
                    getOptionLabel={(option) => option?.section__section_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Section'
                        placeholder='Section'
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4} sm={3} xs={3}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    multiple
                    fullWidth
                    size='small'
                    onChange={handleSubject}
                    id='role_id'
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
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item md={2} sm={3} xs={3} ml={4}>
                  <Button
                    style={{ marginTop: '5px' }}
                    variant='contained'
                    color='primary'
                    fullWidth={true}
                    onClick={handleFilter}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Button
                    style={{ marginTop: '5px' }}
                    variant='contained'
                    color='primary'
                    onClick={clearfilter}
                    fullWidth={true}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}
      <div className='stats-view'>
        <Button
          className={classes.outlined}
          color='secondary'
          variant='contained'
          onClick={statsView}
          style={isStudent ? { marginTop: '30px', marginLeft: '12px' } : { position: 'relative', bottom: '46px', right: '170px' }}
        >
          Stats View
        </Button>
      </div>
      <div className='calenderContainer'>
        {filtered ? (
          <MyCalendar
            selectedGrade={selectedGradeIds}
            selectedSubject={selectedSubjectIds}
            acadyear={selectedAcademicYear}
            filtered={filtered}
            setFiltered={setFiltered}
            counter={counter}
            selectedBranch={selectedBranch}
          />
        ) : (
          <MyCalendar erpConfig={userData?.erp_config} />
        )}
      </div>
      {loading && <Loader />}
    </Layout>
  );
};
export default AcadCalendar;
