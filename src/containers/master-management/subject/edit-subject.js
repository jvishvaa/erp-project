import React, { useContext, useState , useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Modal } from 'antd';


const EditSubject = ({ subjectData, handleGoBack, setLoading, open, showModal, handleOk, loading, setOpen }) => {
  const { id, subject_name, subject_description: desc, is_optional: opt } = subjectData;
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName, setSubjectName] = useState(subject_name || '');
  const [description, setDescription] = useState(desc || '');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [optional, setOptional] = useState(opt || false);

  const handleChange = (event) => {
    setOptional(event.target.checked);
  };

  useEffect(() => {
    setSubjectName(subject_name)

  }, [open])

  const handleCancel = () => {
    setOpen(false)
    setSubjectName('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let request = {};
    // request['subject_id'] = id;
    if (
      (subjectName !== subject_name && subjectName !== '') ||
      (description !== desc && description !== '') ||
      (optional !== opt && optional !== '')
    ) {
      if (subjectName !== subject_name && subjectName !== '')
        request['subject_name'] = subjectName;
      if (description !== desc && description !== '')
        request['subject_description'] = description;
      if (optional !== opt && optional !== '') request['is_optional'] = optional;

      axiosInstance
        .put(`${endpoints.masterManagement.updateSubject}${id}`, request)
        .then((result) => {
          if (result.data.status_code === 201) {
            handleGoBack();
            setSubjectName('');
            setDescription('');
            setOptional(false);
            setLoading(false);
            setOpen(false)
            setAlert('success', `Subject ${result.data.message || result.data.msg}`);
          } else {
            setLoading(false);
            setAlert('error', result.data.message || result.data.msg);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    } else {
      setAlert('error', 'No Fields to Update');
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={open}
      title="Edit Subject Name"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <div style={{ width: '95%', margin: '20px auto' }}>
      <TextField
        id='subname'
        label='Subject Name'
        variant='outlined'
        style={{ width: '100%' }}
        size='small'
        value={subjectName}
        inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
        name='subname'
        onChange={(e) => setSubjectName(e.target.value)}
      />
    </div>
    </Modal>
  );
};

export default EditSubject;
