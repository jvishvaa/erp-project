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
import CustomSelectionTable from 'containers/communication/custom-selection-table/custom-selection-table';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { connect, useSelector } from 'react-redux';
import useStyles from 'containers/communication/assign-role/useStyles';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import 'containers/communication/assign-role/styles.scss';
import axios from 'axios';
import Layout from '../../Layout';
import Loader from 'components/loader/loader'
import { SearchOutlined } from '@material-ui/icons';
// import './assign-role.css';

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

let levelObj = {};


const UserLevelTable = (props) => {
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
  const [roles, setRoles] = useState('');
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
  const [selectAll, setSelectAll] = useState(false);
const [ loading , setLoading ] = useState(false)

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

  useEffect(() => {
    getRoleApi();
  }, []);

 



  useEffect(() => {
    if (
      selectedMultipleRoles ||
      searchText
    ) {
      setClearAllActive(true);
    }
  }, [selectedMultipleRoles, searchText]);


  useEffect(() => {
    if (moduleId && pageno && roles) { displayUsersList() }
    if (assignedRole) {
      setAssigenedRole(false);
    }
    if (clearAll) {
      setClearAll(false);
    }
    if (filterCheck) {
      setFilterCheck(false);
    }
  }, [pageno, assignedRole, clearAll, filterCheck, moduleId, roles]);

  useEffect(() => {
    if (isNewSeach) {
      setIsNewSearch(false);
      displayUsersList()
    }
  }, [isNewSeach]);



  const getRoleApi = async () => {
    try {
      const result = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        const levels = result?.data?.result;
        setRoles(levels);
        levels.forEach(({ id = 3, level_name = 'Student' }) => levelObj[id] = level_name)
        // displayUsersList(result?.data?.result?.result)
      } else {
        setAlert('error', result?.data?.message);
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  


  const displayUsersList = async () => {
    setSelectAll(false)
    let getUserListUrl = `${endpoints.userManagement.getUserLevel}?page_num=${pageno}&page_size=15`;
    if (searchText) {
      getUserListUrl += `&search=${searchText}`;
    }
    if (selectedMultipleRoles?.id) {
      getUserListUrl += `&user_level=${selectedMultipleRoles?.id}`;
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
          { field: 'name', headerName: 'Name', width: 250 , headerAlign: 'center' },
          { field: 'erp_id', headerName: 'ERP Id', width: 250, headerAlign: 'center' },
          { field: 'userlevel', headerName: 'User Level', width: 250, headerAlign: 'center' },
          { field: 'userlevelid', headerName: 'User Level ID', width: 250 , headerAlign: 'center'},
        ]);
        const rows = [];
        const selectionRows = [];
        result.data.result.results.forEach((items, index) => {

          rows.push({
            id: index,
            name: items.name,
            erp_id: items.erp_id,
            userlevel: levelObj[items?.level],
            userid: items.user_id,
            userlevelid: items?.level,
          });
          selectionRows.push({
            id: index,
            data: {
              id: index,
              name: items?.name,
              erp_id: items?.erp_id,
              userlevel: items?.level,
              userid: items?.user_id,
            },
            selected: selectAll
            ? true
            : selectedUsers.length
              ? selectedUsers[pageno - 1].selected.includes(items.user_id)
              : false,
          });
        });

        setUsersRow(rows);
        setCompleteData(selectionRows);
        setTotalPage(result.data.result.count);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.result.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, selected: [] });
          }
          console.log(tempSelectedUser , "selectedUser");
          setSelectedUsers(tempSelectedUser);
        }
        UnSelectAll()

        // if (result.data.result.total_pages !== selectAllObj.length) {
        //   const tempSelectAll = [];
        //   for (let page = 1; page <= result.data.result.total_pages; page += 1) {
        //     tempSelectAll.push({ selectAll: false });
        //   }
        //   setSelectAllObj(tempSelectAll);
        // }
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleFilterCheck = () => {
    if (

      selectedMultipleRoles?.id
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

  const UnSelectAll = () => {
    var items=document.querySelectorAll('input[type=checkbox]');
    items.forEach((item , index) => {
      if(item.checked){
        items[index].click()
      }
    })
  }

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

  





  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('input[type=checkbox]'); // [class*="PrivateSwitchBase-input-"]
    if (!selectAll) {
      testclick[1].click();
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
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
    setSelectAll(false)
    setSelectedMultipleRoles([])
    setSearchText('')
    const assignRoleApi = endpoints.userManagement.assignLevel;
    const selectionArray = [];
    // selectedUsers.forEach((item) => {
    //   console.log(item , "users");
    //   item.selected.forEach((ids) => {
    //     selectionArray.push(ids);
    //   });
    // });

    if (selectAll) {
      completeData
        .forEach((items) => {
          console.log(items);
          selectionArray.push(items.data.userid);
        });
      // selectionArray.push(0);
    }
    if(!selectAll){
    selectedUsers.forEach((item) => {
      item.selected.forEach((ids) => {
        selectionArray.push(ids);
      });
    });
  }

    if (!selectionArray.length) {
      setSelectectUserError('Please select some users');
      return;
    }
    if (!selectedRole) {
      setRoleError('Please select level');
      return;
    }
 

    setSelectectUserError('');
    const formData = new FormData();
    formData.append('user_level', selectedRole?.id)
    formData.append('user', selectionArray)
    try {
      setLoading(true)
      const response = await axiosInstance.post(
        assignRoleApi,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 201) {
        setLoading(false)
        setAlert('success', 'Role successfully assigned to user');
        clearSelectAll();
        displayUsersList()
        setRoleError('');
        setSelectedRole('');
        setSelectAllObj([]);
        setSelectedMultipleRoles([]);
        setSelectectUserError('');
        setAssigenedRole();
        UnSelectAll()
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

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='User Management'
        childComponentName='Assign User Level'
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
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedMultipleRoles(value);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedMultipleRoles}
                options={roles}
                getOptionLabel={(option) => option?.level_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='User Level'
                    placeholder='Select User Level'
                  />
                )}
              />

            </Grid>
            
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
                getOptionLabel={(option) => option?.level_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Assign User Level'
                    placeholder='Assign User Level'
                  />
                )}
              />
              {selectedRole ? 
              <div style={{marginTop : '10px' , border: '1px solid' , padding: '5px', borderColor: '#afafaf', borderRadius: '10px'}} >
              <p><strong>User Level Description :</strong>  {selectedRole?.description}</p>
              </div> : ' ' }
            </Grid>
            <Grid item md={2} xs={4}>
              <Typography color="secondary">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e)}
                      color='primary'
                    />
                  }
                  label='Select all'
                />
              </Typography>
            </Grid>
            <Grid item md={2} xs={4}>
              <Button
                onClick={assignRole}
                variant='contained'
                color='primary'
                size='medium'
                style={{ width: '100%', color: 'white' }}
                disabled={!selectedRole } 
              >
                Assign User Level
              </Button>
            </Grid>
           
          </Grid>
          
        </div>
        {loading && <Loader />}
          <div className='tableLevelArea' >
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
              setSelectAll={setSelectAll}
              setSelectedUsers={setSelectedUsers}
              pageSize={15}
              name='assign_level'
            />
          </div>
        
      </div>
    </Layout>
  );
};

export default UserLevelTable;
