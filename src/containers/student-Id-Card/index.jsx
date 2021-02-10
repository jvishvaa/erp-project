/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import './style.scss';
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  TablePagination,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import Layout from '../Layout';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import StudentIdCardDetails from './studentIdCardDetail';
import StudentIDCardFullView from './studentIcardFullView';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const StudentIdCard = ({ history }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [filterList, setFilterList] = useState({
    acadminYearList: [],
    selectedYear: '',
    branchList: [],
    selectedBranch: '',
    roleList: [],
    selectedRole: '',
    gradeList: [],
    selectedGrade: '',
    sectionlist: [],
    selectedSection: '',
    idCardList: '',
    selectedId: '',
    currentPage: 1,
  });

  function handleStateData(e, key) {
    setFilterList((prev) => {
      const newData = { ...prev };
      switch (key) {
        case key:
          newData[key] = e;
          return newData;
        default:
          return null;
      }
    });
  }

  function getSectionList(value) {
    if (value) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.academics.sections}?branch_id=${filterList.selectedBranch.id}&grade_id=${value}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            handleStateData(result.data.data, 'sectionlist');
            setLoading(false);
          } else {
            setAlert('error', result.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else {
      handleStateData([], 'sectionlist');
    }
  }

  function getGradeList(branch) {
    if (branch) {
      setLoading(true);
      axiosInstance
        .get(`${endpoints.academics.grades}?branch_id=${branch}`)
        .then((result) => {
          if (result.status === 200) {
            handleStateData(result.data.data, 'gradeList');
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
      handleStateData([], 'gradeList');
      handleStateData([], 'sectionlist');
    }
  }

  function getBranchAndRoleAcadList(api, keys) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          if (keys === 'roleList') {
            handleStateData(result.data.result, keys);
          } else {
            handleStateData(result.data.data, keys);
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

  function handleClearFilter() {
    handleStateData('', 'selectedYear');
    handleStateData('', 'selectedBranch');
    handleStateData('', 'selectedGrade');
    handleStateData('', 'selectedSection');
    handleStateData('', 'selectedRole');
    handleStateData([], 'gradeList');
    handleStateData([], 'sectionlist');
  }

  useEffect(() => {
    getBranchAndRoleAcadList(endpoints.communication.branches, 'branchList');
    getBranchAndRoleAcadList(endpoints.communication.roles, 'roleList');
    getBranchAndRoleAcadList(endpoints.userManagement.academicYear, 'acadminYearList');
  }, []);

  function getIdCardsData(pageNo) {
    setLoading(true);
    const year = filterList && filterList.selectedYear && filterList.selectedYear.id;
    const branch =
      filterList && filterList.selectedBranch && filterList.selectedBranch.id;
    const role = filterList && filterList.selectedRole && filterList.selectedRole.id;
    const grade =
      filterList && filterList.selectedGrade && filterList.selectedGrade.grade_id;
    const section =
      filterList && filterList.selectedSection && filterList.selectedSection.section_id;
    axiosInstance
      .get(
        `${
          endpoints.idCards.getIdCardsApi
        }?academic_year_id=${year}&branch_id=${branch}&role_id=${role}${
          grade ? `&grade_id=${grade}` : ''
        }${section ? `&section_id=${section}` : ''}&page_size=12&page=${pageNo}`
      )
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          handleStateData(result.data.result, 'idCardList');
          handleStateData('', 'selectedId');
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  function handleFilter() {
    if (!filterList.selectedYear) {
      setAlert('error', 'Select Acadmic Year');
      return;
    }
    if (!filterList.selectedBranch) {
      setAlert('error', 'Select Branch');
      return;
    }
    if (!filterList.selectedRole) {
      setAlert('error', 'Select Role');
      return;
    }
    getIdCardsData(1);
  }

  function handlePagination(e, page) {
    handleStateData(page, 'currentPage');
    getIdCardsData(page);
  }

  return (
    <>
      {/* <Layout> */}
      <Grid container spacing={2} className='studentIdcardFilterDiv'>
        <Grid item md={12} xs={12}>
          <Grid container spacing={5} justify='middle'>
            <Grid item md={12} xs={12} style={{ display: 'flex' }}>
              <button
                type='button'
                className='studentIdCardNavigationLinks'
                onClick={() => history.push('/dashboard')}
              >
                Dashboard
              </button>
              <ArrowForwardIosIcon className='studentIdCardNavArrow' />
              <span className='studentIdCardNavigationLinks'>ID Cards</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} className='studentIdCardFilterSelectionDiv'>
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  handleStateData(value, 'selectedYear');
                  handleStateData('', 'selectedRole');
                  handleStateData('', 'selectedBranch');
                  handleStateData('', 'selectedGrade');
                  handleStateData('', 'selectedSection');
                }}
                id='academic-year'
                className='dropdownIcon'
                value={filterList.selectedYear}
                options={filterList.acadminYearList}
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
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  handleStateData(value, 'selectedBranch');
                  handleStateData('', 'selectedGrade');
                  handleStateData('', 'selectedSection');
                  getGradeList(value && value.id);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={filterList.selectedBranch}
                options={filterList.branchList}
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
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => handleStateData(value, 'selectedRole')}
                id='role_id'
                className='dropdownIcon'
                value={filterList.selectedRole}
                options={filterList.roleList}
                getOptionLabel={(option) => option?.role_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Role'
                    placeholder='Role'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  handleStateData(value, 'selectedGrade');
                  handleStateData('', 'selectedSection');
                  getSectionList(value && value.grade_id);
                }}
                id='grade_id'
                className='dropdownIcon'
                value={filterList.selectedGrade}
                options={filterList.gradeList}
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
                style={{ width: '100%' }}
                size='small'
                className='dropdownIcon'
                onChange={(event, value) => handleStateData(value, 'selectedSection')}
                id='section_id'
                options={filterList.sectionlist}
                value={filterList.selectedSection}
                getOptionLabel={(option) => option?.section__section_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Sections'
                    placeholder='Sections'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider className='studdentIdCardDivider' />
          <Grid container spacing={2} className='studentIdCardFilterSelectionDiv'>
            <Grid item md={1} xs={12}>
              <Button
                variant='contained'
                size='small'
                fullWidth
                className='studentIdCardFilterButton'
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
                className='studentIdCardFilterButton'
              >
                FILTER
              </Button>
            </Grid>
            <span className='studentIdCardButtonBorderDivider' />
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                size='small'
                color='primary'
                className='studentIdCardFilterButton1'
              >
                Create New
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ padding: '10px 20px' }}>
        {filterList &&
          filterList.idCardList &&
          filterList.idCardList.results.length === 0 && (
            <Grid item md={12} xs={12}>
              <Typography
                variant='h5'
                style={{ textAlign: 'center', margin: '20px 0px' }}
              >
                ID Cards Not Found
              </Typography>
            </Grid>
          )}
        {filterList &&
          filterList.idCardList &&
          filterList.idCardList.results.length !== 0 && (
            <Grid
              item
              md={filterList && filterList.selectedId ? 7 : 12}
              xs={12}
              className='studentIdCardViewCardsSection'
            >
              <Grid container spacing={3}>
                {filterList &&
                  filterList.idCardList &&
                  filterList.idCardList.results.length !== 0 &&
                  filterList.idCardList.results.map((item) => (
                    <Grid
                      item
                      md={filterList && filterList.selectedId ? 6 : 4}
                      xs={12}
                      key={item.id}
                    >
                      <StudentIdCardDetails
                        handleSelect={handleStateData}
                        fullData={item || {}}
                        selectedItem={(filterList && filterList.selectedId) || {}}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          )}
        {filterList && filterList.selectedId && (
          <Grid item md={5} xs={12} className='studentIdCardLeftBorderView'>
            <Grid container className='studentIdCardViewCardsFullSection'>
              <Grid item md={12} xs={12}>
                <StudentIDCardFullView
                  handleClose={handleStateData}
                  selectedDetails={(filterList && filterList.selectedId) || {}}
                  selectedRole={
                    (filterList &&
                      filterList.selectedRole &&
                      filterList.selectedRole.role_name) ||
                    ''
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {filterList &&
          filterList.idCardList &&
          filterList.idCardList.results.length !== 0 && (
            <Grid item md={12} xs={12} className='paginationDiv'>
              <TablePagination
                component='div'
                count={
                  filterList && filterList.idCardList && filterList.idCardList.total_pages
                }
                rowsPerPage='12'
                page={
                  Number(
                    filterList &&
                      filterList.idCardList &&
                      filterList.idCardList.current_page
                  ) - 1
                }
                onChangePage={(e, page) => {
                  handlePagination(e, page + 1);
                }}
                rowsPerPageOptions={false}
                className='table-pagination-users-log-message'
              />
            </Grid>
          )}
      </Grid>
      {/* </Layout> */}
      {loading && <Loader />}
    </>
  );
};

export default withRouter(StudentIdCard);
