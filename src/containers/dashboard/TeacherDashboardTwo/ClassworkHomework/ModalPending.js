import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
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

function ModalPending(props) {
  const classes = useStyles();

  return (
    <div>
      <div>
        <div>
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
                <hr style={{ width: '400px' }} />
                <div style={{ display: 'flex', BorderBottom: '1px solid black', justifyContent: 'space-between' }}>
                  <div style={{ minWidth: 160 }}>
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
                          style={{ display: 'flex', borderBottom: '1px solid #E8E8E8', justifyContent: 'space-between' }}
                        >
                          <div>
                            <p style={{ fontSize: 'small' }}>{data.homework_name}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 'small' }}>{moment(data.uploaded_at).format('DD-MM-YYYY')}</p>
                          </div>
                        </div>
                      </>
                    );
                  })
                  : props?.row?.not_submitted_list.map((data) => {
                    return (
                      <>
                        <div
                          style={{ display: 'flex', borderBottom: '1px solid #E8E8E8', justifyContent: 'space-between' }}
                        >
                          <div>
                            <p style={{ fontSize: 'small' }}>{data.title_name}</p>
                          </div>
                          <div>
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
export default ModalPending;
