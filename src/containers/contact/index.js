// import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
// import Container from '@material-ui/core/Container';
// import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
// import {
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Input,
//   TextField,
//   Box,
// } from '@material-ui/core';
// import { Autocomplete } from '@material-ui/lab';
// import axiosInstance from '../../config/axios';
// import AssignRole from '../communication/assign-role/assign-role';
// import Layout from '../Layout';
// class UserManagement extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         checked: false,
//         file: null,
//         branches: [],
//         years: [],
//         branch: null,
//         year: null,
//       };
//     }
  
//     componentDidMount() {
//       this.getBranches();
//       this.getYears();
//     }
  
//     getBranches = async () => {
//       try {
//         const data = await axiosInstance.get('erp_user/branch/');
//         this.setState({ branches: data.data.data });
//       } catch (error) {
//         console.log('failed to load branches');
//       }
//     };