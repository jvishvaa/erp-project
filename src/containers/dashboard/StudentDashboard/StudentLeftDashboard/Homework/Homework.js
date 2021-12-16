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
import apiRequest from '../../config/apiRequest';
import axiosInstance from 'config/axios';
import moment from 'moment';

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
    borderRadius: '5px',
    alignContent: 'center',
    fontSize: '0.7em',
    fontWeight: "1000",
  },

  homework: {
    color: '#014B7E',
    fontWeight: 600,
    margin: '15px',
    position: "relative",
  },
  pendingbtn: {
    background: '#349ceb',
    color: 'white',
    borderRadius: '50px',
    fontSize: "0.7em",
  },
  certihw: {
    height: '100px',
    width: '170px',
    margin: '5px',
    borderRadius: '5x',
    backgroundColor: 'white',
    border: '1px solid gray',
  },
  
}));

const Homework = (props) => {
  const classes = useStyles();
  const [homeworkArr, setHomeworkArr] = React.useState([]);
  const [isEnabled, setIsEnabled] = React.useState(false);
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
  
  const gethomeworkData = () => {
    apiRequest('get', endpoints.dashboard.student.homeworks, null, null, true, 5000)
      .then((result) => {
        if (result.data.status_code === 200) {
          setIsEnabled(result?.data?.data?.is_enabled);
        setHomeworkArr(result?.data?.data?.results);
        }
      })
      .catch((error) => {});
  };
  useEffect(() => {
    // getHomeworkData();
    gethomeworkData();
    
  }, []);
  return (   
    <React.Fragment> 
      {/* {homeworkArr.length > 0 ?      */}
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
            {homeworkArr?.length > 0 && isEnabled ?  homeworkArr.map((item, i) => (
              <div className={classes.cardhomework} key={`homework_${i}`}>
                <div className={classes.layertop}>
                  <div className={classes.layertopone}>
                    <div className={clsx(classes.headindsubject, classes.ellipsisText)}>{item?.subject__subject_name}</div>
                  </div>
                  <div className={classes.submission}>
                    <span className={classes.submissionData}>{item?.homework_name} </span>
                  </div>
                </div>
                <div className={classes.layermiddle}>{item?.class_date__date === moment().format('YYYY-MM-DD') ? "Due Today" : moment().subtract(1, 'days').format('YYYY-MM-DD') === item?.class_date__date ? "Due Tomorrow" : item?.class_date__date}</div>
              </div>

            )): 
            <div style={{display: "flex"}}>
              <div className={classes.certihw}>
              <div style={{ margin: '35px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> HOMEWORK </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Temporary Disabled</h5>
              </div>
            </div>
            <div className={classes.certihw}>
              <div style={{ margin: '35px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> HOMEWORK </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Temporary Disabled</h5>
              </div>
            </div>
            </div>
            }
          </Carousel>
        </Grid>
      </Grid>
    </React.Fragment>     
  );
};
export default Homework;
