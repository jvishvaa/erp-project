/* eslint-disable global-require */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  TextField,
  Box,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import axiosInstance from '../../config/axios';
import AssignRole from '../communication/assign-role/assign-role';
import Layout from '../Layout';

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      file: null,
      branches: [],
      years: [],
      branch: null,
      year: null,
    };
  }

  componentDidMount() {
    this.getBranches();
    this.getYears();
  }

  getBranches = async () => {
    try {
      const data = await axiosInstance.get('erp_user/list-all-branch/');
      if (data.data.status_code === 200) this.setState({ branches: data.data.data });
      else console.log('');
    } catch (error) {
      console.log('failed to load branches');
    }
  };

  getYears = async () => {
    try {
      const data = await axiosInstance.get('erp_user/list-academic_year/');
      this.setState({ years: data.data.data });
    } catch (error) {
      console.log('failed to load years');
    }
  };

  handleChange = (data, checked) => {
    this.setState({ checked });
  };

  handleFile = (event) => {
    const { files } = event.target;
    const file = files[0];
    this.setState({ file });
  };

  handleUpload = async () => {
    try {
      const { file, branch, year } = this.state;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('academic_year', year);
      formData.append('branch', branch);
      await axiosInstance.post('/erp_user/upload_bulk_user/', formData);
      this.setState({ checked: false, file: null, branch: null, year: null });
      window.alert('File uploaded successfully');
    } catch (error) {
      window.alert('Failed to upload');
    }
  };

  handleBranch = (event, data) => {
    this.setState({ branch: data.id });
  };

  handleYear = (event, data) => {
    this.setState({ year: data.id });
  };

  render() {
    const { match } = this.props;
    return (
      <Layout>
        <Container>
          <div>
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              href={`${match.url}/create-user`}
              color='primary'
              size='medium'
              variant='contained'
            >
              Add user
            </Button>
            <span style={{ margin: '0px 20px' }}>or</span>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checked}
                  onChange={this.handleChange}
                  name='checked'
                />
              }
              label='Upload Excel'
            />
          </div>
          <div style={{ marginTop: 20 }}>
            {this.state.checked ? (
              <Grid container spacing={2} style={{ marginBottom: 20 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    size='small'
                    id='create__class-subject'
                    className='dropdownIcon'
                    options={this.state.branches}
                    getOptionLabel={(option) => option.branch_name}
                    filterSelectedOptions
                    onChange={this.handleBranch}
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
                <Grid item xs={3}>
                  <Autocomplete
                    size='small'
                    id='create__class-subject'
                    className='dropdownIcon'
                    options={this.state.years}
                    getOptionLabel={(option) => option.session_year}
                    filterSelectedOptions
                    onChange={this.handleYear}
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
                <Grid item xs={3}>
                  <Box display='flex' flexDirection='column'>
                    <Input type='file' onChange={this.handleFile} />
                    <Box display='flex' flexDirection='row' style={{ color: 'gray' }}>
                      <Box p={1}>
                        {`Download Format: `}
                        {/* <a
                          style={{ cursor: 'pointer' }}
                          href={require('./download-format/erp_user.xlsx')}
                          download='format.xlsx'
                        >
                          Download format
                        </a> */}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Button style={{ marginLeft: 20 }} onClick={this.handleUpload}>
                    Upload
                  </Button>
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            <AssignRole />
          </div>
        </Container>
      </Layout>
    );
  }
}

export default UserManagement;
