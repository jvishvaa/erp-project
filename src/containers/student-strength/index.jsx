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
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';

const StudentStrength = ({ history }) => {
  const [acadminYearList, setAcadminYearList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [hRef, setHRef] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePagination = (event, page) => {
    setPage(page);
    handleFilter(page);
  };

  const moduleId = 178;
  useEffect(() => {
    setHRef([
      {
        csv: `${endpoints.studentListApis.downloadExcelAllstudents}?academic_year_id=${
          selectedAcademicYear && selectedAcademicYear.id
        }&export_type=csv`,
      },
      {
        csv: `${endpoints.studentListApis.downloadBranchWiseStudent}?academic_year_id=${
          selectedAcademicYear && selectedAcademicYear.id
        }&branch_id=${selectedBranch && selectedBranch.id}
          &export_type=csv`,
      },
    ]);
  }, [selectedAcademicYear, selectedBranch]);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || [], 'checking');
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [], 'checking');
            setBranchList(result?.data?.data?.results || []);
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
    callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
  }, []);

  function handleClearFilter() {
    setSelectedAcadmeicYear('');
    setSelectedBranch('');
    setFilteredData('');
    setPage(1);
  }

  function handleFilter(pageNumber) {
    if (!selectedAcademicYear) {
      setAlert('error', 'Select Acadminc year');
      return;
    }
    if (!selectedBranch) {
      setAlert('error', 'Select Branch');
      return;
    }
    setLoading(true);
    console.log(selectedBranch, 'branch');
    axiosInstance
      .get(
        `${endpoints.studentListApis.branchWiseStudentCount}?academic_year_id=${
          selectedAcademicYear && selectedAcademicYear.id
        }&branch_id=${selectedBranch && selectedBranch.branch.id}&page_number=${
          pageNumber || 1
        }&page_size=${15}`
      )
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setTotalPages(result.data.total_pages);
          console.log(result.data.total_pages);
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
                <span className='SignatureNavigationLinks'>School Strength</span>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} xs={12} className='studentStrengthFilterDiv'>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    setSelectedAcadmeicYear(value);
                    if (value) {
                      callApi(
                        `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                        'branchList'
                      );
                    }
                    setSelectedBranch([]);
                  }}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedAcademicYear || ''}
                  options={academicYear || ''}
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
              <Grid item md={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    setSelectedBranch([]);
                    if (value) {
                      const selectedId = value.branch.id;
                      setSelectedBranch(value);
                      callApi(
                        `${endpoints.academics.grades}?session_year=${
                          selectedAcademicYear.id
                        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                        'gradeList'
                      );
                    }
                  }}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedBranch || ''}
                  options={branchList || ''}
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
            </Grid>
            <Divider className='studentStrenghtDivider' />
            <Grid container spacing={2}>
              <MediaQuery minWidth={1523}>
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
                    onClick={() => {
                      setPage(1);
                      handleFilter(1);
                    }}
                    className='studentStrenghtFilterButton'
                  >
                    FILTER
                  </Button>
                </Grid>
                <Grid item md={4} />

                {selectedAcademicYear && (
                  <Grid item md={3} xs={12}>
                    <Button
                      size='small'
                      href={hRef && hRef[0] && hRef[0].csv}
                      className='studentStrenghtDownloadButton'
                    >
                      Download all Branch excel
                    </Button>
                  </Grid>
                )}
                {selectedAcademicYear && selectedBranch && (
                  <Grid item md={2} xs={12} style={{ marginLeft: '-8%' }}>
                    <Button
                      variant='contained'
                      size='small'
                      color='primary'
                      href={hRef && hRef[1] && hRef[1].csv}
                      className='studentStrenghtFilterButton'
                    >
                      Download Branch excel
                    </Button>
                  </Grid>
                )}
              </MediaQuery>
              <MediaQuery minWidth={1366} maxWidth={1522}>
                <Grid item>
                  <Button
                    variant='contained'
                    size='small'
                    className='studentStrenghtFilterButton'
                    onClick={() => handleClearFilter()}
                  >
                    CLEAR ALL
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={() => {
                      setPage(1);
                      handleFilter(1);
                    }}
                    className='studentStrenghtFilterButton'
                  >
                    FILTER
                  </Button>
                </Grid>
                <Grid item md={2} />

                {selectedAcademicYear && (
                  <Grid item>
                    <Button
                      size='small'
                      href={hRef && hRef[0] && hRef[0].csv}
                      className='studentStrenghtDownloadButton'
                    >
                      Download all Branch excel
                    </Button>
                  </Grid>
                )}

                {selectedAcademicYear && selectedBranch && (
                  <Grid item>
                    <Button
                      variant='contained'
                      size='small'
                      color='primary'
                      href={hRef && hRef[1] && hRef[1].csv}
                      className='studentStrenghtFilterButton'
                    >
                      Download Branch excel
                    </Button>
                  </Grid>
                )}
              </MediaQuery>
              <MediaQuery minWidth={900} maxWidth={1365}>
                <Grid item>
                  <Button
                    variant='contained'
                    size='small'
                    className='studentStrenghtFilterButton'
                    onClick={() => handleClearFilter()}
                  >
                    CLEAR ALL
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={() => {
                      setPage(1);
                      handleFilter(1);
                    }}
                    className='studentStrenghtFilterButton'
                  >
                    FILTER
                  </Button>
                </Grid>
              

                {selectedAcademicYear && (
                  <Grid item>
                    <Button
                      size='small'
                      href={hRef && hRef[0] && hRef[0].csv}
                      className='studentStrenghtDownloadButton'
                    >
                      Download all Branch excel
                    </Button>
                  </Grid>
                )}

                {selectedAcademicYear && selectedBranch && (
                  <Grid item>
                    <Button
                      variant='contained'
                      size='small'
                      color='primary'
                      href={hRef && hRef[1] && hRef[1].csv}
                      className='studentStrenghtFilterButton'
                    >
                      Download Branch excel
                    </Button>
                  </Grid>
                )}
              </MediaQuery>
              <MediaQuery maxWidth={899}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    fullWidth
                    onClick={() => {
                      setPage(1);
                      handleFilter(1);
                    }}
                    className='studentStrenghtFilterButton'
                  >
                    FILTER
                  </Button>
                </Grid>
                <Grid item md={4} />

                {selectedAcademicYear && (
                  <Grid item xs={12}>
                    <Button
                      size='small'
                      href={hRef && hRef[0] && hRef[0].csv}
                      className='studentStrenghtDownloadButton'
                      fullWidth
                    >
                      Download all Branch excel
                    </Button>
                  </Grid>
                )}
                {selectedAcademicYear && selectedBranch && (
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      size='small'
                      fullWidth
                      color='primary'
                      href={hRef && hRef[1] && hRef[1].csv}
                      className='studentStrenghtFilterButton'
                    >
                      Download Branch excel
                    </Button>
                  </Grid>
                )}
              </MediaQuery>
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
            <Grid item md={selectedCard ? 6 : 9} xs={12} className='studentStrenghtBody2'>
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
                  year={(selectedAcademicYear && selectedAcademicYear.id) || 0}
                  branch={(selectedBranch && selectedBranch.branch.id) || 0}
                  grade={selectedCard || 0}
                  hadleClearGrade={setSelectedCard}
                  fullWidth
                />
              </Grid>
            )}
          </Grid>
        )}

        {filteredData && filteredData.grade_wise_data ? (
          <Grid container justify='center'>
            <Pagination
              onChange={handlePagination}
              style={{ marginTop: 25 }}
              count={totalPages}
              color='primary'
              page={page}
            />
          </Grid>
        ) : (
          ''
        )}
        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(StudentStrength);
