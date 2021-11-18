import React, { useEffect, useState } from 'react';
import moreicon from './announcement.svg';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import AddCommentIcon from '@material-ui/icons/AddComment';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import moment from 'moment';
import backgroundimage from './backgroundimage.png';
import bullet from "./bullet.svg";
import axiosInstance from 'config/axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useDashboardContext } from '../../../dashboard-context';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};
const styletwo = {
  position: 'absolute',
  backgroundColor: '#349ceb',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
  height: '450px',
  overflow: 'auto',
  color: 'white',
  padding: '20px 0px',
  "&::-webkit-scrollbar": {
    width: "5px",
    marginRight: "20px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1"
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
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
    marginTop: 20,
  },
  addbtntextfield: {
    marginTop: 20,
  },
  announcementhead: {
    color: 'white',
    fontWeight: 800,
    fontSize: "1.2em",
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
    height: "135px",
    overflow: 'hidden',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: "10px",
    position: 'relative',
    top: 10,
    paddingBottom: 10,
    padding: 10,
    overflow: 'hidden',
    backgroundImage: `url(${backgroundimage} )`,
  },
  buttonmodalicon: {
    position: 'absolute',
    left: 20,
  },
  iconmore: {
    position: 'absolute',
    bottom: 5,
    right: '0.7em',
    zIndex: '100',
    backgroundColor: '#349ceb',
    fontSize: "1em",
    fontWeight: 800,
    color: "white",
  },
  icon: {
    position: 'absolute',
    bottom: 30,
    right: '1.5em',
    zIndex: '110',
    width: "10%",
  },
  add: {
    fontSize: "small",
  },
  details: {
    color: 'white',
    fontWeight: 600,
    fontSize: "0.8em",
    padding: 10,
    paddingTop: 10,
    '&::marker': {
      color: 'yellow',
      fontWeight: "bolder",
    },
  },
  listitem: {
    color: 'white',
    marginBottom: '3px',
    listStyle: "none",
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
  '@media (max-width: 960px)': {
    iconmore: {
      position: 'absolute',
      bottom: 5,
      right: '3em',
      zIndex: '100',
      backgroundColor: '#349ceb',
      fontSize: "0.9em",
    },
    icon: {
      position: 'absolute',
      bottom: 40,
      right: '3.5em',
      zIndex: '110',
    },
  },
}));
export default function Announcement(props) {
  const classes = useStyles();
  const [nextPage, setNextPage] = React.useState("");
  const [announcementArr, setAnnouncementArr] = React.useState([]); //we will store all the announcements in this array
  const [add, setAdd] = React.useState(''); //to add the announcement and role
  const [isShort, setIsShort] = React.useState(true); //just 35 characters must be shown if true
  const [isShortArray, setIsShortArray] = React.useState(true); //how many announcements should be visible(2 or all)
  //for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [opentwo, setOpentwo] = React.useState(false);
  const handleOpentwo = () => setOpentwo(true);
  const handleClosetwo = () => setOpentwo(false);
  const [isStudent, setIsStudent] = useState(true);
  const { welcomeDetails = {} } = useDashboardContext();
  //select
  const [role, setrole] = React.useState(''); //which one? teacher, principal, none//which one have you selected
  const [select, setSelect] = React.useState(false);
  const [roledata, setRoledata] = React.useState(); //roles coming from API
  //we are making request to show roles in modal
  const getRoleData = () => {
    apiRequest('get', endpoints.dashboard.student.roles)
      .then((result) => {
        if (result.data.status_code === 200) {
          setRoledata(result.data.result);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  //making request to show announcements
  const updateAnnouncement = () => {
    apiRequest('get', endpoints.dashboard.student.update)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAnnouncementArr(result.data.result.results);
          setNextPage(result.data.result.next);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  const nextpagehandler = () => {
    // apiRequest('get', endpoints.dashboard.student.update)
    axiosInstance
      .get(nextPage)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAnnouncementArr(result.data.result.results);
          setNextPage(result.data.result.next);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  useEffect(() => {
    getRoleData();
    updateAnnouncement();
  }, []);
  const handleChange = (event) => {
    setrole(event.target.value);
  };
  const selectClose = () => {
    setSelect(false);
  };
  const selectOpen = () => {
    setSelect(true);
  };
  const addbtnhandler = () => {
    if (add.length === 0) {
      // checking if user has entered anything or not. we dont want an empty announcement to be shown
      return;
    }
    setAdd('');
    const payload = { role_id: role, content: add }
    apiRequest('post', endpoints.dashboard.student.create, payload)
      .then((result) => {
        if (result.data.status_code === 200) {
          updateAnnouncement();
          setrole('');
          setAdd('');
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  return (
    <Grid container direction='column' spacing={1} className={classes.box} xs={12}>
      <Grid>
        <Grid item>
          <Grid container item>
            <Grid item xs={12}>
              <span className={classes.announcementhead}>Announcements
                <span style={{ marginLeft: '10px' }}>
                  {welcomeDetails?.userLevel == '4' ? '' : <Button onClick={handleOpen} className={classes.add}>
                    <AddCommentIcon style={{ fontSize: "small" }} />
                  </Button>}
                </span>
              </span>
              <hr />
              <span>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <div>
                      <FormControl
                        className={classes.formControl}
                        variant='outlined'
                        margin='dense'
                        fullWidth
                      >
                        <InputLabel
                          id='demo-controlled-open-select-label'
                          style={{ backgroundColor: 'white', padding: '0 5px' }}
                        >
                          role
                        </InputLabel>
                        <Select
                          labelId='demo-controlled-open-select-label'
                          id='demo-controlled-open-select'
                          open={select}
                          onClose={selectClose}
                          onOpen={selectOpen}
                          value={role}
                          onChange={handleChange}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {roledata &&
                            roledata.map((role) => {
                              return (
                                <MenuItem value={role.id} key={role.id}>
                                  {role.role_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <div className={classes.textfieldgap}>
                        <TextField
                          label='Required*'
                          variant='outlined'
                          margin='dense'
                          multiline
                          rowsMax='3'
                          value={add}
                          onChange={(e) => setAdd(e.target.value)}
                          inputProps={{
                            maxLength: 250,
                          }}
                          fullWidth
                          id='fullWidth'
                        />
                      </div>
                      <div className={classes.addbtntextfield}>
                        <Button
                          style={{ backgroundColor: '#349ceb' }}
                          onClick={addbtnhandler}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </span>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container item>
            <Grid item className={classes.details}>
              {isShortArray ? ( //we are checking if we want to render 2 or all items in announcement */}
                <ul>
                  {announcementArr.map(
                    (d, i) =>
                      i <= 1 && (
                        <div key={`Annoucement${i}`}>
                          <li className={classes.listitem}>
                            <p>
                              <span style={{ marginRight: "7px", }}><img src={bullet} alt="bulet" style={{ width: '8px' }}></img></span>
                              <span>
                                {d.content}

                              </span>
                            </p>
                            <p>
                              <span className={classes.time}>
                                {moment(d.created_at).calendar()};
                              </span>
                            </p>
                          </li>
                        </div>
                      )
                    // );
                  )}
                  <div>
                    <div onClick={handleOpentwo}>
                      <img className={classes.icon} src={moreicon} alt='bttn' />
                    </div>
                    <div>
                      <Button
                        size="small"
                        onClick={handleOpentwo}
                        className={classes.iconmore}
                        style={{ color: "white", fontSize: "1em" }}

                      >
                        {isShortArray ? 'more' : 'less'}
                      </Button>
                      <Modal
                        open={opentwo}
                        onClose={handleClosetwo}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                      >
                        <Box sx={styletwo}>
                          <div className={classes.announcementheadtwo}>Announcements</div>
                          <hr />
                          <ul>
                            {announcementArr.map((item, index) => {
                              return (
                                <div key={`Ann_${index}`}>
                                  <Card style={{ margin: "10px" }}>
                                    <CardContent>
                                      <Typography>{moment(item.created_at).calendar()}</Typography>
                                      <Typography color="textSecondary">{item.content}</Typography>
                                    </CardContent>
                                  </Card>
                                </div>
                              );
                            })}
                            <Button onClick={nextpagehandler} style={{ margin: "20px 250px" }}>Old</Button>
                          </ul>
                        </Box>
                      </Modal>
                    </div>
                  </div>
                </ul>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
