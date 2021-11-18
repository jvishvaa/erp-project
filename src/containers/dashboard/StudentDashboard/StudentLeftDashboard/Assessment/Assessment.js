import React, { useState, useEffect } from 'react';

// import classes from './Assessment.module.css';
// import { Stepper } from '../../ReusableComponents';
import Grid from '@material-ui/core/Grid';
import icon from './icon.svg';
import { makeStyles } from '@material-ui/core/styles';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Carousel, { consts } from 'react-elastic-carousel';
import './assessment.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
// import LazyLoad from 'react-lazy-load';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';

const breakPoints = [
  { width: 1, itemsToShow: 2, itemsToScroll: 2 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 2, itemsToScroll: 2 },
  { width: 1200, itemsToShow: 2, itemsToScroll: 2 },
];

const useStyles = makeStyles((theme) => ({


  track: {
    backgroundColor: '#fafafa',
    // overflow: 'auto',
    whiteSpace: 'nowrap',
    // margin: '10px',
  },
  card: {
    height: '100px',
    width: '180px',
    borderRadius: '10px',
    background: 'white',
    margin: '10px',
    display: 'inline-block',
    fontSize: '0.7em',
    border: '1px solid #349ceb',
    // marginBottom: "40px",

  },

  assessmentbtn: {
    background: '#349CEB',
    color: 'white',
    borderRadius: 20,
    padding: '5px',
    // fontSize:"0.7em",
  },
  icon: {
    width: '12%',
  },

  layertop: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: ' #349ceb',
    padding: '10px',
    color: 'white',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    fontWeight: "1000",
  },
  layerupper: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    borderRadius: '10px',
    fontWeight: "800",
    fontSize: "1.2em",
  },

  layerbottom: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1px 10px',
    fontWeight: "800",
  },

  columnlayer: {
    display: 'flex',
    flexDirection: 'column',
  },

  layermiddle: {
    textAlign: 'left',
    color: '#014b7e',
    fontWeight: "800",
    height: '30px',
    padding: '10px',
  },

  white: {
    color: 'white',
    fontWeight: 600,
    fontSize: '13px',
  },
  blue: {
    color: '#014b7e',
    fontWeight: 600,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
  assessment: {
    color: '#014B7E',
    fontWeight: 800,
    margin: '10px',
    fontSize: "0.9em",
    position: "relative",
  },
  upcomingbtn: {
    background: '#349ceb',
    color: 'white',
    borderRadius: '50px',
    fontSize: "0.7em",
  },
  ellipsisText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

}));

export default function Assessment(item) {
  const classes = useStyles();
  const matches960 = useMediaQuery('(max-width: 960px)');
  const [assessmentArr, setAssessmentArr] = React.useState([]);

  //carousel
  const addItem = () => {
    const nextItem = Math.max(1, assessmentArr.length + 1);
    setAssessmentArr([...assessmentArr, nextItem]);
  };

  const removeItem = () => {
    const endRange = Math.max(0, assessmentArr.length - 1);
    setAssessmentArr(assessmentArr.slice(0, endRange));
  };

  const getAssessmentData = () => {
    apiRequest('get', endpoints.dashboard.student.assessment)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAssessmentArr(result.data.result.results);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  useEffect(() => {
    getAssessmentData();
  }, []);

  //arrow carousal
  const myArrow = ({ type, onClick, isEdge }) => {
    // const pointer = type === consts.PREV ? '<' : '>'
    const leftPointer = '<';
    const rightPointer = '>';

    const arrows = type === consts.PREV ?
      <Button onClick={onClick} disabled={isEdge} className="leftPointer">
        {leftPointer}
      </Button> :
      <Button onClick={onClick} disabled={isEdge} className="rightPointer">
        {rightPointer}
      </Button>

    return arrows

  }

  return (
    <Grid
      container
      spacing={1}
      style={{
        // border: '2px solid blue',
        justifyContent: 'flex-start',
      }}
    >
      <Grid
        item
        className={classes.track}
        id='carasol-grid'
        style={{
          // border: '2px solid red',
          justifyContent: 'flex-start',
          width: "100%",
        }}
      >

        <div>
          <span style={{ fontSize: "0.9em" }} className={classes.assessment}>
            ASSESSMENT
          </span>
          <Button
            size='small'
            style={{ backgroundColor: '#349ceb' }}
            className={classes.upcomingbtn}
          >
            Upcoming
          </Button>
        </div>

        <Carousel renderArrow={myArrow}
          breakPoints={breakPoints}>
          {assessmentArr.map((item, i) => (

            <div className={classes.card} key={`Assesement${i}`}>
              <div className={classes.layertop}>
                <div className={classes.layerupper}>
                  <div className={clsx(classes.white, classes.ellipsisText)} title={item.test_name}>{item.test_name}</div>
                  <img className={classes.icon} src={icon} alt='i'

                  />
                </div>

              </div>
              <div className={classes.layermiddle}>
                {moment(item.test_date).format('dddd')}
              </div>
              <div className={classes.layerbottom}>
                <div className={classes.columnlayer}>
                  <div className={classes.blue}>
                    {moment(item.test_date).format('DD-MM-YYYY')}
                  </div>
                  <div className={classes.blue}>DATE</div>
                </div>

                <div className={classes.columnlayer}>
                  <div className={classes.blue}>
                    {moment(item.test_date).format('LT')}
                  </div>
                  <div className={classes.blue}>TIME</div>
                </div>
              </div>
            </div>

          ))}
        </Carousel>

      </Grid>
    </Grid>
  );
}
