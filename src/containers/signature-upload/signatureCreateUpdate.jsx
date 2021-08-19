/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-curly-newline */
import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  IconButton,
  Typography,
  withStyles,
  Divider,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './style.scss';
import styles from './signature.style';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loader from '../../components/loader/loader';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const CreateUpdateSignatureModel = ({
  classes,
  branchList,
  open,
  close,
  fullData,
  edit,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [erpNo, setErpNo] = useState('');
  const [file, setFile] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fullData) {
      setErpNo(fullData && fullData.author_id__erp_id);
      setFile(fullData && fullData.signature);
      const seletedBranch =
        branchList &&
        branchList.length !== 0 &&
        branchList.filter(
          (item) => item.id === parseInt(fullData && fullData.branch_id, 10)
        ) &&
        branchList.filter(
          (item) => item.id === parseInt(fullData && fullData.branch_id, 10)
        ).length !== 0 &&
        branchList.filter(
          (item) => item.id === parseInt(fullData && fullData.branch_id, 10)
        )[0];
      setSelectedBranch(seletedBranch);
    } else {
      setErpNo('');
      setFile('');
      setSelectedBranch('');
    }
  }, [fullData]);
  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography {...other}>
        <Typography color='secondary' variant='h6'>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label='close'
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  function functionToHandleImage(data) {
    if ((data && data.type === 'image/jpeg') || (data && data.type === 'image/png')) {
      setFile(data);
    } else {
      setAlert('warning', 'Upload Image in JPEG && PNG format Only');
    }
  }

  function handleSubmit() {
    if (!selectedBranch) {
      setAlert('warning', 'Select Branch');
      return;
    }
    if (!erpNo) {
      setAlert('warning', 'Enter Erp No');
      return;
    }
    if (!file) {
      setAlert('warning', 'Upload you signature');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('branch_id', selectedBranch && selectedBranch.id);
    formData.append('erp_id', erpNo);
    if (file && typeof file === 'object') {
      formData.append('signature', file);
    }
    if (edit) {
      axiosInstance
        .put(
          `${endpoints.signature.updateSignatureApi}?sign_id=${fullData && fullData.id}`,
          formData
        )
        .then((result) => {
          setLoading(false);
          if (result.data.status_code === 200) {
            close('success');
            setAlert('success', result.data.message);
          } else {
            setAlert('error', result.data.error);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.error);
        });
    } else {
      axiosInstance
        .post(endpoints.signature.createSignatureApi, formData)
        .then((result) => {
          setLoading(false);
          if (result.data.status_code === 200) {
            close('success');
            setAlert('success', result.data.message);
          } else {
            setAlert('error', result.data.error);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.error);
        });
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Dialog
            maxWidth='xs'
            style={{ width: '100%' }}
            className={classes.modal}
            open={open}
            disableEnforceFocus
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            closeAfterTransition
          >
            <DialogTitle
              id='alert-dialog-title'
              onClose={close}
              color="secondary"
              style={{ backgroundColor: '#FCEEEE' }}
            >
              {edit ? 'Update' : 'Create'}
              &nbsp;Signature
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                <Grid container spacing={2} style={{ margin: '20px 0px' }}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={(event, value) => setSelectedBranch(value)}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedBranch}
                      options={branchList}
                      getOptionLabel={(option) => option?.branch_name}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Branch'
                          placeholder='Branch'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label='Enter ERP number'
                      value={erpNo}
                      helperText={
                        erpNo && erpNo.length < 15 ? (
                          <b style={{ color: '#014B7E' }}>Enter Valid ERP Number</b>
                        ) : (
                          ''
                        )
                      }
                      onChange={(e) =>
                        //e.target.value > -1 &&
                        //e.target.value.length < 12 &&
                        setErpNo(e.target.value)
                      }
                      margin='dense'
                      fullWidth
                      variant='outlined'
                      //type='number'
                      className='signatureUploadTextField'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Typography color='secondary' variant='h6' className='uploadSignaturefileLable'>
                      Upload Image &nbsp;
                      <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <label htmlFor='outlined-button-filee'>
                      <input
                        style={{ display: 'none' }}
                        className={classes.fileUpload}
                        id='outlined-button-filee'
                        type='file'
                        onChange={(e) => functionToHandleImage(e.target.files[0])}
                      />
                      <Button
                        variant='contained'
                        size='medium'
                        style={{ color: 'white', width: '100%' }}
                        color='primary'
                        startIcon={<CloudUploadIcon style={{ fontSize: '20px' }} />}
                      >
                        Browse
                      </Button>
                    </label>
                  </Grid>
                  {file && (
                    <Grid item md={12} xs={12}>
                      <Grid
                        container
                        spacing={2}
                        justify='center'
                        alignItems='center'
                        direction='row'
                        className='uploadedImageName'
                      >
                        <Grid item md={10} xs={10}>
                          {file && typeof file === 'object' && file.name}
                          {file && typeof file === 'string' && (
                            <img
                              alt='crash'
                              src={`${endpoints.signature.s3}${file}`}
                              controls
                              width='100%'
                              height='200px'
                            />
                          )}
                        </Grid>
                        <Grid item md={2} xs={2}>
                          {file && (
                            <DeleteIcon
                              className='fileDeleteButton'
                              onClick={() => setFile('')}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions style={{ backgroundColor: '#FCEEEE' }}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button color='primary' variant='contained' style={{ color: 'white' }} onClick={() => handleSubmit()}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
        {loading && <Loader />}
      </Grid>
    </>
  );
};

CreateUpdateSignatureModel.propTypes = {
  branchList: PropTypes.instanceOf(Array).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  edit: PropTypes.bool.isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CreateUpdateSignatureModel);
