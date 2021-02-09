
import React, { useState, useContext ,useEffect} from 'react'
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout'
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import moment from 'moment';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import DialogActions from '@material-ui/core/DialogActions';

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
  }
}));


  


const EditGenre = (props) => {
    const {item} =props
  const classes = useStyles()
  const [currentTab,setCurrentTab] =useState(0)
  const [genreActiveListRes,setGenreActiveListResponse] = useState('');
  const [genreInActiveListRes,setGenreInActiveListResponse] = useState('');
  const [genreNameEdit,setGenreNameEdit] =useState('');
    console.log(props,"@@@")
  const [genreName,setGenreName] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  const [anchorEl, setAnchorEl] = React.useState(null);
  
  

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
      getGenreList();
   getGenreInActiveList();
    } else {        
      setLoading(false);
      setAlert('error', "duplicates not allowed");
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', "duplicates not allowed");
    })
    };
    const handleEditSubmit = (item) => {
      setLoading(true);
      let requestData= {}
     
        requestData = {
          "genre_id":item.id,
          "genre":genreNameEdit,
        }
    
  
      axiosInstance.put(`${endpoints.blog.genreList}`, requestData)
  
      .then(result=>{
      if (result.data.status_code === 200) {
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

    const handleTabChange = (event,value) =>{
      setCurrentTab(value)
    }
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const activeTabContent = () =>{
      return <div>
      <Grid container spacing={2}>
      { genreActiveListRes && genreActiveListRes.length
        ? genreActiveListRes.map((item) => {
          return <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root} >
        <CardHeader
        style={{padding:'0px'}}
        action=       {
          <Typography>
<IconButton
          title='Delete'
          onClick={()=>handleDelete(item)}
          
        >
          <DeleteOutlinedIcon
            style={{ color: themeContext.palette.primary.main }}
          />
        </IconButton>
        {/* <IconButton
          title='edit'
          onClick={handleClick}          
        >
          <EditOutlinedIcon
            style={{ color: themeContext.palette.primary.main }}
          />
        </IconButton> */}
        {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Grid container>
          <Grid item xs={12}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label='Genre Name'
                defaultValue={item&&item.genre}
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={(event,value)=>{handleGenreNameEditChange(event);}}
                color='secondary'
                size='small'
              />
          </Grid>
          <Grid item xs={12} >
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={()=>handleEditSubmit(item)}
              disabled={!genreNameEdit}
            >
              Save
        </Button>
          </Grid>
        </Grid>
      </Popover> */}
        </Typography>
       
      }
      subheader={
        <Typography
          gutterBottom
          variant='body2'
          align='left'
          component='p'
          style={{ color: '#014b7e' ,pagging:'0px'}}
        >
        Created At : {item && moment(item.created_at).format('MMM DD YYYY')}
        </Typography>
      }
        />
<CardContent  style={{ pagging:'1px'}}>
<Typography  className={classes.typoStyle}>Genre Name: {item.genre} </Typography> 
  <Typography   className={classes.typoStyle}>Created By : {item.created_by.first_name}</Typography>
</CardContent>
        </Card>                        
        </Grid>
                                              
        })
    : ''
  }
</Grid>
  </div>
    } 
    const inActiveTabContent = () =>{
      return <div>
      <Grid container spacing={2}>
      { genreInActiveListRes && genreInActiveListRes.length
        ? genreInActiveListRes.map((item) => {
          return <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.root} >
          <CardHeader
          style={{padding:'0px'}}
        subheader={
          <Typography
            gutterBottom
            variant='body2'
            align='left'
            component='p'
            style={{ color: '#014b7e' ,pagging:'0px'}}
          >
          Created At : {item && moment(item.created_at).format('MMM DD YYYY')}
          </Typography>
        }
          />
  <CardContent  style={{ pagging:'1px'}}>
  <Typography  className={classes.typoStyle}>Genre Name: {item.genre} </Typography> 
  <Typography   className={classes.typoStyle}>Created By : {item.created_by.first_name}</Typography> 
  </CardContent>
          </Card>                        
          </Grid>
                                                
          })
      : ''
    }
  </Grid>
    </div>
    } 
    const handleDelete = (data) => {

      let requestData = {
        "genre_id":data.id,
    
      }
    axiosInstance.put(`${endpoints.blog.genreList}`, requestData)
  
    .then(result=>{
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', result.data.message);
      getGenreList();
      getGenreInActiveList();
    } else {        
      setLoading(false);
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', error.message);
    })
  };
        
  const decideTab =() => {
    if (currentTab === 0) {
      return activeTabContent()
    } else if (currentTab === 1) {
      return inActiveTabContent()
    }
  }
const handleGenreNameChange = (e) => {
  setGenreName(e.target.value);
};
const handleGenreNameEditChange = (e) => {
  setGenreNameEdit(e.target.value);
};

useEffect(() => {
   getGenreList();
   getGenreInActiveList();
}, []);
const getGenreList = () => {
  axiosInstance.get(`${endpoints.blog.genreList}?is_delete=${
    'False'
  }`).then((res) => {
      setGenreActiveListResponse(res.data.result)
  }).catch(err => {
      console.log(err)
  })
}
const getGenreInActiveList = () => {
  axiosInstance.get(`${endpoints.blog.genreList}?is_delete=${
    'True'
  }`).then((res) => {
      setGenreInActiveListResponse(res.data.result)
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
              <Tab label='In-Active'

/>
              

            
            </Tabs>
          </Grid>
        </Grid>{decideTab()}
       

      </Layout>
    </>
  )
}

export default withRouter(EditGenre)