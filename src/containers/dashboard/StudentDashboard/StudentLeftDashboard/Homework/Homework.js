import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
// import arts from './arts.svg';
// import geography from './geography.svg';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import './homework.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Carousel, { consts } from 'react-elastic-carousel';
import endpoints from '../../config/Endpoint';
// import endpoints from '../../config/Endpoint';
// import apiRequest from '../../config/apiRequest';
import axiosInstance from 'config/axios';
const breakPoints = [
  { width: 1, itemsToShow: 2, itemsToScroll: 2 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 2, itemsToScroll: 2 },
  { width: 1200, itemsToShow: 2, itemsToScroll: 2 },
];

const useStyles = makeStyles(() => ({
  track: {
    backgroundColor: '#fafafa',
  },

  itembckground: {
    backgroundColor: '#349ceb',
    height: '30px',
    color: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    margin: '30px 15px',
  },
  layertop: {
    padding: '10px',
    fontWeight: "1000",
  },
  layertopone: {
    textAlign: "center",
    fontWeight: "1000",
  },
  layermiddle: {
    // textAlign: 'center',
    // backgroundColor: '#ff5c58',
    // borderRadius: '50px',
    // margin: '0px auto',
    // padding: '5px',
    // color: 'white',
    // fontWeight: "1000",
    // width: '80%'
    color: 'white',
    width: '80%',
    margin: '0px auto',
    padding: '5px',
    textAlign: 'center',
    fontWeight: '1000',
    borderRadius: '50px',
    backgroundColor: '#ff5c58',
  },
  subjecticon: {
    position: 'relative',
    top: '1px',
    right: '2px',
  },
  icon: {
    height: '30%',
  },
  ellipsisText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  headindsubject: {
    color: 'white',
    display: 'block',
    width: '80%',
    margin: '0 auto',
    fontWeight: "1000",
    textAlign: "left",
    textTransform: 'uppercase',
    fontSize: '14px',
  },
  submission: {
    color: 'white',
    display: 'block',
    margin: '0 auto',
    width: '80%',
    textIndent: '2px',
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: "1000",
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  },
  submissionData: {
    fontWeight: "1000",
    fontSize: '14px',
  },

  cardhomework: {
    height: '100px',
    width: '180px',
    background: '#349ceb',
    margin: '10px',
    display: 'inline-block',
    borderRadius: '10px',
    alignContent: 'center',
    fontSize: '0.7em',
    fontWeight: "1000",
  },

  homework: {
    color: '#014B7E',
    fontWeight: 600,
    margin: '5px',
    position: "relative",
  },
  pendingbtn: {
    background: '#349ceb',
    color: 'white',
    borderRadius: '50px',
    fontSize: "0.7em",
  },
  // '@media (max-width: 960px)': {
  //   cardhomework: {
  //     height: '120px',
  //     width: '200px',
  //     background: '#349ceb',
  //     margin: '5px',
  //     display: 'inline-block',
  //     borderRadius: '10px',
  //     alignContent: 'center',
  //     fontSize: '0.9em',
  //   },
  //   homework: {
  //     color: '#014B7E',
  //     fontWeight: 600,
  //     marginLeft: '47px',
  //     position: "relative",
  //   },
  // },
}));

const Homework = (props) => {
  const classes = useStyles();
  const [homeworkArr, setHomeworkArr] = React.useState([]);

  useEffect(() => {
    getHomeworkData();
    // console.log(homeworkArr.length, "homeworkarr");
  }, []);
  const matches960 = useMediaQuery('(max-width: 960px)');
  const addItem = () => {
    const nextItem = Math.max(1, homeworkArr.length + 1);
    setHomeworkArr([...homeworkArr, nextItem]);
  };
  const removeItem = () => {
    const endRange = Math.max(0, homeworkArr.length - 1);
    setHomeworkArr(homeworkArr.slice(0, endRange));
  };
  // arrow carousal
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
  const getHomeworkData = () => {
    axiosInstance
      .get(endpoints.dashboard.student.homework)
      .then((result) => {
        // if (result.data.status_code === 200) {
        setHomeworkArr(result.data);
        // }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  return (
    <React.Fragment>
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
          style={{
            // border: '2px solid red',
            justifyContent: 'flex-start',
            width: "100%",
          }}
          className={classes.track}
          id='carasol-gridtwo'
        >

          <div><span style={{ fontWeight: 800 }} className={classes.homework}>
            Homeworks
          </span>
            <Button
              size='small'
              style={{ backgroundColor: '#349ceb' }}
              className={classes.pendingbtn}
            >
              Pending
            </Button></div>
          <Carousel renderArrow={myArrow}
            breakPoints={breakPoints}>
            {homeworkArr.map((item, i) => (
              <div className={classes.cardhomework} key={`homework_${i}`}>
                <div className={classes.layertop}>
                  <div className={classes.layertopone}>
                    <div className={clsx(classes.headindsubject, classes.ellipsisText)}>{item.homework__subject__subject_name}</div>
                  </div>
                  <div className={classes.submission}>
                    <span className={classes.submissionData}>{item.pending} </span>
                    {item.pending === 1 ? 'submission' : 'submissions'}
                  </div>
                </div>
                <div className={classes.layermiddle}>{item.max_class_Date}</div>
              </div>

            ))}
          </Carousel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Homework;
