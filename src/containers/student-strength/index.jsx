/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Divider, Button, Typography } from '@material-ui/core';
import './style.scss';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import TotalStudentBar from './totalStudentStrengthBar';
import TotalStudentStrengthCard from './totalStrenghtCard';
import TotalStudentWiseDetails from './totalStudentWiseDetails';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import filterImage from '../../assets/images/unfiltered.svg';
import Layout from '../Layout';

const StudentStrength = ({ history }) => {
  const [acadminYearList, setAcadminYearList] = useState([]);
  const [selectedAcadmic, setSelectedAcadmic] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [hRef, setHRef] = useState([]);

  useEffect(() => {
    setHRef([
      {
        csv: `${endpoints.studentListApis.downloadExcelAllstudents}?academic_year_id=${
          selectedAcadmic && selectedAcadmic.id
        }&export_type=csv`,
      },
      {
        csv: `${endpoints.studentListApis.downloadBranchWiseStudent}?academic_year_id=${
          selectedAcadmic && selectedAcadmic.id
        }&branch_id=${selectedBranch && selectedBranch.id}
          &export_type=csv`,
      },
      // {
      //   csv: `https://erpnew.letseduvate.com/qbox/academic/all_branch_strength_excel_data/?academic_year_id=${
      //     selectedAcadmic && selectedAcadmic.id
      //   }&export_type=csv`,
      // },
      // {
      //   csv: `https://erpnew.letseduvate.com/qbox/academic/branch_strength_excel_data/?academic_year_id=${
      //     selectedAcadmic && selectedAcadmic.id
      //   }&branch_id=${selectedBranch && selectedBranch.id}
      //     &export_type=csv`,
      // },
    ]);
  }, [selectedAcadmic, selectedBranch]);

  function getBranchList() {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setBranchList(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }
  function getAcadminYearList() {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}`)
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setAcadminYearList(result.data.data);
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
    getAcadminYearList();
    getBranchList();
  }, []);

  function handleClearFilter() {
    setSelectedAcadmic('');
    setSelectedBranch('');
    setFilteredData('');
  }

  function handleFilter() {
    if (!selectedAcadmic) {
      setAlert('error', 'Select Acadminc year');
      return;
    }
    if (!selectedBranch) {
      setAlert('error', 'Select Branch');
      return;
    }
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.studentListApis.branchWiseStudentCount}?academic_year_id=${
          selectedAcadmic && selectedAcadmic.id
        }&branch_id=${selectedBranch && selectedBranch.id}`
      )
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setFilteredData(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <Grid container spacing={2} className='studentStrenghtBody'>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2} justify='middle' className='signatureNavDiv'>
              <Grid item md={12} xs={12} style={{ display: 'flex' }}>
                <button
                  type='button'
                  className='SignatureNavigationLinks'
                  onClick={() => history.push('/dashboard')}
                >
                  Dashboard
                </button>
                <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
                <span className='SignatureNavigationLinks'>Student Strength</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} className='studentStrengthFilterDiv'>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => setSelectedAcadmic(value)}
                  id='academic-year'
                  className='dropdownIcon'
                  value={selectedAcadmic}
                  options={acadminYearList}
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
              <Grid item md={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => setSelectedBranch(value)}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedBranch}
                  options={branchList}
                  getOptionLabel={(option) => option?.branch_name}
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
            </Grid>
            <Divider className='studentStrenghtDivider' />
            <Grid container spacing={2}>
              <Grid item md={1} xs={12}>
                <Button
                  variant='contained'
                  size='small'
                  fullWidth
                  className='studentStrenghtFilterButton'
                  onClick={() => handleClearFilter()}
                >
                  CLEAR ALL
                </Button>
              </Grid>
              <Grid item md={1} xs={12}>
                <Button
                  variant='contained'
                  size='small'
                  color='primary'
                  fullWidth
                  onClick={() => handleFilter()}
                  className='studentStrenghtFilterButton'
                >
                  FILTER
                </Button>
              </Grid>
              <Grid item md={6} />
              {selectedAcadmic && (
                <Grid item md={2} xs={12}>
                  <Button
                    size='small'
                    href={hRef && hRef[0] && hRef[0].csv}
                    fullWidth
                    className='studentStrenghtDownloadButton'
                  >
                    Download all Branch excel
                  </Button>
                </Grid>
              )}
              {selectedAcadmic && selectedBranch && (
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    fullWidth
                    href={hRef && hRef[1] && hRef[1].csv}
                    className='studentStrenghtFilterButton'
                  >
                    Download Branch excel
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {!filteredData && (
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
              <img src={filterImage} alt='crash' height='250px' width='250px' />
              <Typography>
                Please select the filter to dislpay student strength
              </Typography>
            </Grid>
          </Grid>
        )}
        {filteredData && (
          <Grid container spacing={2} className='studentStrenghtBody1'>
            <Grid item md={12} xs={12}>
              <TotalStudentBar
                fullData={(filteredData && filteredData.overall_stat) || {}}
              />
            </Grid>
            <Grid
              item
              md={selectedCard ? 6 : 12}
              xs={12}
              className='studentStrenghtBody2'
            >
              <Grid container spacing={3}>
                {filteredData &&
                  filteredData.grade_wise_data &&
                  filteredData.grade_wise_data.lenght !== 0 &&
                  filteredData.grade_wise_data.map((item) => (
                    <Grid item md={selectedCard ? 6 : 4} xs={12} key={item.id}>
                      <TotalStudentStrengthCard
                        fullData={item || {}}
                        handleSelectCard={setSelectedCard}
                        selectedId={selectedCard || ''}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            {selectedCard && (
              <Grid item md={6} xs={12} className='studentStrenghtBody2'>
                <TotalStudentWiseDetails
                  year={(selectedAcadmic && selectedAcadmic.id) || 0}
                  branch={(selectedBranch && selectedBranch.id) || 0}
                  grade={selectedCard || 0}
                  hadleClearGrade={setSelectedCard}
                />
              </Grid>
            )}
          </Grid>
        )}
        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(StudentStrength);
