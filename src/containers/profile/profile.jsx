/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */

/* eslint-disable global-require */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { useState, Fragment, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import CustomInput from './custom-input/customInput';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import ChangePassword from './change-password/change-password';
import Layout from '../Layout';
import './profile.css';

const Profile = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { role_details: roleDetailes } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [update, setUpdate] = useState(false);
  const [userId, setUserId] = useState('');
  const [passwordPopUp, setPasswordPopUp] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userImageData, setUserImageData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [inputFields, setInputFields] = useState([]);

  const getUserDetails = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.profile.userDetails}?erp_user_id=${roleDetailes.erp_user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { result: userDetails } = result.data || {};
      if (result.status === 200) {
        setInputFields([
          {
            name: 'name',
            type: 'text',
            value: `${userDetails.user.first_name} ${userDetails.user.last_name}`,
            placeholder: 'Name',
            editable: true,
            requireOTPAuthentication: false,
          },
          {
            name: 'email',
            type: 'text',
            value: userDetails.user.email,
            placeholder: 'Email Id',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'ERP ID',
            type: 'text',
            value: userDetails.erp_id,
            placeholder: 'Erp Id',
            editable: true,
            requireOTPAuthentication: true,
          },
          {
            name: 'phone no',
            type: 'text',
            value: userDetails.contact,
            placeholder: 'Phone Number',
            editable: false,
            requireOTPAuthentication: true,
          },
        ]);
        setUserId(userDetails.id);
        setProfileImage(userDetails.profile);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUserImage(URL.createObjectURL(event.target.files[0]));
      setUserImageData(event.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    const changeImageUrl = `${endpoints.communication.userStatusChange}${userId}/update-user-profile/`;
    try {
      const formData = new FormData();
      formData.set('profile', userImageData);
      const response = await axiosInstance({
        method: 'put',
        url: changeImageUrl,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status_code === 200) {
        setAlert('success', 'Image changed successfully');
        setUserImage(null);
        setUserImageData(null);
        getUserDetails();
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleProfileUpdateCancel = () => {
    setUserImage(null);
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <>
      <Layout>
        <CommonBreadcrumbs componentName='Profile' />
        <div className='dashboard_profile'>
          {passwordPopUp ? <ChangePassword close={setPasswordPopUp} id={userId} /> : null}
          <div className='profile_wrapper'>
            <div className='profile_image_wrapper'>
              <img
                src={userImage || profileImage || require('../../assets/images/Male.svg')}
                alt='Not found'
                className='profile_avator'
              />
              {userImage ? null : (
                <Button
                  color="primary"
                  variant='contained'
                  className='profile_upload_image_button'
                  component='label'
                >
                  Add Image
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    id='raised-button-file'
                    onChange={onImageChange}
                  />
                </Button>
              )}
            </div>
            <form key={update} className='profile_details_wrapper'>
              {inputFields.map((items, index) => (
                <Fragment key={`profileInput_${index}`}>
                  <div className='profile_tags' />
                  <span className='profile_label_tag'>{items.name}</span>
                  <div
                    className={
                      items.name === 'password' ? 'password' : 'textFieldsContainer'
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
          <Button
            color="primary"
            variant='contained'
            className='profile_change_password_button'
            onClick={() => setPasswordPopUp(true)}
          >
            Change password
          </Button>
        </div>
        {userImage ? (
          <div className='profile_update_button_wrapper'>
            <input
              className='profile_update_button cancel_button_profile'
              type='button'
              onClick={handleProfileUpdateCancel}
              value='cancel'
            />
            <input
              className='profile_update_button'
              type='button'
              onClick={handleProfileUpdate}
              value='Update Profile'
            />
          </div>
        ) : null}
      </Layout>
    </>
  );
};

export default Profile;
