import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './step.scss';
import countryList from '../../../../containers/user-management/list';
import moment from 'moment';

const UserDetails = ({ userDetails, setUserDetails }) => {
  const [image, setImage] = useState('');
  const [profile, setProfile] = useState('');
  const { Option } = Select;

  const userData = [...userDetails];

  const selectDob = (date, dateString) => {
    handleInput('dob', dateString);
  };

  const countryCodeOptions = countryList?.map((each) => {
    return (
      <Option key={each?.id} value={each.callingCode}>
        {each?.country}({each.callingCode})
      </Option>
    );
  });

  useEffect(() => {
    if (typeof profile === 'object') {
      setImage(URL.createObjectURL(profile));
    } else {
      setImage(profile);
    }
  }, [profile]);

  const handleInput = (input, e) => {
    if (input === 'profile') {
      userData[0].userProfile = e;
    }
    // if (input === 'firstname') {
    //   userData[0].userFirstName = e;
    // }
    // if (input === 'middlename') {
    //   userData[0].userMiddleName = e;
    // }
    // if (input === 'lastname') {
    //   userData[0].userLastName = e;
    // }
    // if (input === 'gender') {
    //   userData[0].userGender = e;
    // }
    // if (input === 'dob') {
    //   userData[0].userDOB = e;
    // }
    // if (input === 'code') {
    //   userData[0].userCode = e;
    // }
    // if (input === 'mobile') {
    //   userData[0].userMobile = e;
    // }
    // if (input === 'username') {
    //   userData[0].userUsername = e;
    // }
    // if (input === 'email') {
    //   userData[0].userEmail = e;
    // }
    // if (input === 'address') {
    //   userData[0].userAddress = e;
    // }
    setUserDetails(userData);
  };

  const handleInput2 = (e) => {
    let formData = e[0];

    if (formData.name[0] === 'image') {
      userData[0].userProfile = formData.value;
    }
    if (formData.name[0] === 'first_name') {
      userData[0].userFirstName = formData.value;
    }
    if (formData.name[0] === 'middle_name') {
      userData[0].userMiddleName = formData.value;
    }
    if (formData.name[0] === 'last_name') {
      userData[0].userLastName = formData.value;
    }
    if (formData.name[0] === 'gender') {
      userData[0].userGender = formData.value;
    }
    if (formData.name[0] === 'dob') {
      userData[0].userDOB = moment(formData.value).format('YYYY-MM-DD');
    }
    if (formData.name[0] === 'country_code') {
      userData[0].userCode = formData.value;
    }
    if (formData.name[0] === 'mobile') {
      userData[0].userMobile = formData.value;
    }
    if (formData.name[0] === 'username') {
      userData[0].userUsername = formData.value;
    }
    if (formData.name[0] === 'email') {
      userData[0].userEmail = formData.value;
    }
    if (formData.name[0] === 'address') {
      userData[0].userAddress = formData.value;
    }
  };
  return (
    <React.Fragment>
      <Form
        id='userDetailsForm'
        layout={'vertical'}
        className='academic-staff'
        onFieldsChange={(e) => handleInput2(e)}
      >
        <div className='row mt-5'>
          <div className='col-md-5 col-sm-6 col-12'>
            <img
              src={
                image ||
                `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png`
              }
              alt='Attach Image'
              style={{ width: '100px', height: '100px', borderRadius: '50px' }}
            />
            {profile ? (
              <Button
                type='primary'
                onClick={() => {
                  setProfile('');
                  setImage('');
                  // userData[0].userProfile = '';
                  handleInput('profile', '');
                }}
                danger
                className='btn btn-danger th-br-4 ml-4 mb-0'
              >
                Delete Image
              </Button>
            ) : (
              <label htmlFor={'image'} className='btn btn-primary th-br-4 ml-4 mb-0'>
                Attach Image
                <input
                  style={{ visibility: 'hidden', position: 'absolute' }}
                  type='file'
                  accept='image/*'
                  id={'image'}
                  name={'image'}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfile(e.target.files[0]);
                      // userData[0].profile = e.target.files[0];
                      handleInput('profile', e.target.files[0]);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4 col-sm -12'>
            <Form.Item
              name='first_name'
              label='First Name'
              rules={[{ required: true, message: 'Please enter First Name' }]}
            >
              <Input
                placeholder='First Name'
                // onChange={(e) => handleInput('firstname', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item name='middle_name' label='Middle Name'>
              <Input
                placeholder='Middle Name'
                // onChange={(e) => handleInput('middlename', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item
              name='last_name'
              label='Last Name'
              rules={[{ required: true, message: 'Please enter Last Name' }]}
            >
              <Input
                placeholder='Last Name'
                // onChange={(e) => handleInput('lastname', e.target.value)}
              />
            </Form.Item>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <Form.Item
              name='gender'
              label='Gender'
              rules={[{ required: true, message: 'Please Select Gender' }]}
            >
              <Radio.Group
                defaultValue={userData[0]?.userGender}
                // onChange={(e) => handleInput('gender', e.target.value)}
              >
                <Space direction='vertical'>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                  <Radio value={3}>Other</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className='col-md-4'>
            <Form.Item
              name='dob'
              label='DOB'
              rules={[{ required: true, message: 'Please Select Date of Birth' }]}
            >
              <DatePicker
                disabledDate={(current) => current.isAfter(moment().subtract(1, 'day'))}
                onChange={selectDob}
              />
            </Form.Item>
          </div>

          <div className='col-md-2'>
            <Form.Item
              name='country_code'
              label='Code'
              rules={[{ required: true, message: 'Please Select Country Code' }]}
            >
              <Select
                allowClear={true}
                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                placement='bottomRight'
                showArrow={true}
                dropdownMatchSelectWidth={true}
                filterOption={(input, options) => {
                  return (
                    options.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                showSearch
                placeholder='Country Code'
                getPopupContainer={(trigger) => trigger.parentNode}
                // onChange={(e) => {
                //   if (e != undefined) {
                //     handleInput('code', e);
                //   } else {
                //     handleInput('code', '');
                //   }
                // }}
              >
                {countryCodeOptions}
              </Select>
            </Form.Item>
          </div>
          <div className='col-md-2'>
            <Form.Item
              name='mobile'
              label='Mobile No.'
              rules={[{ required: true, message: 'Please Enter Mobile No.' }]}
            >
              <InputNumber
                placeholder='Mobile No.'
                // onChange={(e) => {
                //   if (e.toString().length > 10) {
                //     message.error('Mobile no. must be 10 digit only');
                //   } else {
                //     setMobile(e);
                //     handleInput('mobile', e);
                //   }
                // }}
              />
            </Form.Item>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <Form.Item
              name='username'
              label='Username'
              // rules={[{ required: true, message: 'Please Enter Username' }]}
            >
              <Input
                placeholder='Username'
                // onChange={(e) => handleInput('username', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4'>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Please Enter Email' },
                { type: 'email', message: 'Please Enter Valid Email' },
              ]}
            >
              <Input
                placeholder='Email'
                // onChange={(e) => handleInput('email', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4'>
            <Form.Item
              name='address'
              label='Address'
              rules={[{ required: true, message: 'Please Enter Address' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder='Address'
                // value={userData[0]?.userAddress}
                // onChange={(e) => {
                //   e.preventDefault();
                //   handleInput('address', e.target.value);
                // }}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default UserDetails;
