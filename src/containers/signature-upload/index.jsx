/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import './style.scss';
import CreateUpdateSignatureModel from './signatureCreateUpdate';
import ViewSignatureCards from './signatureCardView';
import filterImage from '../../assets/images/unfiltered.svg';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from '../Layout';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';

const SignatureUpload = ({ history }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updateData, setUpdateData] = useState('');
  const [signatureList, setsignatureList] = useState('');

  function getBranchList() {
    setLoading(true);
    axiosInstance
      .get(endpoints.masterManagement.branchList)
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          setBranchList(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  function getSignatures(selectedBranch) {
    if (selectedBranch) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.signature.getSignatureList}?branch_id=${
            selectedBranch && selectedBranch.id
          }&is_delete=False`
        )
        .then((result) => {
          setLoading(false);
          if (result.data.status_code === 200) {
            setsignatureList(result.data.result);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setsignatureList([]);
          setAlert('error', error.message);
        });
    } else {
      setsignatureList('');
    }
    if (!selectedBranch) {
      setAlert('warning', 'Select Branch');
    }
  }
  useEffect(() => {
    getBranchList('');
  }, []);
/*
  useEffect(() => {
    if(selectedBranch === ''){
      setsignatureList([]);
    }
  }, [selectedBranch]);
*/
  function handleEdit(data) {
    setUpdateData(data);
    setEdit(true);
    setOpen(true);
  }

  function handleClose(data) {
    setOpen(false);
    setEdit(false);
    setUpdateData({});
    if (data === 'success') {
      getSignatures(selectedBranch);
    }
  }

  function handleOpen() {
    setOpen(true);
    setEdit(false);
    setUpdateData({});
  }

  return (
    <>
      <Layout>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Grid container spacing={2} className='signatureUploadHead'>
            <CommonBreadcrumbs
              componentName='Master Management' childComponentName='Signature Upload' />

            <Grid item md={12} xs={12}>
              <Grid container spacing={5} className='SignatureUploadFilterDiv'>
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(event, value) => {
                      setSelectedBranch(value);
                      //getSignatures(value);
                    }}
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
                <Grid item md={1} xs={12}>
                  <Button
                    size='medium'
                    style={{ color: 'white' }}
                    variant='contained'
                    color='primary'
                    fullWidth
                    onClick={() => getSignatures(selectedBranch)}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Button
                     size='medium'
                     style={{ color: 'white' }}
                     variant='contained'
                     color='primary'
                    onClick={() => handleOpen()}
                  >
                    <AddIcon />
                    &nbsp; Create Signature
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              {!signatureList && (
                <Grid container spacing={2}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ textAlign: 'center', marginTop: '10px' }}
                  >
                    <img src={filterImage} alt='crash' height='250px' width='250px' />
                    <Typography>
                      Please select the filter to dislpay signatures
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {signatureList && signatureList.length === 0 && (
                <Grid container spacing={2} className='signatureCardViewMain'>
                  <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                    <Typography variant='h5'>Signatures Not Found</Typography>
                  </Grid>
                </Grid>
              )}
              {signatureList && signatureList.length !== 0 && (
                <Grid container spacing={2} className='signatureCardViewMain'>
                  {signatureList &&
                    signatureList.length !== 0 &&
                    signatureList.map((item) => (
                      <Grid item md={4} xs={12} key={item.id}>
                        <ViewSignatureCards
                          handleEdit={handleEdit}
                          fullData={item}
                          close={handleClose}
                        />
                      </Grid>
                    ))}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <CreateUpdateSignatureModel
                open={open}
                branchList={branchList}
                close={handleClose}
                edit={edit}
                fullData={updateData}
              />
            </Grid>
          </Grid>
          {loading ? <Loader /> : null}
        </div>
      </Layout>
    </>
  );
};

export default withRouter(SignatureUpload);
