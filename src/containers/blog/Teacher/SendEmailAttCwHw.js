
import React, { useState, useContext ,useEffect} from 'react'
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout'
import { SvgIcon, TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';

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
  rootG: {
    flexGrow: 1,
  },
  typoStyle:{
    fontSize:'12px',
    padding:'1px',
    marginTop: '-5px',
    marginRight: '20px'
  },
  periodDataUnavailable:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    marginLeft:'350px'
  }
}));


  


const SendEmailAttCwHw = (props) => {

  const [response,setResponse] = useState('');

  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const [selectedGrades, setSelectedGrades] = useState('');
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [sucessCount,setSucessCount]=useState('');
  const [gradeList, setGradeList] = useState([]);
  const [branchId]= useState(roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0])
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};


  const handleSubmit = (e) => {

    axiosInstance.post(`${endpoints.email.email}`)

    .then(result=>{
    if (result.data.status_code === 200) {
      setSucessCount(result.data.result)
      setLoading(false);
      setAlert('success', result.data.message);
    } else {        
      setLoading(false);
      setAlert('error', "duplicates not allowed");
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', "duplicates not allowed");
    })
    };

  




        
const handleGrade = (event, value) => {
  if (value) {
    setSelectedGrades(value.id);
  } else {
      setSelectedGrades();
  }
  }
  useEffect(() => {
    if (branchId) {
      getGradeApi();
    }
  }, [branchId]);

  const getGradeApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.masterManagement.grades}?page=${1}&page_size=${30}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        setGradeList(result.data.result.results);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleFilter = () =>{
    getData();
  }
  const getData = () =>{
      axiosInstance.get(`${endpoints.email.email}?grade_id=${selectedGrades}`).then((res) => {
          setResponse(res.data.result)
      }).catch(err => {
          console.log(err)
      })
  
  }


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                    { gradeList.length ? ( 
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              disableClearable
              className='dropdownIcon'
              options={gradeList}
              filterSelectedOptions
              getOptionLabel={(option) => option?.grade_name}

              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
               ) : null }
                    </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleFilter}
              disabled={!selectedGrades}
            >
              Fetch
        </Button>
          </Grid>

        </Grid>
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid>
        <p 
        style={{paddingLeft:'30px',paddingTop:'10px',fontSize:'16px',paddingBottom:'10px'}}
        >
          {response.message}</p>
          </Grid>
                  <Grid>
                  <p                   style={{paddingLeft:'30px',paddingTop:'10px',fontSize:'16px',paddingBottom:'10px', color:'blue'}}
>{response.att}</p></Grid>
<Grid>
                  <p                   style={{paddingLeft:'30px',paddingTop:'10px',fontSize:'16px',paddingBottom:'10px', color:'blue'}}
>{response.hw}</p>
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
              >
              Send Email
        </Button>
              <p  style={{width:'500px',fontSize:'12px',marginTop:'30px'}}
>*Note:Email will send only to configured Grades of Attendace/HW/CW</p>
<p style={{width:'500px',fontSize:'12px',marginTop:'40px',color:'green'}}> {sucessCount ? "Email delivered to " +  sucessCount  +  "  students":'' }</p>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default withRouter(SendEmailAttCwHw)
