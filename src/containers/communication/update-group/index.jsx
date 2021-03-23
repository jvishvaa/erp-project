/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Layout from '../../Layout';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';

const UpdateGroup = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const location = useLocation();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [groupName, setGroupName] = useState(location.state.groupName || '');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  const [moduleId, setModuleid] = useState('');
  const [branchId, setBranchId] = useState([]);
  const [gradeId, setGradeId] = useState([]);
  const [sectionId, setSectionId] = useState([]);

  const [fullUserList, setFullUserList] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);

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
          setFullUserList(result.data.data);
        }
        if (type === 'selectedGroup') {
          const array = [];
          const n = result.data.data && result.data.data.results.length;
          for (let i = 0; i < n; i += 1) {
            if(result.data.data.results[i].is_assigned === true) {
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

  function getFullGroupList() {
    getApiCall(
      `${
        endpoints.communication.communicationUserList
      }?page=1&page_size=500&module_id=${moduleId}&role=${selectedRole}&branch=${branchId}${gradeId.length !== 0 ? `&grade=${gradeId}`: ''}${
        sectionId.length !== 0 ? `&section=${sectionId}` : ''
      }`,
      'fullGroup'
    );
  }

  function getSelectedGroupList() {
    getApiCall(
      `${endpoints.communication.editGroup}${
        location.state.groupId
      }/retrieve-update-group/?page=1&page_size=500&module_id=${moduleId}&role=${selectedRole}&branch=${branchId}${gradeId.length !== 0 ? `&grade=${gradeId}`: ''}${
        sectionId.length !== 0 ? `&section=${sectionId}` : ''
      }`,
      'selectedGroup'
    );
  }

  useEffect(() => {
    if (moduleId) {
      getFullGroupList();
      getSelectedGroupList();
    }
  }, [moduleId]);

  function getIds(data, key) {
    const id = [];
    for (let i = 0; i < data.length; i += 1) {
      if(key === 'section'){
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
      NavData.filter((item) => item.parent_modules === 'Communication').length !== 0 &&
      NavData.filter((item) => item.parent_modules === 'Communication')[0].child_module;
    const Module =
      childModules &&
      childModules.length !== 0 &&
      childModules.filter((item) => item.child_name === 'View&Edit Group').length !== 0 &&
      childModules.filter((item) => item.child_name === 'View&Edit Group')[0].child_id;
    setModuleid(Module);
    console.log(location.state, 'ddddd');
    setSelectedRole(getIds(location.state.roleType, 'role'));
    setBranchId(getIds(location.state.branch, 'branch'));
    setGradeId(getIds(location.state.grades, 'grade'));
    setSectionId(getIds(location.state.sections, 'section'));
  }, []);

  const isSelected = (name) => selectedUser.indexOf(name) !== -1;

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
      (fullUserList && fullUserList.results && fullUserList.results.length)
    ) {
      setSelectedUser([]);
    } else {
      const array = [];
      const n = fullUserList && fullUserList.results.length;
      for (let i = 0; i < n; i += 1) {
        array.push(fullUserList.results[i].id);
      }
      setSelectedUser(array);
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
    const data = {
      group_name: groupName,
      role: selectedRole,
      branch: branchId,
      grade: gradeId,
      section_mapping: sectionId,
      erp_users: selectedUser,
    };
    setLoading(true);
    axiosInstance
      .put(
        `${endpoints.communication.editGroup}${location.state.groupId}/retrieve-update-group/`,
        { ...data }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.status_code === 200) {
          setAlert('success', response.data.message);
          window.history.back();
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
              <Grid item md={3} xs={12} style={{ marginTop: '8px' }}>
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
              </Grid>
              <Grid item md={3} xs={12} style={{ marginTop: '8px' }}>
                <Autocomplete
                  size='small'
                  multiple
                  value={location.state.branch}
                  id='branch_id'
                  disabled
                  className='create_group_branch'
                  options={location.state.branch}
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
              <Grid item md={3} xs={12} style={{ marginTop: '8px', display: location.state.grades.length !== 0 ? '' : 'none', }}>
                <Autocomplete
                  size='small'
                  multiple
                  value={location.state.grades}
                  id='grade_id'
                  disabled
                  className='create_group_branch'
                  options={location.state.grades}
                  getOptionLabel={(option) => option?.grade_name}
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
                  display: location.state.sections.length !== 0 ? '' : 'none',
                }}
              >
                <Autocomplete
                  size='small'
                  multiple
                  value={location.state.sections}
                  id='grade_id'
                  disabled
                  className='create_group_branch'
                  options={location.state.sections}
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
        </Grid>
        {(fullUserList && fullUserList.results.length !== 0 && (
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
                            fullUserList.results &&
                            fullUserList.results.length)
                        }
                      />
                    </TableCell>
                    <TableCell float='left'>S.No</TableCell>
                    <TableCell float='left'>ID</TableCell>
                    <TableCell float='left'>Name</TableCell>
                    <TableCell float='left'>Email Id</TableCell>
                    <TableCell float='left'>Erp Id</TableCell>
                    <TableCell float='left'>Gender</TableCell>
                    <TableCell float='left'>Contact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fullUserList &&
                    fullUserList.results.length !== 0 &&
                    fullUserList.results.map((item, index) => {
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
                          <TableCell float='left'>{item.contact || ''}</TableCell>
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
              onClick={() => window.history.back()}
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
              display: fullUserList && fullUserList.results.length !== 0 ? '' : 'none',
            }}
          >
            <Button variant='contained' color='primary' onClick={() => updateGroupApi()} style={{ color:'white' }}>
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
