import { Breadcrumb, Button, Form, Input, Progress, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../containers/Layout';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import endpoints from '../../../config/endpoints';
import axios from './../../config/axios';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'config/axios';

const ChangePasswordPopup = ({
  isPasswordSubmit,
  setIsPasswordSubmit,
  userId,
  loading,
  setLoading,
  strengthProgress,
  setStrengthProgress,
  isPasswordCanceled,
  setIsPasswordCanceled,
  redirectPath,
}) => {
  const passwordFormRef = useRef();
  const [strengthColor, setStrengthColor] = useState('#f8222f');
  const [validationCheck, setValidationCheck] = useState(null);
  const history = useHistory();

  let userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const { erp: erpId, role_details } = userDetails;

  let passwordInstructions = [
    {
      isChecked: validationCheck?.length ? true : false,
      instructions: 'New password must contain atleast 8 character.',
    },
    {
      isChecked: validationCheck?.hasUpperCase ? true : false,
      instructions: 'New password must contain atleast 1 capital letter.',
    },
    {
      isChecked: validationCheck?.hasLowerCase ? true : false,
      instructions: 'New password must contain atleast 1 small letter.',
    },
    {
      isChecked: validationCheck?.hasDigit ? true : false,
      instructions: 'New password must contain atleast 1 number.',
    },
    {
      isChecked: validationCheck?.hasSpecialChar ? true : false,
      instructions: 'New password must contain atleast 1 special character.',
    },
    {
      isChecked: validationCheck?.sameAsErp ? true : false,
      instructions: 'New password should not be same as your ERP ID.',
    },
  ];

  const checkPasswordStrength = (passwordValue) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
      sameAsErp: false,
    };

    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);
    strengthChecks.sameAsErp = passwordValue == erpId || !passwordValue ? false : true;

    setValidationCheck(strengthChecks);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length == 6 ? 'Strong' : verifiedList.length >= 3 ? 'Medium' : 'Weak';

    setStrengthColor(
      verifiedList.length == 6
        ? '#20c51c'
        : verifiedList.length >= 3
        ? '#ff9922'
        : '#f8222f'
    );

    setStrengthProgress(`${(verifiedList.length / 6) * 100}`);
  };

  useEffect(() => {
    if (isPasswordSubmit) {
      updatePassword();
    }
  }, [isPasswordSubmit]);

  useEffect(() => {
    if (isPasswordCanceled) {
      cancelPasswordUpdate();
    }
  }, [isPasswordCanceled]);

  const updatePassword = () => {
    setLoading(true);
    const updatedValues = passwordFormRef.current.getFieldsValue();

    if (updatedValues.new_password !== updatedValues.confirm_password) {
      message.error('New password and confirm password did not match');
      setLoading(false);
      return;
    }

    axiosInstance
      .post(`${endpoints.userManagement.passwordChange}`, {
        user_id: userId,
        password: updatedValues.new_password,
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);
          cancelPasswordUpdate();
          history.push(redirectPath);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        setIsPasswordSubmit(false);
      });
  };

  const customFormat = (percent) => {
    if (percent > 0 && percent < 59) {
      return (
        <span className='text-center'>
          {parseInt(strengthProgress).toFixed(0)} % <br /> Weak
        </span>
      );
    } else if (percent >= 60 && percent < 99) {
      return (
        <span className='text-center'>
          {parseInt(strengthProgress).toFixed(0)} % <br /> Medium
        </span>
      );
    } else {
      return (
        <span className='text-center'>
          {parseInt(strengthProgress).toFixed(0)} % <br /> Strong
        </span>
      );
    }
  };

  const cancelPasswordUpdate = () => {
    // passwordFormRef.current.resetFields();
    setStrengthProgress('');
    setStrengthColor('#f8222f');
    setValidationCheck(null);
    setIsPasswordCanceled(false);
    setIsPasswordSubmit(false);
  };

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-12'>
          <div className=' py-3 px-2 mb-3'>
            <div className='row flex-row-reverse'>
              <div className='col-md-6 col-12 mb-3'>
                <h6 className='mt-3'>Instructions:</h6>
                <ul style={{ listStyle: 'none' }}>
                  {Array.isArray(passwordInstructions) &&
                    passwordInstructions.length > 0 &&
                    passwordInstructions.map((item, index) => (
                      <li className='pb-2' key={index}>
                        {item.isChecked ? (
                          <CheckCircleOutlined className='th-green mr-1' />
                        ) : (
                          <CloseCircleOutlined className='th-red mr-1' />
                        )}{' '}
                        {item.instructions}
                      </li>
                    ))}
                </ul>
              </div>
              <div className='col-md-6 col-12  mb-3'>
                <Form
                  id='passwordForm'
                  ref={passwordFormRef}
                  layout={'vertical'}
                  onFinish={updatePassword}
                >
                  <div className='row py-2 text-left'>
                    <div className='col-12 pb-1'>
                      <Form.Item
                        name='new_password'
                        label='New Password'
                        rules={[{ required: true, message: 'Please enter new password' }]}
                        onChange={(e) => {
                          checkPasswordStrength(e.target.value);
                        }}
                      >
                        <Input.Password placeholder='Enter new password' />
                      </Form.Item>
                    </div>
                    <div className='col-12 pb-1'>
                      <Form.Item
                        name='confirm_password'
                        label='Confirm Password'
                        rules={[
                          { required: true, message: 'Please confirm new password' },
                        ]}
                      >
                        <Input.Password placeholder='Confirm new password' />
                      </Form.Item>
                    </div>

                    {parseInt(strengthProgress) > 0 && (
                      <div className='col-12 pb-3'>
                        <Progress
                          percent={strengthProgress}
                          strokeColor={strengthColor}
                          format={customFormat}
                          style={{ width: '97%' }}
                        />
                      </div>
                    )}

                    {/* <div className='col-12 d-flex justify-content-end'>
                      <Button
                        key='back'
                        className='th-br-4'
                        onClick={cancelPasswordUpdate}
                      >
                        Cancel
                      </Button>
                      <Button
                        key='submit'
                        className='th-br-4 ml-2'
                        type='primary'
                        form='passwordForm'
                        htmlType='submit'
                        loading={loading}
                        disabled={strengthProgress != '100' ? true : false}
                      >
                        Update Password
                      </Button>
                    </div> */}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChangePasswordPopup;
