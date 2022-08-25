import React, { useEffect, useState } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Box,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import RemoveIcon from '@material-ui/icons/Remove';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import SubComponentCard from './SubComponentCard';
import cuid from 'cuid';
// import InputAdornment from '@mui/material/InputAdornment';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.primarylightest
  },
  paper: {
    marginLeft: '20px',
    width: '95%',
    border: '1px solid #E2E2E2',
    marginBottom: '20px'
  }
}));

function ComponentCard(props) {
  const classes = useStyles();
  const [componentName, setComponentName] = useState('');
  const [questions, setQuestions] = useState([
    // {
    //   id: cuid(),
    //   question: '',
    //   attachments: [],
    //   is_attachment_enable: false,
    //   max_attachment: 2,
    //   penTool: false,
    // },
  ]);
  const [queIndexCounter1, setQueIndexCounter1] = useState(0);
  const addNewQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      {
        id: cuid(),
        question: '',
        attachments: [],
        is_attachment_enable: false,
        max_attachment: 2,
        penTool: false,
      },
      ...prevState.slice(index),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  return (
    <>
      <Paper elevation={2} className={classes.paper}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={3}
            className={'filterPadding'}
            // style={{margin: '20px 10px 20px 20px !important'}}
            //   style={{ background: 'pink' }}
          >
            <TextField
              style={{ width: '100%' }}
              id='subname'
              label='Component Name'
              variant='outlined'
              size='small'
              name='subname'
              autoComplete='off'
              value={componentName}
              //   InputProps={{
              //     endAdornment: (
              //       <Box>
              //         <AddOutlinedIcon
              //           onClick={() => {
              //             setQueIndexCounter1(queIndexCounter1 + 1);
              //             addNewQuestion1(queIndexCounter1 + 1);
              //           }}
              //         />
              //       </Box>
              //     ),
              //   }}
                onChange={(e) => {
                  // setPage(1);
                  setComponentName(e.target.value);
                }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            className={'filterPadding'}
            style={{ paddingLeft: '0px !important' }}
          >
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='small'
              style={{ color: 'white' }}
              title='Create Sub-Component'
              onClick={() => {
                setQueIndexCounter1(queIndexCounter1 + 1);
                addNewQuestion(queIndexCounter1 + 1);
              }}
            >
              {/* Sub-Component */}
            </Button>
          </Grid>
          {questions?.length !== 0 ? (
          <Grid
            item
            xs={12}
            sm={1}
            className={'filterPadding'}
            style={{ paddingLeft: '0px !important' }}
          >
            <Button
              startIcon={<RemoveIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='small'
              style={{ color: 'white' }}
              title='Remove Sub-Component'
              onClick={() => {
                setQueIndexCounter1(queIndexCounter1 - 1);
                removeQuestion(queIndexCounter1 - 1);
              }}
            >
              {/* Sub-Component */}
            </Button>
          </Grid>) : <></>}

          {questions.map((question, index) => (
            <SubComponentCard
            // key={question.id}
            // question={question}
            // index={index}
            // addNewQuestion={addNewQuestion}
            // handleChange={handleChange}
            // removeQuestion={removeQuestion}
            />
          ))}
        </Grid>
      </Paper>
    </>
  );
}

export default ComponentCard;
