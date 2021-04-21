import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout';
import TabPanel from './TabPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { concat, set, update } from 'lodash';
import Axios from 'axios';
import './Contact.css';

import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const ContactAdd = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = React.useState([]);
  const [branch, setBranch] = React.useState([]);

  const [value, setValue] = React.useState(0);
  const [submitdata, setSubmitedData] = React.useState([]);
  const [grade, setGrade] = React.useState();
  const [state, setState] = React.useState();
  const [mobile, setmobile] = useState('');
  const [updateData, setUpdateData] = React.useState([]);

  const [Foe_contact_number, setFoe_contact_number] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [MobileNu, setMobileNu] = useState(null);
  const [mobileerror, setMobileerror] = useState(
    "Something Went Wrong..,Can't Add!!Please, Enter 10 Digits Mobile Number.!"
  );

  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('res.data.data : ', res.data.data);
      setBranch(res.data.data);
    });
  }, []);

  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

  const handleChangeInput = (e) => {
    const re = /^[0-9\b]+$/; //rules
    if (e.target.value === '' || re.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
  };

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const OnFormSubmit = (e) => {
    e.preventDefault();
    if (
      state.foe_contact_number.length === 10 &&
      state.operation_manager_contact_number.length === 10 &&
      state.campus_in_charge_contact_number.length === 10
    ) {
      console.log('state', state);
      axiosInstance
        .post(endpoints.ContactUsAPI.getContactUsAPI, {
          foe_contact_number: state.foe_contact_number,
          operation_manager_contact_number: state.operation_manager_contact_number,
          campus_in_charge_contact_number: state.campus_in_charge_contact_number,
          branch_id: grade,
        })
        .then((result) => {
          if (result.data.status_code === 200) {
            // setLoading(false);
            setAlert('success', result.data.message);
          } else {
            // setLoading(false);
            setAlert('error');
          }
        })
        .catch((error) => {
          // setLoading(false);
          setAlert('error', error.message);
        });
    } else setAlert('error', mobileerror);
  };

  const handleBranch = (evt, value) => {
    console.log('gradevalue:', value);
    setGrade(value.id);
  };

  const [isError, setIsError] = useState(false);

  const onChange = (e, value) => {
    e.preventDefault();
    console.log('values', { [e.target.name]: e.target.value });
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleFilter = (e) => {
    console.log('hbhhbhb');
    e.preventDefault();
    console.log('branchid', grade);
    axiosInstance.get(`academic/contact/?branch_id=${grade}`).then((res) => {
      console.log('res:', res.data.data);
      setUpdateData(res.data.data);
    });
  };

  return (
    <>
      <form onSubmit={OnFormSubmit}>
        <Grid container spacing={2} direction='column'>
          <Grid container spacing={0} direction='row'>
            <Grid item xs={8} sm={8} md={5} lg={4}>
              <Autocomplete
                id='combo-box-demo'
                options={branch}
                onChange={handleBranch}
                name='branch_id'
                getOptionLabel={(option) => option.branch_name}
                helperText='      '
                // style={{ width: '20%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Branch'
                    helperText='      '
                    variant='outlined'
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <Button variant='contained' color='primary' style={{ height: '95%' }}>
                Filter
              </Button>
            </Grid>
          </Grid>
          <Grid item className='postContact' xs={8} sm={8} md={5} lg={4}>
            <TextField
              label='FOE Contact'
              variant='outlined'
              size='medium'
              error={isError}
              fullWidth
              // style={{ width: '20%' }}
              helperText='Enter 10 digit Number..!'
              inputProps={{ pattern: '/^[2-9]{2}d{8}$/', maxLength: 10 }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              name='foe_contact_number'
              onChange={onChange}
              // onChange={validation}
              required='true'
            />
          </Grid>
          <Grid item className='postContact' xs={8} sm={8} md={5} lg={4}>
            <TextField
              label='Manager Contact'
              variant='outlined'
              fullWidth
              size='medium'
              error={isError}
              // style={{ width: '20%' }}
              name='operation_manager_contact_number'
              inputProps={{ pattern: [0 - 9], maxLength: 10 }}
              onChange={onChange}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              required='true'
              helperText='Enter 10 digit Number...!'
              inputProps={{ pattern: '/^[2-9]{2}d{8}$/', maxLength: 10 }}
            />
          </Grid>
          <Grid item className='postContact' xs={8} sm={8} md={5} lg={4}>
            <TextField
              label='Incharge Contact'
              error={isError}
              variant='outlined'
              fullWidth
              size='medium'
              // style={{ width: '20%' }}
              name='campus_in_charge_contact_number'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              inputProps={{ pattern: [0 - 9], maxLength: 10 }}
              onChange={onChange}
              required='true'
              helperText='Enter 10 digit Number...!'
              inputProps={{ pattern: '/^[2-9]{2}d{8}$/', maxLength: 10 }}
            />
          </Grid>

          <Grid container spacing={5} style={{ width: '95%', paddingTop: '25px' }}>
            <Grid item xs={12} sm={2}>
              <Button
                variant='contained'
                color='primary'
                size='medium'
                type='submit'
                onClick={OnFormSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ContactAdd;
