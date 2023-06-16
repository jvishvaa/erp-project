import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Upload,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import moment from 'moment/moment';
const StudentInformation = ({
  handleNext,
  handleBack,
  studentFormValues,
  setStudentFormValues,
  singleParent,
  setSingleParent,
  guardian,
  setGuardian,
  userLevel,
  setParent,
}) => {
  const studentForm = useRef();
  useEffect(() => {
    if (studentFormValues && Object.keys(studentFormValues).length > 0) {
      studentForm.current.setFieldsValue(studentFormValues);
      if (studentFormValues?.profile_photo && !studentFormValues?.profile) {
        setSelectedImage(studentFormValues?.profile_photo);
      } else {
        if (studentFormValues?.profile) {
          setPhoto(studentFormValues?.profile);
          setSelectedImage(URL.createObjectURL(studentFormValues?.profile));
        }
      }
    }
  }, []);
  const [photo, setPhoto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png'];
    let imgType = event.target?.files[0]?.type;
    if (allowedExtension.indexOf(imgType) === -1) {
      message.error('Only image(.jpeg, .jpg, .png) is acceptable!');
      return;
    }
    setPhoto(file);
    setSelectedImage(URL.createObjectURL(file));
  };
  const handleSubmit = (formValues) => {
    setStudentFormValues({
      ...formValues,
      profile: photo,
      profile_photo: studentFormValues?.profile_photo ?? '',
    });
    handleNext();
  };
  console.log(photo, 'khg7hggf');
  return (
    <React.Fragment>
      <div
        className='px-2'
        style={{
          height: '70vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          background: '#F8F8F8',
        }}
      >
        <Form
          ref={studentForm}
          id='studentForm'
          onFinish={handleSubmit}
          layout='vertical'
        >
          <Row gutter={24}>
            <Col className='py-2' md={24}>
              <Form.Item label={(userLevel === 13 ? 'Student' : 'User') + ' Image'}>
                <div className='d-flex align-items-end'>
                  {selectedImage ? (
                    <Avatar shape='square' src={selectedImage} size={80} />
                  ) : (
                    <Avatar shape='square' icon={<UserOutlined />} size={80} />
                  )}
                  {!photo && !selectedImage ? (
                    <div className='pl-3'>
                      <div className='pb-1'>No file uploaded</div>
                      <label
                        style={{ marginBottom: '0px' }}
                        htmlFor='profile'
                        className='ant-btn ant-btn-primary'
                      >
                        Upload Image
                      </label>
                      <input
                        id='profile'
                        className='d-none'
                        type='file'
                        accept='image/png, image/jpg, image/jpeg'
                        onChange={handlePhotoChange}
                      />
                    </div>
                  ) : (
                    <div className='pl-3'>
                      {/* <div className='pb-1'>{photo && photo?.name}</div> */}
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setPhoto(null);
                          setSelectedImage(null);
                        }}
                        type='primary'
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col className='py-2' md={8}>
              <Form.Item
                name={'first_name'}
                rules={[{ required: true, message: 'First name is required!' }]}
                label='First Name'
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            {/* <Col md={1} /> */}
            <Col className='py-2' md={8}>
              <Form.Item name={'middle_name'} label='Middle Name'>
                <Input className='w-100' />
              </Form.Item>
            </Col>
            {/* <Col md={1} /> */}
            <Col className='py-2' md={8}>
              <Form.Item
                rules={[{ required: true, message: 'Last name is required!' }]}
                name={'last_name'}
                label='Last Name'
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col className='py-2' md={24}>
              <Form.Item
                label='Gender'
                name={'gender'}
                rules={[{ required: true, message: 'Gender is required!' }]}
              >
                <Radio.Group>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                  <Radio value={3}>Others</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={6} className='py-2'>
              <Form.Item
                name={'date_of_birth'}
                rules={[{ required: true, message: 'Date of Birth is required!' }]}
                label='Date of Birth'
              >
                <DatePicker
                  className='w-100'
                  inputReadOnly={true}
                  onChange={(e) => {
                    studentForm.current.setFieldsValue({
                      age: moment().diff(moment(e), 'years'),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col md={2} className='py-2'>
              <Form.Item
                rules={[{ required: true, message: 'Age is required!' }]}
                name={'age'}
                label='Age'
              >
                <InputNumber className='w-100' disabled />
              </Form.Item>
            </Col>

            {userLevel === 13 && (
              <>
                <Col md={8} className='py-2'>
                  <Form.Item name={'birth_place'} label='Place of Birth'>
                    <Input className='w-100' />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col md={24}>
              <Row gutter={24}>
                {userLevel === 13 && (
                  <Col md={8} className='py-2'>
                    <Form.Item name={'old_school_name'} label='Previous School Name'>
                      <Input className='' />
                    </Form.Item>
                  </Col>
                )}
                <Col md={8} className='py-2'>
                  <Form.Item
                    rules={[
                      {
                        required: false,
                        pattern: /^\d+_[A-Za-z]{3}$/,
                        message: 'Enter username in the format 2021000001_XYZ',
                      },
                    ]}
                    name={'username'}
                    label='Username'
                  >
                    <Input className='w-100' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            {userLevel === 13 && (
              <Col md={24}>
                <Row gutter={24}>
                  <Col className='py-2' md={8}>
                    <Form.Item
                      name={'special_needs'}
                      label='1. Any Special Needs for the Child'
                    >
                      <Input className='w-100 ' />
                    </Form.Item>
                  </Col>
                  <Col className='py-2' md={8}>
                    <Form.Item
                      name={'medical_info'}
                      label='2. Allergy/Injury Information'
                    >
                      <Input className='w-100 ' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            )}

            {/* <Col md={24}>
              <Row className='py-2' gutter={24}>
                <Col md={8}>
                  <Form.Item label='Student Aadhar Number'>
                    <Input className='' />
                  </Form.Item>
                </Col>
              </Row>
            </Col> */}
          </Row>
          {userLevel === 13 && (
            <Row align='middle' gutter={24}>
              <Col className='py-2' md={12}>
                <div>
                  <div className='pb-1'>Note *</div>
                  <div className='d-flex th-padding-card align-items-center'>
                    <div className=''>Does the student have a single parent?</div>
                    <Form.Item
                      rules={[{ required: true, message: 'Please select!' }]}
                      style={{ margin: '0px' }}
                      name={'single'}
                    >
                      <Radio.Group
                        onChange={(e) => setSingleParent(e.target.value)}
                        className='pl-2'
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
              </Col>
              {singleParent && (
                <Col
                  className='py-2 pt-4 d-flex  align-items-center th-form-bottom-0'
                  md={12}
                >
                  <div className=''>Select</div>
                  <Form.Item
                    rules={[{ required: true, message: 'Please select parent' }]}
                    name={'single_parent'}
                  >
                    <Radio.Group
                      label=''
                      value={guardian}
                      onChange={(e) => {
                        setGuardian(e.target.value);
                      }}
                      className='pl-3'
                    >
                      <Radio value={'father'}>Father</Radio>
                      <Radio value={'mother'}>Mother</Radio>
                      <Radio value={'guardian'}>Guardian</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
            </Row>
          )}
        </Form>
      </div>
      <div
        // style={{ position: 'sticky', bottom: '59px' }}
        className='d-flex justify-content-end align-items-center my-4'
      >
        <Button
          onClick={() => {
            let formValues = studentForm.current.getFieldsValue();
            setStudentFormValues({ ...formValues, profile: photo });
            handleBack();
          }}
          className='ml-3 px-4'
        >
          Back
        </Button>
        <Button htmlType='submit' form='studentForm' className='ml-3 px-4' type='primary'>
          Next
        </Button>
      </div>
    </React.Fragment>
  );
};

export default StudentInformation;
