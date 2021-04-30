import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axios from 'axios';
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
  const [volumeList, setVolumeList] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState('');

  useEffect(() => {
    setSelectedAcad('');
    setSelectedVolume('');
    setBranchList([]);
    setGradeList([]);
    setSubjectList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
  },[clearFilter])

  function ApiCal() {
    axios
    .get(`${endpoints.lessonPlan.volumeList}`, {
      headers: {
        'x-api-key': 'vikash@12345#1231',
      },
    })
    .then((result) => {
      if (result.data.status_code === 200) {
        setVolumeList(result.data.result.results);
      } else {
        setAlert('error', result.data.message);
      }
    })
    .catch((error) => {
      setAlert('error', error.message);
    });
  }

  function withAxiosInstance(url, key) {
    setLoading(true);
    axiosInstance
     .get(url)
     .then(response => {
      setLoading(false);
      if (response.data.status_code === 200) {
        if (key === 'acad') {
          setAcadList(response.data.data);
        } else if(key === 'branch') {
          setBranchList(response.data.data.results);
        } else if (key === 'grade') {
          setGradeList(response.data.data);
        } else if (key === 'subject') {
          setSubjectList(response.data.result);
        }
      }
      }).catch(error => {
          setLoading(false);
          setAlert('error', error.message);
    })
  }

  useEffect(() => {
    withAxiosInstance(`${endpoints.userManagement.academicYear}?module_id=${getModuleInfo('Ebook View').id}`, 'acad');
    ApiCal();
  }, []);

  function handleClear() {
    handleFilter();
    setSelectedAcad('');
    setSelectedVolume('');
    setGradeList([]);
    setSubjectList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
  }

  return (
    <>
      <Grid container spacing={2} style={{ padding: '0px 10px' }}>
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              if(value){
                withAxiosInstance(`${endpoints.communication.branches}?session_year=${value?.id}&module_id=${getModuleInfo('Ebook View').id}`, 'branch');
              }
              setSelectedAcad(value);
              setSelectedGrade('');
              setSelectedSubject('');
              setSelectedBranch('');
            }}
            id='Acad_id'
            options={acadList}
            value={selectedAcad}
            getOptionLabel={(option) => option.session_year}
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
              if(value) {
                withAxiosInstance(`${endpoints.communication.grades}?session_year=${selectedAcad?.id}&branch_id=${value.branch.id}&module_id=${getModuleInfo('Ebook View').id}`, 'grade');
              }
              setSelectedGrade('');
              setSelectedSubject('');
            }}
            id='branch_id'
            options={branchList}
            value={selectedBranch}
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
            size='small'
            onChange={(event, value) => {
              if(value) {
                withAxiosInstance(
                  `${endpoints.lessonPlan.gradeSubjectMappingList}?session_year=${selectedAcad?.id}&branch=${selectedBranch.id}&grade=${value.grade_id}&module_id=${getModuleInfo('Ebook View').id}`,
                  'subject'
                );
              }
              setSelectedGrade(value);
              setSelectedSubject('');
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
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              setSelectedVolume(value);
            }}
            id='volume_id'
            options={volumeList}
            value={selectedVolume}
            getOptionLabel={(option) => option.volume_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Volume'
                placeholder='Volume'
              />
            )}
          />
        </Grid>
        <Grid item md={9}></Grid>
        <Grid item md={3} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={6}>
              <Button
                size='medium'
                fullWidth
                onClick={() => handleClear()}
                variant='contained'
              >
               Clear All
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                startIcon={<FilterFilledIcon />}
                style={{ color: 'white' }}
                size='medium'
                variant='contained'
                color='primary'
                fullWidth
                onClick={()=> handleFilter(selectedAcad, selectedBranch, selectedGrade, selectedSubject, selectedVolume)}
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
