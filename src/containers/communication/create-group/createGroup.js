import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, TextField, useTheme, Button } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import './create-group.css';
import UserTable from './userTable';
import NoFilterData from 'components/noFilteredData/noFilterData';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CreateGroup =({ history, ...props }) => {
  const {
    isEdit,
   branch ,
   grades,
   groupId,
   groupname,
   sectionmappingIds,
   sectionIds,
   sessionYearId,
   sections,
   gradeId,
   branchId,
   usersData,
   

  } = history?.location?.state || {};
const {
    edit,
    preSeletedRoles=[],
    preSeletedBranch=[],
    preSeletedGrades=[],
    preSeletedSections=[],
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
  const [selectedAcademic, setSelectedAcademic] = useState('');
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
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [isedit,setisEdit] = useState(false)

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

useEffect(() => {
if(history?.location?.state){
   setSelectedBranch({id:branchId,branch_name : branch})
   setSelectedGrades({grade_id : gradeId , grade__grade_name : grades})
   setGroupName(groupname)
   setisEdit(isEdit)
   setSelectedSections(sectionIds)
//    getSectionApi(gradeId)
}
},[isEdit])

useEffect(() => {
    if(selectedBranch?.id && isEdit) getSectionApi({grade_id : gradeId , grade__grade_name : grades})
},[isEdit, selectedBranch])


const retrieveGroupData = () => {
    axiosInstance.get(`${endpoints.communication.editGroup}${groupId}/update-retrieve-delete-groups/`)
      .then((res) => {
        if (res.data.status_code === 200) {

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
}

useEffect(() => {
if(isEdit && completeData.length){
  const selecteduserData =  completeData.filter((user) => 
    usersData.findIndex((obj) => obj.id !== user?.id)
    )
}


},[completeData,isEdit])

  useEffect(() => {
    getRoleApi();
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'User Groups') {
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
      const tempBranch = [];
      const tempGrades = [];
      const tempSections = [];
      preSeletedRoles.map((items) => tempRoles.push(items?.role_name));
      preSeletedBranch.map((items) => tempBranch.push(items?.branch_name));
      preSeletedGrades.map((items) => tempGrades.push(items?.grade_name));
      preSeletedSections.map((items) => tempSections.push(items?.section__section_name));
      setSelectedRoles(tempRoles);
      setGroupName(preSelectedGroupName);
      setSelectedBranch(tempBranch);
      setSelectedGrades(tempGrades);
      setSelectedSections(tempSections);
    }
  }, []);

  const getAcademicApi = () => {
    axiosInstance.get(`/erp_user/list-academic_year/?module_id=${moduleId}`)
      .then((res) => {

        if (res.data.status_code === 200) {
          setAcademicYears(res.data.data);
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
  };

  const getBranchApi = async () => {
    axiosInstance.get(`${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`).then((res) => {
      if (res.data.status_code === 200) {
        const transformedResponse = res?.data?.data?.results.map(obj=>((obj&&obj.branch)||{}));
        setBranchList(transformedResponse);
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
  };

  const getGradeApi = async (value) => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value?.id}&module_id=${moduleId}`,
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

  const getSectionApi = async (value) => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.id}&grade_id=${value?.grade_id}&module_id=${moduleId}`,
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
          const selectedSectionsArray = result.data.data.filter((obj) =>
          selectedSections.findIndex((sec) => obj.section_id == sec) > -1
          );
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
      getUserListUrl = `${endpoints.communication.communicationUserList}?page=${pageno}&page_size=15&module_id=${moduleId}&level=${13}&exclude_parent_data=${true}`;
    }
    // if (isEdit) {
    //   getUserListUrl = `${endpoints.communication.edit}${1}/retrieve-update-group/?page=${pageno}&page_size=15&module_id=${moduleId}`;
    // }
    // if (selectedRoles.length && !selectedRoles.includes('All')) {
    //   roleList
    //     .filter((item) => selectedRoles.includes(item['role_name']))
    //     .forEach((items) => {
    //       rolesId.push(items.id);
    //     });
    // }
    // if (selectedBranch.length && !selectedBranch.includes('All')) {
    //   selectedBranch.map((branchs) => branchsId.push(branchs?.id));
    // }
    // if (selectedGrades.length && !selectedGrades.includes('All')) {
    //   gradeList
    //     .filter((item) => selectedGrades.includes(item['grade__grade_name']))
    //     .forEach((items) => {
    //       gradesId.push(items.grade_id);
    //     });
    // }

    // if (selectedGrades.length && !selectedGrades.includes('All')) {
    //   gradeList
    //     .filter((item) => selectedGrades.includes(item['grade__grade_name']))
    //     .forEach((items) => {
    //       gradesId.push(items.grade_id);
    //     });
    // }
    if (selectedSections.length && !selectedSections.includes('All')) {
      selectedSections.forEach((items) => {
          sectionsId.push(items.section_id);
        });
    }
    // if (rolesId.length && !selectedRoles.includes('All')) {
    //   getUserListUrl += `&role=${rolesId.toString()}`;
    // }
    if (selectedBranch) {
      getUserListUrl += `&session_year=${selectedAcademicYear?.id}&branch=${selectedBranch?.id}`;
    }
    if (selectedGrades) {
      getUserListUrl += `&grade=${selectedGrades?.grade_id}`;
    }
    if (sectionsId.length > 0) {
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
          // { field: 'contact', headerName: 'Contact', width: 150 },
        ]);
        result.data.data.results.forEach((items) => {
          rows.push({
            id: items.id,
            fullName: `${items.user.first_name} ${items.user.last_name}`,
            email: items.user.email,
            erp_id: items.erp_id,
            gender: items.gender,
            // contact: items.contact,
          });
          selectionRows.push({
            id: items.id,
            data: {
              id: items.id,
              fullName: `${items.user.first_name} ${items.user.last_name}`,
              email: items.user.email,
              erp_id: items.erp_id,
              gender: items.gender,
              // contact: items.contact,
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
    // if (selectedRoles.length && !selectedRoles.includes('All')) {
    //   roleList
    //     .filter((item) => selectedRoles.includes(item['role_name']))
    //     .forEach((items) => {
    //       rolesId.push(items.id);
    //     });
    // }
    // if (selectedBranch) {
    //   const blist=[...selectedBranch];
    //   for(let p=0;p<blist.length;p++) {
    //     branchId.push(blist[p].id);
    //   }
    // }
    // if (selectedGrades.length && !selectedGrades.includes('All')) {
    //   gradeList
    //     .filter((item) => selectedGrades.includes(item['grade__grade_name']))
    //     .forEach((items) => {
    //       gradesId.push(items.grade_id);
    //     });
    // }
    if (selectedSections.length && !selectedSections.includes('All')) {
        selectedSections.forEach((items) => {
          sectionsId.push(items.id);
        });
    }

    const createGroupApi = endpoints.communication.addGroup;
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
        //   role: roleArray,
        //   branch: selectedBranch?.id,
        //   grade: selectedGrades?.id,
          section_mapping: sectionArray,
          erpusers: selectionArray,
          group_type : 1
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
        window.history.back()
        // setNext(false);
        // setSelectedUsers([]);
        // setSelectedRoles([]);
        // setSelectedSections([]);
        // setSelectedBranch([]);
        // setSelectedGrades([]);
        // setGroupName('');
        // setSelectectUserError('');
        // setSelectAll(false);
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

  const handleBranch = (event, value) => {
    setSelectedBranch([]);
    setSelectedGrades([]);
    setSelectedSections([])
   if (value) {
      // const ids = value.map((el) => el);
      setSelectedBranch(value);
      getGradeApi(value)
    } else {
      setSelectedBranch([]);
    }
  };

const handlegrade = (e,value) => {
    setSelectedGrades([]);
    setSelectedSections([])
  if(value){
    // const items = value.map((el) => el);
    setSelectedGrades(value)
    getSectionApi(value)
    
  }else{
    setSelectedGrades([])
  }
}

const handleSection = (e , value) => {
    setSelectedSections([])
if(value.length > 0){
      const items = value.map((el) => el);
      setSelectedSections(items)
}else{
  setSelectedSections([])
}
}

  const handleEditCancel = () => {
    setSelectedUsers([]);
    setSelectedRoles([]);
    setSelectedSections([]);
    setSelectedBranch([]);
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
    // if (!selectedRoles.length) {
    //   setGroupNameError('');
    //   setRoleError('Please select a role');
    //   return;
    // }
    if (!selectedBranch) {
      setRoleError('');
      setBranchError('Please select a branch');
      return;
    }
    if (!selectedGrades) {
      setRoleError('');
      setBranchError('Please select a Grade');
      return;
    }
    if (!selectedSections) {
      setRoleError('');
      setBranchError('Please select a Section');
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
    if (moduleId)
      getAcademicApi();
  }, [moduleId]);

  useEffect(() => {
    if (moduleId && !isedit) {
      // setSelectedBranch([]);
      // setGrade([]);
      // setSelectedGrades([]);
      getBranchApi();
    }
  }, [moduleId]);

  // useEffect(() => {
  //   if (selectedBranch) {
  //     setGrade([]);
  //     setSelectedGrades([]);
  //     getGradeApi();
  //   }
  // }, [selectedBranch]);

//   useEffect(() => {
//     if (selectedGrades.length && gradeList.length) {
//       // setSelectedSections([]);
//       getSectionApi();
//     } else {
//       if (!edit) {
//         setSelectedSections([]);
//       }
//     }
//   }, [gradeList, selectedGrades]);

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
              componentName='User Management'
              childComponentName={isEdit ? 'Edit Group' : 'Create Group'}
            />
          </div>
          {next ? (
            <div className='create_group_user_list_wrapper'>
              {/* {usersRow.length ? (
                <div className='create_group_select_all_wrapper'>
                  <input
                    type='checkbox'
                    className='create_group_select_all_checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </div>
              ) : null} */}
              <span className='create_group_error_span'>{selectectUserError}</span>
              {/* <CustomSelectionTable
                header={headers}
                rows={usersRow}
                completeData={completeData}
                totalRows={totalPage}
                pageno={pageno}
                setSelectAll={setSelectAll}
                selectedUsers={selectedUsers}
                changePage={setPageno}
                setSelectedUsers={setSelectedUsers}
              /> */}
              <UserTable
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
                  <Grid xs={12} lg={3} className='create_group_items' item>
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
                  <Grid xs={12} lg={3} className='create_group_items' item>
                    <div>
                      <div className='create_group_branch_wrapper'>
                        <Autocomplete
                          size='small'
                          // multiple
                          onChange={handleBranch}
                          value={selectedBranch}
                          id='message_log-branch'
                          className='create_group_branch'
                          options={branchList}
                          getOptionLabel={(option) => option?.branch_name}
                          filterSelectedOptions
                          disabled = {isedit}
                          renderInput={(params) => (
                            <TextField
                              className='message_log-textfield'
                              {...params}
                              variant='outlined'
                              label='Branch'
                              placeholder='Branch'
                              required
                            />
                          )}
                        />
                      </div>
                      <span className='create_group_error_span'>{branchError}</span>
                    </div>
                  </Grid>
                  <Grid xs={12} lg={3} className='create_group_items' item>
                    <div>
                      <div className='create_group_branch_wrapper'>
                        <Autocomplete
                          size='small'
                          // multiple
                          onChange={handlegrade}
                          value={selectedGrades}
                          id='message_log-branch'
                          className='create_group_branch'
                          options={gradeList}
                          getOptionLabel={(option) => option?.grade__grade_name}
                          filterSelectedOptions
                          disabled = {isedit}
                          renderInput={(params) => (
                            <TextField
                              className='message_log-textfield'
                              {...params}
                              variant='outlined'
                              label='Grade'
                              placeholder='Grade'
                              required
                            />
                          )}
                        />
                      </div>
                      <span className='create_group_error_span'>{branchError}</span>
                    </div>
                  </Grid>
                  <Grid xs={12} lg={3} className='create_group_items' item>
                    <div>
                      <div className='create_group_branch_wrapper'>
                        <Autocomplete
                          size='small'
                          multiple
                          onChange={handleSection}
                          value={selectedSections}
                          id='message_log-branch'
                          className='create_group_branch'
                          options={sectionList || []}
                          getOptionLabel={(option) => option?.section__section_name}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              className='message_log-textfield'
                              {...params}
                              variant='outlined'
                              label='Section'
                              placeholder='Section'
                              required
                            />
                          )}
                        />
                      </div>
                      <span className='create_group_error_span'>{branchError}</span>
                    </div>
                  </Grid>
                  {/* <Grid xs={12} lg={4} className='create_group_items' item>
                    <div className='create_group_role'>
                      <CustomMultiSelect
                        selections={selectedRoles}
                        setSelections={setSelectedRoles}
                        nameOfDropdown='User Role'
                        optionNames={roles}
                      />
                      <span className='create_group_error_span'>{roleError}</span>
                    </div>
                  </Grid> */}
                  {/* <Grid xs={0} lg={4} className='create_group_items_mobile_none' item /> */}
                  {/* <Grid xs={12} lg={12} className='under_line_create_group' /> */}
                </Grid>
              </div>

              {/* {selectedRoles.length && !selectedRoles.includes('All') ? (
                <div className='create_group_filter_container'> */}
              <Grid container className='create_group_container' spacing={5}>
                {/* <Grid xs={12} lg={4} className='create_group_items' item>
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
                    </Grid> */}

                {/* <Grid xs={12} lg={4} className='create_group_items' item>
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
                    </Grid> */}
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
              {/* </div> */}
              {/* ) : null} */}
            </>
          )}

          <div className='create_group_filter_container'>
            <Grid container className='create_group_custom_button_wrapper' spacing={5}>
              {!next && edit ? (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    style={{ color: 'white', width: '100%' }}
                    className='cancelButton labelColor'
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
                    className='cancelButton labelColor'
                    size='medium'
                    style={{ width: '100%' }}
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
                      style={{ color: 'white', width: '100%' }}
                      color='primary'
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
                      style={{ color: 'white', width: '100%' }}
                      onClick={createGroup}
                      color='primary'
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
                    style={{ color: 'white', width: '100%' }}
                    onClick={handlenext}
                    color='primary'
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
};

export default  withRouter(CreateGroup);
