import React, { useState, useEffect, Component } from 'react';
import Grid from '@material-ui/core/Grid';
import icon from './icon.svg';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import './onlineclass.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import onlineclassbck from './onlineclassbck.svg';
// import backgroundimage from './backgroundimage.png';
import Carousel, { consts } from 'react-elastic-carousel';
// import endpoints from '../../config/Endpoint';
// import apiRequest from '../../config/apiRequest';
import axiosInstance from 'config/axios';
import moment from 'moment';
import clsx from 'clsx';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// import { Carousel } from 'react-responsive-carousel';


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
  card: {
    width: '180px',
    height: '100px',
    borderRadius: '5px',
    background: 'white',
    margin: '10px',
    display: 'inline-block',
    fontSize: '0.6em',
    border: '1px solid #349ceb',
  },

  layertop: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#349ceb',
    padding: '8px',
    color: 'white',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },

  layerupper: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
  },
  icon: {
    position: 'relative',
    top: '0px',
    right: '2px',
    width: '12%',
  },

  layerbottom: {
    display: 'flex',
    direction: 'column',
    justifyContent: 'space-between',
    padding: '1px 5px',
  },

  columnlayer: {
    display: 'flex',
    flexDirection: 'column',
  },

  layermiddle: {
    textAlign: 'left',
    color: '#014b7e',
    fontWeight: 600,
    height: '30px',
    padding: '5px',
  },

  headerTitle: {
    margin: '10% 4% 0 0',
    fontWeight: 600,
  },
  white: {
    color: 'white',
    fontWeight: 600,
    fontSize: '13px',
  },
  blue: {
    color: ' #014b7e',
    fontWeight: 600,
  },
  green: {
    color: 'green',
    fontWeight: 600,
  },
  red: {
    color: 'red',
    fontWeight: 600,
  },
  onlineclass: {
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
    // padding: '5px 10px',
    fontSize: "0.7em",
  },
  // '@media (max-width: 960px)': {
  //   card: {
  //     width: '200px',
  //     height: '120px',
  //     borderRadius: '10px',
  //     background: 'white',
  //     margin: '5px',
  //     display: 'inline-block',
  //     fontSize: '0.8em',
  //     border: '1px solid #349ceb',
  //   },
  //   onlineclass: {
  //     color: '#014B7E',
  //     fontWeight: 800,
  //     marginLeft: '47px',
  //     fontSize: "0.9em",
  //     position: "relative",
  //   },
  // },
  // '@media (max-width: 400px)': {
  //   layertop: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     backgroundColor: '#349ceb',
  //     padding: '3px',
  //     color: 'white',
  //     borderTopLeftRadius: '5px',
  //     borderTopRightRadius: '5px',
  //   },
  //   layerbottom: {
  //     display: 'flex',
  //     direction: 'column',
  //     justifyContent: 'space-between',
  //     padding: '1px 1px',
  //     fontSize: "0.9em",
  //   },
  // }
  ellipsisText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  borderRadius: 20,
  border: '2px solid #349ceb',
};

const OnlineClass = (props) => {
  const classes = useStyles();

  const matches960 = useMediaQuery('(max-width: 960px)');
  const [onlineclassar, setOnlineclassar] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setSelectedData(item);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedData('');
  };
  const [selectedData, setSelectedData] = useState('');

  //carousel
  const addItem = () => {
    const nextItem = Math.max(1, onlineclassar.length + 1);
    setOnlineclassar([...onlineclassar, nextItem]);
  };

  const removeItem = () => {
    const endRange = Math.max(0, onlineclassar.length - 1);
    setOnlineclassar(onlineclassar.slice(0, endRange));
  };

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

  const getOnlineData = () => {
    apiRequest('get', endpoints.dashboard.student.onlineclasstimestats, null, null, true)
      .then((result) => {
        console.log("resultdata", result.data);
        setOnlineclassar(result.data);
      })
      .catch((error) => {
        console.log('error');
      });
  };
  useEffect(() => {
    getOnlineData();
    console.log("online")
  }, []);

  return (
    <>
      <Grid
        container
        spacing={1}
        style={{
          justifyContent: 'flex-start',
        }}
      >
        <Grid
          item
          className={classes.track}
          id='carasol-gridthree'
          style={{
            justifyContent: 'flex-start',
            width: "100%",
          }}
        >

          <div>
            <span style={{ fontWeight: 800 }} className={classes.onlineclass}>
              ONLINE CLASS
            </span>
            <Button
              size='small'
              style={{ backgroundColor: '#349ceb' }}
              className={classes.upcomingbtn}
            >
              Upcoming
            </Button>
          </div>
          <Carousel
            renderArrow={myArrow}
            breakPoints={breakPoints}>
            {onlineclassar.map((item, i) => (
              <div className={classes.card} key={`Ocls${i}`}>
                <div className={classes.layertop}>
                  <div className={classes.layerupper}>
                    <div>
                      <p className={clsx(classes.white, classes.ellipsisText)}>{item.title}</p>
                      <p>{item.online_class__start_time}</p>
                    </div>

                    <img
                      onClick={() => handleOpen(item)}
                      className={classes.icon}
                      src={icon}
                      alt='i'
                    />
                  </div>
                </div>

                <div className={classes.layermiddle}>{item.online_class__start_time}</div>
                <div>
                  <div className={classes.layerbottom}>
                    <div className={classes.columnlayer}>
                      <div className={classes.blue}>{moment().format('DD-MM-YYYY')}</div>
                      <div className={classes.green}>STARTS</div>
                    </div>

                    <div className={classes.columnlayer}>
                      <div className={classes.blue}>{moment().format('DD-MM-YYYY')}</div>
                      <div className={classes.red}>ENDS</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Grid>

        <Grid item>
          <div>
            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <div>
                    <div style={{ textAlign: 'center' }}>
                      <h3>Schedule</h3>
                      <p style={{ color: 'green', fontWeight: 600 }}>
                        STARTS <span>{moment().format('DD-MM-YYYY')}</span>
                      </p>
                      <p style={{ color: 'red', fontWeight: 600 }}>
                        ENDS <span>{moment().format('DD-MM-YYYY')}</span>
                        {console.log(selectedData)}
                      </p>
                    </div>
                    <div
                      style={{
                        backgroundColor: '#349ceb',
                        color: 'white',
                        textAlign: 'center',
                        margin: '20px',
                        padding: '10px',
                      }}
                    >
                      <h3 style={{ margin: '20px' }}>
                        ONLINE CLASS - <span>{selectedData.online_class__title}</span>
                      </h3>
                      <h4>
                        Topic of Class- <span>{selectedData.topic}</span>
                      </h4>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div>
                        <h3>{selectedData.online_class__start_time}</h3>
                        <h3>{moment().endOf(`{online_class__start_time}`).fromNow()}</h3>
                      </div>

                      <Button
                        style={{
                          backgroundColor: '#349ceb',
                          margin: '10px auto',
                          width: '100px',
                          textAlign: 'center',
                          borderRadius: '50px',
                        }}
                      >
                        Join
                      </Button>
                      <Button
                        style={{
                          backgroundColor: '#349ceb',
                          margin: '10px auto',
                          width: '200px',
                          borderRadius: '50px',
                        }}
                      >
                        Go to classList
                      </Button>
                      <Button
                        onClick={handleClose}
                        style={{
                          backgroundColor: '#349ceb',
                          margin: '10px auto',
                          width: '100px',
                          borderRadius: '50px',

                        }}
                      >
                        close
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
export default OnlineClass;