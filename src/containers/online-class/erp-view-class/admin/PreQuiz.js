
import React, { useState, useContext,useEffect } from 'react'
import { withRouter,useHistory } from 'react-router-dom';

import Layout from '../../../Layout'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {  TextField, Grid, Button, useTheme, Typography} from '@material-ui/core'
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';

import Loading from '../../../../components/loader/loader';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    paddingLeft:'10px',
    borderRadius:'10px',
    height:'110px',
    border:'1px #ff6b6b solid'
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
    boxShadow: '0px 0px 10px -5px #fe6b6b',
    borderRadius: '.5rem'
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  typoStyle:{
    fontSize:'12px',
    padding:'1px',
    marginTop: '-5px',
    marginRight: '20px'
  }
 
}));


  


const PreQuiz = (props) => {
  const classes = useStyles()
  const data = props.location.state.data
  const history = useHistory()

  console.log(data,props.location.state.data,"@@@@@@@@@@@@@@@@AssignQP")
  const [wordCount,setWordCount] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));

  const [preQuizInfo, setPreQuizInfo] = useState([]);
  const {email}=JSON.parse(localStorage.getItem('userDetails')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [isOneOfTheHosts,setIsOneOfTheHosts]=useState(false)
  console.log(email,"@@@@@@@@@@@@@@email")
  if(email === preQuizInfo && preQuizInfo.tutor_details && preQuizInfo.tutor_details.email ){
    setIsOneOfTheHosts(true)
  }
  useEffect(() => {
      getPreQuizStatus();
     }, []);
      const getPreQuizStatus =  () => {

        axiosInstance
      .get(`${endpoints.onlineClass.PreQuiz}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setPreQuizInfo(result.data.result);

        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
      };
 
 
const handleSubmit = () =>{
  const url = `/quiz/start/${preQuizInfo.online_class && preQuizInfo.online_class.id}`
  let link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.click()
  link.remove()

}
const handleCreateLobby = ()=>{
//   let { MPQUIZ } = socketUrls
//   const jwtToken = localStorage.getItem('id_token')
//   const { onlineClassId } = this.state.quizInfo
//   var ws = new window.WebSocket(`${MPQUIZ}${onlineClassId}/${jwtToken}/`)
//   this.setState({ creatingLobby: true, creationFailed: false })
//   // websocket onopen event listener
//   ws.onopen = () => {
//     console.log('connected websocket main component')
//     this.setState({ ws: ws })
//   }
//   ws.onmessage = evt => {
//     // listen to data sent from the websocket server
//     const messageFromServer = JSON.parse(evt.data)
//     const { event } = messageFromServer || {}
//     let { joinLobby } = eventLabels
//     if (event === joinLobby) {
//       const {
//         status: { success, message: statusMessage } = {},
//         quiz_details: { lobby_uuid: lobbyUuid }
//       } = messageFromServer
//       if (success) {
//         let lobbyId = onlineClassId
//         this.props.history.push(`/quiz/game/${onlineClassId}/${lobbyUuid}/${lobbyId}/`)
//         this.setState({ creatingLobby: false, creationFailed: false })
//       } 
//       else {
//         this.props.alert.error(`${statusMessage}`)
//         this.setState({ creatingLobby: false, creationFailed: true })
//       }
//     }
//     ws.close()
//   }
//   ws.onclose = e => {
//     this.setState({ ws: ws })
//     console.log(`Socket is closed.`, e.reason)
//   }

//  // websocket onerror event listener
//  ws.onerror = err => {
//   this.setState({ ws: ws })
//   console.error('Socket encountered error: ', err.message, 'Closing socket')
//   this.setState({ creatingLobby: false, creationFailed: true })
//   this.props.alert.error('Failed to create lobby, Please try again.')
//   ws.close()
// }
// getPreQuizStatus()

}

// baseURL:'http://127.0.0.1:8000/qbox'


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
      <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
      <div className='message_log_breadcrumb_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
      <CommonBreadcrumbs componentName='Start Quiz' />
    {/* chks quiz ended or not */}
    { preQuizInfo.lobby_info && preQuizInfo.lobby_info.is_ended ?       
        <Typography style={{fontSize:'16px',fontWeight:'bold',marginTop:'150px',marginLeft:'320px'}}>Quiz has been ended at  {preQuizInfo.lobby_info && preQuizInfo.lobby_info.ended_at}</Typography>
    : 
    // chks lobby created r not 
        preQuizInfo.lobby_info && preQuizInfo.lobby_info.lobby_identifier ? 
        <div>
        <Typography style={{marginTop:'100px',marginLeft:'320px'}}>OnlineClass Name : {preQuizInfo.online_class && preQuizInfo.online_class.title}</Typography>
        <Typography style={{marginTop:'10px',marginLeft:'320px'}}>Question Paper : {preQuizInfo.online_class && preQuizInfo.online_class.test_details && preQuizInfo.online_class.test_details.test_name }</Typography>
        <Typography style={{marginTop:'10px',marginLeft:'320px'}}>Duration : {preQuizInfo.online_class && preQuizInfo.online_class.test_details && preQuizInfo.online_class.test_details.test_duration }</Typography>
        <Typography style={{marginTop:'10px',marginLeft:'320px'}}>No Of Questions : {preQuizInfo.online_class && preQuizInfo.online_class.test_details && preQuizInfo.online_class.test_details.total_question }</Typography>

         <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white',marginTop:'45px',marginLeft:'100px' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              >
              Join Quiz
          </Button>
          </Grid>
          </Grid> 
          </div>
        : 
        // create lobby if identifier is not there
        isOneOfTheHosts &&   preQuizInfo.lobby_info && preQuizInfo.lobby_info.lobby_identifier === ""  ?
        <Button
        variant='contained'
        style={{ color: 'white',marginTop:'45px',marginLeft:'100px' }}
        color="primary"
        className="custom_button_master"
        size='medium'
        type='submit'
        onClick={handleCreateLobby}
        >
        Create Lobby
    </Button>
        :
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
        </Grid>
        <Grid item xs={12} sm={6}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
        <div style={{fontSize:'16px',fontWeight:'bold',marginLeft:'130px',marginTop:'200px',paddingTop:'30px',padding:'10px'
        ,
        width:'520px',height:'80px'}}>
          
        { preQuizInfo.lobby_info && preQuizInfo.lobby_info.question_paper === "" ? 
          'This onlineclass does not have quiz associated with it.'
          : preQuizInfo.lobby_info && preQuizInfo.lobby_info.lobby_identifier === ""? 
          'Quiz lobby is not created yet. Please wait untill the host creates it'
        :
          ''}</div>
        
        </Grid>
         
        </Grid>
       
}
       </div>
       </div>

      </Layout>
    </>
  )
}

export default withRouter(PreQuiz)