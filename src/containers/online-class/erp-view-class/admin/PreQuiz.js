
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
import ENVCONFIG from '../../../../config/config';


// import axios from 'axios';

import Loading from '../../../../components/loader/loader';

const {
  apiGateway: { baseURLMPQ },
} = ENVCONFIG;
const ajaxBaseURL = baseURLMPQ // 'http://127.0.0.1:8000/qbox';
// const ajaxBaseURL= 'https://dev.mpquiz.letseduvate.com';

const genSocketBase = () => {
  const { port: isLocal, host } = new URL(ajaxBaseURL);
  const protocol = isLocal ? 'ws' : 'wss';
  return `${protocol}://${host}`;
};
const socketBase = genSocketBase();
const socketBaseURL = `${socketBase}/ws`;
const quizSocketURLEndpoint = `${socketBaseURL}/multiplayer-quiz/<domain_name>/<role>/<online_class_id>/<question_paper>/<user_auth_token>/`



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
  const {location:{state:{data}={}}={}}=props||{}
  const history = useHistory()
  const { match: { params } } = props;

  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [creatingLobby,setCreateLobby]=useState(false)
  const[ws,setWs]=useState()
  const [preQuizInfo, setPreQuizInfo] = useState([]);
  const {email: currentUserEmail, token: userAuthToken}=JSON.parse(localStorage.getItem('userDetails')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [isOneOfTheHosts,setIsOneOfTheHosts]=useState(false)
  
  useEffect(() => {
      getPreQuizStatus();
     }, []);
      const getPreQuizStatus =  () => {
        setLoading(true)
        axiosInstance
      .get(`${endpoints.questionPaper.QuestionsInQP}?lobby_identifier=${params.id}&question_paper=${params.qid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setLoading(false)
        if (result.data.status_code === 200) {
          const data = result.data.result
          const { online_class_info:onlineClassInfo }= data
          const { tutor_details:tutorDetails }= onlineClassInfo || {}
          const {email: tutorEmailId } =tutorDetails ||{}
          if(currentUserEmail === tutorEmailId){
            setIsOneOfTheHosts(true)
          }
          // setPreQuizInfo(result.data.result);
          setPreQuizInfo(data);

        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false)
        setAlert('error', error.message);
      });
      };
 
 
const handleSubmit = () =>{
  const { lobby_info:lobbyInfoObj} = preQuizInfo||{}
  let role=''
  if(isOneOfTheHosts){
    role=0
  }else{
    role=1
  }
  const { 
    lobby_uuid : lobbyUuid= 'uuid-mk-default',
    // lobby_identifier: onlineClassId,
    // question_paper: questionPaperId
  }= lobbyInfoObj||{}
  const questionPaperId = preQuizInfo?.assessment_details?.question_paper_id
  const {online_class_info: onlineClassInfo} = preQuizInfo||{}
  const {online_class: onlineClassObj} = onlineClassInfo||{}
  const {id: onlineClassId} = onlineClassObj||{}
  const url = `/erp-online-class/${onlineClassId}/quiz/${questionPaperId}/${lobbyUuid}/${role}`
  let link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.click()
  link.remove()
}

const handleCreateLobby = ()=>{
  const { host } = new URL(axiosInstance.defaults.baseURL); // "dev.olvorchidnaigaon.letseduvate.com"
  const hostSplitArray = host.split('.');
  const subDomainLevels = hostSplitArray.length - 2;
  let domain = '';
  let subDomain = '';
  let subSubDomain = '';
  if (hostSplitArray.length > 2) {
    domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
  }
  if (subDomainLevels === 2) {
    subSubDomain = hostSplitArray[0];
    subDomain = hostSplitArray[1];
  } else if (subDomainLevels === 1) {
    subDomain = hostSplitArray[0];
  }

  const domainTobeSent = subDomain;
  let role=''
  if(isOneOfTheHosts){
    role=0
  }else{
    role=1
  }
  const questionPaperId = preQuizInfo?.assessment_details?.question_paper_id
  const {online_class_info: onlineClassInfo} = preQuizInfo||{}
  const {online_class: onlineClassObj} = onlineClassInfo||{}
  const {id: onlineClassId} = onlineClassObj||{}

  // let lobbyUuid =  preQuizInfo && preQuizInfo.lobby_identifier && preQuizInfo.lobby_info.lobby_identifier
  // let { MPQUIZ } = socketUrls
  const url = quizSocketURLEndpoint
    .replace('<domain_name>', domainTobeSent)
    .replace('<role>',role)
    .replace('<online_class_id>', onlineClassId)
    .replace('<question_paper>', questionPaperId)
    .replace('<user_auth_token>', userAuthToken);
//   const jwtToken = localStorage.getItem('id_token')
//   const { onlineClassId } = this.state.quizInfo
  var ws = new window.WebSocket(url)
  setCreateLobby(true);
//   this.setState({ creatingLobby: true, creationFailed: false })
//   // websocket onopen event listener
  ws.onopen = () => {
    console.log('connected websocket main component')
    setWs(ws)
//     this.setState({ ws: ws })
  }
  ws.onmessage = evt => {
//     // listen to data sent from the websocket server
    const messageFromServer = JSON.parse(evt.data)
    const { event } = messageFromServer || {}
    // let { joinLobby } = eventLabels
    if (event === "join_lobby") {
      const {
        status: { success, message: statusMessage } = {},
        quiz_details: { lobby_uuid: lobbyUuid = 'uuid-mk-default', 
        lobby_identifier: onlineClassId,
        // question_paper: questionPaperId
      }={}
      } = messageFromServer
      if (success) {
        let lobbyId = data
        // this.props.history.push(`/quiz/game/${on}/${lobbyUuid}/${lobbyId}/`)
        // this.setState({ creatingLobby: false, creationFailed: false })
        getPreQuizStatus()
        // const url = `/quiz/:onlineClassId/:questionpaperId/:lobbyUuid`
        // history.push(`/quiz/game/${data}/${lobbyUuid}/${lobbyId}/`)
        const url = `/erp-online-class/${onlineClassId}/quiz/${questionPaperId}/${lobbyUuid}/${role}`;
        history.push(url);
        setCreateLobby(false);
      } 
      else {
        setAlert('error', `${statusMessage}`);
        setCreateLobby(false)
        // this.props.alert.error(`${statusMessage}`)
//         this.setState({ creatingLobby: false, creationFailed: true })
      }
    }
    ws.close()
  }
  ws.onclose = e => {
//     this.setState({ ws: ws })
    setWs(ws)
    console.log(`Socket is closed.`, e.reason)
  }

//  // websocket onerror event listener
 ws.onerror = err => {
   setWs(ws)
//   this.setState({ ws: ws })
  console.error('Socket encountered error: ', err.message, 'Closing socket')
  setCreateLobby(false)
//   this.setState({ creatingLobby: false, creationFailed: true })
//   this.props.alert.error('Failed to create lobby, Please try again.')
setAlert('error', "Failed to create lobby, Please try again.");

  ws.close()
}

}


const {online_class_info:onlineClassInfo} = preQuizInfo||{}
const {lobby_info:lobbyInfo} = onlineClassInfo||{}

const { is_ended=false,ended_at,lobby_identifier, question_paper } = lobbyInfo||{}


return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
      <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
      <div className='message_log_breadcrumb_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
      <CommonBreadcrumbs componentName='Start Quiz' />
      <div style={{display:'flex', minHeight:'80vh'}}>
        <div style={{margin:'auto'}}>
        
    {/* chks quiz ended or not */}
    {is_ended?
        <Typography style={{fontSize:'16px',fontWeight:'bold'}}>Quiz has been ended at  {preQuizInfo?.online_class_info?.lobby_info && preQuizInfo?.online_class_info?.lobby_info?.ended_at}</Typography>
    : 
    // chks lobby created r not 
        preQuizInfo?.lobby_info && preQuizInfo?.lobby_info?.lobby_identifier?
                <div>
        <Typography>OnlineClass Name : {preQuizInfo?.online_class_info && preQuizInfo?.online_class_info?.online_class && preQuizInfo?.online_class_info?.online_class?.title}</Typography>
        <Typography>Question Paper : {preQuizInfo?.assessment_details?.test_name}</Typography>
        <Typography>Duration : {preQuizInfo?.assessment_details?.test_duration}</Typography>
        <Typography>No Of Questions : {preQuizInfo?.questions.length}</Typography>


            <Button
              variant='contained'
              style={{ color: 'white', width: '100%'}}
              color="primary"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              >
              Join Quiz
          </Button>
          </div>
        : 
        // create lobby if identifier is not there
        isOneOfTheHosts ?
        <div>

        <Button
        variant='contained'
        style={{ color: 'white', width: '100%' }}
        color="primary"
        size='medium'
        type='submit'
        onClick={handleCreateLobby}
        >
        Create Lobby
    </Button>
    </div>
        :
        <div style={{fontSize:'16px',fontWeight:'bold',paddingTop:'30px',padding:'10px'}}>
          
        Quiz lobby is not created yet. Please wait untill the host creates it
          </div>    
}
       </div>
       <div>
      <Button
      variant='contained'
      style={{ width: '50%', backgroundColor: 'lightgray' }}
      size='medium'
      onClick={()=>history.goBack()}
      >
      BACK
      </Button>
      </div>
       </div>
       </div>
       </div>
      </Layout>
    </>
  )
}

export default withRouter(PreQuiz)
