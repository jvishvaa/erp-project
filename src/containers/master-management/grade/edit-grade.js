import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {  Modal } from 'antd';

const EditGrade = ({ id, name, type, handleGoBack, setLoading  , open , showModal ,handleOk , loading , setOpen }) => {
  console.log('idL', id , name , type);
  console.log('handlegoback:', handleGoBack);
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName, setGradeName] = useState(name);
  const [gradeType, setGradeType] = useState(type || '');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  useEffect(() => {
    setGradeName(name)

  },[open])

  const handleCancel = () => {
    setOpen(false)
    setGradeName('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let request = {};
    if (gradeName !== '' && gradeName !== name) request['grade_name'] = gradeName;
    if (gradeType !== '' && gradeType !== type) request['grade_type'] = gradeType;
    request['grade_id'] = id;

    if (
      (gradeName !== '' && gradeName !== name) ||
      (gradeType !== '' && gradeType !== type)
    ) {
      axiosInstance
        .put(`${endpoints.masterManagement.updateGrade}${id}`, request)
        .then((result) => {
          if (result.data.status_code > 199 && result.data.status_code < 300) {
            handleGoBack();
            handleCancel()
            setGradeName('');
            setGradeType('');
            setLoading(false);
            setAlert('success', `Grade ${result.data?.message || result.data?.msg}`);
          } else {
            setLoading(false);
            setAlert('error', result.data?.message || result.data?.msg);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    } else {
      setLoading(false);
      setAlert('error', 'No Fields to Update');
    }
  };

  return (
    <Modal
    visible={open}
    title="Edit Grade Name"
    onOk={handleSubmit}
    onCancel={handleCancel}
  >
      <div style={{ width: '95%', margin: '20px auto' }}>
              <TextField
                className='create__class-textfield'
                id='gradename'
                label='Grade Name'
                variant='outlined'
                style={{ width: '100%' }}
                size='small'
                inputProps={{ maxLength: 50 }}
                value={gradeName}
                name='gradename'
                onChange={(e) => setGradeName(e.target.value)}
              />
  
      </div>
    </Modal>
  );
};

export default EditGrade;
