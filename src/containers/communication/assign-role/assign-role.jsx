/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
// import Layout from '../../Layout';
import './assign-role.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AssignRole = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedRole, setSelectedRole] = useState('');
  const [pageno, setPageno] = useState(1);
  const [assignedRole, setAssigenedRole] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [selectectUserError, setSelectectUserError] = useState('');
  const [selectAll, setSelectAll] = useState(false);

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
  const displayUsersList = async () => {
    const getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=5`;
    try {
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setHeaders([
          { field: 'fullName', headerName: 'Name', width: 250 },
          { field: 'email', headerName: 'Email Id', width: 200 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 100 },
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

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('[class*="PrivateSwitchBase-input-"]');
    if (!selectAll) {
      testclick[1].click();
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const assignRole = async () => {
    const assignRoleApi = endpoints.communication.assignRole;
    const selectionArray = [];
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
    setSelectectUserError('');
    try {
      const response = await axiosInstance.post(
        assignRoleApi,
        {
          role_id: selectedRole,
          user_id: selectAll ? 'All' : selectionArray,
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
        setAlert('success', message);
        setSelectedUsers([]);
        setRoleError('');
        setSelectedRole('');
        setSelectAll(false);
        setSelectectUserError('');
        setAssigenedRole(true);
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  useEffect(() => {
    getRoleApi();
  }, []);
  useEffect(() => {
    displayUsersList();
    if (assignedRole) {
      setAssigenedRole(false);
    }
  }, [pageno, assignedRole]);

  return (
    // <Layout>
    <div className='assign_role_wrapper'>
      <div className='assign_role_roles'>
        <span className='create_group_error_span'>{roleError}</span>
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel id='demo-simple-select-outlined-label'>Roles</InputLabel>
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
      {assignedRole ? (
        <div>Please Wait ...</div>
      ) : (
        <>
          {usersRow.length ? (
            <div className='assign_role_select_all_wrapper'>
              <input
                type='checkbox'
                className='assign_role_select_all_checkbox'
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
            pageSize={5}
          />
          <input
            className='assign_role_button'
            type='button'
            onClick={assignRole}
            value='Assign Role'
          />
        </>
      )}
    </div>
  );
};

export default AssignRole;
