/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { DataGrid } from '@material-ui/data-grid';
import React, { useContext, useEffect, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Divider, Grid, TextField, Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import useStyles from './useStyles';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import './styles.scss';

import Layout from '../../Layout';
// import './assign-role.css';

const AssignRole = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedRole, setSelectedRole] = useState('');
  const [pageno, setPageno] = useState(1);
  const [assignedRole, setAssigenedRole] = useState(false);
  const [assignedRoleError, setAssignedRoleError] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedMultipleRoles, setSelectedMultipleRoles] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [roleError, setRoleError] = useState('');
  const [selectectUserError, setSelectectUserError] = useState('');
  const [clearAll, setClearAll] = useState(false);
  const [clearAllActive, setClearAllActive] = useState(false);
  const [filterCheck, setFilterCheck] = useState(false);
  const [selectAllObj, setSelectAllObj] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [isSelected, setISselected] = useState(false);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('xs'));

<<<<<<< HEAD
  useEffect(() => {
    getRoleApi();
    getYearApi();
    // getBranchApi();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      getBranchApi();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedBranch) {
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (
      selectedMultipleRoles.length ||
      selectedGrades.length ||
      selectedSections.length ||
      searchText
    ) {
      setClearAllActive(true);
    }
  }, [selectedMultipleRoles, selectedGrades, selectedSections, searchText]);

  useEffect(() => {
    if (selectedGrades.length) {
      getSectionApi();
    }
  }, [selectedGrades]);

  useEffect(() => {
    displayUsersList();
    if (assignedRole) {
      setAssigenedRole(false);
    }
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [pageno, assignedRole, clearAll, filterCheck]);
=======
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Assign Role') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
>>>>>>> 103ed9fab4eb77b9692821b17b5b280771b5d716

  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.role_name));
        setRoles(result.data.result);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getYearApi = async () => {
    try {
      const result = await axiosInstance.get(`/erp_user/list-academic_year/?module_id=${moduleId}`);
      if (result.status === 200) {
        setAcademicYearList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.masterManagement.branchList}?session_year=${selectedYear.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setBranchList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getGradeApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch.id}&module_id=${moduleId}`);
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getSectionApi = async () => {
    try {
      const selectedGradeId = selectedGrades.map((el) => el.grade_id);
      const result = await axiosInstance.get(
        `${endpoints.communication.sections
        }?session_year=${selectedYear.id}&branch_id=${selectedBranch.id}&grade_id=${selectedGradeId.toString()}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        setSectionList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const displayUsersList = async () => {
    let getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=15`;

    if (selectedMultipleRoles.length) {
      const selectedRoleId = selectedMultipleRoles.map((el) => el.id);
      getUserListUrl += `&role=${selectedRoleId.toString()}`;
    }
    if (selectedYear) {
      getUserListUrl += `&session_year=${selectedYear.id}`;
    }
    if (selectedBranch) {
      getUserListUrl += `&branch=${selectedBranch.id}`;
    }
    if (selectedGrades.length) {
      const selectedGradeId = selectedGrades.map((el) => el.grade_id);
      getUserListUrl += `&grade=${selectedGradeId.toString()}`;
    }
    if (selectedSections.length) {
      const selectedSectionId = selectedSections.map((el) => el.section_id);
      getUserListUrl += `&section=${selectedSectionId.toString()}`;
    }
    if (searchText) {
      getUserListUrl += `&search=${searchText}`;
    }
    try {
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setHeaders([
          // { field: 'id', headerName: 'ID', width: 250 },
          { field: 'fullName', headerName: 'Name', width: 250 },
          { field: 'email', headerName: 'Email Id', width: 250 },
          { field: 'erp_id', headerName: 'ERP Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 150 },
          { field: 'contact', headerName: 'Contact', width: 150 },
          {
            field: 'role',
            headerName: 'Role',
            width: 150,
          },
        ]);
        const rows = [];
        const selectionRows = [];
        console.log('results ', result.data.results);

        result.data.results.forEach((items) => {
          rows.push({
            id: items.id,
            fullName: `${items.user.first_name} ${items.user.last_name}`,
            email: items.user.email,
            erp_id: items.erp_id,
            gender: items.gender,
            contact: items.contact,
            role: items.roles?.role_name,
          });
          selectionRows.push({
            id: items.id,
            data: {
              id: items.id,
              fullName: `${items.user.first_name} ${items.user.last_name}`,
              email: items.user.email,
              erp_id: items.erp_id,
              gender: items.gender,
              contact: items.contact,
              role: items.roles?.role_name,
            },
            selected: selectedUsers.length
              ? selectedUsers[pageno - 1].selected.includes(items.id)
              : false,
          });
        });

        setUsersRow(rows);
        setCompleteData(selectionRows);
        setTotalPage(result.data.count);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
        }

        if (result.data.total_pages !== selectAllObj.length) {
          const tempSelectAll = [];
          for (let page = 1; page <= result.data.total_pages; page += 1) {
            tempSelectAll.push({ selectAll: false });
          }
          setSelectAllObj(tempSelectAll);
        }
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleFilterCheck = () => {
    if (
      selectedYear ||
      selectedBranch ||
      selectedMultipleRoles.length ||
      selectedGrades.length ||
      selectedSections.length ||
      searchText
    ) {
      setSelectedUsers([]);
      setSelectAllObj([]);
      setPageno(1);
      setTotalPage(0);
      setFilterCheck(true);
    }
  };

  const handleClearAll = () => {
    if (clearAllActive) {
      setSelectedUsers([]);
      setSelectedMultipleRoles([]);
      setSelectedSections([]);
      setSelectedBranch('');
      setSelectedYear('');
      setSelectedGrades([]);
      setSelectAllObj([]);
      setTotalPage(0);
      setPageno(1);
      setClearAll(true);
      setClearAllActive(false);
    }
  };

  const handleTextSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleMultipleRoles = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedMultipleRoles(ids);
    } else {
      setSelectedMultipleRoles([]);
    }
  };

  const handleYear = (event, value) => {
    setSelectedYear('');
    setSelectedBranch('');
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value) {
      setSelectedYear(value);
    }
  };

  const handleBranch = (event, value) => {
    setSelectedBranch('');
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value) {
      setSelectedBranch(value);
    }
  };

  const handleGrades = (event, value) => {
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedGrades(ids);
    }
  };

  const handleSections = (event, value) => {
    setSelectedSections([]);
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedSections(ids);
    }
  };

  const handleSelectAll = (e) => {
    console.log('on click', e.target.checked)
    // set select all to true/false 

    // turn all the states to true/ False
    const tempSelectObj = selectAllObj.slice();
    
    // tempSelectObj[pageno - 1].selectAll = !tempSelectObj[pageno - 1].selectAll;
    tempSelectObj[pageno - 1].selectAll = e.target.checked;
    console.log('=== textClick checked: ', tempSelectObj)
    setSelectAllObj(tempSelectObj);
    const testclick = document.querySelectorAll('input[type=checkbox]');
    if (!selectAllObj[pageno - 1].selectAll) {
      for (let i = 2; i < testclick.length; i += 1) {
        // console.log('=== textClick checked: ', testclick[i])
        if (testclick[i].checked) {
          testclick[i].click()
        }
        testclick[i].removeAttribute("checked");
        
      }
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        // console.log('=== textClick unCheck: ', testclick[i])
        if (!testclick[i].checked) {
          testclick[i].click()
        }
        testclick[i].setAttribute("checked", "checked");
      }
    }
  };

  const clearSelectAll = () => {
    const tempSelectAll = selectAllObj?.map((obj) => ({ ...obj, selectAll: false }));
    if (tempSelectAll.length) {
      setSelectAllObj(tempSelectAll);
    }
  };

  const assignRole = async () => {
    const assignRoleApi = endpoints.communication.assignRole;
    const selectionArray = [];
    console.log('=== selected user assign: ', selectedUsers)
    selectedUsers.forEach((item) => {
      item.selected.forEach((ids) => {
        selectionArray.push(ids);
      });
    });

    if (!selectionArray.length) {
      setSelectectUserError('Please select some users');
      return;
    }
    if (!selectedRole) {
      setRoleError('Please select some Role');
      return;
    }
    // if (!assignedRole) {
    //   setAssignedRoleError('Please select a role to be assigned');
    //   return;
    // }

    setSelectectUserError('');
    try {
      const response = await axiosInstance.post(
        assignRoleApi,
        {
          role_id: selectedRole?.id,
          user_id: selectionArray,
        },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        // props.history.push('/user-management/assign-role')
        displayUsersList()
        setAlert('success', 'Role successfully assigned to user');
        // setSelectedUsers([]);
        setRoleError('');
        setSelectedRole('');
        setSelectAllObj([]);
        setSelectedBranch('');
        setSelectedGrades([]);
        setSelectedMultipleRoles([]);
        setSelectedSections([]);
        //setSelectAllObj([]);
        setSelectectUserError('');
        setAssigenedRole();
        clearSelectAll();
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
<<<<<<< HEAD
=======
  useEffect(() => {
    getRoleApi();
  }, []);

  useEffect(() => {
    if (moduleId) getYearApi();
  }, [moduleId]);

  useEffect(() => {
    if (selectedYear) {
      getBranchApi();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedBranch) {
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (
      selectedMultipleRoles.length ||
      selectedGrades.length ||
      selectedSections.length ||
      searchText
    ) {
      setClearAllActive(true);
    }
  }, [selectedMultipleRoles, selectedGrades, selectedSections, searchText]);

  useEffect(() => {
    if (selectedGrades.length) {
      getSectionApi();
    }
  }, [selectedGrades]);

  useEffect(() => {
    displayUsersList();
    if (assignedRole) {
      setAssigenedRole(false);
    }
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [pageno, assignedRole, clearAll, filterCheck]);
>>>>>>> 103ed9fab4eb77b9692821b17b5b280771b5d716

  const checkAll = selectAllObj[pageno - 1]?.selectAll || false;

  return (
    <Layout>
      <div className='assign-role-container'>
        <div className={classes.filtersContainer}>
          <div className={`bread-crumbs-container ${classes.spacer}`}>
            <CommonBreadcrumbs
              componentName='User Management'
              childComponentName='Assign role'
            />
          </div>
          {/* <Grid container className='message_log_container' spacing={10}>
          <Grid lg={10} item>
            <div className='user_search_wrapper'>
              <TextField
                id='user_search'
                label='Search'
                value={searchText}
                onChange={handleTextSearch}
              />
            </div>
          </Grid>

        </Grid> */}
          <Grid container spacing={2} className={classes.spacer}>
            <Grid item xs={12} md={3}>
              <Autocomplete
                multiple
                size='small'
                onChange={handleMultipleRoles}
                value={selectedMultipleRoles}
                id='message_log-smsType'
                options={roles}
                getOptionLabel={(option) => option?.role_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    label='Role'
                    placeholder='Role'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                size='small'
                onChange={handleYear}
                value={selectedYear || ''}
                id='message_log-branch'
                className='message_log_branch'
                options={academicYearList || []}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid>
            {selectedYear && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  size='small'
                  onChange={handleBranch}
                  value={selectedBranch || ''}
                  id='message_log-branch'
                  className='message_log_branch'
                  options={branchList || []}
                  getOptionLabel={(option) => option?.branch_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
            )}
            {selectedBranch && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleGrades}
                  value={selectedGrades || ''}
                  id='message_log-smsType'
                  options={gradeList || []}
                  getOptionLabel={(option) => option?.grade__grade_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Grade'
                      placeholder='Grade'
                    />
                  )}
                />
              </Grid>
            )}
            {selectedGrades.length > 0 && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleSections}
                  value={selectedSections || ''}
                  id='message_log-smsType'
                  options={sectionList || []}
                  getOptionLabel={(option) => option?.section__section_name || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Sections'
                      placeholder='Sections'
                    />
                  )}
                />
              </Grid>
            )}
            {/* <Grid xs={4}></Grid> */}
          </Grid>
          <Divider className={classes.spacer} />
          <Grid container spacing={4} className={classes.spacer}>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                className='disabled-btn'
                onClick={handleClearAll}
                fullWidth
              >
                CLEAR ALL
              </Button>

              {/* <input
              className={clearAllActive ? 'profile_update_button' : 'deactive_clearAll'}
              // className='profile_update_button'
              type='button'
              onClick={handleClearAll}
              value='Clear All'
            /> */}

              {/* <input
              className='profile_update_button'
              type='button'
              onClick={handleFilterCheck}
              value='Filter'
            /> */}
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                onClick={handleFilterCheck}
                color='primary'
                fullWidth
              >
                FILTER
              </Button>
            </Grid>
          </Grid>
          {/* <Grid container className='message_log_container' spacing={5}>
          <Grid lg={3} item>
            <Autocomplete
              multiple
              size='small'
              onChange={handleMultipleRoles}
              value={selectedMultipleRoles}
              id='message_log-smsType'
              options={roles}
              getOptionLabel={(option) => option?.role_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  label='Role'
                  placeholder='Role'
                />
              )}
            />
          </Grid>
          <Grid lg={3} item>
            <Autocomplete
              size='small'
              onChange={handleBranch}
              value={selectedBranch}
              id='message_log-branch'
              className='message_log_branch'
              options={branchList}
              getOptionLabel={(option) => option?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
          <Grid lg={3} item>
            {selectedBranch ? (
              <Autocomplete
                multiple
                size='small'
                onChange={handleGrades}
                value={selectedGrades}
                id='message_log-smsType'
                options={gradeList}
                getOptionLabel={(option) => option?.grade__grade_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            ) : null}
          </Grid>
          <Grid lg={3} item>
            {selectedGrades.length ? (
              <Autocomplete
                multiple
                size='small'
                onChange={handleSections}
                value={selectedSections}
                id='message_log-smsType'
                options={sectionList}
                getOptionLabel={(option) => option?.section__section_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    label='Sections'
                    placeholder='Sections'
                  />
                )}
              />
            ) : null}
          </Grid>
        </Grid> */}
          {/* <Grid container className='message_log_container' spacing={2}>
          <Grid lg={5} item>
            <input
              className={clearAllActive ? 'profile_update_button' : 'deactive_clearAll'}
              // className='profile_update_button'
              type='button'
              onClick={handleClearAll}
              value='Clear All'
            />

            <input
              className='profile_update_button'
              type='button'
              onClick={handleFilterCheck}
              value='Filter'
              </Grid>
        </Grid> */}
        </div>
        <div
          className={`${classes.tableActionsContainer} ${classes.spacer}`}
          style={{ width: '95%', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                //onChange={(e) => setSelectedBranch(e.target.value)}
                onChange={(event, value) => {
                  setSelectedRole(value);
                }}
                id='branch_id'
                //className='dropdownIcon'
                value={selectedRole}
                options={roles}
                getOptionLabel={(option) => option?.role_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Assign Role'
                    placeholder='Assign Role'
                  />
                )}
              />
            </Grid>
            {/*
            <Grid item xs={12} md={4}>
              <FormControl variant='outlined' fullWidth size='small'>
                <InputLabel id='demo-simple-select-outlined-label'>
                  Assign Role
                </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  label='Assign Role'
                >
                  <MenuItem>
                    <em>None</em>
                  </MenuItem>
                  {roles.map((items, index) => (
                    <MenuItem key={`roles_assign_${index}`} value={items.id}>
                      {items.role_name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText style={{ color: 'red' }}>{roleError}</FormHelperText>
              </FormControl>
            </Grid>
            */}

            <Grid item md={2} xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkAll}
                    onChange={(e) => handleSelectAll(e)}
                    color='primary'
                  />
                }
                label='Select all'
              />
            </Grid>
            <Grid item md={2} xs={4}>
              <Button
                onClick={assignRole}
                variant='contained'
                color='primary'
                disabled={!selectedRole}
              >
                ASSIGN ROLE
              </Button>
            </Grid>
            {isMobile && (
              <Grid item md={4} xs={6}>
                <p
                  className={classes.viewMoreBtn}
                  onClick={() => {
                    setViewMore((prevState) => !prevState);
                  }}
                  style={{ textAlign: 'right' }}
                >
                  {viewMore ? 'View Less' : 'View More'}
                </p>
              </Grid>
            )}
          </Grid>
        </div>
        {assignedRole ? (
          <div>Please Wait ...</div>
        ) : (
          <>
            {/* {usersRow.length && selectAllObj.length ? (
            <div className='assign_role_select_all_wrapper'>
              <input
                type='checkbox'
                className='assign_role_select_all_checkbox'
                checked={selectAllObj[pageno - 1].selectAll}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </div>
          ) : null} */}
            <span className='create_group_error_span'>{selectectUserError}</span>
              <CustomSelectionTable
                
              header={
                isMobile
                  ? headers
                    .filter((obj) => {
                      if (viewMore) {
                        return true;
                      }
                      return ['fullName', 'erp_id'].includes(obj.field);
                    })
                    .map((header) => ({ ...header, width: 150 }))
                  : headers
              }
              rows={usersRow}
              checkAll={checkAll}
              completeData={completeData}
              totalRows={totalPage}
              pageno={pageno}
              selectedUsers={selectedUsers}
              changePage={setPageno}
              name='assign_role'
              setSelectedUsers={setSelectedUsers}
              pageSize={15}
            />
            {/*
            
                  import { DataGrid } from '@material-ui/data-grid';

                  const columns = [
                    { field: 'fullName', headerName: 'Name', width: 250 },
                    { field: 'email', headerName: 'Email Id', width: 250 },
                    { field: 'erp_id', headerName: 'ERP Id', width: 150 },
                    { field: 'gender', headerName: 'Gender', width: 150 },
                    { field: 'contact', headerName: 'Contact', width: 150 },
                    {
                      field: 'role',
                      headerName: 'Role',
                      width: 150,
                    },
                  ];

                  const rows = [
                    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
                    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
                    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
                    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
                    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
                    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
                    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
                    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
                    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
                  ];

                  export default function DataGridDemo() {
                    return (
                      <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
                      </div>
                    );
                  }

            
            <Grid container className='message_log_container' spacing={5}>
            <Grid lg={3} item>
              <input
                className='assign_role_button'
                type='button'
                onClick={assignRole}
                value='Assign Role'
              />
            </Grid>
            <Grid lg={3} item>
              <div className='assign_role_roles'>
                <span className='create_group_error_span'>{roleError}</span>
                <FormControl variant='outlined' className={classes.formControl}>
                  <InputLabel id='demo-simple-select-outlined-label'>
                    Assign Role
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    label='Roles'
                  >
                    <MenuItem>
                      <em>None</em>
                    </MenuItem>
                    {roles.map((items, index) => (
                      <MenuItem key={`roles_assign_${index}`} value={items.id}>
                        {items.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid> */}
            {/*
            <Grid
              container
              className={`${classes.assignRoleBtnContainer} ${classes.spacer}`}
              justify={isMobile && 'center'}
            >
              <Grid item md={4}>
                <Button
                  onClick={assignRole}
                  variant='contained'
                  color='primary'
                  disabled={!selectedRole}
                >
                  ASSIGN ROLE
                </Button>
              </Grid>
            </Grid>
            */}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AssignRole;
