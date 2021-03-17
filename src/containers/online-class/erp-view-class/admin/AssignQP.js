
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
  }
 
}));


  


const AssignQP = (props) => {
  const classes = useStyles()
  const data = props.location.state.data
  const history = useHistory()

//   const gradeObj=data.grade
  console.log(data,props.location.state.data,"@@@@@@@@@@@@@@@@AssignQP")
  const [wordCount,setWordCount] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));

  const [qpList, setQpList] = useState([]);

  const branchId=roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
  // const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  // console.log(token,"@@@@@@@@@@@@@@@@@@tok")
  useEffect(() => {
      getQP();
     }, []);
      const getQP =  () => {

        axios
      .get(`${endpoints.questionPaper.FETCHQP}`, {
        headers: {
          // responseType: 'blob',
            // Authorization: `Bearer ${token}`,
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setQpList(result.data.result);
            console.log(result.data,"@@@@@@@@2")

        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
      };
 
 
      const handleSubmit = (e) => {
    const chkWordCount=+wordCount
    const chkNumber = Number.isInteger(chkWordCount)
      if (!chkNumber){
        setAlert('error',"please enter a valid word count with integer" );

      }else{

    setLoading(true);
    let requestData= {}
      requestData = {
        "word_count":wordCount || data.word_count,
        "grade_id":data.grade.id,
        "wrd_c_con_id":data.id
      }

    // axiosInstance.put(`${endpoints.blog.WordCountConfig}`, requestData)

    // .then(result=>{
    // if (result.data.status_code === 200) {
    //   setLoading(false);
    //   setAlert('success', result.data.message);
    //   history.push('/blog/wordcount-config')
    // } else {        
    //   setLoading(false);
    //   setAlert('error', "word config already existing for this grade");
    // }
    // }).catch((error)=>{
    //   setLoading(false);        
    //   setAlert('error', "word config already existing for this grade");
    // }) 
}
    };
      
       
   
const handleWordCountChange = (e) => {
  setWordCount(e.target.value);
};


  

  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              // onChange={this.handleStatusTwo}

              id='grade'
              // className='dropdownIcon'
              required
              disableClearable
              options={qpList}
            //   value={gradeObj}
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
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!wordCount || !data.word_count}
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