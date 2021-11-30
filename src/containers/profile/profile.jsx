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
import { makeStyles } from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import ChangePassword from './change-password/change-password';
import Layout from '../Layout';
import './profile.css';
const useStyles = makeStyles((theme) => ({
  textfields: {
    display: 'block',
    padding: '0% 1%',
    border: 'none',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.secondary.main,
    paddingLeft: '0',
    width: '85%',
    outline: 'none',
    color: theme.palette.secondary.main,
    margin: '0% 5%',
  },
  profileLabelTag: {
    textTransform: 'capitalize',
    paddingLeft: '5%',
    color: theme.palette.secondary.main,
    fontWeight: '600',
  },
}));

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
  const [editable,seteditable] = useState(false)
  const classes = useStyles();
  const [userDetails,setuserDetails] = useState()
  const [inputDetails, setInputDetails] = useState()

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
            value: `${ userDetails?.user?.first_name} ${ userDetails?.user?.last_name}`,
            placeholder: 'Name',
            editable: false,
            requireOTPAuthentication: false,
          },
          {
            name: 'Fathers Name',
            type: 'text',
            value: userDetails?.parent_details.father_name,
            placeholder: 'Fathers Name',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'Mothers Name',
            type: 'text',
            value: userDetails?.parent_details.mother_name,
            placeholder: 'Mothers Name',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'email',
            type: 'text',
            value:  userDetails?.user.email,
            placeholder: 'Email Id',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'ERP ID',
            type: 'text',
            value: userDetails?.erp_id,
            placeholder: 'Erp Id',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'phone no',
            type: 'text',
            value: userDetails?.contact,
            placeholder: 'Phone Number',
            editable: false,
            requireOTPAuthentication: true,
          },
          {
            name: 'DOB',
            type: 'date',
            value: userDetails?.date_of_birth,
            placeholder: 'Date of Birth',
            editable: false,
            requireOTPAuthentication: true,
          },
         
        ]);
        setUserId(userDetails?.id);
        setProfileImage(userDetails?.profile);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const editDetails = () => {
    seteditable(true)
    setInputDetails(inputFields)
    let data = inputFields.map((i)=> (
      (i.name == 'name' || i.name =='Fathers Name' ||i.name == 'Mothers Name' ||i.name == 'DOB') ? {...i, editable : true} : {...i}
    ))
    setInputFields(data)
  }
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
      if(userImageData){
        formData.set('profile', userImageData);
      }
      if(userDetails && userDetails.name){
        formData.set('name',userDetails.name )
      }
      if(userDetails && userDetails['Fathers Name']){
        formData.set('father_name',userDetails['Fathers Name'])
      }
      if(userDetails && userDetails['Mothers Name']){
        formData.set('mother_name',userDetails['Mothers Name'])
      }
      if(userDetails && userDetails.DOB){
        formData.set('dob',userDetails.DOB)
      }
      const response = await axiosInstance({
        method: 'put',
        url: changeImageUrl,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status_code === 200) {
        setAlert('success', 'Profile changed successfully');
        setUserImage(null);
        setuserDetails(null)
        setUserImageData(null);
        getUserDetails();
        seteditable(false)
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleProfileUpdateCancel = () => {
    setUserImage(null);
    seteditable(false)
    setInputFields(inputDetails)
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <>
      <Layout>
        <div style={{ height: '100%' }}>
          <div className='profile_breadcrumb_wrapper'>
            <CommonBreadcrumbs componentName='Profile' />
          </div>
          <div className='dashboard_profile'>
            {passwordPopUp ? (
              <ChangePassword close={setPasswordPopUp} id={userId} />
            ) : null}
            <div className='profile_wrapper'>
              <div className='profile_image_wrapper'>
                <img
                  src={
                    profileImage
                      ? profileImage
                      : userImage
                      ? userImage
                      : require('../../assets/images/Male.svg')
                  }
                  alt='Not found'
                  onError={(e) => {
                    e.target.src = require('../../assets/images/Male.svg');
                  }}
                  className='profile_avator'
                />
                {userImage ? null : (
                  <Button
                    color='primary'
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
                    <span className={classes.profileLabelTag}>{items.name}</span>
                    <div
                      className={
                        items.name === 'password' ? 'password' : 'textFieldsContainer'
                      }
                    >
                      <CustomInput
                        className={
                          items.type === 'text'
                            ? `${classes.textfields}`
                            : `${classes.textfields} ${'passwordWidth'}`
                        }
                        type={items.type}
                        id={items.name}
                        name={items.name}
                        readonly = {!items.editable}
                        value={items.value}
                        autoFocus = {true}
                        onChange = {(e) => setuserDetails({...userDetails,[items.name] : e.target.value})}
                      />
                    </div>
                  </Fragment>
                ))}
              </form>
            </div>
            <Button
              color='primary'
              variant='contained'
              className='profile_change_password_button'
              onClick={() => setPasswordPopUp(true)}
            >
              Change password
            </Button>
            {!editable && <Button
              color='primary'
              variant='contained'
              // className='profile_change_password_button'
              style={{    marginLeft: '68%',marginTop: '3%'}}
              onClick = {editDetails}
              
            >
              Edit
            </Button>}
          </div>
          {userImage || editable ?  (
            <div className='profile_update_button_wrapper'>
              <input
                className='profile_update_button cancel_button_profile'
                type='button'
                onClick={handleProfileUpdateCancel}
                value='cancel'
              />
              <Button
                variant='contained'
                color='primary'
                className='profile_update_button'
                onClick={handleProfileUpdate}
                color='primary'
              >
                Update Profile
              </Button>
            </div>
          ) : null}
        </div>
      </Layout>
    </>
  );
};

export default Profile;
