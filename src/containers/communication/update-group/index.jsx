/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  Checkbox,
  Button,
  InputBase,
  Paper
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import Layout from '../../Layout';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';

const UpdateGroup = ({ handleEditing, editData }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  // const location = useLocation();
  const {
    isEdit,
    branch,
    grades,
    groupId,
    groupname,
    //  sectionmappingIds,
    sectionIds,
    sessionYearId,
    sections,
    active,
    gradeId,
    branchId,
    usersData,
    sectionData,
  } = editData;
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [groupName, setGroupName] = useState();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  const [moduleId, setModuleid] = useState('');
  const [branchid, setBranchId] = useState([]);
  const [gradeid, setGradeId] = useState([]);
  const [sectionId, setSectionId] = useState([]);
  const [section, setSection] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [fullUserList, setFullUserList] = useState('');
  const [ userListCopy,setUserListCopy] = useState()
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [sectionMappingIds, setSectionMappingIds] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    if (editData) {
      setSelectedBranch({ id: branchId, branch_name: branch });
      setSelectedGrades({ grade_id: gradeId, grade__grade_name: grades });
      setGroupName(groupname);
      //  setisEdit(isEdit)
      setSelectedSections(sectionData);
      setGradeId(gradeId);
      setSectionId(sectionIds);
      setSelectedUser(usersData?.map((item) => item?.id));
      setSectionMappingIds(sectionData?.map((item) => item?.id));
      //    getSectionApi(gradeId)
    }
  }, [editData]);

  useEffect(() => {
    if (selectedBranch?.id)
      getSectionApi({ grade_id: gradeId, grade__grade_name: grades });
  }, [isEdit, selectedBranch]);

  const getApiCall = async (api, type) => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        if (type === 'fullGroup') {
          setFullUserList(result?.data?.data?.results);
          setUserListCopy(result?.data?.data?.results)
        }
        if (type === 'selectedGroup') {
          const array = [];
          const n = result.data.data && result.data.data.results.length;
          for (let i = 0; i < n; i += 1) {
            if (result.data.data.results[i].is_assigned === true) {
              array.push(result.data.data.results[i].id);
            }
          }
          setSelectedUser(array);
        }
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
          const selectedSectionsArray = result.data.data.filter(
            (obj) =>
              selectedSections.findIndex((sec) => obj.section_id == sec.section_id) > -1
          );
          console.log(selectedSectionsArray, 'selectedSectionsArray');
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

  function getFullGroupList() {
    getApiCall(
      `${
        endpoints.communication.communicationUserList
      }?page=1&page_size=500&module_id=${moduleId}&session_year=${
        selectedAcademicYear?.id
      }&branch=${branchId}&grade=${gradeId}${`&section=${sectionId}`}&level=13`,
      'fullGroup'
    );
  }

  function getSelectedGroupList() {
    getApiCall(
      `${
        endpoints.communication.edit
      }${1}/retrieve-update-group/?page=1&page_size=500&module_id=${moduleId}&session_year=${
        selectedAcademicYear?.id
      }&branch=${branchId}&grade=${gradeid}${
        sectionId.length !== 0 ? `&section=${sectionId}` : ''
      }`,
      'selectedGroup'
    );
  }

  const handleSection = (e, value) => {
    setSelectedSections([]);
    if (value.length > 0) {
      const items = value.map((el) => el);
      const ids = value.map((el) => el.section_id);
      const mappingIds = value.map((el) => el?.id);
      setSelectedSections(items);
      setSectionId(ids);
      setSectionMappingIds(mappingIds);
    } else {
      setSelectedSections([]);
    }
  };

  // useEffect(() => {
  //   let sectionsId =[]
  //   if (selectedSections.length && !selectedSections.includes('All')) {
  //     selectedSections.forEach((items) => {
  //         sectionsId.push(items.section_id);
  //       });
  //       setSectionId(sectionsId)
  //   }
  // },[selectedSections])

  useEffect(() => {
    if (moduleId && branchId && gradeId && selectedSections) {
      getFullGroupList();
      // getSelectedGroupList();
      // let sectionsId = []
      // if (selectedSections.length && !selectedSections.includes('All')) {
      //   let sectionsId =  selectedSections.map((items) => items.section_id);
      //   setSectionId(sectionsId)

      // }
    }
  }, [moduleId, branchId, gradeId, selectedSections]);

  function getIds(data, key) {
    const id = [];
    for (let i = 0; i < data.length; i += 1) {
      if (key === 'section') {
        id.push(data[i].section_id);
      } else {
        id.push(data[i].id);
      }
    }
    return id;
  }

  useEffect(() => {
    const childModules =
      NavData &&
      NavData.length !== 0 &&
      NavData.filter((item) => item.parent_modules === 'User Management').length !== 0 &&
      NavData.filter((item) => item.parent_modules === 'User Management')[0].child_module;
    const Module =
      childModules &&
      childModules.length !== 0 &&
      childModules.filter((item) => item.child_name === 'User Groups').length !== 0 &&
      childModules.filter((item) => item.child_name === 'User Groups')[0].child_id;
    setModuleid(Module);
    // setSelectedRole(getIds(location.state.roleType, 'role'));
    setBranchId(branchid);
    setGradeId(gradeid);
    setSectionId(sectionIds);
  }, []);

  const isSelected = (id) => selectedUser.indexOf(id) !== -1;

  const handleClick = (event, name) => {
    const selectedIndex = selectedUser.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUser, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUser.slice(1));
    } else if (selectedIndex === selectedUser.length - 1) {
      newSelected = newSelected.concat(selectedUser.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUser.slice(0, selectedIndex),
        selectedUser.slice(selectedIndex + 1)
      );
    }
    setSelectedUser(newSelected);
  };

  function handelSelectAll() {
    if (
      selectedUser.length ===
      (fullUserList && fullUserList.length)
    ) {
      setSelectedUser([]);
    } else {
      const array = [];
      const n = fullUserList && fullUserList.length;
      for (let i = 0; i < n; i += 1) {
        array.push(fullUserList[i].id);
      }
      setSelectedUser(array);
    }
  }

  const handleSearch = (e) => {
    if(e.target.value.length > 0){
      let filterData = userListCopy?.filter((item) =>{
        let name = item.user.first_name +' '+ item.user.last_name
        if(name.toLowerCase().startsWith(e.target.value.toLowerCase()))
             return item
      })
      setFullUserList(filterData)
      
    }else{
      setFullUserList(userListCopy)
    }
  }

  function updateGroupApi() {
    if (!groupName) {
      setAlert('warning', 'Enter Group Name');
      return;
    }
    if (!selectedUser || selectedUser.length == 0) {
      setAlert('warning', 'Select Users');
      return;
    }
    let userListIds = fullUserList?.map((item) => item?.id);
    let finalUserList = userListIds?.filter((id) => selectedUser?.includes(id));

    if (!finalUserList || finalUserList.length == 0) {
      setAlert('warning', 'Please Select Users');
      return;
    }
    const data = {
      group_name: groupName,
      // role: selectedRole,
      // branch: branchid,
      // grade: gradeid,
      section_mapping: sectionMappingIds,
      erpusers: finalUserList,
      is_active: active,
    };
    setLoading(true);
    axiosInstance
      .put(
        `${endpoints.communication.editGroup}${groupId}/update-retrieve-delete-groups/`,
        { ...data }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.status_code === 200) {
          setAlert('success', response.data.message);
          handleEditing(false);
          // window.history.back();
        } else {
          setAlert('error', response.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }

  return (
    <Layout>
      <Grid container spacing={2} style={{ width: '100%' }}>
        <Grid item md={12} xs={12}>
          <div className='view_group_breadcrumb_container'>
            <CommonBreadcrumbs
              componentName='Communication'
              childComponentName='Update Group'
            />
          </div>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card style={{ margin: '0px 10px', padding: '10px' }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  label='Group Name'
                  value={groupName}
                  fullWidth
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder='Enter Group Name'
                  margin='dense'
                  variant='outlined'
                  color='primary'
                />
              </Grid>
              {/* <Grid item md={3} xs={12} style={{ marginTop: '8px' }}>
                <Autocomplete
                  size='small'
                  value={location.state.roleType}
                  id='role_id'
                  disabled
                  multiple
                  className='create_group_branch'
                  options={location.state.roleType}
                  getOptionLabel={(option) => option?.role_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='User Role'
                      placeholder='User Role'
                    />
                  )}
                />
              </Grid> */}
              <Grid item md={3} xs={12} style={{ marginTop: '8px' }}>
                <Autocomplete
                  size='small'
                  // multiple
                  value={selectedBranch}
                  id='branch_id'
                  disabled
                  className='create_group_branch'
                  options={branchList || []}
                  getOptionLabel={(option) => option?.branch_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Selected Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
                style={{ marginTop: '8px' }}
              >
                <Autocomplete
                  size='small'
                  // multiple
                  value={selectedGrades}
                  id='grade_id'
                  disabled
                  className='create_group_branch'
                  options={gradeList || []}
                  getOptionLabel={(option) => option?.grade__grade_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Selected Grade'
                      placeholder='Grade'
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
                style={{
                  marginTop: '8px',
                  // display: selectedSections.length !== 0 ? '' : 'none',
                }}
              >
                <Autocomplete
                  size='small'
                  multiple
                  value={selectedSections}
                  id='grade_id'
                  // disabled
                  onChange={handleSection}
                  className='create_group_branch'
                  options={sectionList || []}
                  getOptionLabel={(option) => option?.section__section_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Selected Section'
                      placeholder='Section'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Card>
          <Grid item md={4} style={{marginLeft :'1%'}}>
                  <Paper elevation={3} className='search'>
                    <div>
                      <SearchIcon />
                    </div>
                    <InputBase
                      style = {{width : '100%'}}
                      placeholder=' Search'
                      onChange={(e) => handleSearch(e)}
                    />
                  </Paper>
            </Grid>
        </Grid>
        {(fullUserList && fullUserList.length !== 0 && (
          <Grid item md={12} xs={12} style={{ margin: '0px 10px', padding: '10px' }}>
            <Card style={{ width: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell float='left'>
                      Select All
                      <Checkbox
                        color='secondary'
                        onClick={handelSelectAll}
                        checked={
                          selectedUser.length ===
                          (fullUserList &&
                            fullUserList?.length)
                        }
                      />
                    </TableCell>
                    <TableCell float='left'>S.No</TableCell>
                    <TableCell float='left'>ID</TableCell>
                    <TableCell float='left'>Name</TableCell>
                    <TableCell float='left'>Email Id</TableCell>
                    <TableCell float='left'>Erp Id</TableCell>
                    <TableCell float='left'>Gender</TableCell>
                    {/* <TableCell float='left'>Contact</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fullUserList &&
                    fullUserList.length !== 0 &&
                    fullUserList.map((item, index) => {
                      const isItemSelectedId = isSelected(item.id);
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, item.id)}
                          role='checkbox'
                          tabIndex={-1}
                          key={item.id}
                          selected={isItemSelectedId}
                        >
                          <TableCell float='left'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelectedId}
                              id={item.user.first_name + item.id}
                              key={item.user.first_name + item.id}
                            />
                          </TableCell>
                          <TableCell float='left'>{index + 1}</TableCell>
                          <TableCell float='left'>
                            {(item.user && item.id) || ''}
                          </TableCell>
                          <TableCell float='left'>
                            {(item.user && item.user.first_name) || ''}
                            &nbsp;
                            {(item.user && item.user.last_name) || ''}
                          </TableCell>
                          <TableCell float='left'>
                            {(item.user && item.user.email) || ''}
                          </TableCell>
                          <TableCell float='left'>{item.erp_id || ''}</TableCell>
                          <TableCell float='left'>{item.gender || ''}</TableCell>
                          {/* <TableCell float='left'>{item.contact || ''}</TableCell> */}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        )) || (
          <Grid item md={12} xs={12}>
            <Typography
              variant='h5'
              style={{ color: 'midnightblue', textAlign: 'center', marginTop: '20px' }}
            >
              Records Not Found
            </Typography>
          </Grid>
        )}
        <Grid container spacing={2} style={{ margin: '0px 10px', padding: '10px' }}>
          <Grid item md={6} xs={6} style={{ textAlign: 'left' }}>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => handleEditing(false)}
            >
              Back
            </Button>
          </Grid>
          <Grid
            item
            md={6}
            xs={6}
            style={{
              textAlign: 'right',
              display: fullUserList && fullUserList.length !== 0 ? '' : 'none',
            }}
          >
            <Button
              variant='contained'
              color='primary'
              onClick={() => updateGroupApi()}
              style={{ color: 'white' }}
            >
              Update Group
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </Layout>
  );
};

export default UpdateGroup;
