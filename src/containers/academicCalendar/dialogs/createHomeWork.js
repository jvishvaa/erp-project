import React, { useState } from 'react';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Layout from 'containers/Layout';

const CreateHomeWork = ({ openStudentDialog, setStudentDialog }) => {
  const closeModal = () => {
    setStudentDialog(false);
  };
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={isMobile ? 'sm' : 'md'}
        style={{ top: '100px' }}
        open={openStudentDialog}
      >
        <DialogTitle style={{ background: 'whitesmoke' }}>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ marginLeft: '20px' }}>
              Student
              <br />
              <span style={{ color: 'grey', fontSize: '14px' }}>Roll No :321</span>
            </div>
            <IconButton
              edge='end'
              color='inherit'
              // onClick={handleClose}
              style={{ marginLeft: '700px' }}
              aria-label='close'
            >
              <CloseIcon onClick={closeModal} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div
              style={{
                border: '2px solid black',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <div style={{ borderBottom: '1px solid black', padding: '5px' }}>
                HomeWork{' '}
              </div>
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            // variant="contained"
            color='primary'
            style={{ padding: '5px', width: '150px' }}
            // onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            // variant="contained"
            color='primary'
            style={{ padding: '5px', width: '150px' }}
            // onClick={handleClose}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CreateHomeWork;
