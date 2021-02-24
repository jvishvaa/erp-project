import React, { useContext, useState } from 'react';
import { Grid, Card, Button, Popover, Typography } from '@material-ui/core';
import './style.scss';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import image from '../../assets/images/Male.svg';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const ViewSignatureCards = ({ handleEdit, fullData, close }) => {
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleDelete() {
    setLoading(true);
    axiosInstance
      .delete(
        `${endpoints.signature.deleteSignatureApi}?sign_id=${fullData && fullData.id}`
      )
      .then((result) => {
        setLoading(false);
        if (result.data.status_code === 200) {
          close('success');
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Grid container spacing={2} className='signatureViewCardMainDiv'>
        <Grid item md={12} xs={12}>
          <Card className='signatureViewMainCard'>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} className='signatureCardViewHeader'>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    Name:&nbsp;
                    {(fullData && fullData.author_id__name) || ''}
                  </Grid>
                  <Grid item md={4} xs={12} className='signatureCardVideHeaderDivider'>
                    ERP:&nbsp;
                    {(fullData && fullData.author_id__erp_id) || ''}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    Branch:&nbsp;
                    {(fullData && fullData.author_id__branch_id__branch_name) || ''}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} className='singatureCardViewImageDiv'>
                <Grid container spacing={2}>
                  <Grid item md={1} xs={1} />
                  <Grid item md={10} xs={10}>
                    <img
                      src={
                        `${endpoints.signature.s3}${fullData && fullData.signature}` ||
                        image
                      }
                      alt='crash'
                      width='100%'
                      height='200px'
                    />
                  </Grid>
                  <Grid item md={1} xs={1} />
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} className='SignatureCardViewFooter'>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6}>
                    <Button
                      size='small'
                      color='primary'
                      variant='contained'
                      fullWidth
                      onClick={() => handleEdit(fullData)}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      style={{ overflow: 'hidden' }}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Grid
                        container
                        spacing={2}
                        style={{ textAlign: 'center', padding: '10px' }}
                      >
                        <Grid item md={12} xs={12}>
                          <Typography>Are you sure to delete ?</Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Button
                            variant='contained'
                            size='small'
                            style={{ fontSize: '11px' }}
                            onClick={() => handleClose()}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Button
                            variant='contained'
                            color='primary'
                            style={{ fontSize: '11px' }}
                            size='small'
                            onClick={() => handleDelete()}
                          >
                            Confirm
                          </Button>
                        </Grid>
                      </Grid>
                    </Popover>
                    <Button
                      size='small'
                      color='primary'
                      aria-describedby={id}
                      variant='contained'
                      fullWidth
                      onClick={handleClick}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {loading && <Loader />}
    </>
  );
};

export default ViewSignatureCards;
