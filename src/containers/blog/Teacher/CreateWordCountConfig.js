
import React, { useState, useContext,useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout'
import Autocomplete from '@material-ui/lab/Autocomplete';

import {  TextField, Grid, Button, useTheme} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    paddingLeft:'10%'
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
}));


  


const CreateWordCountConfig = () => {

  
  const [wordCount,setWordCount] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [grade, setGrade] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState('');
  const [moduleId, setModuleId] = useState(68);

  const [gradeList, setGradeList] = useState([]);

  const branchId=roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};


  const handleSubmit = (e) => {
    const chkWordCount=+wordCount
    const chkNumber = Number.isInteger(chkWordCount)
      if (!chkNumber){
        setAlert('error',"please enter a valid word count with integer" );

      }else{

    setLoading(true);
   
    let requestData= {}
   
      requestData = {
        "word_count":wordCount,
        "grade_id":selectedGrades
      }
  

    axiosInstance.post(`${endpoints.blog.WordCountConfig}`, requestData)

    .then(result=>{
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', result.data.message);
    } else {        
      setLoading(false);
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', error.message);
    }) }
    };
    useEffect(() => {
        const getInActiveList = () => {
          axiosInstance.get(`${endpoints.blog.WordCountConfig}?is_delete=True`)
            .then((res) => {
                setInActiveListRes(res.data.result)
            }).catch(err => {
                console.log(err)
            })
        }
        getInActiveList();
      }, []);

      useEffect(() => {
        const getActiveList = () => {
          axiosInstance.get(`${endpoints.blog.WordCountConfig}?is_delete=False`)
            .then((res) => {
                setActiveListRes(res.data.result)
            }).catch(err => {
                console.log(err)
            })
        }
        getActiveList();
      }, []);
      
    useEffect(() => {
        if (branchId) {
          setGrade([]);
          getGradeApi();
        }
      }, [branchId]);

      const getGradeApi = async () => {
        try {
          setLoading(true);
          const result = await axiosInstance.get(
            `${endpoints.communication.grades}?branch_id=${branchId}&module_id=${moduleId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const resultOptions = [];
          if (result.status === 200) {
            result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
            if (branchId) {
              setGrade(resultOptions);
            }
            setGradeList(result.data.data);
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


      const handleGrade = (event, value) => {
        if (value) {
          
          setSelectedGrades(value.id);
         
        } else {
            setSelectedGrades();
        }
        }
      
const handleWordCountChange = (e) => {
  setWordCount(e.target.value);
};
const handleTabChange = (event,value) =>{
    setCurrentTab(value)
  }
  const decideTab =() => {
    if (currentTab === 0) {
      return activeTabContent()
    } else if (currentTab === 1) {
      return inActiveTabContent()
    }
  }

  const activeTabContent= () =>{
    return <div> 
    <Grid container spacing={2}>
    { activeListRes && activeListRes.length
      ? activeListRes.map((item) => {
        return <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.root} style={{ border: '1px solid #FEE4D4'  }}>
          <CardHeader  style={{fontSize: '15px'}}
      action={
        <IconButton aria-label="settings" style={{fontSize: '15px'}}>
         {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
        </IconButton>
      }
      style={{fontSize: '15px'}}
      title= {
        <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> {item.category}  
</p>

      }
      subheader={
        <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
        {item.sub_category_name}  <br />
      {item.sub_sub_category_name}</p>
      }
    />
          </Card>                        
          </Grid>
                                                
          })
      : ''
    }
  </Grid>
    </div>
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
              className='dropdownIcon'
              options={gradeList}
              filterSelectedOptions
              getOptionLabel={(option) => option?.grade__grade_name}

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
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label='Word Count'
                defaultValue=''
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 3 }}
                onChange={(event,value)=>{handleWordCountChange(event);}}
                color='secondary'
                size='small'
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
              disabled={!wordCount || !selectedGrades}
            >
              Save
        </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Tabs value={currentTab} indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange} aria-label='simple tabs example'>
              <Tab label='Active'
              />
              <Tab label='In-Active'
              />
            </Tabs>
          </Grid>
        </Grid>{decideTab()}

       

      </Layout>
    </>
  )
}

export default withRouter(CreateWordCountConfig)