import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import { InfoCircleFilled, UserOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import countryList from 'containers/user-management/list';
const FamilyInformation = ({
  singleParent,
  handleNext,
  handleBack,
  familyFormValues,
  setFamilyFormValues,
  guardian,
  setGuardian,
  userLevel,
  parent,
  setParent,
  handleSubmit,
  loading,
  editId,
  fatherPrimary,
  setFatherPrimary,
  motherPrimary,
  setMotherPrimary,
  guardianPrimary,
  setGuardianPrimary,
  fatherPrimaryEmail,
  setFatherPrimaryEmail,
  motherPrimaryEmail,
  setMotherPrimaryEmail,
  guardianPrimaryEmail,
  setGuardianPrimaryEmail,
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
    console.log(formValues, 'formValues');
    if (userLevel === 13) {
      if (!fatherPrimary && !motherPrimary && !guardianPrimary) {
        message.error('Select a contact number as primary!');
      }
      if (!fatherPrimaryEmail && !motherPrimaryEmail && !guardianPrimaryEmail) {
        message.error('Select an email as primary!');
      }
    }
    if (fatherPrimary && !formValues?.father_mobile) {
      message.error(`Enter Father's Contact Number!`);
      return;
    }
    if (motherPrimary && !formValues?.mother_mobile) {
      message.error(`Enter Mother's Contact Number!`);
      return;
    }
    if (guardianPrimary && !formValues?.guardian_mobile) {
      message.error(`Enter Guardian's Contact Number!`);
      return;
    }
    if (userLevel === 13) {
      if (
        !formValues.father_aadhaar &&
        !formValues.mother_aadhaar &&
        !formValues.guardian_aadhaar
      ) {
        message.error(`Either of Father's or Mother's or Guardian's aadhar is required!`);
        return;
      }
      if (
        !formValues.father_mobile &&
        !formValues.mother_mobile &&
        !formValues.guardian_mobile
      ) {
        message.error(
          `Either of Father's or Mother's or Guardian's Contact is required!`
        );
        return;
      }
      handleNext();
    } else {
      if (
        parent &&
        parent.length > 0 &&
        !formValues.father_aadhaar &&
        !formValues.mother_aadhaar &&
        !formValues.guardian_aadhaar
      ) {
        message.error(`Either of Father's or Mother's or Guardian's aadhar is required!`);
        return;
      }
      if (
        parent &&
        parent.length > 0 &&
        !formValues.father_mobile &&
        !formValues.mother_mobile &&
        !formValues.guardian_mobile
      ) {
        message.error(
          `Either of Father's or Mother's or Guardian's Contact is required!`
        );
        return;
      }
      handleSubmit({
        ...formValues,
        father_photo: selectedImageFather,
        mother_photo: selectedImageMother,
        guardian_photo: selectedImageGuardian,
      });
    }
  };
  const guardianOption = [
    { label: 'Parent', value: 'parent' },
    { label: 'Guardian', value: 'guardian' },
  ];
  let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png'];
  const countryCodeOptions = countryList?.map((each) => (
    <Select.Option key={each?.callingCode} value={each?.callingCode}>
      {/* {each?.country} ( */}
      {each?.callingCode}
    </Select.Option>
  ));
  return (
    <React.Fragment>
      <div
        className='px-2'
        style={{
          height: '60vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          background: '#F8F8F8',
        }}
      >
        <Form
          scrollToFirstError
          id='familyForm'
          ref={familyRef}
          onFinish={onSubmit}
          layout='vertical'
        >
          {userLevel !== 13 && (
            <Row gutter={24}>
              <Col>
                <Form.Item
                  label='Parent / Guardian'
                  style={{ margin: '0px' }}
                  name={'single'}
                >
                  <Checkbox.Group
                    options={guardianOption}
                    onChange={(e) => {
                      setParent(e);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          {/* FATHER DETAILS */}
          {(userLevel === 13 ||
            (userLevel !== 13 && parent && parent?.includes('parent'))) && (
            <>
              <Row gutter={24}>
                <Col className='py-2' md={24}>
                  <Form.Item
                    // required={
                    //   guardian === 'father' ||
                    //   !singleParent ||
                    //   (userLevel !== 13 &&(parent && parent?.includes('parent')))
                    // }
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
                          {selectedImageFather ? '' : 'No file uploaded'}
                        </div>
                        {selectedImageFather ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImageFather(null);
                            }}
                            type='primary'
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <>
                            <label
                              htmlFor='fatherPhoto'
                              className='ant-btn ant-btn-primary'
                              style={{ marginBottom: '0px' }}
                            >
                              Upload Image
                            </label>
                            <input
                              className='d-none'
                              type='file'
                              id='fatherPhoto'
                              accept='image/png, image/jpg, image/jpeg'
                              onChange={(event) => {
                                let file = event.target.files[0];
                                let imgType = event.target?.files[0]?.type;
                                if (allowedExtension.indexOf(imgType) === -1) {
                                  message.error(
                                    'Only image(.jpeg, .jpg, .png) is acceptable!'
                                  );
                                  return;
                                }
                                setSelectedImageFather(file);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col className='py-2' md={6}>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'father' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                        required:
                          guardian === 'father' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                        required:
                          guardian === 'father' ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
                        message: `Father's Email is required!`,
                      },
                    ]}
                    name='father_email'
                    label={
                      <Space align='end' className='th-primary-contact-check'>
                        {userLevel === 13 && (
                          <Form.Item
                            style={{ marginBottom: '0px' }}
                            className='mb-0 th-primary-contact-checkbox'
                            name={'father_primary_email'}
                          >
                            <Checkbox
                              checked={fatherPrimaryEmail}
                              onChange={(e) => {
                                setFatherPrimaryEmail(e.target.checked);
                                setMotherPrimaryEmail(false);
                                setGuardianPrimaryEmail(false);
                              }}
                              className='w-100 h-100'
                            />
                          </Form.Item>
                        )}
                        <div>Father's Email</div>
                        {userLevel === 13 && (
                          <Tooltip title={`Make Father's  Email as primary`}>
                            <InfoCircleFilled />
                          </Tooltip>
                        )}
                      </Space>
                    }
                  >
                    <Input className='w-100' />
                  </Form.Item>
                </Col>
                <Col className='py-2'>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'father' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                    <Col md={8} className=''>
                      <Space align='start'>
                        <Form.Item name={'father_mobile_code'} label='Code'>
                          <Select defaultValue={'+91'}>{countryCodeOptions}</Select>
                        </Form.Item>
                        <Form.Item
                          rules={[
                            {
                              required: false,
                              pattern: /^[0-9]{10}$/,
                              message: `Father's Contact Number is invalid!`,
                            },
                          ]}
                          name={'father_mobile'}
                          label={
                            <Space align='end' className='th-primary-contact-check'>
                              {userLevel === 13 && (
                                <Form.Item
                                  style={{ marginBottom: '0px' }}
                                  className='mb-0 th-primary-contact-checkbox'
                                  name={'father_primary'}
                                >
                                  <Checkbox
                                    checked={fatherPrimary}
                                    onChange={(e) => {
                                      setFatherPrimary(e.target.checked);
                                      setMotherPrimary(false);
                                      setGuardianPrimary(false);
                                    }}
                                    className='w-100 h-100'
                                  />
                                </Form.Item>
                              )}
                              <div>Contact Number</div>
                              {userLevel === 13 && (
                                <Tooltip
                                  title={`Make Father's contact number as primary`}
                                >
                                  <InfoCircleFilled />
                                </Tooltip>
                              )}
                            </Space>
                          }
                        >
                          <Input className='w-100' />
                        </Form.Item>
                      </Space>
                    </Col>
                    <Col md={6}>
                      <Form.Item
                        rules={[
                          {
                            required:
                              guardian === 'father' ||
                              !singleParent ||
                              (userLevel !== 13 && parent && parent?.includes('parent')),
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
                            required:
                              guardian === 'father' ||
                              !singleParent ||
                              (userLevel !== 13 && parent && parent?.includes('parent')),
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
                            required: false,
                            message: `Invalid Aadhar Number!`,
                            pattern: /^\d{12}$/,
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
            </>
          )}

          {/* MOTHER DETAILS */}
          {(userLevel === 13 ||
            (userLevel !== 13 && parent && parent?.includes('parent'))) && (
            <>
              <Row gutter={24}>
                <Col className='py-2' md={24}>
                  <Form.Item
                    // required={
                    //   guardian === 'mother' ||
                    //   !singleParent ||
                    //   (userLevel !== 13 &&(parent && parent?.includes('parent')))
                    // }
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
                          {selectedImageMother ? '' : 'No file uploaded'}
                        </div>
                        {selectedImageMother ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImageMother(null);
                            }}
                            type='primary'
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <>
                            <label
                              htmlFor='motherPhoto'
                              className='ant-btn ant-btn-primary mb-0'
                            >
                              Upload Image
                            </label>
                            <input
                              className='d-none'
                              type='file'
                              id='motherPhoto'
                              accept='image/png, image/jpg, image/jpeg'
                              onChange={(event) => {
                                let files = event.target.files[0];
                                let imgType = event.target?.files[0]?.type;
                                if (allowedExtension.indexOf(imgType) === -1) {
                                  message.error(
                                    'Only image(.jpeg, .jpg, .png) is acceptable!'
                                  );
                                  return;
                                }
                                setSelectedImageMother(files);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>

                <Col className='py-2' md={6}>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'mother' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                        required:
                          guardian === 'mother' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                        required:
                          guardian === 'mother' ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
                        message: `Mother's Email is required!`,
                      },
                    ]}
                    name='mother_email'
                    label={
                      <Space align='end' className='th-primary-contact-check'>
                        {userLevel === 13 && (
                          <Form.Item
                            style={{ marginBottom: '0px' }}
                            className='mb-0 th-primary-contact-checkbox'
                            name={'mother_primary_email'}
                          >
                            {userLevel === 13 && (
                              <Checkbox
                                checked={motherPrimaryEmail}
                                onChange={(e) => {
                                  setFatherPrimaryEmail(false);
                                  setMotherPrimaryEmail(e.target.checked);
                                  setGuardianPrimaryEmail(false);
                                }}
                                className='w-100 h-100'
                              />
                            )}
                          </Form.Item>
                        )}
                        <div>Mother's Email</div>
                        {userLevel === 13 && (
                          <Tooltip title={`Make Mother's  Email as primary`}>
                            <InfoCircleFilled />
                          </Tooltip>
                        )}
                      </Space>
                    }
                  >
                    <Input className='w-100' />
                  </Form.Item>
                </Col>
                <Col className='py-2'>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'mother' ||
                          !singleParent ||
                          (userLevel !== 13 && parent && parent?.includes('parent')),
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
                    <Col md={8} className=''>
                      <Space>
                        <Form.Item name={'mother_mobile_code'} label='Code'>
                          <Select defaultValue={'+91'}>{countryCodeOptions}</Select>
                        </Form.Item>
                        <Form.Item
                          rules={[
                            {
                              required: false,
                              pattern: /^[0-9]{10}$/,
                              message: `Mother's Contact Number is invalid!`,
                            },
                          ]}
                          name={'mother_mobile'}
                          label={
                            <Space align='end' className='th-primary-contact-check'>
                              <Form.Item
                                style={{ marginBottom: '0px' }}
                                className='mb-0 th-primary-contact-checkbox'
                                name={'mother_primary'}
                              >
                                {userLevel === 13 && (
                                  <Checkbox
                                    checked={motherPrimary}
                                    onChange={(e) => {
                                      setFatherPrimary(false);
                                      setMotherPrimary(e.target.checked);
                                      setGuardianPrimary(false);
                                    }}
                                    className='w-100 h-100'
                                  />
                                )}
                              </Form.Item>
                              <div>Contact Number</div>
                              {userLevel === 13 && (
                                <Tooltip
                                  title={`Make Mother's contact number as primary`}
                                >
                                  <InfoCircleFilled />
                                </Tooltip>
                              )}
                            </Space>
                          }
                        >
                          <Input className='w-100' />
                        </Form.Item>
                      </Space>
                    </Col>
                    <Col md={6}>
                      <Form.Item
                        rules={[
                          {
                            required:
                              guardian === 'mother' ||
                              !singleParent ||
                              (userLevel !== 13 && parent && parent?.includes('parent')),
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
                            required:
                              guardian === 'mother' ||
                              !singleParent ||
                              (userLevel !== 13 && parent && parent?.includes('parent')),
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
                            required: false,
                            message: `Invalid Aadhar Number!`,
                            pattern: /^\d{12}$/,
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
            </>
          )}

          {/* GUARDIAN DETAILS */}
          {((userLevel === 13 && singleParent) ||
            (userLevel !== 13 && parent && parent?.includes('guardian'))) && (
            <>
              <Row gutter={24}>
                <Col className='py-2' md={24}>
                  <Form.Item label="Guardian's Image">
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
                          {selectedImageGuardian ? '' : 'No file uploaded'}
                        </div>
                        {selectedImageGuardian ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImageGuardian(null);
                            }}
                            type='primary'
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <>
                            <label
                              htmlFor='guardianPhoto'
                              className='ant-btn ant-btn-primary mb-0'
                            >
                              Upload Image
                            </label>
                            <input
                              className='d-none'
                              type='file'
                              id='guardianPhoto'
                              accept='image/png, image/jpg, image/jpeg'
                              onChange={(event) => {
                                let files = event.target.files[0];
                                let imgType = event.target?.files[0]?.type;
                                if (allowedExtension.indexOf(imgType) === -1) {
                                  message.error(
                                    'Only image(.jpeg, .jpg, .png) is acceptable!'
                                  );
                                  return;
                                }
                                setSelectedImageGuardian(files);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col className='py-2' md={6}>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'guardian' ||
                          (userLevel !== 13 && parent && parent?.includes('guardian')),
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
                        required:
                          guardian === 'guardian' ||
                          (userLevel !== 13 && parent && parent?.includes('guardian')),
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
                        required:
                          guardian === 'guardian' ||
                          (userLevel !== 13 && parent && parent?.includes('guardian')),
                        message: `Guardian's Email is required!`,
                      },
                    ]}
                    name='guardian_email'
                    label={
                      <Space align='end' className='th-primary-contact-check'>
                        {userLevel === 13 && (
                          <Form.Item
                            style={{ marginBottom: '0px' }}
                            className='mb-0 th-primary-contact-checkbox'
                            name={'guardian_primary_email'}
                          >
                            <Checkbox
                              checked={guardianPrimaryEmail}
                              onChange={(e) => {
                                setFatherPrimaryEmail(false);
                                setMotherPrimaryEmail(false);
                                setGuardianPrimaryEmail(e.target.checked);
                              }}
                              className='w-100 h-100'
                            />
                          </Form.Item>
                        )}
                        <div>Guardian's Email</div>
                        {userLevel === 13 && (
                          <Tooltip title={`Make Guardian's  Email as primary`}>
                            <InfoCircleFilled />
                          </Tooltip>
                        )}
                      </Space>
                    }
                  >
                    <Input className='w-100' />
                  </Form.Item>
                </Col>
                <Col className='py-2'>
                  <Form.Item
                    rules={[
                      {
                        required:
                          guardian === 'guardian' ||
                          (userLevel !== 13 && parent && parent?.includes('guardian')),
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
                    <Col md={8} className=''>
                      <Space align='start'>
                        <Form.Item name={'guardian_mobile_code'} label='Code'>
                          <Select defaultValue={'+91'}>{countryCodeOptions}</Select>
                        </Form.Item>
                        <Form.Item
                          rules={[
                            {
                              required: false,
                              pattern: /^[0-9]{10}$/,
                              message: `Guardian's Contact Number is invalid!`,
                            },
                          ]}
                          name={'guardian_mobile'}
                          label={
                            <Space align='end' className='th-primary-contact-check'>
                              {userLevel === 13 && (
                                <Form.Item
                                  style={{ marginBottom: '0px' }}
                                  className='mb-0 th-primary-contact-checkbox'
                                  name={'guardian_primary'}
                                >
                                  <Checkbox
                                    checked={guardianPrimary}
                                    onChange={(e) => {
                                      setFatherPrimary(false);
                                      setMotherPrimary(false);
                                      setGuardianPrimary(e.target.checked);
                                    }}
                                    className='w-100 h-100'
                                  />
                                </Form.Item>
                              )}
                              <div>Contact Number</div>
                              {userLevel === 13 && (
                                <Tooltip
                                  title={`Make Guardian's contact number as primary`}
                                >
                                  <InfoCircleFilled />
                                </Tooltip>
                              )}
                            </Space>
                          }
                        >
                          <Input className='w-100' />
                        </Form.Item>
                      </Space>
                    </Col>
                    <Col md={6}>
                      <Form.Item
                        rules={[
                          {
                            required:
                              guardian === 'guardian' ||
                              (userLevel !== 13 &&
                                parent &&
                                parent?.includes('guardian')),
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
                            required:
                              guardian === 'guardian' ||
                              (userLevel !== 13 &&
                                parent &&
                                parent?.includes('guardian')),
                            message: `Guardian's Occupation is required!`,
                          },
                        ]}
                        name='guardian_occupation'
                        label="Guardian's Occupation"
                      >
                        <Input className='' />
                      </Form.Item>
                    </Col>
                    {/* 
                    <Col md={6}>
                      <Form.Item
                        rules={[
                          {
                            required: false,
                            pattern: /^[0-9]{10}$/,
                            message: `Guardian's Contact Number is invalid!`,
                          },
                        ]}
                        name={'guardian_mobile'}
                        label='Contact Number'
                      >
                        <Input className='' />
                      </Form.Item>
                    </Col> */}
                    <Col md={6}>
                      <Form.Item
                        rules={[
                          {
                            required: false,
                            message: `Invalid Aadhar Number!`,
                            pattern: /^\d{12}$/,
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
              <Divider />
            </>
          )}
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
            {userLevel !== 13 && (
              <Col md={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid Email!',
                    },
                  ]}
                  name={'email'}
                  label='Email Id'
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row className='py-2' gutter={24}>
            {userLevel !== 13 && (
              <Col md={8} className='py-2'>
                <Space align='start'>
                  <Form.Item name={'contact_code'} label='Code'>
                    <Select defaultValue={'+91'}>{countryCodeOptions}</Select>
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]{10}$/,
                        message: 'Contact Number is invalid!',
                      },
                    ]}
                    name={'contact'}
                    required
                    label='Contact Number'
                  >
                    <Input className='w-100' />
                  </Form.Item>
                </Space>
              </Col>
            )}
            {/* <Col md={6}>
              <Form.Item label='Alternative Contact Number'>
                <Input />
              </Form.Item>
            </Col> */}
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
        {userLevel !== 13 ? (
          <Button
            htmlType='submit'
            form='familyForm'
            className='ml-3 px-4'
            type='primary'
            loading={loading}
          >
            {editId ? 'Update' : 'Submit'}
          </Button>
        ) : (
          <Button
            htmlType='submit'
            form='familyForm'
            className='ml-3 px-4'
            type='primary'
          >
            Next
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};

export default FamilyInformation;
