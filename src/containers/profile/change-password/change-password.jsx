/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useContext } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomInput from '../custom-input/customInput';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './change-password.css';

const ChangePassword = (props) => {
  const { close, id } = props || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [openModal, setOpenModal] = useState(true);
  const [errorPassword, setErrorPassword] = useState('');
  const handleCancel = () => {
    close(false);
  };
  const handleChangePassword = async () => {
    if (!previousPassword) {
      setErrorPassword('Please enter the old password');
      return;
    }
    if (!newPassword) {
      setErrorPassword('Please enter the new password');
      return;
    }
    if (!confirmNewPassword) {
      setErrorPassword('Please enter the confirm password');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorPassword('New password and confirm password didnot match');
      return;
    }
    if (newPassword === previousPassword) {
      setErrorPassword('New password is same as the previous password');
      return;
    }
    setErrorPassword('');
    const changePasswordUrl = `${endpoints.communication.userStatusChange}${id}/change-password/`;
    try {
      const request = {
        old_password: previousPassword,
        new_password: newPassword,
      };
      const response = await axiosInstance.put(changePasswordUrl, request, {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          // See: http://bit.ly/text-json
          'content-type': 'application/json',
        },
      });
      if (response.data.status_code === 200) {
        setAlert('success', 'Password updated successfully');
        close(false);
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleCloseModal = () => {
    close(false);
  };

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle
        style={{ cursor: 'move', color: '#014b7e' }}
        id='draggable-dialog-title'
      >
        Change Password
      </DialogTitle>

      <DialogContent>
        <div className='password_wrapper'>
          <div className='profile_password_wrapper'>
            <span className='password_label'>Old Password</span>
            <CustomInput
              className='profile_change_password_input'
              id='previousPassword'
              value={previousPassword}
              placeholder='Enter Old Password'
              name='previousPassword'
              type='password'
              onChange={(e) => setPreviousPassword(e.target.value)}
            />
          </div>
          <div className='profile_password_wrapper'>
            <span className='password_label'>New Password</span>
            <CustomInput
              className='profile_change_password_input'
              id='newPassword'
              value={newPassword}
              placeholder='Enter New Password'
              name='newPassword'
              type='password'
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className='profile_password_wrapper'>
            <span className='password_label'>Confirm New Password</span>
            <CustomInput
              className='profile_change_password_input'
              id='confirmPassword'
              value={confirmNewPassword}
              placeholder='Confirm New Password'
              name='confirmPassword'
              type='password'
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
        </div>
        <span className='profile_password_error'>{errorPassword}</span>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleCancel}
          className='view_group_delete_alert_button_cancel'
          color='secondary'
        >
          Cancel
        </Button>
        <Button className='view_group_delete_alert_button' onClick={handleChangePassword}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
