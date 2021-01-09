/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
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
  },
  card: {
    // backgroundColor: 'red',
    // padding: theme.spacing(2),
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundColor: 'grey',
    // color: theme.palette.text.secondary,
  },
}));

function GridList(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* <Card style={{ backgroundColor: 'yellow' }} className={classes.card}> */}
          <Grid item>
            <Card className={classes.card} style={{ width: '100%', height: '200px' }}>
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
                    {data[0].Data}
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
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    {data[0].title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-15px', width: 150 }}
                  onClick={() => props.history.push('/blog/teacher/contentView')}
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
              <Card style={{ width: '100%', height: '290px' }} className={classes.card}>
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
                      {data[0].Data}
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
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[0].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-100px', width: 150 }}
                    onClick={() => this.props.history.push('/blog/teacher/contentView')}
                  >
                    Read more
                  </Button>
                  {/* <Route path='/hello' component={ContentView} /> */}
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                style={{ backgroundColor: 'grey', width: '100%', height: '290px' }}
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
                      {data[0].Data}
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
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[1].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-100px', width: 150 }}
                    onClick={() => this.props.history.push('/blog/teacher/contentView')}
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
              <Card style={{ width: '100%', height: '290px' }} className={classes.card}>
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
                      {data[2].Data}
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
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[2].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-100px', width: 150 }}
                    onClick={() => this.props.history.push('/blog/teacher/contentView')}
                  >
                    Read more
                  </Button>
                  {/* <Route path='/hello' component={ContentView} /> */}
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={{ width: '100%', height: '290px' }} className={classes.card}>
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
                      {data[3].Data}
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
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[3].title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ bottom: '-100px', width: 150 }}
                    onClick={() => props.history.push('/blog/teacher/contentView')}
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
            <Card style={{ width: '100%', height: '200px' }} className={classes.card}>
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
                    {data[4].Data}
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
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    {data[4].title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-15px', width: 150 }}
                  onClick={() => this.props.history.push('/blog/teacher/contentView')}
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
    </div>
  );
}

export default withRouter(GridList);
