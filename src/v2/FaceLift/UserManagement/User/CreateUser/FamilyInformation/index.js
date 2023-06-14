import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Col, Divider, Form, Input, InputNumber, Radio, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
const FamilyInformation = ({
  singleParent,
  handleNext,
  handleBack,
  familyFormValues,
  setFamilyFormValues,
  guardian,
  setGuardian,
}) => {
  useEffect(() => {
    if (familyFormValues && Object.keys(familyFormValues).length > 0) {
      familyRef.current.setFieldsValue(familyFormValues);
      if (familyFormValues?.father_photo) {
        setSelectedImageFather(familyFormValues?.father_photo);
      }
      if (familyFormValues?.mother_photo) {
        setSelectedImageMother(familyFormValues?.mother_photo);
      }
      if (familyFormValues?.guardian_photo) {
        setSelectedImageGuardian(familyFormValues?.guardian_photo);
      }
    }
  }, []);
  const familyRef = useRef();
  const [selectedImageFather, setSelectedImageFather] = useState(null);
  const [selectedImageMother, setSelectedImageMother] = useState(null);
  const [selectedImageGuardian, setSelectedImageGuardian] = useState(null);
  const onSubmit = (formValues) => {
    setFamilyFormValues({
      ...formValues,
      father_photo: selectedImageFather,
      mother_photo: selectedImageMother,
      guardian_photo: selectedImageGuardian,
    });
    handleNext();
  };
  return (
    <React.Fragment>
      <div
        className=''
        style={{
          height: '70vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          background: '#F8F8F8',
        }}
      >
        <Form id='familyForm' ref={familyRef} onFinish={onSubmit} layout='vertical'>
          {/* FATHER DETAILS */}
          <Row gutter={24}>
            {/* {singleParent && (
              <Col className='py-2' md={24}>
                Select
                <Radio.Group
                  value={guardian}
                  onChange={(e) => {
                    setGuardian(e.target.value);
                  }}
                  className='pt-2 pb-3 pl-3'
                >
                  <Radio value={'father'}>Father</Radio>
                  <Radio value={'mother'}>Mother</Radio>
                  <Radio value={'guardian'}>Guardian</Radio>
                </Radio.Group>
              </Col>
            )} */}
            <Col className='py-2' md={24}>
              <Form.Item
                required={guardian === 'father' || !singleParent}
                label="Father's Image"
              >
                <div className='d-flex align-items-end'>
                  {selectedImageFather ? (
                    <Avatar
                      shape='square'
                      src={
                        typeof selectedImageFather === 'string'
                          ? selectedImageFather
                          : URL.createObjectURL(selectedImageFather)
                      }
                      size={80}
                    />
                  ) : (
                    <Avatar shape='square' icon={<UserOutlined />} size={80} />
                  )}
                  <div className='pl-3'>
                    <div className='pb-1'>
                      {selectedImageFather
                        ? selectedImageFather?.name
                        : 'No file uploaded'}
                    </div>
                    <label htmlFor='fatherPhoto' className='ant-btn ant-btn-primary'>
                      Upload Image
                    </label>
                    <input
                      className='d-none'
                      type='file'
                      id='fatherPhoto'
                      onChange={(event) => {
                        let files = event.target.files[0];
                        setSelectedImageFather(files);
                      }}
                    />
                  </div>
                </div>
              </Form.Item>
            </Col>
            <Col className='py-2' md={6}>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'father' || !singleParent,
                    message: `Father's First Name is required!`,
                  },
                ]}
                name={'father_first_name'}
                label="Father's First Name"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col className='py-2' md={6}>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'father' || !singleParent,
                    message: `Father's Last Name is required!`,
                  },
                ]}
                name={'father_last_name'}
                label="Father's Last Name"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>

            <Col md={6} className='py-2'>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'father',
                    message: `Father's Email is required!`,
                  },
                ]}
                name='father_email'
                label="Father's Email"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col className='py-2'>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'father' || !singleParent,
                    message: `Father's Age is required!`,
                  },
                ]}
                name='father_age'
                label="Father's Age"
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col className='py-2' md={24}>
              <Row gutter={24}>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'father' || !singleParent,
                        message: `Father's Qualification is required!`,
                      },
                    ]}
                    name='father_qualification'
                    label="Father's Qualification"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'father' || !singleParent,
                        message: `Father's Occupation is required!`,
                      },
                    ]}
                    name='father_occupation'
                    label="Father's Occupation"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'father' || !singleParent,
                        message: `Father's Contact Number is required!`,
                      },
                    ]}
                    name={'father_mobile'}
                    label="Father's Contact Number"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'father' || !singleParent,
                        message: `Father's Contact Number is Aadhaar Number!`,
                      },
                    ]}
                    name='father_aadhaar'
                    label="Father's Aadhaar Number"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          {/* MOTHER DETAILS */}
          <Row gutter={24}>
            <Col className='py-2' md={24}>
              <Form.Item
                required={guardian === 'mother' || !singleParent}
                label="Mother's Image"
              >
                <div className='d-flex align-items-end'>
                  {selectedImageMother ? (
                    <Avatar
                      shape='square'
                      src={
                        typeof selectedImageMother === 'string'
                          ? selectedImageMother
                          : URL.createObjectURL(selectedImageMother)
                      }
                      size={80}
                    />
                  ) : (
                    <Avatar shape='square' icon={<UserOutlined />} size={80} />
                  )}
                  <div className='pl-3'>
                    <div className='pb-1'>
                      {selectedImageMother
                        ? selectedImageMother?.name
                        : 'No file uploaded'}
                    </div>
                    <label htmlFor='motherPhoto' className='ant-btn ant-btn-primary'>
                      Upload Image
                    </label>
                    <input
                      className='d-none'
                      type='file'
                      id='motherPhoto'
                      onChange={(event) => {
                        let files = event.target.files[0];
                        setSelectedImageMother(files);
                      }}
                    />
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col className='py-2' md={6}>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'mother' || !singleParent,
                    message: `Mother's First Name is required!`,
                  },
                ]}
                name={'mother_first_name'}
                label="Mother's First Name"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col className='py-2' md={6}>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'mother' || !singleParent,
                    message: `Mother's Last Name is required!`,
                  },
                ]}
                name={'mother_last_name'}
                label="Mother's Last Name"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>

            <Col md={6} className='py-2'>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'mother',
                    message: `Mother's Email is required!`,
                  },
                ]}
                name='mother_email'
                label="Mother's Email"
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col className='py-2'>
              <Form.Item
                rules={[
                  {
                    required: guardian === 'mother' || !singleParent,
                    message: `Mother's Age is required!`,
                  },
                ]}
                name='mother_age'
                label="Mother's Age"
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col className='py-2' md={24}>
              <Row gutter={24}>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'mother' || !singleParent,
                        message: `Mother's Qualification is required!`,
                      },
                    ]}
                    name='mother_qualification'
                    label="Mother's Qualification"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'mother' || !singleParent,
                        message: `Mother's Occupation is required!`,
                      },
                    ]}
                    name='mother_occupation'
                    label="Mother's Occupation"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'mother' || !singleParent,
                        message: `Mother's Contact Number is required!`,
                      },
                    ]}
                    name={'mother_mobile'}
                    label="Mother's Contact Number"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    rules={[
                      {
                        required: guardian === 'mother' || !singleParent,
                        message: `Mother's Aadhaar Number is required!`,
                      },
                    ]}
                    name='mother_aadhaar'
                    label="Mother's Aadhaar Number"
                  >
                    <Input className='' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          {/* GUARDIAN DETAILS */}
          {singleParent && (
            <Row gutter={24}>
              <Col className='py-2' md={24}>
                <Form.Item required={guardian === 'guardian'} label="Guardian's Image">
                  <div className='d-flex align-items-end'>
                    {selectedImageGuardian ? (
                      <Avatar
                        shape='square'
                        src={
                          typeof selectedImageGuardian === 'string'
                            ? selectedImageGuardian
                            : URL.createObjectURL(selectedImageGuardian)
                        }
                        size={80}
                      />
                    ) : (
                      <Avatar shape='square' icon={<UserOutlined />} size={80} />
                    )}
                    <div className='pl-3'>
                      <div className='pb-1'>
                        {selectedImageGuardian
                          ? selectedImageGuardian?.name
                          : 'No file uploaded'}
                      </div>
                      <label htmlFor='guardianPhoto' className='ant-btn ant-btn-primary'>
                        Upload Image
                      </label>
                      <input
                        className='d-none'
                        type='file'
                        id='guardianPhoto'
                        onChange={(event) => {
                          let files = event.target.files[0];
                          setSelectedImageGuardian(files);
                        }}
                      />
                    </div>
                  </div>
                </Form.Item>
              </Col>
              <Col className='py-2' md={6}>
                <Form.Item
                  rules={[
                    {
                      required: guardian === 'guardian',
                      message: `Guardian's First Name is required!`,
                    },
                  ]}
                  name={'guardian_first_name'}
                  label="Guardian's First Name"
                >
                  <Input className='w-100' />
                </Form.Item>
              </Col>
              <Col className='py-2' md={6}>
                <Form.Item
                  rules={[
                    {
                      required: guardian === 'guardian',
                      message: `Guardian's Last Name is required!`,
                    },
                  ]}
                  name={'guardian_last_name'}
                  label="Guardian's Last Name"
                >
                  <Input className='w-100' />
                </Form.Item>
              </Col>

              <Col md={6} className='py-2'>
                <Form.Item
                  rules={[
                    {
                      required: guardian === 'guardian',
                      message: `Guardian's Email is required!`,
                    },
                  ]}
                  name='guardian_email'
                  label="Guardian's Email"
                >
                  <Input className='w-100' />
                </Form.Item>
              </Col>
              <Col className='py-2'>
                <Form.Item
                  rules={[
                    {
                      required: guardian === 'guardian',
                      message: `Guardian's Age is required!`,
                    },
                  ]}
                  name='guardian_age'
                  label="Guardian's Age"
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col className='py-2' md={24}>
                <Row gutter={24}>
                  <Col md={6}>
                    <Form.Item
                      rules={[
                        {
                          required: guardian === 'guardian',
                          message: `Guardian's Qualification is required!`,
                        },
                      ]}
                      name='guardian_qualification'
                      label="Guardian's Qualification"
                    >
                      <Input className='' />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item
                      rules={[
                        {
                          required: guardian === 'guardian',
                          message: `Guardian's Occupation is required!`,
                        },
                      ]}
                      name='guardian_occupation'
                      label="Guardian's Occupation"
                    >
                      <Input className='' />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item
                      rules={[
                        {
                          required: guardian === 'guardian',
                          message: `Guardian's Contact Number is required!`,
                        },
                      ]}
                      name={'guardian_mobile'}
                      label="Guardian's Contact Number"
                    >
                      <Input className='' />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item
                      rules={[
                        {
                          required: guardian === 'guardian',
                          message: `Guardian's Aadhaar Number is required!`,
                        },
                      ]}
                      name={'guardian_aadhaar'}
                      label="Guardian's Aadhaar Number"
                    >
                      <Input className='' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <Divider />
          {/* ADDRESS/PHONE DETAILS  */}
          <Row className='py-2' gutter={24}>
            <Col md={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Address is required!',
                  },
                ]}
                name={'address'}
                label='Address'
              >
                <TextArea rows={4} className='w-100' />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Pincode is required!',
                  },
                ]}
                name={'pin_code'}
                label='Pincode'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Email is required!',
                  },
                ]}
                name={'email'}
                label='Email Id'
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row className='py-2' gutter={24}>
            <Col md={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Contact Number is required!',
                  },
                ]}
                name={'contact'}
                required
                label='Contact Number'
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label='Alternative Contact Number'>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div
        // style={{ position: 'sticky', bottom: '59px' }}
        className='d-flex justify-content-end align-items-center my-4'
      >
        <Button
          onClick={() => {
            let formValues = familyRef.current.getFieldsValue();
            setFamilyFormValues({
              ...formValues,
              father_photo: selectedImageFather,
              mother_photo: selectedImageMother,
              guardian_photo: selectedImageGuardian,
            });
            handleBack();
          }}
          className='ml-3 px-4'
          // type='primary'
        >
          Back
        </Button>
        <Button htmlType='submit' form='familyForm' className='ml-3 px-4' type='primary'>
          Next
        </Button>
      </div>
    </React.Fragment>
  );
};

export default FamilyInformation;
