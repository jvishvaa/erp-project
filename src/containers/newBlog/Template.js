import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  makeStyles,
  Typography,
  Grid,
  Breadcrumbs,
  MenuItem,
  TextareaAutosize,
  Paper,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  Drawer,
  TablePagination,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RatingScale from './RatingScale';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import StarsIcon from '@material-ui/icons/Stars';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
const drawerWidth = 350;
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    marginLeft: '25px',
    // marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: 'white',
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderRadius: '5px',
  },
  buttonColor1: {
    color: 'green !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
}));
const Template = (props) => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  return (
    <div
      style={{
        background: 'white',
        width: '502px',
        marginLeft: '34px',
        height: 'auto',
        marginTop: '12px',
        marginBottom: '29px',
      }}
    >
      <div style={{ paddingLeft: '30px', paddingTop: '12px' }}>
        <div
          style={{
            background: `url(${props.image})`,
          }}
          className= 'background-image-write'
        >
          <div className='certificate-text-center certificate-input-box'>
            <textarea
              className='certificate-box'
              style={{ width: '338px', height: '366px' }}
              value={props.text}
              placeholder='type text here...'
            />
          </div>
        </div>
      </div>
      {/* <div
      style={{
        paddingLeft: '30px',
        paddingTop: '12px',
        paddingBottom: '6px',
      }}
    >
      {ReactHtmlParser(previewData?.submitted_work?.html_text)}
    </div> */}
    </div>
  );
};
export default Template;