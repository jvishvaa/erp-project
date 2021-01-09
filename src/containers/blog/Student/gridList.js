/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

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
            {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
            <Grid item>
              <Card
                className={classes.card}
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  display: data.length >= 1 ? '' : 'none',
                }}
              >
                <CardHeader
                  action={
                    <Box>
                      <span
                        className='period_card_menu'
                        onClick={() => handlePeriodMenuOpen(data[0] && data[0].id)}
                        onMouseLeave={handlePeriodMenuClose}
                      >
                        <IconButton
                          className='moreHorizIcon'
                          disableRipple
                          color='primary'
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        {showPeriodIndex === (data[0] && data[0].id) && showMenu ? (
                          <div className='tooltipContainer'>
                            <span className='tooltiptext'>Download All</span>
                            <span className='tooltiptext'>Download All</span>
                          </div>
                        ) : null}
                      </span>
                    </Box>
                  }
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
                  <CardContent>
                    <Typography
                      variant='body2'
                      style={{
                        marginTop: '-5px',
                        fontSize: 'x-large',
                        fontWeight: 'bolder',
                        color: 'white',
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
                  {/* <Route path='/hello' component={ContentView} /> */}
                </CardActions>
              </Card>
            </Grid>
            {/* </Card> */}
            {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    display: data.length >= 2 ? '' : 'none',
                    backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
                    action={
                      <LightTooltip
                        interactive
                        title={
                          <>
                            <List component='nav' aria-label='main mailbox folders'>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                      onClick={() => console.log('hi')}
                                    >
                                      Edit
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                    >
                                      Delete
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </>
                        }
                        dataow
                      >
                        <IconButton aria-label='settings'>
                          <MoreHorizIcon />
                        </IconButton>
                      </LightTooltip>
                    }
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
                    <CardContent>
                      <Typography
                        variant='body2'
                        style={{
                          marginTop: '0px',
                          fontSize: 'x-large',
                          fontWeight: 'bolder',
                          color: 'white',
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
                      style={{ marginTop: 50, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[1] },
                        })}
                    >
                      Read more
                    </Button>
                    {/* <Route path='/hello' component={ContentView} /> */}
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
                    backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
                    action={
                      <LightTooltip
                        interactive
                        title={
                          <>
                            <List component='nav' aria-label='main mailbox folders'>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                      onClick={() => console.log('hi')}
                                    >
                                      Edit
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                    >
                                      Delete
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </>
                        }
                        dataow
                      >
                        <IconButton aria-label='settings'>
                          <MoreHorizIcon />
                        </IconButton>
                      </LightTooltip>
                    }
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
                    <CardContent>
                      <Typography
                        variant='body2'
                        style={{
                          marginTop: '0px',
                          fontSize: 'x-large',
                          fontWeight: 'bolder',
                          color: 'white',
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
                      style={{ marginTop: 50, width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[2] },
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
          </Grid>
          <Grid item xs={6}>
            {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    display: data.length >= 4 ? '' : 'none',
                    backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
                    action={
                      <LightTooltip
                        interactive
                        title={
                          <>
                            <List component='nav' aria-label='main mailbox folders'>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                      onClick={() => console.log('hi')}
                                    >
                                      Edit
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                    >
                                      Delete
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </>
                        }
                        dataow
                      >
                        <IconButton aria-label='settings'>
                          <MoreHorizIcon />
                        </IconButton>
                      </LightTooltip>
                    }
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
                    <CardContent>
                      <Typography
                        variant='body2'
                        style={{
                          marginTop: '0px',
                          fontSize: 'x-large',
                          fontWeight: 'bolder',
                          color: 'white',
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
                    {/* <Route path='/hello' component={ContentView} /> */}
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    display: data.length >= 5 ? '' : 'none',
                    backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
                    action={
                      <LightTooltip
                        interactive
                        title={
                          <>
                            <List component='nav' aria-label='main mailbox folders'>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                      onClick={() => console.log('hi')}
                                    >
                                      Edit
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem button>
                                <ListItemText
                                  secondary={
                                    <Typography
                                      style={{ color: '#ff6b6b' }}
                                      variant='subtitle2'
                                    >
                                      Delete
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </>
                        }
                        dataow
                      >
                        <IconButton aria-label='settings'>
                          <MoreHorizIcon />
                        </IconButton>
                      </LightTooltip>
                    }
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
                    <CardContent>
                      <Typography
                        variant='body2'
                        style={{
                          marginTop: '0px',
                          fontSize: 'x-large',
                          fontWeight: 'bolder',
                          color: 'white',
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
                  backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                }}
                className={classes.card}
              >
                <CardHeader
                  action={
                    <LightTooltip
                      interactive
                      title={
                        <>
                          <List component='nav' aria-label='main mailbox folders'>
                            <ListItem button>
                              <ListItemText
                                secondary={
                                  <Typography
                                    style={{ color: '#ff6b6b' }}
                                    variant='subtitle2'
                                    onClick={() => console.log('hi')}
                                  >
                                    Edit
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <ListItem button>
                              <ListItemText
                                secondary={
                                  <Typography
                                    style={{ color: '#ff6b6b' }}
                                    variant='subtitle2'
                                  >
                                    Delete
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </List>
                        </>
                      }
                      dataow
                    >
                      <IconButton aria-label='settings'>
                        <MoreHorizIcon />
                      </IconButton>
                    </LightTooltip>
                  }
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
                      {data[5] && moment(data[5].created_at).format('MMM DD YYYY')}
                    </Typography>
                  }
                />
                <CardActionArea>
                  <CardContent>
                    <Typography
                      variant='body2'
                      style={{
                        marginTop: '-5px',
                        fontSize: 'x-large',
                        fontWeight: 'bolder',
                        color: 'white',
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
                        state: { data: data[5] },
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
