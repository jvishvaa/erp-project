/* eslint-disable react/jsx-wrap-multilines */
import React, { useState ,useContext} from 'react';
import { withStyles, makeStyles,useTheme } from '@material-ui/core/styles';
import { Grid, Card, Button, Typography, Divider ,SvgIcon} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Face from '@material-ui/icons/Face'

import endpoints from '../../../config/endpoints';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import moment from 'moment';

import unfiltered from '../../../assets/images/unfiltered.svg'

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
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'auto',
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


  return (
    <div className={classes.root}>
      {data.length ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid item>
              <Card
                className={classes.card}
                style={{
                  width: '100%',
                  height: '290px',
                  backgroundSize: '520px 290px',
                  backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  display:data.length >= 1 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 10,


                }}
              >
                <CardHeader
                  subheader={
                    <Typography
                      gutterBottom
                      variant='body2'
                      align='left'
                      component='p'
                      style={{ color: 'white' }}
                    >
                      {data[0] && moment(data[0].created_at).format('MMM DD YYYY')}
                      
                    </Typography>
                    
                  }
                />
           
                <CardActionArea>
                   <CardContent style ={{ padding:'5px'}}>
                    <Typography
                      style={{
                        marginTop: '-35px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[0] && data[0].title}
                    </Typography>
                    <Typography
                      style={{
                        color: 'white',
                        paddingRight:'360px',
                       
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px'}}/>
                   </IconButton>
                      {data[0] && data[0].author.first_name}
                    </Typography>
                   
                  </CardContent>
                </CardActionArea>
                {data[0]&&data[0].status === '4' ?
                <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '310px'
            //  ,paddingTop:'100px'
                }}>
                  {data[0]&&data[0].status === '4' ?
                   data[0]&&data[0].published_level === "2" ?
                   'Published at branch level' :data[0]&&data[0].published_level === "3" ?
                  'Published at grade level':data[0]&&data[0].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> :''}
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[0] ,tabValue :props.tabValue},
                      })}
                  >
                    Read more
                  </Button>
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                    {data[0]&&data[0].status === '5' ? 'Revision' :''}</p>
                </CardActions>
              </Card>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    display:data.length >= 2 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '350px',
                    backgroundSize: '250px 350px',
                    backgroundImage: `url(${data[1] && data[1].thumbnail})`,
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 10,


                  }}
                  className={classes.card}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[1] && moment(data[1].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                  <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        style={{
                          marginTop: '-10px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[1] && data[1].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[1] && data[1].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  {data[1]&&data[1].status === '4' ?
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '90px'
            //  ,paddingTop:'100px'
                }}>
                  {data[1]&&data[1].status === '4' ?
                   data[1]&&data[1].published_level === "2" ?
                   'Published at branch level' :data[1]&&data[1].published_level === "3" ?
                  'Published at grade level':data[1]&&data[1].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> :''}
                  <CardActions style={{ float: 'right' }}>
                    
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[1],tabValue :props.tabValue },
                        })}
                    >
                      Read more
                    </Button>
                    <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                      {data[1]&&data[1].status === '5' ? 'Revision' :''}</p>

                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                 style={{
                  display:data.length >= 3 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '350px',
                  backgroundSize: '250px 350px',
                  backgroundImage: `url(${data[2] && data[2].thumbnail})` ,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 10,


                }}
                 
                  className={classes.card}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[2] && moment(data[2].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        style={{
                          marginTop: '-15px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[2] && data[2].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[2] && data[2].author.first_name}
                    </Typography>
                      
                    </CardContent>
                  </CardActionArea>
                  {data[2]&&data[2].status === '4' ?
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '90px'
            //  ,paddingTop:'100px'
                }}>
                  {data[2]&&data[2].status === '4' ?
                   data[2]&&data[2].published_level === "2" ?
                   'Published at branch level' :data[2]&&data[2].published_level === "3" ?
                  'Published at grade level':data[2]&&data[2].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> :''}
                  <CardActions style={{ float: 'right' }}>
                 
                    <Button
                      size='small'
                      color='primary'
                      style={{  width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[2] ,tabValue :props.tabValue},
                        })}
                    >
                      Read more
                    </Button>
                    <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                      {data[2]&&data[2].status === '5' ? 'Revision' :''}</p>

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
                    display:data.length >= 4 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '350px',
                    backgroundSize: '250px 350px',
                    backgroundImage: `url(${data[3] && data[3].thumbnail})`,
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 10,


                  }}
                  className={classes.card}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[3] && moment(data[3].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        style={{
                          marginTop: '-15px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[3] && data[3].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[3] && data[3].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  {data[3]&&data[3].status === '4' ?
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '90px'
            //  ,paddingTop:'100px'
                }}>
                  {data[3]&&data[3].status === '4' ?
                   data[3]&&data[3].published_level === "2" ?
                   'Published at branch level' :data[3]&&data[3].published_level === "3" ?
                  'Published at grade level':data[3]&&data[3].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> :''}
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[3],tabValue :props.tabValue },
                        })}
                    >
                      Read more
                    </Button>
                    <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                      {data[3]&&data[3].status === '5' ? 'Revision' : ''}</p>

                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '350px',
                    backgroundSize: '250px 350px',
                    display:data.length >= 5 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: `url(${data[4] && data[4].thumbnail})`,
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 10,


                  }}
                  
                  className={classes.card}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[4] && moment(data[4].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        style={{
                          marginTop: '-15px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[4] && data[4].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[4] && data[4].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  {data[4]&&data[4].status === '4' ?
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '90px'
            //  ,paddingTop:'100px'
                }}>
                  {data[4]&&data[4].status === '4' ?
                   data[4]&&data[4].published_level === "2" ?
                   'Published at branch level' :data[4]&&data[4].published_level === "3" ?
                  'Published at grade level':data[4]&&data[4].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> : ''}
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[4] ,tabValue :props.tabValue},
                        })}
                    >
                      Read more
                    </Button>
                    <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                      {data[4]&&data[4].status === '5' ? 'Revision' : ''}</p>

                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            <Grid item>
              <Card
                style={{
                  width: '100%',
                  display:data.length >= 6 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundImage: `url(${data[5] && data[5].thumbnail})`,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 10,
                  height: '290px',
                  backgroundSize: '520px 290px',

                }}
                className={classes.card}
              >
                <CardHeader
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p' style={{color:'white'}}>
                      {data[5] && moment(data[5].created_at).format('MMM DD YYYY')}
                    </Typography>
                  }
                />
                <CardActionArea>
                   <CardContent style ={{ padding:'5px'}}>
                    <Typography
                      style={{
                        marginTop: '-35px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[5] && data[5].title}
                    </Typography>
                    <Typography
                      style={{
                        color: 'white',
                        paddingRight:'360px',
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[5] && data[5].author.first_name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {data[5]&&data[5].status === '4' ?
                <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' ,marginLeft: '20px',
             paddingRight: '310px'
            //  ,paddingTop:'100px'
                }}>
                  {data[5]&&data[5].status === '4' ?
                   data[5]&&data[5].published_level === "2" ?
                   'Published at branch level' :data[5]&&data[5].published_level === "3" ?
                  'Published at grade level':data[5]&&data[5].published_level === "4" ?
                  'Published at section level': "Published at orchids level" :''}</p> :''}
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{  width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[5],tabValue :props.tabValue},
                      })}
                  >
                    Read more
                  </Button>
                  <p style={{ fontSize:'12px',fontFamily: 'Arial', color: 'green', 'margin-left': '1rem' }}>
                    {data[5]&&data[5].status === '5' ? 'Revision' :''}</p>

                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ) : 
      (
        <div className="periodDataUnavailable">
            <SvgIcon
                component={() => (
                    <img
                        src={unfiltered}
                    />
                )}
            />
           
        </div>
    )
      }
    </div>
  );
}

export default withRouter(GridList);
