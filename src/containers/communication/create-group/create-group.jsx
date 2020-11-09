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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
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
  const [loading, setLoaging] = useState(false);
  const [modulePermision, setModulePermision] = useState(true);

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
        setRoles(resultOptions);
        setRoleList(result.data.result);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.branches, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.branch_name));
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
        `${endpoints.communication.grades}?branch_id=${selectedBranch}&module_id=${moduleId}`,
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
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getSectionApi = async () => {
    try {
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axiosInstance.get(
        `${
          endpoints.communication.sections
        }?branch_id=${selectedBranch}&grade_id=${gradesId.toString()}&module_id=${moduleId}`,
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
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const displayUsersList = async () => {
    const rolesId = [];
    const gradesId = [];
    const sectionsId = [];
    setNext(true);
    let getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=15`;
    if (selectedRoles.length && !selectedRoles.includes('All')) {
      roleList
        .filter((item) => selectedRoles.includes(item['role_name']))
        .forEach((items) => {
          rolesId.push(items.id);
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
      getUserListUrl += `&branch=${selectedBranch}`;
    }
    if (gradesId.length && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradesId.toString()}`;
    }
    if (sectionsId.length && !selectedSections.includes('All')) {
      getUserListUrl += `&section=${sectionsId.toString()}`;
    }

    try {
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setHeaders([
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'fullName', headerName: 'Name', width: 250 },
          { field: 'email', headerName: 'Email Id', width: 200 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 100 },
          { field: 'contact', headerName: 'Contact', width: 150 },
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
              : selectedUsers.length
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
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
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
      branchId.push(selectedBranch);
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
    const branchArray = [];
    const gradeArray = [];
    const sectionArray = [];
    const selectionArray = [];
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
      const response = await axiosInstance.post(
        createGroupApi,
        {
          group_name: groupName,
          role: rolesId[0],
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
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const addGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('[class*="PrivateSwitchBase-input-"]');
    if (!selectAll) {
      testclick[0].click();
    } else {
      for (let i = 1; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const handleback = () => {
    setSelectedUsers([]);
    setNext(false);
    setSelectAll(false);
    setSelectectUserError('');
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
    getRoleApi();
    getBranchApi();
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
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      setGrade([]);
      setSelectedGrades([]);
      setSelectedSections([]);
      getGradeApi();
    }
  }, [selectedBranch]);
  useEffect(() => {
    if (selectedGrades.length) {
      setSelectedSections([]);
      getSectionApi();
    }
  }, [selectedGrades]);
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
          <CommonBreadcrumbs
            componentName='Communication'
            childComponentName='Create Group'
          />
          {next ? (
            <>
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
            </>
          ) : (
            <>
              <div className='creategroup_firstrow'>
                <div className='group_name_wrapper'>
                  <CustomInput
                    className='group_name'
                    onChange={addGroupName}
                    value={groupName}
                    name='Group name'
                  />
                  <span className='create_group_error_span'>{groupNameError}</span>
                </div>
                <div>
                  <CustomMultiSelect
                    selections={selectedRoles}
                    setSelections={setSelectedRoles}
                    nameOfDropdown='User Role'
                    optionNames={roles}
                  />
                  <span className='create_group_error_span'>{roleError}</span>
                </div>
              </div>
              {selectedRoles.length && !selectedRoles.includes('All') ? (
                <div className='creategroup_firstrow'>
                  <div>
                    <div className='create_group_branch_wrapper'>
                      <FormControl variant='outlined' className={classes.formControl}>
                        <InputLabel id='demo-simple-select-outlined-label'>
                          Branch
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-outlined-label'
                          id='demo-simple-select-outlined'
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          label='Branch'
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {branchList.map((items, index) => (
                            <MenuItem
                              key={`branch_create_group_${index}`}
                              value={items.id}
                            >
                              {items.branch_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <span className='create_group_error_span'>{branchError}</span>
                  </div>
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
                  {selectedGrades.length && sectionList.length ? (
                    <CustomMultiSelect
                      selections={selectedSections}
                      setSelections={setSelectedSections}
                      nameOfDropdown='Section'
                      optionNames={section}
                    />
                  ) : null}
                </div>
              ) : null}
            </>
          )}
          <div className='button_wrapper'>
            {next ? (
              <input
                className='custom_button addgroup_back_button'
                type='button'
                onClick={handleback}
                value='back'
              />
            ) : null}
            {next ? (
              <input
                className='custom_button addgroup_next_button'
                type='button'
                onClick={createGroup}
                value='create group'
              />
            ) : (
              <input
                className='custom_button addgroup_next_button'
                type='button'
                onClick={handlenext}
                value='next'
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
});

export default CreateGroup;
