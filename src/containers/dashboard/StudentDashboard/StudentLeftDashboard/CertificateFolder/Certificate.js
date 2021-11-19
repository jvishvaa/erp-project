import React, { useState, useEffect } from 'react';
import { Stepper } from '../../ReusableComponents';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import { useTheme } from '@material-ui/core/styles';
import Carousel, { consts } from 'react-elastic-carousel';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './certificate.scss';
import Button from '@material-ui/core/Button';
import Coming from './Coming.png';
// carousel;
const breakPoints = [
  { width: 1, itemsToShow: 2, itemsToScroll: 2 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 2, itemsToScroll: 2 },
  { width: 1200, itemsToShow: 2, itemsToScroll: 2 },
];

const useStyles = makeStyles((theme) => ({
  track: {
    backgroundColor: '#fafafa',
  },

  certi: {
    height: '130px',
    width: '180px',
    margin: '5px',
    borderRadius: '5x',
    backgroundColor: 'white',
    border: '1px solid gray',
  },
  //
  imagecerti: {
    height: '100%',
    width: '100%',
    borderRadius: '5px',
  },
  '@media (max-width: 960px)': {
    certi: {
      height: '120px',
      width: '200px',
      margin: '5px',
      borderRadius: '5px',
      // position: "absolute",
    },
  },
}));

const Certificate = (props) => {
  const themeContext = useTheme();

  const classes = useStyles();
  const [certificateArr, setCertificateArr] = React.useState([]);


  // carousel;
  const addItem = () => {
    const nextItem = Math.max(1, certificateArr.length + 1);
    setCertificateArr([...certificateArr, nextItem]);
  };

  const removeItem = () => {
    const endRange = Math.max(0, certificateArr.length - 1);
    setCertificateArr(certificateArr.slice(0, endRange));
  };

  const getCertificateData = () => {
    apiRequest('get', endpoints.dashboard.student.certificates)
      .then((result) => {
        if (result.data.status_code === 200) {
          setCertificateArr(result.data.result);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  // useEffect(() => {
  //   getCertificateData();
  // }, []);

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
          className={classes.track}
          id='carasol-gridone'
          style={{
            // border: '2px solid red',
            justifyContent: 'flex-start',
            width: "100%",
          }}
        >

          <Carousel renderArrow={myArrow}

            breakPoints={breakPoints}

          >
            {/* {certificateArr.map((item) => (
              <div className={classes.certi}>
                <img
                  className={classes.imagecerti}
                  
                  alt='imagef'
                ></img>
              </div>
            ))} */}
            <div className={classes.certi}>
              <div style={{ margin: '50px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> CERTIFICATE </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Coming soon</h5>
              </div>
            </div>
            <div className={classes.certi}>
              <div style={{ margin: '50px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> CERTIFICATE </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Coming soon</h5>
              </div>
            </div>
            <div className={classes.certi}>
              <div style={{ margin: '50px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> CERTIFICATE </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Coming soon</h5>
              </div>
            </div>
          </Carousel>
          {/* </Slider> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Certificate;