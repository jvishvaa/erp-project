import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Grid, Paper } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import Typography from '@material-ui/core/Typography';
import PlaceIMG from '../../../assets/images/placeholder_small.jpg';
import SubjectImg from '../../../assets/images/subjectTrain.jpg';
import './volumecards.scss';

import ButtonBackgroundImage from '../../../assets/images/button.svg';

const useStyles = makeStyles({
  root: {
    width: '300px',
    marginBottom: '2%',
    color: 'white',
  },
  media: {
    height: 140,
  },
  action: {
  display: 'flex',
  justifyContent: 'center'    
  },
});

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

export default function MediaCard(props) {
  const classes = useStyles();
  const getCardColor = (index) => {
    const colors = [
      '#54688c',
      '#f47a62',
      '#4a66da',
      '#75cba8',
      // "#f2bf5e"
    ];
    const diffColors = index % 4;
    return colors[diffColors];
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-center',
        // flexWrap: 'wrap',
        backgroundColor: '#FAFAFA',
      }}
      className='allCardsContain'
    >
      {props.allVolumes &&
        props.allVolumes.map((vol, index) => (
          <div id='subTrain'>
            <div id='allCard'>
              <Card
                sx={{ maxWidth: 345 }}
                style={{ backgroundColor: getCardColor(index) }}
              >
                <div
                  style={{
                    display: 'flex',
                    display: 'flex',
                    alignItem: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardMedia
                    className={classes.media}
                    component='img'
                    alt='Contemplative Reptile'
                    title='Contemplative Reptile'
                    image='https://udaansurelearning.com/static/media/course.63579270.jpg'
                  />
                </div>
                
                <CardContent justify='center' className={classes.content1}>
                  <div id='time-area'>
                    <div id='pending-area'>
                      <Typography style={{ color: 'white' }}>
                        {vol.volume_name}
                      </Typography>
                    </div>
                    <div id='course-area'>
                      <Typography style={{ color: 'white' , fontSize: '15px' }}>
                        {vol.course_name}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
                <CardContent justify='center' className={classes.content}>
                  <Grid container direction='row'>
                    <Grid vol md={12} xs={12} style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          style={{
                            verticalAlign: 'middle',
                            display: 'inline-flex',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          <strong>Total Hours </strong>
                          <AccessAlarmsIcon
                            style={{
                              fontSize: '14px',
                              color: 'white',
                            }}
                          />
                        </Typography>
                        <Typography
                          style={{
                            verticalAlign: 'middle',
                            display: 'inline-flex',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          <strong>Pending Hours </strong>{' '}
                          <AccessAlarmsIcon
                            style={{
                              fontSize: '14px',
                              color: 'white',
                            }}
                          />
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item md={12} xs={12} style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          style={{
                            verticalAlign: 'middle',
                            display: 'inline-flex',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          {vol.total_duration}
                        </Typography>
                        <Typography
                          style={{
                            verticalAlign: 'middle',
                            display: 'inline-flex',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          {vol.pending_hours}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions className={classes.action}>
                  <div
                    style={{
                      height: '40px',
                      display: 'flex',
                      width: '80%',
                      justifyContent: 'center',
                      backgroundImage: `url(${ButtonBackgroundImage})`,
                      backgroundPosition: 'center',
                      backgroundSize: '60%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <Typography
                      onClick={() => props.startTrain(vol)}
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                    >
                      Start
                    </Typography>
                  </div>
                </CardActions>
              </Card>
            </div>
          </div>
        ))}
    </div>
  );
}
