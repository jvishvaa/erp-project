import React, { useEffect, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import './viewClassParticipate.scss';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableContainer,
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useParams, withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import axiosInstance from 'config/axios';
import Pagination from 'components/PaginationComponent';
import CloseIcon from '@material-ui/icons/Close';
import {
  finalEvaluationForHomework,
} from '../../../redux/actions';

import Loader from '../../../components/loader/loader';




const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  navcontent: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },

  closebutton: {
    padding: theme.spacing(2),
    textAlign: 'end',
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
    border: '1px solid #77787a',
    borderRadius: '5px',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
}));

const AddScoreDialog = (props) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useStyles();
  const {
    periodId,
    onClose,
    selectedValue,
    open,
    studentId,
    nameStudent,
    studentScore,
    updateScore,
    flagprop,
    studentRemark,
    handlestudentRemark,
    homeWorkId,
    cpConfirm
  } = props;

  const handleChange = (e) => {
    updateScore(e.target.value)
  }

  const finalEvaluationForHomework = async () => {
    setLoading(true);

    const reqData = {
      studentRemark,
      studentScore,
    };
    if (!studentRemark) {
      setAlert('error', 'Please provide a remark');
      return;
    }

    if (!studentScore) {
      setAlert('error', 'Please provide a score');
      return;
    }
    try {
      await finalEvaluationForHomework(periodId, reqData);
      setAlert('success', 'Homework Evaluated');
      setLoading(false);

      // onClose();
    } catch (e) {
      setAlert('error', 'Homework Evaluation Failed');
      setLoading(false);

    }
  };



  const studentRemarkUpdate = () => {
    setLoading(true);
    if(!cpConfirm){
    setLoading(false);
    if(studentScore > 0 && studentScore <= 10){
    axiosInstance
      .put(`/period/${periodId}/update-attendance/`, {
        erp_id: studentId,
        cp_remarks: studentRemark,
        cp_marks: parseFloat(studentScore),
      })
      .then((result) => {

        if (result?.data?.status_code === 200) {
          setAlert('success', result.data.message);
          flagprop();
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error?.message);
        setLoading(false);
      });}else{
        setAlert("error","Please enter marks between 0 to 10")
      }
    }else{
      setLoading(false);
      setAlert('error',"Remarks and score has been already locked")
    }
  };
  const handleClose = () => {
    onClose(selectedValue);
    setRemarks();
    setRating();
  };

  const handleIncrementItem = () => {
    if (studentScore < 10) {
      updateScore(Math.round((parseFloat(studentScore) + parseFloat(0.1)) * 10) / 10);
    }
  };

  const handleDecreaseItem = () => {
    if (studentScore > 0) {
      updateScore(Math.round((parseFloat(studentScore) - parseFloat(0.1)) * 10) / 10);
    }
  };

  const handleUpdate = () => {
    handleClose();
    studentRemarkUpdate();
    if (homeWorkId) {
      finalEvaluationForHomework()
    }
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleRatingUpdate = (e) => {
    handlestudentRemark(e.target.value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby='simple-dialog-title' open={open}>
      {loading && <Loader />}
      <DialogTitle id='simple-dialog-title'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            border: '1px solid black',
            borderRadius: '5px',
            backgroundColor: '#c4c7cc',
            padding: '7px',
          }}
        >
          <AccountCircleIcon style={{ fontSize: '50px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
            <h6>Student Name: {nameStudent}</h6>
            <h6>Roll NO: {studentId}</h6>
          </div>
        </div>
        <hr />
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            paddingBottom: 5,
            paddingTop: 5,
          }}
        >
          <h5 style={{ paddingRight: 5 }}>Marks: </h5>
          <br />
          <form
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <div
              class='value-button'
              id='decrease'
              onClick={handleDecreaseItem}
              value='Decrease Value'
            >
              -
            </div>
            <input type='number' id='number' value={studentScore} onChange={handleChange} />
            <div
              class='value-button'
              id='increase'
              onClick={handleIncrementItem}
              value='Increase Value'
            >
              +
            </div>
          </form>
          <h5 style={{ paddingLeft: 5 }}> /10</h5>
        </div>
        <TextField
          style={{ width: '25rem' }}
          id='outlined-multiline-static'
          label=''
          multiline
          value={studentRemark}
          rows={4}
          variant='outlined'
          onChange={handleRatingUpdate}
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <Button
            size='small'
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            style={{ paddingBottom: 5, paddingTop: 5, width: 200 }}
          >
            {' '}
            Done{' '}
          </Button>
        </div>
      </DialogTitle>
    </Dialog>
  );
}
export default AddScoreDialog;
