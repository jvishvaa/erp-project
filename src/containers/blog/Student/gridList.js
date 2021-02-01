/* eslint-disable react/jsx-wrap-multilines */
import React, { useState ,useContext} from 'react';
import { withStyles, makeStyles,useTheme } from '@material-ui/core/styles';
import { Grid, Card, Button, Typography, Divider } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
// import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import endpoints from '../../../config/endpoints';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import Box from '@material-ui/core/Box';
import moment from 'moment';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: -30,
  },
  card: {
    // backgroundColor: 'red',
    // padding: theme.spacing(2),
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'auto',
    // backgroundColor: 'grey',
    // backgroundImage: `url(${'https://robbreport.com/wp-content/uploads/2016/09/lamborghini_huracan_slideshow_lead.jpg?w=772'})`,
    // color: theme.palette.text.secondary,
  },
}));

function GridList(props) {
  const classes = useStyles();
  const { data } = props;
  const {tabValue} = props.tabValue;
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };
  const handleDeleteBlog = (blogId) => {
    let requestData = {
      "blog_id": blogId ,
      "status": "1"
  
    }
  axiosInstance.put(`${endpoints.blog.Blog}`, requestData)

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
console.log(props.tabValue,"@@22")


  return (
    <div className={classes.root}>
      {data.length ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
            <Grid item>
              <Card
                className={classes.card}
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  display: data.length >= 1 ? '' : 'none',
                }}
              >
                <CardHeader
//                 action=       {
//                   props.tabValue === 2 ?
// <IconButton
//                   title='Delete'
//                   // onClick={handleDeleteBlog(data)}
//                 >
//                   <DeleteOutlinedIcon
//                     style={{ color: themeContext.palette.primary.main }}
//                   />
//                 </IconButton>
//       : '' 
//               }
                  subheader={
                    <Typography
                      gutterBottom
                      variant='body2'
                      align='left'
                      component='p'
                      style={{ color: 'black' }}
                    >
                      {data[0] && moment(data[0].created_at).format('MMM DD YYYY')}
                    </Typography>
                  }
                />
           
                <CardActionArea>
                  <CardContent>
                    <Typography
                      // variant='body2'
                      style={{
                        marginTop: '-35px',
                        // fontSize: 'x-large',
                        fontWeight: 'bold',
                        color: 'black',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[0] && data[0].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-15px', width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[0] },
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    display: data.length >= 2 ? '' : 'none',
                    backgroundSize: '360px',
                    backgroundImage: `url(${data[1] && data[1].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
          //           action={
                      
          //             props.tabValue === 2 ?
                    
          //           <Button
          //             size='small'
          //             type='button'
          //             startIcon={<DeleteIcon />}
          //             // onClick={handleDeleteBlog(data[0].id)}
          //           >
          // </Button> : '' 
          //           }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'black' }}
                      >
                        {data[1] && moment(data[1].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-10px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'black',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[1] && data[1].title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ marginTop: 30, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[1] },
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  style={{
                    backgroundColor: 'grey',
                    width: '100%',
                    height: '290px',
                    display: data.length >= 3 ? '' : 'none',
                    backgroundSize: '360px',
                    backgroundImage: `url(${data[3] && data[3].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
          //           action={
                      
          //             props.tabValue === 2 ?
                    
          //           <Button
          //             size='small'
          //             type='button'
          //             startIcon={<DeleteIcon />}
          //             // onClick={handleDeleteBlog(data[0].id)}
          //           >
          // </Button> : '' 
          //           }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'black' }}
                      >
                        {data[2] && moment(data[2].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'black',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[2] && data[2].title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ marginTop: 30, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[2] },
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    display: data.length >= 4 ? '' : 'none',
                    backgroundSize: '360px',
                    backgroundImage: `url(${data[4] && data[4].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
          //           action={
                     
          //             props.tabValue === 2 ?
                    
          //           <Button
          //             size='small'
          //             type='button'
          //             startIcon={<DeleteIcon />}
          //             // onClick={handleDeleteBlog(data[0].id)}
          //           >
          // </Button> : '' 
          //           }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'black' }}
                      >
                        {data[3] && moment(data[3].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'black',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[3] && data[3].title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ marginTop: 50, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[3] },
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    backgroundSize: '360px',
                    display: data.length >= 5 ? '' : 'none',
                    backgroundImage: `url(${data[3] && data[3].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
          //           action={
                      
          //             props.tabValue === 2 ?
                    
          //           <Button
          //             size='small'
          //             type='button'
          //             startIcon={<DeleteIcon />}
          //             // onClick={handleDeleteBlog(data[0].id)}
          //           >
          // </Button> : '' 
          //           }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'black' }}
                      >
                        {data[4] && moment(data[4].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'black',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[4] && data[4].title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ marginTop: 50, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[4] },
                        })}
                    >
                      Read more
                    </Button>
                    {/* <Route path='/hello' component={ContentView} /> */}
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            {/* </Card> */}
            {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
            <Grid item>
              <Card
                style={{
                  width: '100%',
                  height: '200px',
                  display: data.length === 6 ? '' : 'none',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[5] && data[5].thumbnail})`,
                }}
                className={classes.card}
              >
                <CardHeader
          //         action={
                  
          //           props.tabValue === 2 ?
                    
          //           <Button
          //             size='small'
          //             type='button'
          //             startIcon={<DeleteIcon />}
          //             // onClick={handleDeleteBlog(data[0].id)}
          //           >
          // </Button> : '' 
          //         }
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
                      {data[5] && moment(data[5].created_at).format('MMM DD YYYY')}
                    </Typography>
                  }
                />
                <CardActionArea>
                  <CardContent>
                    <Typography
                      // variant='body2'
                      style={{
                        marginTop: '-35px',
                        // fontSize: 'x-large',
                        fontWeight: 'bold',
                        color: 'black',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[5] && data[5].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-15px', width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[5]},
                      })}
                  >
                    Read more
                  </Button>
                  {/* <Route path='/hello' component={ContentView} /> */}
                </CardActions>
              </Card>
            </Grid>
            {/* </Card> */}
          </Grid>
        </Grid>
      ) : (
        <Typography align='center'>Oops... No blogs Posted</Typography>
      )}
    </div>
  );
}

export default withRouter(GridList);
