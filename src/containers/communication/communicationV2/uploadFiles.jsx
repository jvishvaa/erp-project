import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Typography from '@material-ui/core/Typography';
import { Grid, Divider, makeStyles } from '@material-ui/core';
import DNDFileUpload from 'components/dnd-file-upload';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from './../../../context-api/alert-context/alert-state';
import Loader from './../../../components/loader/loader';
import ConfirmModal from 'containers/assessment-central/assesment-card/confirm-modal';

const UploadFiles = ({ openUpload, setOpenUpload, handleFiles, branchId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [filenames,setFilenames] = useState([])
  const [openModalFinal,setOpenModalFinal] = useState(false)
  const [filesToDelete,setFilesToDelete] = useState()
  const [idToDelete,setIdToDelete] = useState()
 
  const handleClose = (Submit) => {
    if(Submit){
      setOpenUpload(false);
      handleFiles(files)
      setFilenames([])
      setFiles([])
      setAlert('success','File submitted successfully')
    }else{
      handleFiles([])
      setOpenUpload(false);
      setFilenames([])
      setFiles([])
    }
  };
  const handleRemove = () => {
    files.splice(idToDelete, 1);
    const removeName = filenames.filter((z) => z != filesToDelete);
    setFiles(files);
    setFilenames(removeName)
  };
  const handleUpload = (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('branch_id', branchId);
    formData.append('file', e)

    if (branchId) {
      axiosInstance
        .post(`${endpoints.announcementNew.uploadingFile}`, formData)
        .then((res) => {
          if (res.status === 200) {
            setAlert('success', res?.data?.message);
            setFiles((pre)=>[...pre,res?.data?.data])
            setFilenames((pre)=>[...pre,(res?.data?.data[0]).split("/")])
          } else {
            setAlert('error', res?.data?.message);
          }
          setLoading(false);
        })
        .catch((e) => {
          // setAlert('error',e.response.message)
        });
    } else {
      setAlert('warning', 'Please select Branch');
      setLoading(false)
    }
  };


  const fileConf = {
    fileTypes: 'image/jpeg,image/png,.pdf,video/mp4,audio/mpeg',
    types: 'images,pdf,mp3,mp4',
    initialValue: '',
  };
  return (
    <div>
      
      <Dialog
        // fullScreen={true}
        open={openUpload}
        onClose={()=>handleClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth={true}
        maxWidth='sm'
      >
        {loading && <Loader />}
        <Grid item container justifyContent='space-between' alignItems='center' xs={12}>
          <Typography
            style={{ color: '#676767', paddingLeft: 15, fontWeight: 600, fontSize: 25 }}
          >
            Upload File
          </Typography>
          <HighlightOffIcon
            onClick={()=>handleClose(false)}
            style={{ cursor: 'pointer', paddingRight: 15, fontSize: '50px' }}
          />
        </Grid>
        <Divider />
        <div style={{ padding: 20 }}>
          <DNDFileUpload
            value={fileConf.initialValue}
            handleChange={(e) => {
              if (e) {
                handleUpload(e);
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
            <div style={{ flex: 2, textAlign: 'center',paddingRight: 25 }}>Type</div>
            <div style={{ flex: 1, textAlign: 'center' }}></div>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'scroll' }}>
            {filenames &&
              filenames?.map((item, index) => (
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
                    {item[2]}
                  </div>
                  <div style={{ flex: 2, textAlign: 'center' }}>
                    {item[2].split(".")[1]}
                    </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <HighlightOffIcon
                      onClick={() => {
                        setOpenModalFinal(true)
                        setFilesToDelete(item)
                        setIdToDelete(index)
                      }
                      }
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
            onClick={()=>handleClose(false)}
            style={{ padding: '5px 30px', marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            style={{ padding: '5px 40px', marginLeft: 10 }}
            onClick={()=>handleClose(true)}
          >
            Submit
          </Button>
        </Grid>
        <ConfirmModal
          submit={handleRemove}
          openModal={openModalFinal}
          setOpenModal = {setOpenModalFinal}
        />
      </Dialog>
    </div>
  );
};
export default UploadFiles;
