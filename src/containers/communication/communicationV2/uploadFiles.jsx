import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Typography from '@material-ui/core/Typography';
import { Grid, Divider, makeStyles } from '@material-ui/core';
import DNDFileUpload from 'components/dnd-file-upload';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from './../../../context-api/alert-context/alert-state';

const UploadFiles = ({ openUpload, setOpenUpload, handleFiles, branchId }) => {
  const [files, setFiles] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleClose = () => {
    setOpenUpload(false);
    setFiles([]);
  };
  const handleRemove = (item, i) => {
    const removedList = files.filter((z) => z != item);
    setFiles(removedList);
    console.log('files', files);
  };
  const handleUpload = () => {
    const formData = new FormData();
    for (let j = 0; j < files.length; j++) {
      formData.append('file', files[j]);
    }
    formData.append('branch_id', branchId);

    if (branchId) {
      axiosInstance
        .post(`${endpoints.announcementNew.uploadingFile}`, formData)
        .then((res) => {
          if (res.status === 200) {
            handleFiles(res?.data?.data);
            setAlert('success', res?.data?.message);
          } else {
            setAlert('error', res?.data?.message);
          }
        })
        .catch((e) => {
          // setAlert('error',e.response.message)
        });
      handleClose();
    } else {
      setAlert('error', 'Please select Branch');
    }
  };

  const fileConf = {
    fileTypes: 'image/jpeg,image/png,.pdf,',
    types: 'images,pdf,mp3,mp4',
    initialValue: '',
  };
  return (
    <div>
      <Dialog
        // fullScreen={true}
        open={openUpload}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth={true}
        maxWidth='sm'
      >
        <Grid item container justifyContent='space-between' alignItems='center' xs={12}>
          <Typography
            style={{ color: '#676767', paddingLeft: 15, fontWeight: 600, fontSize: 25 }}
          >
            Upload File
          </Typography>
          <HighlightOffIcon
            onClick={handleClose}
            style={{ cursor: 'pointer', paddingRight: 15, fontSize: '50px' }}
          />
        </Grid>
        <Divider />
        <div style={{ padding: 20 }}>
          <DNDFileUpload
            value={fileConf.initialValue}
            handleChange={(e) => {
              if (e) {
                setFiles((prev) => [...prev, e]);
              }
            }}
            fileType={fileConf.fileTypes}
            typeNames={fileConf.types}
          />
          <div
            style={{
              display: 'flex',
              padding: '10px 25px',
              background: '#E5E5E5',
              fontSize: 16,
              marginTop: 20,
              fontWeight: 600,
            }}
          >
            <div style={{ flex: 5, textAlign: 'left' }}>Name</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Size</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Type</div>
            <div style={{ flex: 1, textAlign: 'center' }}></div>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'scroll' }}>
            {files &&
              files.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    padding: '10px 25px',
                    border: '1px solid #E5E5E5',
                    fontSize: 16,
                  }}
                >
                  <div
                    style={{
                      flex: 5,
                      textAlign: 'left',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item?.path}
                  </div>
                  <div style={{ flex: 2, textAlign: 'center' }}>{item?.size}</div>
                  <div style={{ flex: 2, textAlign: 'center' }}>{item?.type}</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <HighlightOffIcon
                      onClick={() => handleRemove(item, index)}
                      style={{ cursor: 'pointer', fontSize: '30px' }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Grid
          container
          xs={12}
          justifyContent='center'
          style={{ marginBottom: 20, marginTop: 15 }}
        >
          <Button
            variant='contained'
            onClick={handleClose}
            style={{ padding: '5px 30px', marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            style={{ padding: '5px 40px', marginLeft: 10 }}
            onClick={handleUpload}
          >
            Submit
          </Button>
        </Grid>
      </Dialog>
    </div>
  );
};
export default UploadFiles;
