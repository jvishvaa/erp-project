
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

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
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

  

  return (
    
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
      <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
      <CommonBreadcrumbs componentName='Start Quiz' />
        {preQuizInfo.lobby_info && preQuizInfo.lobby_info.lobby_identifier ? 
        <div>
        <Typography style={{marginTop:'100px',marginLeft:'250px'}}>OnlineClass Name : {preQuizInfo.online_class && preQuizInfo.online_class.title}</Typography>
        {/* <Typography style={{marginTop:'100px',marginLeft:'250px'}}>OnlineClass Name : {preQuizInfo.online_class && preQuizInfo.online_class.title}</Typography> */}

         <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
</Grid>

          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white',marginTop:'200px',marginLeft:'150px' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              >
              Start Quiz
        </Button>
          </Grid>
        </Grid> 
              </div>:
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
</Grid>
        <Grid item xs={12} sm={6}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                    <div style={{fontSize:'16px',fontWeight:'bold',marginLeft:'130px',marginTop:'200px',paddingTop:'30px',padding:'10px'
                    // ,border:'1px solid red'
                    ,
                    width:'520px',height:'80px'}}>
                      
                      {preQuizInfo.lobby_info && preQuizInfo.lobby_info.question_paper === "" ? 
                      'This onlineclass does not have quiz associated with it.'
                      : preQuizInfo.lobby_info && preQuizInfo.lobby_info.lobby_identifier === ""? 
                      'Quiz lobby is not created yet. Please wait untill the host creates it'
                    :''}</div>
                    </Grid>
         
        </Grid>}
       

       </div>
       </div>

      </Layout>
    </>
  )
}

export default withRouter(PreQuiz)