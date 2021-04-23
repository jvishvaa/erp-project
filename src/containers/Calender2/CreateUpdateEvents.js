/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable key-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { DialogTitle } from '@material-ui/core';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Radio,
  InputLabel,
  IconButton,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import axios from 'axios';

import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import styles from './wibenarSchedule.style';
import './style.css';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CreateUpdateEvents({ classes, handleClose, open, fullData }) {
  console.log(fullData, ':::fullData');
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const { setAlert } = useContext(AlertNotificationContext);
  const [grades, setGrades] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    axiosInstance.get(endpoints.masterManagement.gradesDrop).then((response) => {
      console.log('grades', response.data.data);
      setGrades(response.data.data);
    });
    axiosInstance
      .get(`${endpoints.masterManagement.sectionsTable}?page=${page}&page_size=${limit}`)
      .then((res) => {
        console.log('sections', res.data.result.results);
        setSectionList(res.data.result.results);
      });
  }, []);
  function dateFormate(dateInd) {
    // const dateInfo = data.split('/');
    const dataNu =
      dateInd.getDate() && dateInd.getDate() > 9
        ? dateInd.getDate()
        : `0${dateInd.getDate()}`;
    const MounthNu =
      dateInd.getMonth() + 1 && dateInd.getMonth() + 1 > 9
        ? dateInd.getMonth() + 1
        : `0${dateInd.getMonth() + 1}`;
    const YearNu = dateInd.getDate() && dateInd.getFullYear();
    return `${YearNu}-${MounthNu}-${dataNu}`;
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('psodata', postData);
    axiosInstance
      .post(endpoints.calender.postEvents, postData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  // console.log('user:', localStorage.getItem('userDetails'));
  return (
    <Dialog
      maxWidth='sm'
      className={classes.modal}
      open={open}
      disableEnforceFocus
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      closeAfterTransition
    >
      <DialogTitle id='alert-dialog-title' onClose={handleClose}>
        <IconButton
          onClick={() => handleClose()}
          style={{ float: 'right', textAlign: 'right' }}
        >
          <CloseIcon />
        </IconButton>
        Add Event
        <Typography style={{ color: 'blue' }}>
          {' '}
          {fullData &&
            fullData.date &&
            fullData.date &&
            new Date(fullData.date).toString().split('G')[0].substring(0, 16)}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container direction='row'>
              <Grid md={12}>
                <TextField
                  label='Title'
                  variant='outlined'
                  name='event_name'
                  onChange={handleChange}
                  fullWidth
                  helperText
                />
                <TextField
                  label='Start Date'
                  type='date'
                  variant='outlined'
                  onChange={handleChange}
                  name='start_date'
                  style={{ width: '50%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText
                />
                <TextField
                  label='End Date'
                  type='date'
                  name='end_date'
                  variant='outlined'
                  onChange={handleChange}
                  style={{ paddingLeft: '1%', width: '50%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText
                />
                <TextField
                  label='start time'
                  type='time'
                  name='start_time'
                  variant='outlined'
                  style={{ width: '50%' }}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label='end time'
                  type='time'
                  name='end_time'
                  onChange={handleChange}
                  variant='outlined'
                  style={{ paddingLeft: '1%', width: '50%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText
                />
                <TextareaAutosize
                  variant='outlined'
                  rowsMin={10}
                  name='description'
                  onChange={handleChange}
                  placeholder='Description'
                  style={{ width: '100%' }}
                  helperText
                />
                <Grid container direction='row'>
                  <Grid item md={3}>
                    <FormControlLabel control={<Checkbox />} label='All Day' />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel control={<Checkbox />} label='First Half' />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel control={<Checkbox />} label='Second Half' />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel control={<Checkbox />} label='Holiday' />
                  </Grid>
                  <Grid item md={3}>
                    <FormControl
                      variant='outlined'
                      className={classes.formControl}
                      style={{ width: '100%' }}
                    >
                      <InputLabel id='demo-simple-select-outlined-label'>
                        Grade
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-outlined-label'
                        id='demo-simple-select-outlined'
                        size='small'
                        onChange={handleChange}
                        label='grade'
                        name='grade'
                      >
                        {grades &&
                          grades.map((grade) => {
                            return (
                              <MenuItem value={grade.id} key={grade.id}>
                                {grade.grade_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={3}>
                    <FormControl
                      variant='outlined'
                      className={classes.formControl}
                      style={{ width: '100%' }}
                    >
                      <InputLabel id='demo-simple-select-outlined-label'>
                        section
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-outlined-label'
                        id='demo-simple-select-outlined'
                        size='small'
                        name='section'
                        onChange={handleChange}
                        label='section'
                      >
                        {sectionList &&
                          sectionList.map((grade) => {
                            return (
                              <MenuItem value={grade.id} key={grade.id}>
                                {grade.section?.section_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Button className='Bt2' style={{ marginLeft: 100 }} type='submit'>
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}

CreateUpdateEvents.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default withStyles(styles)(CreateUpdateEvents);
