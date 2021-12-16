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
import Carousel, { consts } from 'react-elastic-carousel';
import axiosInstance from 'config/axios';
import moment from 'moment';
import clsx from 'clsx';
import { useHistory } from 'react-router';
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
    margin: '15px',
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
  certicw: {
    height: '100px',
    width: '179px',
    margin: '5px',
    borderRadius: '5x',
    backgroundColor: 'white',
    border: '1px solid gray',
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
  const history = useHistory();
  const matches960 = useMediaQuery('(max-width: 960px)');
  const [onlineClassArr, setOnlineClassArr] = useState([]);
  const [isEnabled, setIsEnabled] = React.useState(false);

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
  const removeItem = () => {
    const endRange = Math.max(0, onlineClassArr?.length - 1);
    setOnlineClassArr(onlineClassArr.slice(0, endRange));
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
    apiRequest('get', endpoints.dashboard.student.onlineclasstimestats, null, null, true, 5000)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setIsEnabled(result?.data?.data?.is_enabled);
          setOnlineClassArr(result?.data?.data?.results);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getOnlineData();
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
            {onlineClassArr?.length > 0 && isEnabled && onlineClassArr ? onlineClassArr.map((item, i) => (
              <div className={classes.card} key={`Ocls${i}`}>
                <div className={classes.layertop}>
                  <div className={classes.layerupper}>
                    <div>
                      <p className={clsx(classes.white, classes.ellipsisText)}>{item?.title}</p>
                      {/* <p>{item?.start_time}</p> */}
                    </div>
                    <img
                      onClick={() => handleOpen(item)}
                      className={classes.icon}
                      src={icon}
                      alt='i'
                    />
                  </div>
                </div>
                <div className={classes.layermiddle}>{item?.starts_in}</div>
                <div>
                  <div className={classes.layerbottom}>
                    <div className={classes.columnlayer}>
                      <div className={classes.blue}>{item?.start_date}</div>
                      <div className={classes.green}>STARTS</div>
                    </div>
                    <div className={classes.columnlayer}>
                      <div className={classes.blue}>{item?.end_date}</div>
                      <div className={classes.red}>ENDS</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
            :
            <div style={{display: "flex"}}>
              <div className={classes.certicw}>
              <div style={{ margin: '35px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> ONLINE CLASS </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Temporarily Disabled  </h5>
              </div>
            </div>
            <div className={classes.certicw}>
              <div style={{ margin: '35px auto', borderRadius: '5px' }}>
                <h5 style={{ color: "#349CEB", textAlign: "center" }}> ONLINE CLASS </h5>
                <h5 style={{ color: "black", textAlign: "center" }}>Temporarily Disabled  </h5>
              </div>
            </div>
            </div>}
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
                        ONLINE CLASS - <span>{selectedData?.online_class__title}</span>
                      </h3>
                      <h4>
                        Topic of Class- <span>{selectedData?.topic}</span>
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
                        <h3>{selectedData?.online_class__start_time}</h3>
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
                        onClick={()=> {window.location.href=`${selectedData?.join_url}`}}
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
                        onClick={()=>history.push('/erp-online-class-student-view')}
                      >
                        Go to Class List
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
                        Close
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
