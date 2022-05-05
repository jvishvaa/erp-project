import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axios from 'axios';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import { connect, useSelector } from 'react-redux';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loading from '../../components/loader/loader';
import { getModuleInfo } from '../../utility-functions';

const Filter = ({ handleFilter, clearFilter }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [acadList, setAcadList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedAcad, setSelectedAcad] = useState(
    useSelector((state) => state.commonFilterReducer?.selectedYear)
  );
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [customGrade, setCustomGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [volumeList, setVolumeList] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    setSelectedVolume('');
    setBranchList([]);
    setGradeList([]);
    setSubjectList([]);
    setSelectedBranch('');
    setSelectedGrade('');
    setSelectedSubject('');
    setSelectedVolume('')
    // setIsFilter(true);
  }, [clearFilter]);

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
      .then((response) => {
        setLoading(false);
        if (response.data.status_code === 200) {
          if (key === 'acad') {
            // const defaultYear = response?.data?.current_acad_session_data?.[0];
            //   setSelectedAcad(defaultYear)
            setAcadList(response.data.data);
            withAxiosInstance(
              `${endpoints.communication.branches}?session_year=${
                selectedAcad?.id
              }&module_id=${getModuleInfo('Ebook View').id}`,
              'branch'
            );
          } else if (key === 'branch') {
            setBranchList(response.data.data.results);
          } else if (key === 'grade') {
            setGradeList(response.data.result);
          } else if (key === 'subject') {
            setSubjectList(response.data.result);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  useEffect(() => {
    // withAxiosInstance(
    //   `${endpoints.userManagement.academicYear}?module_id=${
    //     getModuleInfo('Ebook View').id
    //   }`,
    //   'acad'
    // );
    withAxiosInstance(
      `${endpoints.communication.branches}?session_year=${selectedAcad?.id}&module_id=${
        getModuleInfo('Ebook View').id
      }`,
      'branch'
    );
    // if (key === 'branch') {
    // setBranchList(response.data.data.results);
    // }
    ApiCal();
  }, []);

  function handleClear() {
    // handleFilter();
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
        {/* <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              if (value) {
                withAxiosInstance(
                  `${endpoints.communication.branches}?session_year=${
                    value?.id
                  }&module_id=${getModuleInfo('Ebook View').id}`,
                  'branch'
                );
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
                label='Academic Year'
                //
                placeholder='Academic Year'
              />
            )}
          />
        </Grid> */}
        <Grid item md={3} xs={12}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            className='dropdownIcon'
            onChange={(event, value) => {
              setSelectedBranch(value);
              if (value) {
                withAxiosInstance(
                  `${endpoints.ebook.EbookMappedGrade}?session_year=${
                    selectedAcad?.id
                  }&branch_id=${value.branch.id}&module_id=${
                    getModuleInfo('Ebook View').id
                  }`,
                  'grade'
                );
              }
              setSelectedVolume('');
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
              if (value) {
                withAxiosInstance(
                  `${endpoints.ebook.EbookMappedGrade}?branch_id=${selectedBranch.branch.id}&session_year=${selectedAcademicYear?.id}&grade_id=${value.erp_grade}&module_id=${
                    getModuleInfo('Ebook View').id
                  }`,
                  'subject'
                );
              }
              setSelectedVolume('');
              setSelectedGrade(value);
              setSelectedSubject('');
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='grade'
            options={gradeList}
            value={selectedGrade}
            getOptionLabel={(option) => option?.erp_grade_name || ''}
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
              setSelectedVolume('');
              if(value){
                let subject = value?.central_grade
                setSelectedSubject(value);
                setCustomGrade(subject)
              }
            }}
            className='dropdownIcon'
            style={{ width: '100%' }}
            id='subject'
            options={subjectList}
            getOptionLabel={(option) =>
              (option &&
                option.subject_id_name &&
                option.subject_id_name[0] &&
                option.subject_id_name[0].erp_sub_name) ||
              ''
            }
            value={selectedSubject}
            // getOptionLabel={(option) => option?.erp_sub_name||''}
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
              // setSelectedSubject(value);

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
                onClick={() =>
                  handleFilter(
                    selectedAcad,
                    selectedBranch?.branch?.id,
                    selectedGrade,
                    selectedSubject,
                    selectedVolume,
                    customGrade
                  )
                }
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
