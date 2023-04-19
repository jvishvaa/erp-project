/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { DataGrid } from '@material-ui/data-grid';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Divider, Grid, TextField, Button, OutlinedInput, Typography } from '@material-ui/core';
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
import { connect, useSelector } from 'react-redux';
import useStyles from './useStyles';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import './styles.scss';
import Loader from '../../../components/loader/loader';
import { Table , Pagination, Spin } from 'antd';
import Layout from '../../Layout';
import { SearchOutlined } from '@material-ui/icons';
// import './assign-role.css';

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const AssignRole = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const isSuper = JSON.parse(localStorage.getItem('userDetails'))?.is_superuser || {};
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
  // const [selectedYear, setSelectedYear] = useState('');
  const selectedYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
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
  const [isNewSeach, setIsNewSearch] = useState(true);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('xs'));
  const [loading, setLoading] = useState(false);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa'
      ? true
      : false;

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

  useEffect(() => {
    getRoleApi();
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) getBranchApi();
  }, [moduleId, selectedYear]);

  // useEffect(() => {
  //   if (selectedYear) {
  //     getBranchApi();
  //   }
  // }, [selectedYear]);

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
    if (moduleId && filterCheck) displayUsersList();
    if (assignedRole) {
      setAssigenedRole(false);
    }
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [pageno, assignedRole, clearAll, filterCheck, moduleId]);

  useEffect(() => {
    if (isNewSeach && moduleId) {
      setIsNewSearch(false);
      displayUsersList();
    }
  }, [isNewSeach, moduleId]);

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

  // const getYearApi = async () => {
  //   try {
  //     const result = await axiosInstance.get(`erp_user/branch/?session_year=${selectedYear?.id}&module_id=${moduleId}`);
  //     if (result.data?.status_code === 200) {
  //       setAcademicYearList(result.data.data);
  //       const defaultYear = result.data?.data?.[0];
  //       // setSelectedYear(defaultYear);
  //     } else {
  //       setAlert('error', result.data.message);
  //     }
  //   } catch (error) {
  //     setAlert('error', error.message);
  //   }
  // };

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
    setLoading(true)
    if (moduleId) {
      let getUserListUrl = ''
      if (window.location.host == 'orchids.letseduvate.com' || window.location.host == 'qa.olvorchidnaigaon.letseduvate.com' || window.location.host == 'test.orchids.letseduvate.com') {
        if (isSuper != true) {
          getUserListUrl = `${endpoints.communication.userListV2}?page=${pageno}&page_size=15&module_id=${moduleId}`;
        } else {
          getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=15&module_id=${moduleId}`;
        }
      } else {
        getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=15&module_id=${moduleId}`;
      }

      if (selectedMultipleRoles.length) {
        const selectedRoleId = selectedMultipleRoles.map((el) => el.id);
        getUserListUrl += `&role=${selectedRoleId.toString()}`;
      }
      if (selectedYear) {
        getUserListUrl += `&session_year=${selectedYear.id}`;
      }
      if (selectedBranch) {
        getUserListUrl += `&branch_id=${selectedBranch.id}`;
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
            // selectionRows.push({
            //   id: items.id,
            //   data: {
            //     id: items.id,
            //     fullName: `${items.user.first_name} ${items.user.last_name}`,
            //     email: items.user.email,
            //     erp_id: items.erp_id,
            //     gender: items.gender,
            //     contact: items.contact,
            //     role: items.roles?.role_name,
            //   },
            //   selected: selectedUsers.length
            //     ? selectedUsers[pageno - 1].selected.includes(items.id)
            //     : false,
            // });
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
          setLoading(false)
        } else {
          setLoading(false)
          setAlert('error', result.data.message);
        }
      } catch (error) {
        setLoading(false)
        setAlert('error', error.message);
      }
    }
  };

  const showContactInfo = async (index, id, type) => {
    try {
      const statusChange = await axiosInstance.get(
        `${endpoints.communication.fetchContactInfoByErp}?erp_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusChange.status === 200) {
        // setLoading(false);
        let newData;
        let newContact;
        if (type === "email") {
          const email = statusChange?.data?.data?.email;
          newData = { ...usersRow[index], email };
          console.log(newData , 'new');
          usersRow[index] = newData
          setUsersRow(usersRow)
          console.log(usersRow , 'user');
          // console.log(statusChange?.data?.data?.email)
        }
        else {
          const contact = statusChange?.data?.data?.contact;
          newContact = { ...usersRow[index], contact };
          console.log(newContact , 'newcontact');
          usersRow[index] = newContact
          setUsersRow(usersRow)
          console.log(usersRow , 'usercontact');
        }
        
        // console.log(newArr , 'newArr');
        // setUsersRow(newArr)
        setAlert('success', statusChange.data.message);
        setLoading(false);
      } else {
        setLoading(false);
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setLoading(false);
      setAlert('error', error.message);
    }
  };

  useEffect(() => {
    displayUsersList();
  }, [pageno, clearAllActive]);

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
      // setSelectedYear('');
      setSelectedGrades([]);
      setSelectAllObj([]);
      setTotalPage(0);
      setPageno(1);
      setClearAll(true);
      setClearAllActive(false);
      setIsNewSearch(false);
      setSearchText('');
    }
  };

  const debounceCallback = useCallback(
    debounce(value => {
      setIsNewSearch(true);
    }, 500),
    []
  );

  const handleTextSearch = (e) => {
    let search = e.target.value;
    setSearchText(e.target.value);
    if (search.length > 1) {
      debounceCallback(search);
    }
    else {
      setIsNewSearch(false);
    }
  };

  const handleMultipleRoles = (event, value) => {
    if (value?.length) {
      const ids = value.map((el) => el) || [];
      setSelectedMultipleRoles(ids);
    } else {
      setSelectedMultipleRoles([]);
    }
  };

  const handleYear = (event = {}, value = '') => {
    // setSelectedYear('');
    setSelectedBranch('');
    setSelectedGrades([]);
    setSelectedSections([]);
    if (value) {
      // setSelectedYear(value);
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
    // set select all to true/false 

    // turn all the states to true/ False
    const tempSelectObj = selectAllObj.slice();

    // tempSelectObj[pageno - 1].selectAll = !tempSelectObj[pageno - 1].selectAll;
    tempSelectObj[pageno - 1].selectAll = e.target.checked;
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
    setLoading(true)
    console.log(selectedUsers);
    const assignRoleApi = endpoints.communication.assignRole;
    const selectionArray = [];
    selectedUsers.forEach((item) => {
        selectionArray.push(item?.id);
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
        setLoading(false)
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
        setSelectedUsers([])
        clearSelectAll();
      } else {
        setAlert('error', response.data.message);
        setLoading(false)
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false)
    }
  };

  const checkAll = selectAllObj[pageno - 1]?.selectAll || false;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      onCell: (record, rowIndex ) => {
        return {
            onClick: (ev) => {
              handleCLickCellEmail(record, rowIndex , 'email' );
            },
        };
    },
    },
    {
      title: 'ERP ID',
      dataIndex: 'erp_id',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
     {
      title: 'Contact',
      dataIndex: 'contact',
      onCell: (record, rowIndex ) => {
        return {
            onClick: (ev) => {
              handleCLickCellEmail(record, rowIndex , 'contact' );
            },
        };
    },
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
  ];

  const handleCLickCellEmail = (record, rowIndex , type ) => {
    console.log(record, rowIndex  ,'record');
    showContactInfo(rowIndex , record?.erp_id , type )
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedUsers(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: (record.role === 'Student' || record.role === 'student' || record.role === "Anvesh_Student") && isOrchids,
    
    }),
  };

  return (
    <Layout>
      {/* {loading && <Loader />} */}
      <CommonBreadcrumbs
        componentName='User Management'
        childComponentName='Assign role'
      />
      <div className='assign-role-container'>
        <div className={classes.filtersContainer}>
          <Grid container spacing={2} className={classes.spacer}>
            <Grid item xs={12} md={3}>
              <FormControl
                variant='outlined'
                className={'searchViewUser'}
                fullWidth
                size='small'
              >
                <InputLabel>Search</InputLabel>
                <OutlinedInput
                  endAdornment={<SearchOutlined color='primary' />}
                  placeholder='Search users ..'
                  label='Search'
                  value={searchText}
                  onChange={handleTextSearch}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                multiple
                size='small'
                onChange={handleMultipleRoles}
                value={selectedMultipleRoles}
                className='dropdownIcon'
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
            {/* <Grid item xs={12} md={3}>
              <Autocomplete
                size='small'
                onChange={handleYear}
                value={selectedYear || ''}
                id='message_log-branch'
                className='message_log_branch dropdownIcon'
                value={selectedYear || ''}
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
            </Grid> */}
            {selectedYear && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  size='small'
                  onChange={handleBranch}
                  value={selectedBranch || ''}
                  id='message_log-branch'
                  className='message_log_branch dropdownIcon'
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
                  className='dropdownIcon'
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
                  className='dropdownIcon'
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
          </Grid>
          <Divider className={classes.spacer} />
          <Grid container spacing={4} className={classes.spacer}>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                className='cancelButton labelColor'
                onClick={handleClearAll}
                size='medium'
                style={{ width: '100%' }}
              >
                Clear All
              </Button>
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                variant='contained'
                onClick={handleFilterCheck}
                color='primary'
                size='medium'
                style={{ color: 'white', width: '100%' }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
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
                onChange={(event, value) => {
                  setSelectedRole(value);
                }}
                id='branch_id'
                className='dropdownIcon'
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
            {/* <Grid item md={2} xs={4}>
              <Typography color="secondary">
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
              </Typography>
            </Grid> */}
            <Grid item md={2} xs={4}>
              <Button
                onClick={assignRole}
                variant='contained'
                color='primary'
                size='medium'
                style={{ width: '100%', color: 'white' }}
                disabled={!selectedRole}
              >
                Assign Role
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
            <span className='create_group_error_span'>{selectectUserError}</span>
            {/* <CustomSelectionTable

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
              showContactInfo={showContactInfo}
              setLoading={setLoading}
            /> */}
            {console.log(usersRow , 'row')}
            {loading ? <div style={{display: 'flex' , justifyContent: 'center' }} >
              <Spin size='large' tip='Loading...'  />
            </div>  : 
            <>
            <Table
              rowSelection={{ ...rowSelection }}
              columns={columns}
              dataSource={[...usersRow]}
              rowKey={(record) => record?.id}
              pagination={false}
              rowClassName={(record, index) =>
                `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              className=' th-homework-table-head-bg '
            />
            <div className='bg-white pt-3' >
            <Pagination
              current={pageno}
              total={totalPage}
              showSizeChanger={false}
              pageSize={15}
              onChange={(current) => setPageno(current)}
              className='text-center'
              />
              </div>
            </>}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AssignRole;