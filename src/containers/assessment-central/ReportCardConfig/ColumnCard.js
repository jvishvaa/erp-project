import React, { useEffect, useState } from 'react';
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
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import cuid from 'cuid';
import OtherDetailsCard from './OtherDetailsCard';
import RemoveIcon from '@material-ui/icons/Remove';

function ColumnCard() {
  const [column, setColumn] = useState('');
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
  console.log('treeques', questions)
  const [queIndexCounter1, setQueIndexCounter1] = useState(0);
  console.log('treeind', queIndexCounter1)
  const addNewQuestion1 = (index) => {
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

  console.log(addNewQuestion1, 'treeaddNewQuestion1')

  const removeQuestion = (index) => {
    setQuestions((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  console.log(removeQuestion, 'treeremoveQuestion')



  return (
    <>
      <Grid container spacing={2} style={{ margin: '0px' }}>
        <Grid item xs={12} sm={3} className={'filterPadding'}>
          {/* <TextField
            style={{ width: '100%', border: '1px solid black' }}
            id='subname'
            label='Column Name'
            variant='outlined'
            size='small'
            name='subname'
            autoComplete='off'
            // InputProps={{
            //   endAdornment: (
            //     <Box>
            //       <AddOutlinedIcon
            //         onClick={() => {
            //           setQueIndexCounter1(queIndexCounter1 + 1);
            //           addNewQuestion1(queIndexCounter1 + 1);
            //         }}
            //       />
            //     </Box>
            //   ),
            // }}
            onChange={(e) => {
              // setPage(1);
              setColumn(e.target.value);
            }}
          /> */}
          <h4>Add Column Name</h4>

        </Grid>
        <Grid item xs={12} sm={1} className={'filterPadding'} style={{ paddingLeft: '0px !important' }}>
          <Button
            startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
            variant='contained'
            color='primary'
            size='small'
            style={{ color: 'white', border: '1px solid red' }}
            title='Create Other Fields'
            onClick={() => {
              setQueIndexCounter1(queIndexCounter1 + 1);
              addNewQuestion1(queIndexCounter1 + 1);
            }}
          >
            {/* Sub-Component */}
          </Button>
        </Grid>
        {questions?.length !== 0 ? (
          <Grid item xs={12} sm={1} className={'filterPadding'} style={{ paddingLeft: '0px !important' }}>
            <Button
              startIcon={<RemoveIcon style={{ fontSize: '30px', border: '1px solid green' }} />}
              variant='contained'
              color='primary'
              size='small'
              style={{ color: 'white' }}
              title='Remove Other Fields'
              onClick={() => {
                setQueIndexCounter1(queIndexCounter1 - 1);
                removeQuestion(queIndexCounter1 - 1);
              }}
            >
              {/* Sub-Component */}
            </Button>
          </Grid>) : <></>}
        {questions?.map((question, index) => {
          return (
            <>
              <Grid item xs={12} sm={12} className={'filterPadding'}>
                <TextField
                  style={{ width: '49%', border: '1px solid black' }}
                  id='subname'
                  label='Column Name'
                  variant='outlined'
                  size='small'
                  name='subname'
                  autoComplete='off'
                  // InputProps={{
                  //   endAdornment: (
                  //     <Box>
                  //       <AddOutlinedIcon
                  //         onClick={() => {
                  //           setQueIndexCounter1(queIndexCounter1 + 1);
                  //           addNewQuestion1(queIndexCounter1 + 1);
                  //         }}
                  //       />
                  //     </Box>
                  //   ),
                  // }}
                  onChange={(e) => {

                    setColumn(e.target.value);
                  }}
                />
              </Grid>
              <OtherDetailsCard />
            </>
          )
        })}
        {/* <Grid item xs={12} sm={3} className={'filterPadding'}>
          <TextField
            style={{ width: '100%' }}
            id='subname'
            label='Summary'
            variant='outlined'
            size='small'
            name='subname'
            autoComplete='off'
            //   onChange={(e) => {
            //     setPage(1);
            //     setSearchSubject(e.target.value);
            //   }}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={'filterPadding'}>
          <Button style={{ width: '100%' }}>Test Selection</Button>
        </Grid>
        <Grid container spacing={2} style={{ margin: '0px' }}>
          <Grid item xs={12} sm={3} className={'filterPadding'}>
            <TextField
              style={{ width: '100%' }}
              id='subname'
              label='Weightage'
              variant='outlined'
              size='small'
              name='subname'
              type='number'
              autoComplete='off'
              //   onChange={(e) => {
              //     setPage(1);
              //     setSearchSubject(e.target.value);
              //   }}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={'filterPadding'}>
            <TextField
              style={{ width: '100%' }}
              id='subname'
              label='Logic'
              variant='outlined'
              size='small'
              name='subname'
              type='number'
              autoComplete='off'
              //   onChange={(e) => {
              //     setPage(1);
              //     setSearchSubject(e.target.value);
              //   }}
            />
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
}

export default ColumnCard;
