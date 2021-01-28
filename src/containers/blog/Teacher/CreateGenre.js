import React, { useState, useEffect, useContext } from 'react'
import Layout from '../../Layout'
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';


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


  


const CreateGenre = () => {
  const classes = useStyles()

  
  const [currentTab,setCurrentTab] =useState(0)
  const [genreName,setGenreName] =useState('');
  const [genreListRes,setGenreListResponse] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  
  useEffect(() => {
    const getGenreList = () => {
        axiosInstance.get(endpoints.blog.genreList).then((res) => {
            setGenreListResponse(res.data.result)
        }).catch(err => {
            console.log(err)
        })
    }
    getGenreList();
}, []);
      
   const decideTab =() => {
    if (currentTab === 0) {
      return activeTabContent()
    } else if (currentTab === 1) {
      return inActiveTabContent()
    }
  }

  const activeTabContent = () =>{
    return <div>
    <Grid container spacing={2}>
    { genreListRes && genreListRes.length
      ? genreListRes.map((item) => {
        return <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.root} style={{ border: '1px solid #FEE4D4'  }}>
          <CardHeader  style={{fontSize: '15px'}}
      action={
        <IconButton aria-label="settings" style={{fontSize: '15px'}}>
         {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
        </IconButton>
      }
      style={{fontSize: '15px'}}
      title=
      {
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> {item.genre} 
          </p> }
          />
          </Card>
          </Grid>
           
                                                  
            })
        : ''
      }
    </Grid>
    </div>
  } 
  const inActiveTabContent= () =>{
    return <div> 
    <Grid container spacing={2}>
    { genreListRes && genreListRes.length
      ? genreListRes.map((item) => {
        return <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.root} style={{ border: '1px solid #FEE4D4'  }}>
          <CardHeader  style={{fontSize: '15px'}}
      action={
        <IconButton aria-label="settings" style={{fontSize: '15px'}}>
         {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
        </IconButton>
      }
      style={{fontSize: '15px'}}
      title=
      {
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> {item.genre}  
          </p> } />
          </Card>                        
          </Grid>
          })
      : ''
    }
  </Grid>
    </div>
  }
  
  
  
  const handleTabChange = (event,value) =>{
    setCurrentTab(value)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let requestData= {}
   
      requestData = {
        "genre":genreName,
      }
  

    axiosInstance.post(`${endpoints.blog.genreList}`, requestData)

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
    })
    };





const handleGenreNameChange = (e) => {
  setGenreName(e.target.value);
};


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label='Genre Name'
                defaultValue=''
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={(event,value)=>{handleGenreNameChange(event);}}
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
              disabled={!genreName}
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
              

            <Tab label='In-Active'/>
            </Tabs>
          </Grid>
        </Grid>{decideTab()}

      </Layout>
    </>
  )
}

export default CreateGenre