
import React, { useState, useContext,useEffect } from 'react'
import { withRouter,useHistory } from 'react-router-dom';

import Layout from '../../../Layout'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {  TextField, Grid, Button, useTheme} from '@material-ui/core'

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
  },
  containerQuestion: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginLeft:'10px'
  },
  cardContainer: {
    width: '98%',
    minHeight: '100px',
    border: '1px solid black',
    margin: 'auto',
    marginTop: '15px',
    padding: '8px'
  },questionOptions: {
    fontSize: '1rem'
  },
  quizAnswer: {
    display: 'inline-block',
    marginLeft: '10px'
  },




 
}));


  


const AssignQP = (props) => {
  const classes = useStyles()
  // const data = props.location.state.data
  const {location:{state:{data}={}}={}}=props||{}
  const history = useHistory()

//   const gradeObj=data.grade
  const [wordCount,setWordCount] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
  const JSON5 = require('json5')
  const [selectedQp,setSelectedQp]=useState()

  const [qpList, setQpList] = useState([]);
  const [questionData,setQuestionData]=useState([]);
  const branchId=roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  useEffect(() => {
      getQP();
     }, []);
      const getQP =  () => {

        axios
      .get(`${endpoints.questionPaper.FETCHQP}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setQpList(result.data.result);

        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
      };
 
      const handleSubmit = (e) => {

    setLoading(true);
    let requestData= {}
    
      requestData = {
      "quiz_test_paper": 80
      }

    axiosInstance.put(`${endpoints.questionPaper.AssignQP}${data}/assign-quiz/`, requestData)
    .then(result => {
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', result.data.message);
      history.push('/erp-online-class')
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', "Cant Assign Question Paper");
    }) 
    };
      
       
  


const handleQPSelect = (event,value) =>{
  if (value){
    setSelectedQp(value.question_paper)
  }
  axiosInstance
  .get(`${endpoints.questionPaper.QuestionsInQP}?question_paper=${
    value.question_paper
  }`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  })
  .then((result) => {
    if (result.data.status_code === 200) {
      setQuestionData(result.data.result);

    } else {
      setAlert('error', result.data.message);
    }
  })
  .catch((error) => {
    setAlert('error', error.message);
  });
}
const questionCard = (data, index) => {
  try {
    const filteredOptions = Object.entries(data.options).filter(([key, value]) => value !== null)
    return (
      <div className={classes.cardContainer}>
        <Grid container>
          <Grid item >{index + 1}</Grid>
          <Grid item xs={11}>
            <div
              dangerouslySetInnerHTML={{ __html: index+1 && data.question }}
              className={classes.containerQuestion}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {filteredOptions.map(([key, value], i) => {
            let tempValue=Object.values(value)
            return (
              <Grid
                item
                xs={6}
                md={3}
                key={`${key}-${i}`}
                className={classes.questionOptions}
              >
                <span>{i + 1}.</span>
                <div
                  dangerouslySetInnerHTML={{ __html: tempValue && tempValue[0].optionValue }}
                  className={classes.quizAnswer}
                />
              </Grid>
            )
          })}
        </Grid>
        <Grid
          style={{
            marginTop: '20px'
          }}
          container
          justify='space-between'
          spacing={2}
        >
          <Grid item xs={12} md={4}>
            <span>Answer: </span>
            {
              typeof data.answer === 'object' ? data.answer : (
                <div
                  dangerouslySetInnerHTML={{ __html: data.answer[0] }}
                  className={classes.quizAnswer}
                />
              )
            }
          </Grid>
         
        </Grid>
      </div>
    )
  } catch (err) {
    return <span>The JSON is not in the proper format. Please Contact Technical Team</span>
  }
}


  

  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleQPSelect}

              id='grade'
              required
              disableClearable
              options={qpList}
              filterSelectedOptions
              getOptionLabel={(option) => option?.test_name}

              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Question Paper'
                  placeholder='Question Paper'
                />
              )}
            />
                    </Grid>
         
        </Grid>
        <div>
        {questionData && questionData.questions &&questionData.questions && questionData.questions.map((item, index) => {
          return (
            <div key={item.id}>
              {
                item.id &&
                questionCard(item.question_answer[0], index)
              }
            </div>
          )
        })}
      </div>

        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white',marginTop:'30px' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!selectedQp}
            >
              Assign
        </Button>
          </Grid>
        </Grid>

       

      </Layout>
    </>
  )
}

export default withRouter(AssignQP)