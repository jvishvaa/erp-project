import React, {useContext} from 'react';
import { Dialog, DialogTitle, Button, Grid } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useHistory } from 'react-router-dom';
import endpoints from '../../config/endpoints';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';



const NotifyConfirmPopUp = (props) => {
  const { openModal, handleNotifyPopUp,startDate,sectionId,rolesId } = props;
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = React.useState(false);



  const sendNotification = () =>{
    setLoading(true)
    const sectionMappingId = sectionId.toString()
    const payLoad = {
      section_mapping_id:sectionMappingId,
      date : startDate,
      role : rolesId,
    }
    axiosInstance.post(`${endpoints.academics.notifyAttendance}`,payLoad).then((result)=>{
      if(result.data.status_code === 200){
        setAlert('success',result?.data?.message)
        setLoading(false)
      }else{
        setAlert('errorr',result?.data?.message)
        setLoading(false)
      }
    }
    )
  }

  return (
    <Dialog
      className='reminderDialog'
      open={openModal}
      //   onClose={handleNotifyPopUp(false)}
      aria-labelledby='draggable-dialog-title'
    >
      {loading && <Loader />}
      <HighlightOffIcon
        onClick={() => handleNotifyPopUp(false)}
        style={{ position: 'absolute', right: 5, top: 5, cursor: 'pointer' }}
      />
      <DialogTitle id='draggable-dialog-title'>
        <Grid style={{ marginTop: 15 }}>
          Share the attendance status for the following students?
        </Grid>
        <Grid style={{ color: 'red', fontSize: 14, fontWeight: 600 }}>
          ( These students were not "PRESENT" )
        </Grid>
      </DialogTitle>
      <Grid container justifyContent='center' style={{ marginBottom: 20 }}>
        <Button
          onClick={() => handleNotifyPopUp(false)}
          style={{ fontWeight: 600, marginRight: 10 }}
          className='labelColor cancelButton'
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          style={{ marginLeft: 10 }}
          color='primary'
          onClick={() => {
            sendNotification()
            handleNotifyPopUp(false);           
          }}
        >
          Send Notification
        </Button>
      </Grid>
    </Dialog>
  );
};

export default NotifyConfirmPopUp;
