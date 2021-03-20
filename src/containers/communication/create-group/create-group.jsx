/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable dot-notation */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, TextField, useTheme, Button } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomInput from '../custom-inputfield/custom-input';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import './create-group.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// eslint-disable-next-line no-unused-vars
const CreateGroup = withRouter(({ history, ...props }) => {
  const {
    edit,
    preSeletedRoles,
    preSeletedBranch,
    preSeletedGrades,
    preSeletedSections,
    preSelectedGroupName,
    preSelectedGroupId,
    editClose,
  } = props || {};
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [next, setNext] = useState(false);
  const [pageno, setPageno] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [grade, setGrade] = useState([]);
  const [section, setSection] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [groupNameError, setGroupNameError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [branchError, setBranchError] = useState('');
  const [selectectUserError, setSelectectUserError] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [moduleId, setModuleId] = useState();
  const [loading, setLoading] = useState(false);
  const [modulePermision, setModulePermision] = useState(true);

  const getRoleApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.role_name));
        setRoles(resultOptions);
        setRoleList(result.data.result);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const getAcademicApi = async () => {
    axiosInstance.get(`/erp_user/list-academic_year/?module_id=${moduleId}`)
    .then((res) => {
      console.log(res.data);

      if (res.data.status_code === 200) {
        setAcademicYears(res.data.data);
        setLoading(false);
      } else {
        setAlert('error', res.data.message);
        setLoading(false);
      }
    })
    .catch((error) => { 
      console.log(error);
      setAlert('error', error.message);
      setLoading(false);
    })
  };

  const getBranchApi = async () => {
    axiosInstance.get(`${endpoints.masterManagement.branchList}?session_year=${selectedAcademic?.id}&module_id=${moduleId}`).then((res) => {
      console.log(res.data);
      if (res.data.status_code === 200) {
        setBranchList(res.data.data);
        setLoading(false);
      } else {
        setAlert('error', res.data.message);
        setLoading(false);
      }
    })
    .catch((error) => {
      setAlert('error', error.message);
      setLoading(false);
    })
    // try {
    //   setLoading(true);
    //   const result = await axiosInstance.get(endpoints.communication.branches, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   const resultOptions = [];
    //   if (result.status === 200) {
    //     result.data.data.map((items) => resultOptions.push(items.branch_name));
    //     console.log(result.data.data, 'mlbranch');
    //     setBranchList(result.data.data);
    //     setLoading(false);
    //   } else {
    //     setAlert('error', result.data.message);
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   setAlert('error', error.message);
    //   setLoading(false);
    // }
  };

  const getGradeApi = async () => {
    try {
      setLoading(true);
      const branchsId = [];
      selectedBranch.length > 0 && selectedBranch.map((branchs) => branchsId.push(branchs?.id));
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?branch_id=${branchsId.toString()}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
        if (selectedBranch) {
          setGrade(resultOptions);
        }
        setGradeList(result.data.data);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const getSectionApi = async () => {
    try {
      setLoading(true);
      const branchsId = [];
      selectedBranch.length > 0 && selectedBranch.map((branchs) => branchsId.push(branchs?.id));
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?branch_id=${branchsId.toString()}&grade_id=${gradesId.toString()}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.section__section_name));
        setSection(resultOptions);
        setSectionList(result.data.data);
        if (selectedSections && selectedSections.length > 0) {
          // for retaining neccessary selected sections when grade is changed
          const selectedSectionsArray = selectedSections.filter(
            (sec) =>
              result.data.data.findIndex((obj) => obj.section__section_name == sec) > -1
          );
          console.log('selected sections array ', selectedSectionsArray);
          setSelectedSections(selectedSectionsArray);
        }
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const displayUsersList = async () => {
    const rolesId = [];
    const branchsId = [];
    const gradesId = [];
    const sectionsId = [];
    setNext(true);
    let getUserListUrl;
    if (!edit) {
      getUserListUrl = `${endpoints.communication.communicationUserList}?page=${pageno}&page_size=15&module_id=${moduleId}`;
    }
    if (edit) {
      getUserListUrl = `${endpoints.communication.editGroup}${preSelectedGroupId}/retrieve-update-group/?page=${pageno}&page_size=15&module_id=${moduleId}`;
    }
    if (selectedBranch.length && !selectedRoles.includes('All')) {
      selectedBranch.map((branchs) => branchsId.push(branchs?.id));
    }
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }

    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }
    if (selectedSections.length && !selectedSections.includes('All')) {
      sectionList
        .filter((item) => selectedSections.includes(item['section__section_name']))
        .forEach((items) => {
          sectionsId.push(items.section_id);
        });
    }
    if (rolesId.length && !selectedRoles.includes('All')) {
      getUserListUrl += `&role=${rolesId.toString()}`;
    }
    if (selectedBranch) {
      getUserListUrl += `&branch=${branchsId.toString()}`;
    }
    if (gradesId.length && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradesId.toString()}`;
    }
    if (sectionsId.length && !selectedSections.includes('All')) {
      getUserListUrl += `&section=${sectionsId.toString()}`;
    }

    try {
      setLoading(true);
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        const rows = [];
        const selectionRows = [];
        setHeaders([
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'fullName', headerName: 'Name', width: 190 },
          { field: 'email', headerName: 'Email Id', width: 250 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 150 },
          { field: 'contact', headerName: 'Contact', width: 150 },
        ]);
        result.data.data.results.forEach((items) => {
          rows.push({
            id: items.id,
            fullName: `${items.user.first_name} ${items.user.last_name}`,
            email: items.user.email,
            erp_id: items.erp_id,
            gender: items.gender,
            contact: items.contact,
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
            },
            selected: selectAll
              ? true
              : selectedUsers.length && !selectedUsers[pageno - 1].first
              ? selectedUsers[pageno - 1].selected.includes(items.id)
              : edit
              ? items.is_assigned
              : false,
          });
        });
        setUsersRow(rows);
        setCompleteData(selectionRows);
        setTotalPage(result.data.data.count);
        setLoading(false);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.data.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, first: true, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
        }
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const editGroup = async () => {
    console.log(selectedUsers);
    const editGroupApiUrl = `${endpoints.communication.editGroup}${preSelectedGroupId}/retrieve-update-group/`;
    const rolesId = [];
    const branchId = [];
    const gradesId = [];
    const sectionsId = [];
    if (selectedRoles.length && !selectedRoles.includes('All')) {
      roleList
        .filter((item) => selectedRoles.includes(item['role_name']))
        .forEach((items) => {
          rolesId.push(items.id);
        });
    }
    if (selectedBranch) {
      branchId.push(selectedBranch.id);
    }
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }
    if (selectedSections.length && !selectedSections.includes('All')) {
      sectionList
        .filter((item) => selectedSections.includes(item['section__section_name']))
        .forEach((items) => {
          sectionsId.push(items.id);
        });
    }
    const roleArray = [];
    const branchArray = [];
    const gradeArray = [];
    const sectionArray = [];
    const selectionArray = [];
    rolesId.forEach((item) => {
      roleArray.push(item);
    });
    gradesId.forEach((item) => {
      gradeArray.push(item);
    });
    branchId.forEach((item) => {
      branchArray.push(item);
    });
    sectionsId.forEach((item) => {
      sectionArray.push(item);
    });
    if (selectAll) {
      selectionArray.push(0);
    } else {
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
    setSelectectUserError('');
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        editGroupApiUrl,
        {
          group_name: groupName,
          role: roleArray,
          branch: branchArray,
          grade: gradeArray,
          mapping_bgs: sectionArray,
          erp_users: selectionArray,
        },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        setAlert('success', message);
        editClose(false);
        setSelectAll(false);
        setLoading(false);
      } else {
        setAlert('error', response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const createGroup = async () => {
    const rolesId = [];
    const branchId = [];
    const gradesId = [];
    const sectionsId = [];
    if (selectedRoles.length && !selectedRoles.includes('All')) {
      roleList
        .filter((item) => selectedRoles.includes(item['role_name']))
        .forEach((items) => {
          rolesId.push(items.id);
        });
    }
    if (selectedBranch) {
      branchId.push(selectedBranch.id);
    }
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }
    if (selectedSections.length && !selectedSections.includes('All')) {
      sectionList
        .filter((item) => selectedSections.includes(item['section__section_name']))
        .forEach((items) => {
          sectionsId.push(items.id);
        });
    }
    const createGroupApi = endpoints.communication.createGroup;
    const roleArray = [];
    const branchArray = [];
    const gradeArray = [];
    const sectionArray = [];
    const selectionArray = [];
    rolesId.forEach((item) => {
      roleArray.push(item);
    });
    gradesId.forEach((item) => {
      gradeArray.push(item);
    });
    branchId.forEach((item) => {
      branchArray.push(item);
    });
    sectionsId.forEach((item) => {
      sectionArray.push(item);
    });
    if (selectAll) {
      selectionArray.push(0);
    } else {
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
    setSelectectUserError('');
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        createGroupApi,
        {
          group_name: groupName,
          role: roleArray,
          branch: branchArray,
          grade: gradeArray,
          mapping_bgs: sectionArray,
          erp_users: selectionArray,
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
      const { message } = response.data;
      if (message === 'Group created successfully') {
        setLoading(false);
        setAlert('success', message);
        setNext(false);
        setSelectedUsers([]);
        setSelectedRoles([]);
        setSelectedSections([]);
        setSelectedGrades([]);
        setGroupName('');
        setSelectectUserError('');
        setSelectAll(false);
      } else {
        setAlert('error', response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const addGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('input[type=checkbox]');
    if (!selectAll) {
      testclick[1].click();
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const handleAcademicYears = (event, value) => {
    if (value) {
      setSelectedAcademic(value);
    } else {
      setSelectedAcademic('');
    }
  };

  const handleBranch = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedBranch(ids);
    } else {
      setSelectedBranch([]);
    }
  };

  const handleEditCancel = () => {
    setSelectedUsers([]);
    setSelectedRoles([]);
    setSelectedSections([]);
    setSelectedGrades([]);
    setGroupName('');
    setSelectectUserError('');
    setSelectAll(false);
    editClose(false);
  };

  const handleback = () => {
    if (selectAll) {
      handleSelectAll();
    }
    setSelectedUsers([]);
    setNext(false);
    setSelectAll(false);
    setSelectectUserError('');
    setUsersRow([]);
    setCompleteData([]);
    setTotalPage([]);
  };
  const handlenext = () => {
    if (!groupName) {
      setGroupNameError('Please select a group name');
      return;
    }
    if (!selectedRoles.length) {
      setGroupNameError('');
      setRoleError('Please select a role');
      return;
    }
    if (!selectedBranch) {
      setRoleError('');
      setBranchError('Please select a branch');
      return;
    }
    window.scrollTo(0, 0);
    setGroupNameError('');
    setRoleError('');
    setBranchError('');
    setGradeError('');
    setNext(true);
  };

  useEffect(() => {
    if (
      selectedUsers.length &&
      !selectedUsers[pageno - 1].length &&
      selectedUsers[pageno - 1].first &&
      completeData.length
    ) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      const newEnter = [{ pageNo: pageno, first: false, selected: [] }];
      completeData.forEach((items) => {
        if (items.selected) {
          newEnter[0].selected.push(items.id);
        }
      });
      tempSelection.splice(pageno - 1, 1, newEnter[0]);
      setSelectedUsers(tempSelection);
    }
  }, [completeData, selectedUsers]);

  useEffect(() => {
    getRoleApi();
    getAcademicApi();
    //getBranchApi();
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Communication' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Add Group') {
              setModuleId(item.child_id);
              setModulePermision(true);
            } else {
              setModulePermision(false);
            }
          });
        } else {
          setModulePermision(false);
        }
      });
    } else {
      setModulePermision(false);
    }
    if (edit) {
      setSelectedBranch({ id: 5, branch_name: 'Orchids' });
      const tempRoles = [];
      const tempGrades = [];
      const tempSections = [];
      preSeletedRoles.map((items) => tempRoles.push(items.role_name));
      preSeletedGrades.map((items) => tempGrades.push(items.grade_name));
      preSeletedSections.map((items) => tempSections.push(items.section__section_name));
      setSelectedRoles(tempRoles);
      setGroupName(preSelectedGroupName);
      setSelectedGrades(tempGrades);
      setSelectedSections(tempSections);
    }
  }, []);

  useEffect(() => {
    if(selectedAcademic){
      setSelectedBranch([]);
      setGrade([]);
      setSelectedGrades([]);
      getBranchApi();
    }
  }, [selectedAcademic]);

  useEffect(() => {
    if (selectedBranch.length > 0) {
      setGrade([]);
      setSelectedGrades([]);
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedGrades.length && gradeList.length) {
      // setSelectedSections([]);
      getSectionApi();
    } else {
      if (!edit) {
        setSelectedSections([]);
      }
    }
  }, [gradeList, selectedGrades]);

  useEffect(() => {
    if (next && groupName && selectedRoles) {
      displayUsersList();
    }
  }, [next, pageno]);
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='creategroup__page'>
          <div className='create_group_breadcrumb_wrapper'>
            <CommonBreadcrumbs
              componentName='Communication'
              childComponentName={edit ? 'Edit Group' : 'Create Group'}
            />
          </div>
          {next ? (
            <div className='create_group_user_list_wrapper'>
              {usersRow.length ? (
                <div className='create_group_select_all_wrapper'>
                  <input
                    type='checkbox'
                    className='create_group_select_all_checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </div>
              ) : null}
              <span className='create_group_error_span'>{selectectUserError}</span>
              <CustomSelectionTable
                header={headers}
                rows={usersRow}
                completeData={completeData}
                totalRows={totalPage}
                pageno={pageno}
                setSelectAll={setSelectAll}
                selectedUsers={selectedUsers}
                changePage={setPageno}
                setSelectedUsers={setSelectedUsers}
              />
            </div>
          ) : (
            <>
              <div className='create_group_filter_container'>
                <Grid container className='create_group_container' spacing={5}>
                  <Grid xs={12} lg={4} className='create_group_items' item>
                    <div className='group_name_wrapper'>
                      <TextField
                        className='create_group-textfield'
                        id='class-Group name'
                        label='Group name'
                        variant='outlined'
                        size='small'
                        name='Group name'
                        value={groupName}
                        onChange={addGroupName}
                        required
                      />
                      <span className='create_group_error_span'>{groupNameError}</span>
                    </div>
                  </Grid>
                  <Grid xs={12} lg={4} className='create_group_items' item>
                    <div className='create_group_role'>
                      <CustomMultiSelect
                        selections={selectedRoles}
                        setSelections={setSelectedRoles}
                        nameOfDropdown='User Role'
                        optionNames={roles}
                      />
                      <span className='create_group_error_span'>{roleError}</span>
                    </div>
                  </Grid>
                  <Grid xs={0} lg={4} className='create_group_items_mobile_none' item />
                  <Grid xs={12} lg={12} className='under_line_create_group' />
                </Grid>
              </div>

              {selectedRoles.length && !selectedRoles.includes('All') ? (
                <div className='create_group_filter_container'>
                  <Grid container className='create_group_container' spacing={5}>
                  <Grid xs={12} lg={4} className='create_group_items' item>
                      <div>
                        <div className='create_group_branch_wrapper'>
                          <Autocomplete
                            size='small'
                            onChange={handleAcademicYears}
                            value={selectedAcademic}
                            id='academic_year'
                            className='create_group_branch'
                            options={academicYears}
                            getOptionLabel={(option) => option?.session_year}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField
                                className='message_log-textfield'
                                {...params}
                                variant='outlined'
                                label='Academic Years'
                                placeholder='Academic Years'
                              />
                            )}
                          />
                        </div>
                      </div>
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      <div>
                        <div className='create_group_branch_wrapper'>
                          <Autocomplete
                            size='small'
                            multiple
                            onChange={handleBranch}
                            value={selectedBranch}
                            id='message_log-branch'
                            className='create_group_branch'
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
                        </div>
                        <span className='create_group_error_span'>{branchError}</span>
                      </div>
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedBranch && gradeList.length ? (
                        <div>
                          <CustomMultiSelect
                            selections={selectedGrades}
                            setSelections={setSelectedGrades}
                            nameOfDropdown='Grade'
                            optionNames={grade}
                          />
                          <span className='create_group_error_span'>{gradeError}</span>
                        </div>
                      ) : null}
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedGrades.length && sectionList.length ? (
                        <CustomMultiSelect
                          selections={selectedSections}
                          setSelections={setSelectedSections}
                          nameOfDropdown='Section'
                          optionNames={section}
                        />
                      ) : null}
                    </Grid>
                    <Grid xs={12} lg={12} className='under_line_create_group' />
                  </Grid>
                </div>
              ) : null}
            </>
          )}

          <div className='create_group_filter_container'>
            <Grid container className='create_group_custom_button_wrapper' spacing={5}>
              {!next && edit ? (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    className='custom_button_master labelColor'
                    size='medium'
                    onClick={handleEditCancel}
                  >
                    CANCEL
                  </Button>
                </Grid>
              ) : null}
              {next ? (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    className='custom_button_master labelColor'
                    size='medium'
                    onClick={handleback}
                  >
                    BACK
                  </Button>
                </Grid>
              ) : null}
              {next ? (
                edit ? (
                  <Grid xs={12} lg={3} className='create_group_custom_button' item>
                    <Button
                      variant='contained'
                      style={{ color: 'white' }}
                      className='custom_button_master'
                      size='medium'
                      onClick={editGroup}
                    >
                      EDIT GROUP
                    </Button>
                  </Grid>
                ) : (
                  <Grid xs={12} lg={3} className='create_group_custom_button' item>
                    <Button
                      variant='contained'
                      style={{ color: 'white' }}
                      onClick={createGroup}
                      color='primary'
                      className='custom_button_master'
                      size='medium'
                    >
                      CREATE GROUP
                    </Button>
                  </Grid>
                )
              ) : (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    onClick={handlenext}
                    color='primary'
                    className='custom_button_master'
                    size='medium'
                  >
                    NEXT
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default CreateGroup;
