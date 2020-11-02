/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-debugger */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomInput from '../custom-inputfield/custom-input';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
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
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageno, setPageno] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [usersRow, setUsersRow] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const addGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const editGroup = async () => {
    try {
      const editGroupApiUrl = `${endpoints.communication.editGroup}${editId}/retrieve-update-group/`;
      const selectionArray = [];
      selectedUsers.forEach((item) => {
        item.selected.forEach((ids) => {
          selectionArray.push(ids);
        });
      });
      const response = await axiosInstance.put(
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
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const getEditGroupsData = async () => {
    const getEditGroupsDataUrl = `${endpoints.communication.editGroup}${editId}/retrieve-update-group/?page=${pageno}&page_size=15`;
    try {
      const result = await axiosInstance.get(getEditGroupsDataUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      testclick[0].click();
    } else {
      for (let i = 1; i < testclick.length; i += 1) {
        testclick[i].click();
      }
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
