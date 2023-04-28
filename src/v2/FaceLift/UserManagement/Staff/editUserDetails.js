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
import React, { useEffect, useRef, useState } from 'react';
import './step.scss';
import countryList from '../../../../containers/user-management/list';
import moment from 'moment';
import { _ } from 'lodash';

const EditUserDetails = ({ userDetails, handleUpdateUserDetails, setUserDetails }) => {
  const [image, setImage] = useState('');
  const [profile, setProfile] = useState('');
  const { Option } = Select;

  const formRef = useRef();
  const userData = [userDetails];

  const selectDob = (date, dateString) => {
    handleInput('dob', dateString);
  };

  const countryCodeOptions = countryList?.map((each) => {
    return (
      <Option key={each?.country} value={each.callingCode}>
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

  useEffect(() => {
    if (formRef.current) {
      let gender;
      if (userDetails?.gender === 'male') {
        gender = 1;
      } else if (userDetails?.gender === 'female') {
        gender = 2;
      } else {
        gender = 3;
      }
      let contact = userDetails?.contact.split('-');
      userDetails?.profile !== null || userDetails?.profile !== undefined
        ? setImage(userDetails?.profile)
        : setImage('');
      formRef.current.setFieldsValue({
        first_name: userDetails?.user?.first_name,
        middle_name: userDetails?.user_middle_name,
        last_name: userDetails?.user?.last_name,
        gender: gender,
        dob: moment(userDetails?.date_of_birth),
        country_code: contact[0],
        mobile: contact[1],
        username: userDetails?.user?.username,
        email: userDetails?.user?.email,
        address: userDetails?.address,
      });
    }
  }, []);

  const handleInput = (input, e) => {
    if (input === 'profile') {
      userData[0].profile = e;
    }
    setUserDetails(userData[0]);
  };

  const handleInput2 = (e) => {
    let formData = e[0];
    // const updatedDetails = _.cloneDeep(userDetails);
    let contact = userDetails?.contact.split('-');

    if (formData.name[0] === 'image') {
      userData[0].profile = formData.value;
    }
    if (formData.name[0] === 'first_name') {
      userData[0].user.first_name = formData.value;
    }
    if (formData.name[0] === 'middle_name') {
      userData[0].user_middle_name = formData.value;
    }
    if (formData.name[0] === 'last_name') {
      userData[0].user.last_name = formData.value;
    }
    if (formData.name[0] === 'gender') {
      userData[0].gender = formData.value;
    }
    if (formData.name[0] === 'dob') {
      userData[0].date_of_birth = moment(formData.value).format('YYYY-MM-DD');
    }
    if (formData.name[0] === 'country_code') {
      userData[0].contact = `${formData.value}-${contact[1]}`;
    }
    if (formData.name[0] === 'mobile') {
      userData[0].contact = `${contact[0]}-${formData.value}`;
    }
    if (formData.name[0] === 'username') {
      userData[0].erp_id = formData.value;
      userData[0].user.username = formData.value;
    }
    if (formData.name[0] === 'email') {
      userData[0].email = formData.value;
      userData[0].user.email = formData.value;
    }
    if (formData.name[0] === 'address') {
      userData[0].address = formData.value;
    }
    setUserDetails(userData[0]);
  };
  return (
    <React.Fragment>
      <Form
        id='userDetailsForm'
        layout={'vertical'}
        className='academic-staff'
        onFieldsChange={(e) => handleInput2(e)}
        ref={formRef}
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
                      if (!e.target.files[0]?.type.includes('image/')) {
                        message.error('Please select image files only');
                        return false;
                      } else {
                        setProfile(e.target.files[0]);
                        // userData[0].profile = e.target.files[0];
                        handleInput('profile', e.target.files[0]);
                      }
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
              // rules={[{ required: true, message: 'Please enter First Name' }]}
              rules={[
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'First Name should contain only character',
                },
                { required: true, message: 'Please Enter First Name' },
              ]}
              validationTrigger='onChange'
            >
              <Input
                placeholder='First Name'
                value={userData?.user?.first_name}
                // onChange={(e) => handleInput('firstname', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item
              name='middle_name'
              label='Middle Name'
              rules={[
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'First Name should contain only character',
                },
              ]}
              validationTrigger='onChange'
            >
              <Input
                placeholder='Middle Name'
                value={userData?.user_middle_name}
                // onChange={(e) => handleInput('middlename', e.target.value)}
              />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item
              name='last_name'
              label='Last Name'
              rules={[
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'Last Name should contain only character',
                },
                { required: true, message: 'Please Enter Last Name' },
              ]}
            >
              <Input
                placeholder='Last Name'
                value={userData?.user?.last_name}
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
                format={'YYYY-MM-DD'}
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
              rules={[
                {
                  pattern: /^(?:\d*)$/,
                  message: 'Mobie number should contain only number',
                },
                { required: true, message: 'Please Enter Mobile No.' },
                {
                  maxLength: 12,
                  message: 'Mobile number should be 10 to 12 digit long.',
                },
              ]}
              validationTrigger='onChange'

              // validateTrigger="onBlur"
            >
              <Input
                placeholder='Mobile No.'
                maxLength={12}
                // onChange={(e) => {
                //   if (e.target.value.toString().length > 10) {
                //     e.preventDefault()
                //     message.error('Mobile no. must be 10 digit only');
                //   }else{
                //     e.preventDefault()
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
                disabled
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

export default EditUserDetails;
