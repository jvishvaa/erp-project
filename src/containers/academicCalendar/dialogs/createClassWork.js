import React, { useState } from 'react';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {
  Button,
  Divider,
  Avatar,
} from '@material-ui/core';

const CreateClassWork = ({ openClassWork, setOpenClassWork }) => {
  const closeModal = () => {
    setOpenClassWork(false);
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          marginTop: '10%',
          marginLeft: '2%',
        }}
      >
        <div>
          <Avatar
            name='Abhishek Manglam'
            round={true}
            size='50'
            style={{ marginLeft: '45%' }}
          />
        </div>

        <div style={{ marginLeft: '20px' }}>
          Student
          <br />
          <span style={{ color: 'grey', fontSize: '14px' }}>Roll No :321</span>
        </div>
        <Divider />
      </div>

      <div
        style={{
          border: '2px solid black',
          borderRadius: '5px',
          marginBottom: '20px',
          width: '90%',
          marginTop: '3%',
          marginLeft: '5%',
        }}
      >
        <div style={{ borderBottom: '1px solid black', padding: '5px' }}>ClassWork </div>
        <div style={{ padding: '5px' }}>
          <p>
            Assinged Work <br />
            <a href='#' download>
              Quiz.pdf
            </a>
            <br />
            Set Duration: 50 min <br />
            Created : DD/MM/YYYY
          </p>
        </div>
        <div style={{ background: 'whitesmoke', padding: '5px' }}>
          <p>
            Submitted By Student
            <br />
            <PictureAsPdfIcon />
            <a href='#'>sample.pdf</a>
            <br />
            <PictureAsPdfIcon />
            <a href='#'>sample.pdf</a>
          </p>
        </div>
      </div>
      <div
        style={{
          background: 'lightblue',
          borderRadius: '5px',
          padding: '5px',
          marginLeft: '5%',
          width: '90%',
        }}
      >
        <h3>Score</h3>
        <div style={{ background: '#fff', borderRadius: '5px', width: '30%' }}>
          <h1>7/10</h1>
        </div>
        <h3>Remarks</h3>
        <div style={{ background: '#fff', borderRadius: '5px' }}>
          <p style={{ padding: '5px' }}>
            Need to improve on multiplication of complex number and jay
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexFlow: 'row-reverse wrap',
          marginTop: '3%',
          marginRight: '5%',
        }}
      >
        <div>
          <Button
            // variant="contained"
            color='primary'
            style={{ padding: '5px', width: '150px' }}
            // onClick={handleClose}
          >
            Edit
          </Button>
        </div>
        <div>
          <Button
            // variant="contained"
            color='primary'
            style={{ padding: '5px', width: '150px', marginLeft: '-5%' }}
            // onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
export default CreateClassWork;
