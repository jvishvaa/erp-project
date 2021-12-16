import React, { useEffect, useState, useContext } from 'react';
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
import bullet from "./bullet.svg";
import axiosInstance from 'config/axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useDashboardContext } from '../../../dashboard-context';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { IconButton } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import Loading from '../../../../../components/loader/loader';
import InfiniteScroll from 'react-infinite-scroll-component';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
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
  borderRadius: "5px",
  height: '450px',
  overflow: 'auto',
  color: 'white',
  overflow: 'hidden',
  padding: '10px 0px',
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
    marginTop: 6,
    height: '100px',
  },
  addbtntextfield: {
    marginTop: 20,
  },
  announcementhead: {
    color: theme.palette.secondary.main,
    fontWeight: 800,
    fontSize: "1.2em",
    position: "sticky",
    top: "0px",
    // background: "wheat",
    margin: "0 auto 0px auto",
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
   
    height: "135px",
    overflow: 'hidden',
    border: '1px solid #d3d1d1',
    borderRadius: "5px",
    position: 'relative',
    top: 10,
    paddingBottom: 10,
    padding: 10,
    transform: "translateX(4px)",
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
    fontSize: "1em",
    fontWeight: 800,
    color: theme.palette.secondary.main,
    
  },
  icon: {
    position: 'absolute',
    bottom: 24,
    right: '2em',
    zIndex: '110',
    width: "10%",
    marginBottom: '10px',
  },
  add: {
    fontSize: "small",
  },
  details: {
    color: 'white',
    // overflowY: 'scroll',
    // scrollX: 'none',
    fontWeight: 600,
    fontSize: "1em",
    padding: 10,
    maxWidth: '450px',
    paddingTop: 10,
    '&::marker': {
      color: 'yellow',
      fontWeight: "bolder",
    },
  },
  listitem: {
    color: theme.palette.secondary.main,
    marginBottom: '3px',
    listStyle: "none",
    fontsize: "1em",
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
  // '@media (max-width: 960px)': {
  //   iconmore: {
  //     position: 'absolute',
  //     bottom: 5,
  //     right: '3em',
  //     zIndex: '100',
  //     backgroundColor: '#349ceb',
  //     fontSize: "0.9em",
  //   },
  //   icon: {
  //     position: 'absolute',
  //     bottom: 40,
  //     right: '3.5em',
  //     zIndex: '110',
  //   },
  // },
}));
export default function Announcement(props) {
  const classes = useStyles();
  const [nextPage, setNextPage] = React.useState("");//next page url from API response 
  const [announcementArr, setAnnouncementArr] = React.useState([]); //we will store all the announcements in this array
  const [add, setAdd] = React.useState(''); //to add the announcement and role
  const [editadd, setEditAdd] = React.useState('');// to add the edited announcement from the modal
  const [isShort, setIsShort] = React.useState(true); //just 35 characters must be shown if true
  const [isShortArray, setIsShortArray] = React.useState(true); //how many announcements should be visible(2 or all)
  //for modal
  const [open, setOpen] = React.useState(false);
  const [checkdata, setCheckdata] = React.useState('');
  const handleOpen = (data , index) => {setOpen(true) 
  setOpentwo(false);
  if(data?.content) {
    setCheckdata(data);
    console.log(data , "check");
    
  }
  };
  const handleClose = () => {
    setOpen(false);
    setCheckdata('')
    }
  const [opentwo, setOpentwo] = React.useState(false);
  const handleOpentwo = () => setOpentwo(true);
  const handleClosetwo = () => setOpentwo(false);
  const [isStudent, setIsStudent] = useState(true);
  const { welcomeDetails = {} } = useDashboardContext();
  //select
  const [role, setrole] = React.useState("");
  // const [role, setrole] = React.useState([]); //which one? teacher, principal, none, student,//which one have you selected
  const [select, setSelect] = React.useState(false);
  const [roledata, setRoledata] = React.useState(); //roles coming from API
  const matches = useMediaQuery('(max-width:600px)');
  const { setAlert } = useContext(AlertNotificationContext);
  const [ today , setToday  ] = useState([])
  const [ yesterday , setYesterday  ] = useState([])
  const [ twodays , setTwodays ] = useState([])
  const [ oldPost , setOldPost ] = useState([])
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
    apiRequest('get', endpoints.dashboard.student.update,null,null,true, 5000)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setIsEnabled(result?.data?.is_enabled)
          setNextPage(result?.data?.result?.next);
          setAnnouncementArr(result?.data?.result?.data);
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  const nextpagehandler = () => {
    let url = nextPage.split('page=')[1]
    apiRequest('get', `${endpoints.dashboard.student.update}?page=${url}` ,null, null, true, 5000)
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
  // const handleChange = (event, newValue) => {
  //   setrole(newValue);
  // };
  const handleChange = (event, newvalue) => {
    setrole(newvalue);
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
    // setAdd('');
    // let myRole = [];
    // role?.length && role.map(item => {
    //   myRole.push(item.id)
    // })
    // const payload = { role_id: myRole, content: add }
    const payload = { role_id: role.id, content: add }
    apiRequest('post', endpoints.dashboard.student.create, payload)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          updateAnnouncement();
          setrole('');
          setAdd('');
          setOpen(false)
        }
      })
      .catch((error) => {
        console.log('error');
      });

  };
  

  const deleteHandler = (item, index , arr) => {
    setLoading(true);
    // announcementArr.splice(index, 1);
    apiRequest('delete', `${endpoints.dashboard.student.deleteAnnouncement}${item.id}/`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', "Deleted");
          arr.splice(index, 1);
          setLoading(false);
          checkDates();
          getRoleData();
          setRoledata([])
          updateAnnouncement();
        } else {
          setAlert('error', "Not Authorized");
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', "Network Error");
        setLoading(false);
      });
  }

  const editHandler = (item, index) => {
    // setLoading(true);
    setOpentwo(false);
    // let myRole = [];
    // role && role?.length && role.map(roleitem => {
    //   myRole.push(roleitem.id)
    // })
    // const payload = { role_id: myRole, content: add }
    // const payload = { role_id: role, content: add }
    const payload = { role_id: role.id, content: add }
    apiRequest('put', `${endpoints.dashboard.student.editAnnouncement}${checkdata?.id}/`, payload)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          // setAlert('success', "Deleted");
          // announcementArr.splice(index, 1);
          // debugger;
          // announcementArr[index].content = add;
          // announcementArr[index].role_id = myRole;
          updateAnnouncement()
          handleClose()
          setLoading(false);
          checkDates();
          getRoleData();
          setRoledata([])
          setAdd('')
          setrole("")
          setCheckdata("");
        } else {
          setAlert('error', "Not Authorized");
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', "Network Error");
        setLoading(false);
      });
  }


  const checkDates = () => {
  setToday(announcementArr.filter((item) => { return (`${moment(item.created_at).format('YYYY-MM-DD')}` === 
  `${moment().format('YYYY-MM-DD')}`)}))
  setYesterday(announcementArr.filter((item) => { return (`${moment(item.created_at).format('YYYY-MM-DD')}` === 
  `${moment().subtract(1, 'days').format('YYYY-MM-DD')}`)}))
  setTwodays(announcementArr.filter((item) => { return (`${moment(item.created_at).format('YYYY-MM-DD')}` === 
  `${moment().subtract(2, 'days').format('YYYY-MM-DD')}`)}))
  setOldPost(announcementArr.filter((item) => moment().diff(moment(item.created_at),'days') > 2))
  }
  useEffect(()=> {
    checkDates();
  } , [announcementArr])
  return (
    <Grid container direction='column' spacing={1} className={classes.box} style={{height: matches? "320px": "135px", }} xs={12}>
      <Grid>
        <Grid item>
          <Grid container item>
            <Grid item xs={12}>
              <div>
              <span className={classes.announcementhead}>Announcements
                <span style={{ marginLeft: '10px' }}>
                  {welcomeDetails?.userLevel == '4' ? '' :
                    <AddCommentIcon onClick={handleOpen} style={{ fontSize: "1.3rem", cursor: 'pointer' }} />}
                </span>
              </span>
              <hr />
              </div>
              <span>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <div>
                      <div style={{ width: "100%" }}>
                        <Autocomplete
                          freeSolo
                          id="free-solo-2-demo"
                          disableClearable
                          options={roledata}
                          getOptionLabel={(option) => option?.role_name}
                          filterSelectedOptions
                          onChange={handleChange}
                          value={role}
                          // value={role || []}
                          // multiple
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Search role"
                              margin="normal"
                              variant="outlined"
                              fullWidth
                              InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                          )}
                        />
                      </div>

                      <div className={classes.textfieldgap}>
                        <TextField
                          label='Enter the Announcement:*'
                          variant='outlined'
                          margin='dense'
                          // style={{ height: '50px' }}
                          multiline
                          rowsMax='3'
                          rows={4}
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
                        { checkdata === '' ? <Button
                          style={{ backgroundColor: '#349ceb' }}
                          // onClick={handleClose}
                          onClick={addbtnhandler}
                        >
                          Add
                        </Button>
                        : <Button
                          style={{ backgroundColor: '#349ceb', }}
                          // onClick={handleClose}
                          onClick={editHandler}
                        >
                          Edit
                        </Button>}
                        <Button
                          style={{ backgroundColor: '#349ceb', marginLeft: '50px' }}
                          // onClick={handleClose}
                          onClick={handleClose}
                        >
                          Close
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
              <div >
              {isShortArray ? ( //we are checking if we want to render 2 or all items in announcement */}
                <ul style={{overflow: "scroll", height : "100px", width: "350px"}}>
                  {isEnabled && announcementArr && announcementArr.map(
                    (d, i) =>
                      i <= 10 && (
                        <div key={`Annoucement${i}`} >
                          <li className={classes.listitem}>
                            <div style={{display:'flex', justifyContent:'flex-start'}}>
                              <div style={{ marginRight: "7px", }}><img src={bullet} alt="bulet" style={{ width: '8px' }}></img></div>
                              <div style={{textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap',position: 'relative'}}>
                                {d?.content}
                              </div>
                            </div>
                            <p>
                              <span className={classes.time}>
                                {moment(d?.created_at).calendar()};
                              </span>
                            </p>
                          </li>
                        </div>
                      )
                    // );
                  )}
                   {isEnabled && matches? <Button
                   variant="outlined"
                   size="small"
                   style={{ fontSize: "1em" }}
                   color='black'
                   onClick={nextpagehandler}
                   disabled={!isEnabled}
                   >
                     More
                     </Button>: ""}
                  <div>
                    {isEnabled && matches ? "" : <div onClick={handleOpentwo}>
                      <img className={classes.icon} src={moreicon} alt='bttn' />
                    </div>}
                    <div>
                      {matches ? "" : <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpentwo}
                        className={classes.iconmore}
                        style={{ fontSize: "0.8em" }}
                        // varient='contained'
                        color='primary'
                      >
                        {isShortArray ? 'more' : 'less'}
                      </Button>}
                      <Modal
                        open={opentwo}
                        onClose={handleClosetwo}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                      >
                        <Box sx={styletwo}>
                          <div className={classes.announcementheadtwo}>Announcements</div>
                          <hr />
                          <InfiniteScroll
                              dataLength={announcementArr?.length}
                              next={nextpagehandler}
                              hasMore={!!nextPage}
                              loader={<h4>Loading...</h4>}
                              endMessage={
                                <p style={{ textAlign: 'center' }}>
                                  <b>Yay! You have seen it all</b>
                                </p>
                              }
                              height={500}
                            >
                          
                          <div>
                          <div>
                          <Card style={{ margin: '10px' }}>
                            <CardContent>
                            <div style={{textAlign:"center", fontSize:"16px", fontWeight:"800"}}>Today</div>
                           <ul style={{paddingLeft:"30px"}}> 
                          { today && today.map((item,index)=>{ return <div style={{display:"flex", justifyContent:"space-between"}} key={`Anntoday_${index}`}>
                            <li style={{ maxWidth: "350px", wordWrap: "break-word", whiteSpace: "pre-line"}}>{item?.content}</li>
                            <div>{welcomeDetails?.userLevel == '4' ? '' : (
                              <div>
                            <IconButton onClick={() => deleteHandler(item, index, today)} >
                            <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => handleOpen(item , index)}>Update</Button>
                            
                            </div>
                            )}</div>
                            </div>})}
                          </ul>
                          </CardContent>
                          </Card>
                          </div>
                          <div>
                          <Card style={{ margin: '10px' }}>
                            <CardContent>
                            <div style={{textAlign:"center", fontSize:"16px", fontWeight:"800"}}>Yesterday</div>
                           <ul style={{paddingLeft:"30px"}}> 
                            {yesterday && yesterday.map((item, index)=>{ return <div style={{display:"flex", justifyContent:"space-between"}} key={`AnnYEs_${index}`}>
                            <li style={{ maxWidth: "350px", wordWrap: "break-word", whiteSpace: "pre-line"}}>{item?.content}</li>
                            <div>
                            {welcomeDetails?.userLevel == '4' ? '' : (
                              <div>
                            <IconButton onClick={() => deleteHandler(item, index, yesterday)} >
                            <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => handleOpen(item , index)}>Update</Button>
                            </div>
                            )}
                            </div>
                          </div>})}
                         
                          </ul>
                          </CardContent>
                          </Card>
                          </div>
                          <div>
                          <Card style={{ margin: '10px' }}>
                            <CardContent>
                            <div style={{textAlign:"center", fontSize:"16px", fontWeight:"800"}}>2 Days back</div>
                           <ul style={{paddingLeft:"30px"}}> 
                            {twodays && twodays.map((item, index)=>{return <div style={{display:"flex", justifyContent:"space-between"}} key={`Anntwo_${index}`}>
                            <li style={{ maxWidth: "350px", wordWrap: "break-word", whiteSpace: "pre-line"}}>{item?.content}</li>
                            <div>{welcomeDetails?.userLevel == '4' ? '' : (
                              <div>
                            <IconButton onClick={() => deleteHandler(item, index, twodays)} >
                            <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => handleOpen(item , index)}>Update</Button>
                            </div>
                            )}</div>
                            </div>})}
                          </ul>
                          </CardContent>
                          </Card>
                          </div>
                          <div>
                          <Card style={{ margin: '10px' }}>
                            <CardContent>
                            <div style={{textAlign:"center", fontSize:"16px", fontWeight:"800"}}>Old</div>
                            <ul style={{paddingLeft:"30px"}}> 
                           {oldPost && oldPost.map((item, index)=>{ return <div style={{display:"flex", justifyContent:"space-between"}} key={`Annold_${index}`}> 
                             <li style={{ maxWidth: "350px", wordWrap: "break-word", whiteSpace: "pre-line", }}>{item?.content}</li>
                             <div>{welcomeDetails?.userLevel == '4' ? '' : (
                               <div>
                            <IconButton onClick={() => deleteHandler(item, index, oldPost)} >
                            <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => handleOpen(item , index)}>Update</Button>
                            </div>
                            )}</div>
                             </div>})}
                          </ul>
                          <ul>  
                        
                          </ul>
                          </CardContent>
                          <Button>Close</Button>
                          </Card>
                          </div>
                          
                          </div>
                          </InfiniteScroll>
                        </Box>
                      </Modal>
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