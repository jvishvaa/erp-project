import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loading from '../../components/loader/loader';
import { getModuleInfo }from '../../utility-functions'

const Filter = ({ handleFilter, clearFilter }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [acadList, setAcadList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedAcad, setSelectedAcad] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedAcad('');
    setGradeList([]);
    setSubjectList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
  },[clearFilter])

  function getApiCalls(url, key) {
    setLoading(true);
    axiosInstance
      .get(url)
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          if (key === 'acad') {
            setAcadList(result.data.data);
          } else if (key === 'grade') {
            setGradeList(result.data.data);
          } else if (key === 'subject') {
            setSubjectList(result.data.result);
          } else if(key === 'branch') {
            setBranchList(result.data.data.results.map(item=>((item&&item.branch)||false)).filter(Boolean));
          }
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  useEffect(() => {
    getApiCalls(`${endpoints.ebook.academicYearList}`, 'acad');
    getApiCalls(`${endpoints.communication.branches}?module_id=${getModuleInfo('Ebook View').id}`, 'branch');
  }, []);

  function handleClear() {
    handleFilter();
    setSelectedAcad('');
    setGradeList([]);
    setSubjectList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              setSelectedAcad(value);
              setSelectedGrade('');
              setSelectedSubject('');
            }}
            id='Acad_id'
            options={acadList}
            value={selectedAcad}
            getOptionLabel={(option) => option?.session_year || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Acadmic Year'
                placeholder='Acadmic Year'
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              setSelectedBranch(value);
              getApiCalls(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=${getModuleInfo('Ebook View').id}`, 'grade');
              setSelectedGrade('');
              setSelectedSubject('');
            }}
            id='branch_id'
            options={branchList}
            value={selectedBranch}
            getOptionLabel={(option) => option?.branch_name||''}
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
            size='small'
            onChange={(event, value) => {
              setSelectedGrade(value);
              setSelectedSubject('');
              getApiCalls(
                `${endpoints.lessonPlan.gradeSubjectMappingList}?branch=${selectedBranch.id}&grade=${value.grade_id}`,
                'subject'
              );
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='grade'
            options={gradeList}
            value={selectedGrade}
            getOptionLabel={(option) => option?.grade__grade_name||''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grades'
                placeholder='Grades'
                required
              />
            )}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Autocomplete
            size='small'
            onChange={(event, value) => {
              setSelectedSubject(value);
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='subject'
            options={subjectList}
            value={selectedSubject}
            getOptionLabel={(option) => option?.subject_name||''}
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
        <Grid item md={3} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
              <Button
                startIcon={<ClearIcon />}
                style={{ color: 'white' }}
                size='small'
                fullWidth
                onClick={() => handleClear()}
                variant='contained'
              >
                &nbsp;Clear
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                startIcon={<FilterFilledIcon />}
                style={{ color: 'white' }}
                size='small'
                variant='contained'
                color='primary'
                fullWidth
                onClick={()=> handleFilter(selectedAcad, selectedBranch, selectedGrade, selectedSubject)}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </>
  );
};

export default Filter;
