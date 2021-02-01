import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom';

import Layout from '../../Layout'
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/EditOutlined';

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


  


const ViewGenre = () => {
  const classes = useStyles()

  
  const [currentTab,setCurrentTab] =useState(0)
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
    } 
  }
//   const EditGenreNav = (item) => {
//     this.props.history.push({
//       pathname: '/blog/create/genre',
//       state: { item },
//     });
//   };

  const activeTabContent = () =>{
    return <div>
    <Grid container spacing={2}>
    { genreListRes && genreListRes.length
      ? genreListRes.map((item) => {
        return <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.root} 
        //   style={{ border: '1px solid #FEE4D4' ,height:'150px' }}
          style={{
            width: '100%',
            height: '120%',
            overflow: 'auto',
            // background: 'grey',
            border: '1px solid #FEE4D4',
            // padding: '40px'
          }}
          >
          <CardHeader  style={{fontSize: '15px'}}
      style={{fontSize: '15px'}}
      title=
      {
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> {item.genre} 
         

                <span style={{float:'right'}}
        //   onClick={() => EditGenreNav(item)}
        >
          <EditIcon />
        </span>

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

  
  
  const handleTabChange = (event,value) =>{
    setCurrentTab(value)
  }

  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

       
        <Grid container spacing={3}>
          <Grid item xs={12}>

            <Tabs value={currentTab} indicatorColor='primary'

              textColor='primary'
              onChange={handleTabChange} aria-label='simple tabs example'>

              <Tab label='All'

              />
              

            
            </Tabs>
          </Grid>
        </Grid>{decideTab()}

      </Layout>
    </>
  )
}

export default withRouter(ViewGenre)