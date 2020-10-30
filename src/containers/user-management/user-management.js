import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Checkbox, FormControlLabel, Grid, Input, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axiosInstance from '../../config/axios';
import AssignRole from '../communication/assign-role/assign-role';

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
      const data = await axiosInstance.get('erp_user/branch/');
      this.setState({ branches: data.data.data });
    } catch (error) {
      window.alert('Failed to load branches');
    }
  };

  getYears = async () => {
    try {
      const data = await axiosInstance.get('erp_user/list-academic_year/');
      this.setState({ years: data.data.data });
    } catch (error) {
      window.alert('Failed to load branches');
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
      <>
        <div>
          <Button startIcon={<AddOutlinedIcon />} href={`${match.url}/create-user`}>
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
            label='Upload excel'
          />
        </div>
        <div style={{ marginTop: 20 }}>
          {this.state.checked ? (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Input type='file' onChange={this.handleFile} />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  size='small'
                  id='create__class-subject'
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
              <Grid item xs={4}>
                <Autocomplete
                  size='small'
                  id='create__class-subject'
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
              <Grid item xs={4}>
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
      </>
    );
  }
}

export default UserManagement;
