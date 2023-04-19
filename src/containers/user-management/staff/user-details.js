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
import ImageUpload from 'components/image-upload';
import React, { useEffect, useState } from 'react';
import './step.scss';
import countryList from './../list';

const UserDetails = () => {
  const [image, setImage] = useState('');
  const [profile, setProfile] = useState('');
  const [gender, setGender] = useState(1);
  const [mobile, setMobile] = useState('');
  const { Option } = Select;

  const selectDob = (date, dateString) => {
    console.log(date, dateString);
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

  console.log({ profile });
  return (
    <React.Fragment>
      <Form id='userDetailsForm' layout={'vertical'} className='academic-staff'>
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
              <Input placeholder='First Name' />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item name='middle_name' label='Middle Name'>
              <Input placeholder='Middle Name' />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm -12'>
            <Form.Item
              name='last_name'
              label='Last Name'
              rules={[{ required: true, message: 'Please enter Last Name' }]}
            >
              <Input placeholder='Last Name' />
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
                onChange={(e) => setGender(e.target.value)}
                defaultValue={gender}
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
              <DatePicker onChange={selectDob} />
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
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                placeholder='Select Country Code'
                getPopupContainer={(trigger) => trigger.parentNode}
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
                onChange={(e) => {
                  if (e > 9999999999) {
                    message.error('Mobile no. must be less than 10 digit only');
                  } else {
                    setMobile(e);
                  }
                }}
                max={10}
              />
            </Form.Item>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <Form.Item
              name='username'
              label='Username'
              rules={[{ required: true, message: 'Please Enter Username' }]}
            >
              <Input placeholder='Username' />
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
              <Input placeholder='Email' />
            </Form.Item>
          </div>
          <div className='col-md-4'>
            <Form.Item
              name='address'
              label='Address'
              rules={[{ required: true, message: 'Please Enter Address' }]}
            >
              <Input.TextArea rows={3} placeholder='Address' />
            </Form.Item>
          </div>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default UserDetails;
