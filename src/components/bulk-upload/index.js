/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import React, { useEffect, useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Autocomplete } from '@material-ui/lab';
import axios from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const BulkUpload = ({ onUploadSuccess }) => {
  const [branch, setBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [year, setYear] = useState(null);
  const [yearList, setYearList] = useState([]);
  const [file, setFile] = useState(null);

  const { setAlert } = useContext(AlertNotificationContext);

  const getBranches = async () => {
    try {
      const data = await axios.get('erp_user/branch/');
      setBranchList(data.data.data);
    } catch (error) {
      console.log('failed to load branches');
    }
  };

  const getYears = async () => {
    try {
      const data = await axios.get('erp_user/list-academic_year/');
      setYearList(data.data.data);
    } catch (error) {
      console.log('failed to load years');
    }
  };

  useEffect(() => {
    getBranches();
    getYears();
  }, []);

  const handleFileChange = (event) => {
    const { files } = event.target;
    const file = files[0];
    setFile(file);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('academic_year', year);
      formData.append('branch', branch);
      await axios.post('/erp_user/upload_bulk_user/', formData);
      setBranch(null);
      setYear(null);
      setFile(null);
      onUploadSuccess();
      setAlert('success', 'File uploaded successfully');
    } catch (error) {
      setAlert('error', 'Failed to upload');
    }
  };

  const handleBranchChange = (event, data) => {
    setBranch(data?.id);
  };

  const handleYearChange = (event, data) => {
    setYear(data?.id);
  };
  return (
    <Grid container spacing={4} style={{ marginBottom: 20 }}>
      <Grid item md={3} xs={12}>
        <Autocomplete
          size='small'
          id='create__class-subject'
          options={branchList}
          getOptionLabel={(option) => option.branch_name}
          filterSelectedOptions
          onChange={handleBranchChange}
          renderInput={(params) => (
            <TextField
              size='small'
              className='create__class-textfield'
              {...params}
              variant='outlined'
              label='Branch'
              placeholder='Branch'
              required
            />
          )}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Autocomplete
          size='small'
          id='create__class-subject'
          options={yearList}
          getOptionLabel={(option) => option.session_year}
          filterSelectedOptions
          onChange={handleYearChange}
          renderInput={(params) => (
            <TextField
              size='small'
              className='create__class-textfield'
              {...params}
              variant='outlined'
              label='Academic year'
              placeholder='Academic year'
              required
            />
          )}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Box display='flex' flexDirection='column'>
          <Input type='file' onChange={handleFileChange} />
          <Box display='flex' flexDirection='row' style={{ color: 'gray' }}>
            <Box p={1}>
              {`Download Format: `}
              <a
                style={{ cursor: 'pointer' }}
                href='/assets/download-format/erp_user.xlsx'
                download='format.xlsx'
              >
                Download format
              </a>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={3} xs={12}>
        <Button onClick={handleFileUpload}>Upload</Button>
      </Grid>
    </Grid>
  );
};

export default BulkUpload;
