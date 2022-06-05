import React, { useEffect, useState, useContext } from 'react';
import moreicon from './announcement.svg';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AddCommentIcon from '@material-ui/icons/AddComment';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import moment from 'moment';
import bullet from './bullet.svg';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { useHistory } from 'react-router-dom';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '5px',
};
const styletwo = {
  position: 'absolute',
  backgroundColor: 'rgb(237, 237, 237)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '5px',
  // height: '450px',
  minHeight: '350px',
  overflow: 'auto',
  color: 'white',
  overflow: 'hidden',
  padding: '10px 0px',
  '&::-webkit-scrollbar': {
    width: '5px',
    marginRight: '20px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
};
const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
  },
  textfieldgap: {
    marginTop: 6,
    height: '100px',
  },
  addbtntextfield: {
    marginTop: 20,
  },
  announcementhead: {
    color: theme.palette.secondary.main,
    fontWeight: 800,
    fontSize: '1.2em',
    position: 'sticky',
    top: '0px',
    // background: "wheat",
    margin: '0 auto 0px auto',
    zIndex: 100,
  },
  announcementheadtwo: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    margin: '10px',
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  box: {
    height: '135px',
    overflow: 'hidden',
    border: '1px solid #d3d1d1',
    borderRadius: '5px',
    position: 'relative',
    top: 10,
    paddingBottom: 10,
    padding: 10,
    transform: 'translateX(4px)',
    // overflow: 'hidden',
    backgroundColor: 'white',
    // overflow: 'auto',
    // scrollX: 'none',
    color: 'theme.palette.secondary',
  },
  buttonmodalicon: {
    position: 'absolute',
    left: 20,
  },
  iconmore: {
    position: 'absolute',
    bottom: 5,
    right: '1.5em',
    zIndex: '100',
    // backgroundColor: '#349ceb',
    fontSize: '1em',
    fontWeight: 800,
    color: theme.palette.secondary.main,
  },
  icon: {
    position: 'absolute',
    bottom: 24,
    right: '2em',
    zIndex: '110',
    width: '10%',
    marginBottom: '10px',
  },
  add: {
    fontSize: 'small',
  },
  details: {
    color: 'white',
    // overflowY: 'scroll',
    // scrollX: 'none',
    fontWeight: 600,
    fontSize: '1em',
    padding: 10,
    maxWidth: '450px',
    paddingTop: 10,
    '&::marker': {
      color: 'yellow',
      fontWeight: 'bolder',
    },
  },
  listitem: {
    color: theme.palette.secondary.main,
    marginBottom: '3px',
    listStyle: 'none',
    fontsize: '1em',
    textTransform: 'Capitalize',
    // '&::marker': {
    //   color: 'yellow',
    // },
  },
  morecolorbtn: {
    color: 'red',
    backgroundColor: '#349ceb',
  },
  time: {
    fontSize: '0.8em',
    margin: 0,
    fontWeight: 800,
  },
}));
export default function Announcement(props) {
  const history = useHistory();
  const classes = useStyles();
  const [nextPage, setNextPage] = React.useState(''); //next page url from API response
  const [announcementArr, setAnnouncementArr] = React.useState([]); //we will store all the announcements in this array
  const [isShortArray, setIsShortArray] = React.useState(true); //how many announcements should be visible(2 or all)
  //for modal
  const [open, setOpen] = React.useState(false);
  const [checkdata, setCheckdata] = React.useState('');
  const handleOpen = (data, index) => {
    setOpen(true);
    setOpentwo(false);
    if (data?.content) {
      setCheckdata(data);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setCheckdata('');
  };
  const [opentwo, setOpentwo] = React.useState(false);
  const handleOpentwo = () => setOpentwo(true);
  const handleClosetwo = () => setOpentwo(false);
  //select
  const [roledata, setRoledata] = React.useState(); //roles coming from API
  const matches = useMediaQuery('(max-width:600px)');
  const { setAlert } = useContext(AlertNotificationContext);
  const [today, setToday] = useState([]);
  const [yesterday, setYesterday] = useState([]);
  const [twodays, setTwodays] = useState([]);
  const [oldPost, setOldPost] = useState([]);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [page, setPage] = React.useState();

  const [loading, setLoading] = useState(false);
  //we are making request to show roles in modal
  const getRoleData = () => {
    apiRequest('get', endpoints.dashboard.student.roles, null, null, null, 5000)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setRoledata(result?.data?.result);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  //making request to show announcements
  const updateAnnouncement = () => {
    apiRequest('get', `/announcement/v2/inbox/`, null, null, false, 5000)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          // setIsEnabled(result?.data?.is_enabled);
          // setNextPage(result?.data?.result?.next);
          setAnnouncementArr(result?.data?.data);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
const announcementRedirect = () => {
  history.push('/comm_dashboard')
}

  const nextpagehandler = () => {
    let url = nextPage?.split('page=')[1];
    if (url)
      apiRequest(
        'get',
        `${endpoints.dashboard.student.update}?page=${url}`,
        null,
        null,
        true,
        5000
      )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setAnnouncementArr([...announcementArr, ...result?.data?.result?.data]);
            setNextPage(result?.data?.result?.next);
          }
        })
        .catch((error) => {
          console.log('error');
        });
  };
  useEffect(() => {
    getRoleData();
    updateAnnouncement();
    // nextpagehandler();
  }, []);

  const checkDates = () => {
    setToday(
      announcementArr.filter((item) => {
        return (
          `${moment(item.created_at).format('YYYY-MM-DD')}` ===
          `${moment().format('YYYY-MM-DD')}`
        );
      })
    );
    setYesterday(
      announcementArr.filter((item) => {
        return (
          `${moment(item.created_at).format('YYYY-MM-DD')}` ===
          `${moment().subtract(1, 'days').format('YYYY-MM-DD')}`
        );
      })
    );
    setTwodays(
      announcementArr.filter((item) => {
        return (
          `${moment(item.created_at).format('YYYY-MM-DD')}` ===
          `${moment().subtract(2, 'days').format('YYYY-MM-DD')}`
        );
      })
    );
    setOldPost(
      announcementArr.filter((item) => moment().diff(moment(item.created_at), 'days') > 2)
    );
  };
  useEffect(() => {
    checkDates();
  }, [announcementArr]);
  return (
    <Grid
      container
      direction='column'
      spacing={1}
      className={classes.box}
      style={{ height: matches ? '320px' : '160px',marginBottom: '10px' }}
      xs={12}
    >
      <Grid>
        <Grid item>
          <Grid container item>
            <Grid item xs={12}>
              <div>
                <span className={classes.announcementhead}>
                  Announcements
                </span>
                <hr />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container item>
            <Grid item className={classes.details}>
              <div>
                {isShortArray ? ( //we are checking if we want to render 2 or all items in announcement */}
                  <ul style={{ overflow: 'scroll', height: '250px', width: '350px' }}>
                    {announcementArr &&
                      announcementArr.map(
                        (d, i) =>
                          i <= 100 && (
                            <div key={`Annoucement${i}`}>
                              <li className={classes.listitem}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                  }}
                                >
                                  <div style={{ marginRight: '7px' }}>
                                    <img
                                      src={bullet}
                                      alt='bulet'
                                      style={{ width: '8px' }}
                                    ></img>
                                  </div>
                                  <div
                                    style={{
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      position: 'relative',
                                    }}
                                  >
                                    {d?.title?.length >20 ? `${d?.title.slice(0,20)}...` : d?.title}
                                  </div>
                                </div>
                                <p>
                                  <span className={classes.time}>
                                    {moment(d?.created_time).calendar()};
                                  </span>
                                </p>
                              </li>
                            </div>
                          )
                        // );
                      )}
                    {isEnabled && matches ? (
                      <Button
                        variant='outlined'
                        backgroundColor='primary'
                        size='small'
                        style={{ fontSize: '1em' }}
                        color='black'
                        onClick={nextpagehandler}
                        disabled={!isEnabled}
                      >
                        More
                      </Button>
                    ) : (
                      ''
                    )}
                    <div>
                      {isEnabled && matches ? (
                        ''
                      ) : (
                        <div onClick={handleOpentwo}>
                          <img className={classes.icon} src={moreicon} alt='bttn' />
                        </div>
                      )}
                      <div>
                        {matches ? (
                          ''
                        ) : (
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={announcementRedirect}
                            className={classes.iconmore}
                            style={{ fontSize: '0.8em' }}
                            // varient='contained'
                            color='primary'
                          >
                            {isShortArray ? 'more' : 'less'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </ul>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
