import React, { useState, useEffect, useContext } from 'react';
import { Grid, Button, Typography,withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';
import unfiltered from '../../../../assets/images/unfiltered.svg';
import { SvgIcon } from '@material-ui/core';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../containers/Layout/';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './videoviewer.scss';




const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: 500
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
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const StyledButton1 = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
const TressreVideoViewer = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const history = useHistory();
  const [vedioDetail,setVedioDetail] = useState('');
  const [open, setOpen] = React.useState(false);
  const [dTitle, setDTitle] = React.useState(true);
  const handleBack = () => {
    history.push('/tressureBox');
  };
  const handleClickOpen = (item) => {
    console.log(item.title,'item')
    setDTitle(item.title)
    setVedioDetail(item.text)
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
          if(res.data.length > 0) {
            console.log(res.data[0].file, 'tressureBoxid');
            setAlert('success', 'Data Fetched Successfully');
            setData(res.data);
          }else {
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
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Treasure Box'
          isAcademicYearVisible={true}
        />
        <Grid container spacing={4} style={{ marginTop: '5px', marginLeft: '15px' }}>
          <Grid item md={2} xs={12}>
            <Button
              variant='contained'
              size='medium'
              style={{ width: '100%' }}
              className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          justify='center'
          style={{ paddingTop: '20px' }}
          id='container'
        >
          {data[0] ? (
            <>
              {data.map((item) => {
                return (
                  <div id='videobox'>
                    <video width='320' height='240' controls>
                      <source src={item.file} type='video/mp4' />
                    </video>
                    <Typography variant='h5'>
                      <strong>{item.title}</strong>
                    </Typography>
                    <StyledButton1 onClick={()=>handleClickOpen(item)}>Vedio Details</StyledButton1>
                    {/* <div>{extractContent(item.text)}</div> */}
                  </div>
                );
              })}
            </>
          ) : (
            <div className='noDataIMG' style={{ width: '100%' }}>
              <SvgIcon
                component={() => (
                  <img style={{ paddingLeft: '380px' }} src={unfiltered} />
                )}
              />
              <p style={{ paddingLeft: '440px' }}>NO DATA FOUND </p>
            </div>
          )}

          <Dialog
          width={700}
          style={{marginTop: '50px'}}
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
          >
            <DialogTitle id='customized-dialog-title' onClose={handleClose}>
              {dTitle}
            </DialogTitle>
            <DialogContent dividers>
              <Typography
                gutterBottom
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {ReactHtmlParser(vedioDetail)}</Typography>
              
            </DialogContent>
          </Dialog>
        </Grid>
      </div>
    </Layout>
  );
};
export default TressreVideoViewer;
