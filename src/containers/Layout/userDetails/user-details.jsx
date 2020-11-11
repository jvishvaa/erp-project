/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable global-require */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { useState, Fragment, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomInput from '../../profile/custom-input/customInput';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './user-details.css';

const UserDetails = withRouter(({ history, ...props }) => {
  const { close, userId, setUserId, setSearching } = props || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [inputFields, setInputFields] = useState([]);
  const handleClose = () => {
    setUserId(null);
    close(false);
  };

  const handleEdit = (id) => {
    history.replace(`/user-management/edit-user/${id}`);
    if (history.location.pathname.includes('/edit-user/')) {
      window.location.reload();
    }
  };

  const getUserDetails = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.gloabSearch.singleUser}${userId}/global-search-user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: userDetails } = result.data || {};
      if (result.data.status_code === 200) {
        setInputFields([
          {
            name: 'name',
            type: 'text',
            value: userDetails.name || 'null',
            placeholder: 'Name',
            editable: true,
            requireOTPAuthentication: false,
          },
          {
            name: 'email',
            type: 'text',
            value: userDetails.user ? userDetails.user.email : 'null',
            placeholder: 'Email Id',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'ERP ID',
            type: 'text',
            value: userDetails.erp_id || 'null',
            placeholder: 'Erp Id',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'Role',
            type: 'text',
            value: userDetails.roles ? userDetails.roles.role_name : 'null',
            placeholder: 'Role name',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'Date of Birth',
            type: 'text',
            value: userDetails.date_of_birth || 'null',
            placeholder: 'Date of Birth',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'phone no',
            type: 'text',
            value: userDetails.contact || 'null',
            placeholder: 'Phone Number',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'Address',
            type: 'text',
            value: userDetails.address || 'null',
            placeholder: 'Address',
            editable: false,
            requireOTPAuthentication: true,
          },
        ]);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className='global_search_whole_page_wrapper'>
      <div className='global_search_userdetails_wrapper'>
        <span
          className='edit_icon_global_user_details'
          onClick={() => handleEdit(userId)}
        >
          <EditIcon />
        </span>
        <span className='close_icon_global_user_details' onClick={() => handleClose()}>
          <CloseIcon />
        </span>
        <div className='global_userdetails_tag'>User Details</div>
        <form className='user_details_wrapper'>
          {inputFields.map((items, index) => (
            <Fragment key={`userInput_${index}`}>
              <div className='user_tags' />
              <span className='user_label_tag'>{items.name}</span>
              <div
                className={
                  items.name === 'password' ? 'password' : 'user_textFieldsContainer'
                }
              >
                <CustomInput
                  className={
                    items.type === 'text'
                      ? 'textFields'
                      : `${'textFields'} ${'passwordWidth'}`
                  }
                  id={items.name}
                  name={items.name}
                  readonly
                  value={items.value}
                />
              </div>
            </Fragment>
          ))}
        </form>
      </div>
    </div>
  );
});

export default UserDetails;
