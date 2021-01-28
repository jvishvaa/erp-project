/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import moment from 'moment';
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

  return (
    <div className={classes.root}>
    { data && data.length ? (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid item>
            <Card 
             style={{
              width: '100%',
              height: '290px',
              display: data.length >= 0 ? '' : 'none',
              backgroundSize: '360px',
              backgroundImage: `url(${data[0] && data[0].thumbnail})`,
            }}
            className={classes.card} >
              <CardHeader
                subheader={
                  <Typography gutterBottom variant='body2' align='left' component='p'>
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
                        state: { data: data[0] ? data[0] :'' },
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
             
            </Card>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card  className={classes.card}
              style={{
                width: '100%',
                height: '290px',
                display: data.length >= 1 ? '' : 'none',
                backgroundSize: '360px',
                backgroundImage: `url(${data[1] && data[1].thumbnail})`,
              }}>
                <CardHeader
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
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
                className={classes.card}
                style={{
                  width: '100%',
                  height: '290px',
                  display: data.length >= 2 ? '' : 'none',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[2] && data[2].thumbnail})`,
                }}
              >
                <CardHeader
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
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
              <Card  className={classes.card}
              style={{
                width: '100%',
                height: '290px',
                display: data.length >= 3 ? '' : 'none',
                backgroundSize: '360px',
                backgroundImage: `url(${data[3] && data[3].thumbnail})`,
              }}>
                <CardHeader
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
                        state: { data: data[3] },
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card  className={classes.card}
              style={{
                width: '100%',
                height: '290px',
                display: data.length >= 4 ? '' : 'none',
                backgroundSize: '360px',
                backgroundImage: `url(${data[4] && data[4].thumbnail})`,
              }}>
                <CardHeader
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p'>
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
                        state: { data: data[4] },
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Grid item>
            <Card  className={classes.card}
            style={{
              width: '100%',
              height: '290px',
              display: data.length >= 5 ? '' : 'none',
              backgroundSize: '360px',
              backgroundImage: `url(${data[5] && data[5].thumbnail})`,
            }}>
              <CardHeader
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
                    style={{ marginTop: 100, width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/teacher/contentView',
                        state: { data: data[5] },
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
       ) : (
        <Typography align='center'>Oops... No blogs Posted</Typography>
            )}
    </div>
  );
}

export default withRouter(GridList);
