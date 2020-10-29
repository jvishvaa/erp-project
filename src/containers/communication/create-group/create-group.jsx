/* eslint-disable dot-notation */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomInput from '../custom-inputfield/custom-input';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './create-group.css';

// eslint-disable-next-line no-unused-vars
const CreateGroup = withRouter(({ history, ...props }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedRoles, setSelectedRoles] = useState([]);
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
  const [roles, setRoles] = useState(['All']);
  const [branch, setBranch] = useState(['All']);
  const [grade, setGrade] = useState(['All']);
  const [section, setSection] = useState(['All']);
  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [groupNameError, setGroupNameError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [branchError, setBranchError] = useState('');

  const getRoleApi = async () => {
    try {
      const result = await axios.get('http://13.234.252.195:443/erp_user/roles/');
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.role_name));
        setRoles([...roles, ...resultOptions]);
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
      const result = await axios.get('http://13.234.252.195:443/erp_user/branch/');
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.branch_name));
        setBranch([...branch, ...resultOptions]);
        setBranchList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getGradeApi = async () => {
    const branchesId = [];
    branchList
      .filter((item) => item['branch_name'] === selectedBranch[0])
      .forEach((items) => {
        branchesId.push(items.id);
      });
    try {
      const result = await axios.get(
        `http://13.234.252.195:443/erp_user/grademapping/?branch_id=${branchesId.toString()}`
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
        if (selectedBranch.length > 1) {
          setGrade([...grade, ...resultOptions]);
        } else {
          setGrade(['All', ...resultOptions]);
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
      const branchesId = [];
      branchList
        .filter((item) => item['branch_name'] === selectedBranch[0])
        .forEach((items) => {
          branchesId.push(items.id);
        });
      const gradesId = [];
      gradeList
        .filter((item) => item['grade__grade_name'] === selectedGrades[0])
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axios.get(
        `http://13.234.252.195:443/erp_user/sectionmapping/?branch_id=${branchesId.toString()}&grade_id=${gradesId.toString()}`
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.section__section_name));
        if (selectedGrades.length > 1) {
          setSection([...section, ...resultOptions]);
        } else {
          setSection(['All', ...resultOptions]);
        }
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
    let getUserListUrl = `http://13.234.252.195:443/communication/erp-user-info/?page=${pageno}`;
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
          sectionsId.push(items.id);
        });
    }
    if (rolesId.length && !selectedRoles.includes('All')) {
      getUserListUrl += `&role=${rolesId.toString()}`;
    }
    if (gradesId.length && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradesId.toString()}`;
    }
    if (sectionsId.length && !selectedSections.includes('All')) {
      getUserListUrl += `&section=${sectionsId.toString()}`;
    }

    try {
      const result = await axios.get(getUserListUrl);
      if (result.status === 200) {
        setHeaders([
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'firstName', headerName: 'First name', width: 150 },
          { field: 'lastName', headerName: 'Last name', width: 150 },
          { field: 'email', headerName: 'Email Id', width: 200 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 100 },
          { field: 'contact', headerName: 'Contact', width: 150 },
          {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 250,
            valueGetter: (params) =>
              `${params.getValue('firstName') || ''} ${
                params.getValue('lastName') || ''
              }`,
          },
        ]);
        const rows = [];
        const selectionRows = [];
        result.data.results.forEach((items) => {
          rows.push({
            id: items.id,
            lastName: items.user.last_name,
            firstName: items.user.first_name,
            email: items.user.email,
            erp_id: items.erp_id,
            gender: items.gender,
            contact: items.contact,
          });
          selectionRows.push({
            id: items.id,
            data: {
              id: items.id,
              lastName: items.user.last_name,
              firstName: items.user.first_name,
              email: items.user.email,
              erp_id: items.erp_id,
              gender: items.gender,
              contact: items.contact,
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
    if (selectedBranch.length && !selectedBranch.includes('All')) {
      branchList
        .filter((item) => selectedBranch.includes(item['branch_name']))
        .forEach((items) => {
          branchId.push(items.id);
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
          sectionsId.push(items.id);
        });
    }
    const createGroupApi = 'http://13.234.252.195:443/communication/communication-group/';
    // const formData = new FormData();
    const branchArray = [];
    const gradeArray = [];
    const sectionArray = [];
    const selectionArray = [];
    // formData.set('group_name', groupName);
    // formData.set('role', rolesId[0]);
    gradesId.forEach((item) => {
      gradeArray.push(item);
    });
    branchId.forEach((item) => {
      branchArray.push(item);
    });
    sectionsId.forEach((item) => {
      sectionArray.push(item);
    });
    selectedUsers.forEach((item) => {
      item.selected.forEach((ids) => {
        selectionArray.push(ids);
      });
    });
    try {
      const response = await axios.post(
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

  const handleback = () => {
    setSelectedUsers([]);
    setNext(false);
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
    if (!selectedBranch.length) {
      setRoleError('');
      setBranchError('Please select a branch');
      return;
    }
    if (!selectedGrades.length) {
      setBranchError('');
      setGradeError('Please select a grade');
      return;
    }
    setGroupNameError('');
    setRoleError('');
    setBranchError('');
    setGradeError('');
    setNext(true);
  };

  useEffect(() => {
    getRoleApi();
    getBranchApi();
  }, []);

  useEffect(() => {
    if (selectedBranch.length && !selectedBranch.includes('All')) {
      setGrade(['All']);
      getGradeApi();
    }
  }, [selectedBranch]);
  useEffect(() => {
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      getSectionApi();
    }
  }, [selectedGrades]);
  useEffect(() => {
    if (next && groupName && selectedRoles) {
      displayUsersList();
    }
  }, [next, pageno]);
  return (
    <div className='creategroup__page'>
      <div className='creategroup_heading'>Communication &gt; Create Group</div>
      {next ? (
        <CustomSelectionTable
          header={headers}
          rows={usersRow}
          completeData={completeData}
          totalRows={totalPage}
          pageno={pageno}
          selectedUsers={selectedUsers}
          changePage={setPageno}
          setSelectedUsers={setSelectedUsers}
        />
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
                <CustomMultiSelect
                  selections={selectedBranch}
                  setSelections={setSelectedBranch}
                  nameOfDropdown='Branch'
                  optionNames={branch}
                />
                <span className='create_group_error_span'>{branchError}</span>
              </div>
              {selectedBranch.length && !selectedBranch.includes('All') ? (
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
              {selectedGrades.length && !selectedGrades.includes('All') ? (
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
        <input
          className='custom_button addgroup_back_button'
          type='button'
          onClick={handleback}
          value='back'
        />
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
  );
});

export default CreateGroup;
