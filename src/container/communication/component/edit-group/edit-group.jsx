/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-debugger */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import CustomInput from '../custom-inputfield/custom-input';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import './edit-group.css';

// eslint-disable-next-line no-unused-vars
const EditGroup = withRouter(({ history, ...props }) => {
  const {
    editId,
    editClose,
    groupName,
    groupRole,
    groupGrades,
    groupSections,
    setGroupName,
  } = props || {};
  const [pageno, setPageno] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [usersRow, setUsersRow] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const addGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const editGroup = async () => {
    try {
      const editGroupApiUrl = `http://13.234.252.195:443/communication/${editId}/retrieve-update-group/`;
      const selectionArray = [];
      selectedUsers.forEach((item) => {
        item.selected.forEach((ids) => {
          selectionArray.push(ids);
        });
      });
      console.log(selectionArray);
      const response = await axios.put(
        editGroupApiUrl,
        {
          group_name: groupName,
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
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        alert(message);
        editClose(false);
      } else {
        console.log('error');
        // dispatch(setAlert('error', result.data.message));
      }
    } catch (error) {
      console.log('error');
      // dispatch(setAlert('error', error.message));
    }
  };
  const getEditGroupsData = async () => {
    const getEditGroupsDataUrl = `http://13.234.252.195:443/communication/${editId}/retrieve-update-group/?page=${pageno}`;
    try {
      const result = await axios.get(getEditGroupsDataUrl);
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
        result.data.data.results.forEach((items) => {
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
            selected:
              selectedUsers.length && selectedUsers[pageno - 1].selected.length
                ? selectedUsers[pageno - 1].selected.includes(items.id)
                : items.is_assigned,
          });
        });

        setUsersRow(rows);
        setCompleteData(selectionRows);
        setTotalPage(result.data.data.count);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.data.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, first: true, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
        }
      } else {
        console.log('error');
        // dispatch(setAlert('error', result.data.message));
      }
    } catch (error) {
      console.log('error');
      // dispatch(setAlert('error', error.message));
    }
  };
  useEffect(() => {
    getEditGroupsData();
  }, [pageno]);
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
  return (
    <div className='edit_group__page'>
      <span className='close_icon_edit_group' onClick={() => editClose(false)}>
        <CloseIcon />
      </span>
      <div className='editGroup_Fields'>
        <CustomInput
          className='group_name'
          onChange={addGroupName}
          value={groupName}
          name='Group name'
        />
        <div className='role_name_edit_group'>
          <span className='edit_group_level'>Group Role</span>
          <Chip label={groupRole} className='edit_group_chip' />
        </div>
        <div className='role_name_edit_group'>
          <span className='edit_group_level'>Group Grade</span>
          {groupGrades.map((grades) => (
            <Chip label={grades.grade_name} className='edit_group_chip' />
          ))}
        </div>
        <div className='role_name_edit_group'>
          <span className='edit_group_level'>Group Section</span>
          {groupSections.map((sections) => (
            <Chip label={sections.section__section_name} className='edit_group_chip' />
          ))}
        </div>
      </div>
      <CustomSelectionTable
        header={headers}
        rows={usersRow}
        completeData={completeData}
        totalRows={totalPage}
        edit
        pageno={pageno}
        selectedUsers={selectedUsers}
        changePage={setPageno}
        setSelectedUsers={setSelectedUsers}
      />
      <input
        className='edit_group_button'
        type='button'
        onClick={editGroup}
        value='edit group'
      />
    </div>
  );
});

export default EditGroup;
