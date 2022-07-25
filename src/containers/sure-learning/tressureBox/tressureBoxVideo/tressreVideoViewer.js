import React, { useState, useEffect, useContext } from 'react';
import { Grid, Button, Typography, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';
import NoFilterData from 'components/noFilteredData/noFilterData';
import { SvgIcon } from '@material-ui/core';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../containers/Layout/';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './videoviewer.scss';
import { HighlightOff } from '@material-ui/icons';
import PropTypes from "prop-types";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: 500,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

// function extractContent(s) {
//   const span = document.createElement('span');
//   span.innerHTML = s;
//   return span.textContent || span.innerText;
// }
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);
const StyledButton1 = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: '#09458b',
    },
  },
}))(Button);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
const TressreVideoViewer = ({ classes }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const history = useHistory();
  const [vedioDetail, setVedioDetail] = useState('');
  const [open, setOpen] = React.useState(false);
  const [dTitle, setDTitle] = React.useState(true);
  const handleBack = () => {
    history.push('/tressureBox');
  };
  const handleClickOpen = (item) => {
    console.log(item.title, 'item');
    setDTitle(item.title);
    setVedioDetail(item.text);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;
  console.log(moduleData, 'module');

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Treasure_Box') {
          setModuleId(item.module);
        }
      });
    }
  }, []);
  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(
          endpoints.sureLearning.TressureBoxVedio +
          sessionStorage.getItem('tressureBoxid'),
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          if (res.data.length > 0) {
            console.log(res.data[0].file, 'tressureBoxid');
            setAlert('success', 'Data Fetched Successfully');
            setData(res.data);
          } else {
            setAlert('warning', 'There is no data');
          }
        })
        .catch((error) => {
          setAlert('error', 'some thing went wrong');
        });
    }
  }, [moduleId]);
  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Treasure Box 1'
        isAcademicYearVisible={true}
      />
      <div style={{ padding: '0 0 0 20px' }}>
        <Grid container spacing={3} className='tressureVedios-container'>
          <Grid item xs={12}>
            <Button
              variant='contained'
              size='medium'
              // style={{ width: '100%' }}
              className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
          {data[0] ? (
            <>
              {data.map((item) => {
                return (
                  <Grid item>
                    <video width='320' height='240' controls>
                      <source src={`${endpoints.s3UDAAN_BUCKET}${item.file.substring(31)}`} type='video/mp4' />
                    </video>
                    <Typography variant='h5'>
                      <strong>{item.title}</strong>
                    </Typography>
                    <StyledButton1
                      color="primary"
                      variant="contained"
                      onClick={() => handleClickOpen(item)}>
                      Vedio Details
                    </StyledButton1>
                    {/* <div>{extractContent(item.text)}</div> */}
                  </Grid>
                );
              })}
            </>
          ) : (
            <Grid xs={12}>
              <NoFilterData data={'NO DATA FOUND'} />
            </Grid>
          )}
        </Grid>
      </div>
      <Dialog
        maxWidth='md'
        style={{ marginTop: '50px' }}
        // onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle id='customized-dialog-title'>{dTitle}</DialogTitle>
        <DialogContent dividers>
          <div style={{ position: 'absolute', right: 0, top: 5 }}>
            <IconButton onClick={() => handleClose()}>
              <HighlightOff />
            </IconButton>
          </div>
          <Typography
            gutterBottom
            style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
          >
            {ReactHtmlParser(vedioDetail)}
          </Typography>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

TressreVideoViewer.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(TressreVideoViewer);