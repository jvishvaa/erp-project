import React from 'react';
// import './App.css';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: 'pink',
  },
}));

function ModalSubmitted(props) {
  // console.log('ModalSubmitted', props);
  const classes = useStyles();

  return (
    <div>
      <div>
        <div>
          {/* <Button variant='outlined' color='primary'>
            <Avatar aria-label='recipe' className={classes.avatar}>
              3
            </Avatar>
            Pending 3 more tasks
          </Button> */}
          <Dialog
            open={props?.open}
            onClose={props?.handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                <div style={{ display: 'flex' }}>
                  <div>
                    <Avatar aria-label='recipe' className={classes.avatar}>
                      <AccountCircleIcon />
                    </Avatar>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginLeft: '10px',
                    }}
                  >
                    {props?.index1 ? (
                      <>
                        <div style={{ color: '#4768A1', fontSize: 'small' }}>Details</div>
                        <div style={{ color: '#4768A1', fontSize: 'small' }}> {''}</div>
                      </>
                    ) : (
                      <>
                        <div style={{ color: '#4768A1', fontSize: 'small' }}>
                          {props?.row?.name}
                        </div>
                        <div style={{ color: '#4768A1', fontSize: 'small' }}>
                          {' '}
                          {props?.row?.erp}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <hr style={{ width: '300px' }} />
                <div style={{ display: 'flex', BorderBottom: '1px solid black' }}>
                  <div>
                    <b style={{ color: '#E33535', fontSize: 'small' }}>
                      Pending Class Work's
                    </b>
                  </div>
                  <div
                    style={{
                      marginLeft: '32px',
                      marginTop: '7px',
                      color: '#E33535',
                      fontSize: 'small',
                    }}
                  >
                    <b>Date</b>
                  </div>
                </div>
                {props?.index1
                  ? props?.col?.map((data) => {

                    return (
                      <>
                        <div
                          style={{ display: 'flex', borderBottom: '1px solid #E8E8E8' }}
                        >
                          <div style={{ width: 20 }}>
                            {/* <p style={{ fontSize: 'small' }}>{row?.not_submitted_list[0].title_name}</p> */}
                            <p style={{ fontSize: 'small' }}>
                              {data.first_name} {data.last_name}
                            </p>
                          </div>
                          <div style={{ marginLeft: '120px' }}>
                            <p style={{ fontSize: 'small' }}>Date</p>
                          </div>
                        </div>
                      </>
                    );
                  })
                  : props?.row?.not_submitted_list.map((data) => {
                    return (
                      <>
                        <div
                          style={{ display: 'flex', borderBottom: '1px solid #E8E8E8' }}
                        >
                          <div style={{ width: 20 }}>
                            {/* <p style={{ fontSize: 'small' }}>{row?.not_submitted_list[0].title_name}</p> */}
                            <p style={{ fontSize: 'small' }}>{data.title_name}</p>
                          </div>
                          <div style={{ marginLeft: '120px' }}>
                            <p style={{ fontSize: 'small' }}>{data.date}</p>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
export default ModalSubmitted;