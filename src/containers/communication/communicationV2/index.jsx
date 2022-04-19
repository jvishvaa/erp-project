import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Typography,
  Menu,
  MenuItem,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  TextField,
  Checkbox,
  IconButton,
} from '@material-ui/core';
// import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import EventIcon from '@material-ui/icons/Event';
import EventNoteIcon from '@material-ui/icons/EventNote';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import SubjectIcon from '@material-ui/icons/Subject';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MessageIcon from '@material-ui/icons/Message';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import NestedMenuItem from 'material-ui-nested-menu-item';
import { DataGrid } from '@material-ui/data-grid';
import CreateAnouncement from './CreateAnnouncement';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));



// const rows = [
//   {
//     date: '11/04/2022',
//     id: '001',
//     description: 'DANCE COMPETITION',
//     imageurl:
//       'https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg',
//     details:
//       'There will be Dance Competition on 28th March 2022. Students interested should register with their respective class representatives. There is no entry fee.Note: All the dress should be arranged by the students themselves.',
//   },
//   {
//     date: '12/04/2022',
//     id: '002',
//     description: 'HOLIDAY',
//     details:
//       'There will be Dance Competition on 28th March 2022. Students interested should register with their respective class representatives. There is no entry fee.Note: All the dress should be arranged by the students themselves.',
//   },
//   {
//     date: '10/04/2022',
//     id: '003',
//     description: 'LOST',
//     details:
//       'There will be Dance Competition on 28th March 2023. Students interested should register with their respective class representatives.Veniam, illo, aperiam voluptatum magni et asperiores',
//   },
//   {
//     date: '12/04/2022',
//     id: '003',
//     description: 'Found',
//     details:
//       'There will be Dance Competition on 28th March 2023. Students interested should register with their respective class representatives.Veniam, illo, aperiam voluptatum magni et asperiores',
//   },
//   {
//     date: '11/04/2022',
//     id: '003',
//     description: 'LOST',
//     details:
//       'There will be Dance Competition on 28th March 2023. Students interested should register with their respective class representatives.Veniam, illo, aperiam voluptatum magni et asperiores',
//   },
//   {
//     date: '11/04/2022',
//     id: '003',
//     description: 'Holiday',
//     details:
//       'There will be Dance Competition on 28th March 2023. Students interested should register with their respective class representatives.Veniam, illo, aperiam voluptatum magni et asperiores',
//   },
// ];
const columns = [
  { field: 'id', headerName: '', width: 90 },
  { field: 'section', headerName: '', width: 90 },
];

const graderows = [
  { id: 1, section: 'Section A' },
  { id: 2, section: 'Section B' },
  { id: 3, section: 'Section C' },
];

const NewCommunication = () => {
  const classes = useStyles();
  const [headerOpen, setHeaderOpen] = useState(false);
  const [onClickIndex, setOnClickIndex] = useState(1);
  const [dialogData, setDialogData] = useState([]);
  const [openPublish, setOpenPublish] = useState(false);
  const currentDate = moment(new Date()).format('DD/MM/YYYY');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows]= useState([]);
  console.log('debug1', rows)

  const handleRightClick = (event) => {
    if (menuPosition) {
      return;
    }
    event.preventDefault();
    setMenuPosition({
      top: event.pageY,
      left: event.pageX,
    });
  };
  const handleItemClick = (event) => {
    // setMenuPosition(null);
  };

  // console.log('Debug', currentDate);

  const handleClose = () => {
    setHeaderOpen(false);
    setOpenPublish(false);
    setAnchorEl(null);
  };

  const handlePopOverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  const userToken = JSON.parse(localStorage.getItem('userDetails'))?.token;

const rowsData = () => {
  axiosInstance
    .get(`${endpoints.announcementNew.inbox}`, {
      headers: {
        'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com', 
        // 'X-DTS-HOST': window.location.host,
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((result) => {
      if (result?.data?.status_code === 200) {
        console.log('debug api data', result?.data?.data);
        setRows(result?.data?.data);
        // setBranchId(result.data.result[0].branch_id);
        // setSessionYearId(selectedAcademicYear?.id);
      }
    })
    .catch((error) => {
      // setAlert('error', error?.message);
      // setLoading(false);
    });
};

useEffect(() => {
  rowsData();
}, [])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


 

  // var date = moment(yourdate).format('MM/DD/YYYY');
  const Output = rows.reduce((initialValue, data) => {
    console.log('debug data in reduce', data)
    console.log('debug initialValue in reduce', initialValue)
    // const date = data.date;
    const date = moment(data.created_time).format('MM/DD/YYYY')
    if (!initialValue[date]) {
      console.log("DEBUG empty")
      initialValue[date] = [];
    }
    initialValue[date].push(data);
    return initialValue;
  }, {});

  console.log('Debug Output after reduce', Output);
  // Edit: to add it in the array format instead
  const dateWiseEvents = Object.keys(Output)
    // .sort()
    .map((date) => {
      console.log('debugdate', date)
      console.log('debugevent', Output[date])
      return {
        date,
        events: Output[date],
      };
    });
    
  console.log('Debug dateWiseEvents', dateWiseEvents);

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={9} sm={9} md={9} spacing={3}>
          <div style={{ padding: '0 20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ paddingTop: '10px', color: '#347394', fontSize: '20px' }}>
                Announcements
              </div>
              <div
                style={{
                  paddingTop: '10px',
                  color: '#347394',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                <Typography onClick={handleRightClick}>Filters</Typography>
              </div>
            </div>
            {dateWiseEvents.reverse().map((announcement) => {
              console.log("DEBUG", announcement.date);
              return (
                <>
                  <div
                    style={{
                      // marginLeft: '20px',
                      padding: '10px 0',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {announcement.date == moment(new Date()).format('DD/MM/YYYY')
                      ? 'Today, '
                      : announcement.date ==
                        moment().subtract(1, 'days').format('DD/MM/YYYY')
                      ? 'Yesterday, '
                      : ''}
                    {announcement.date}
                  </div>
                  <div>
                    <Paper>
                      {announcement.events.map((item) => (
                        <Grid
                          container
                          style={{
                            height: '40px',
                            marginBottom: '5px',
                            borderLeft: '5px solid red',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            style={{
                              display: 'flex',
                              // justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                color: 'black',
                                fontWeight: 'bold',
                                paddingLeft: '20px',
                                fontSize: '14px',
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={onClickIndex === 1 ? 10 : 9}
                            sm={onClickIndex === 1 ? 10 : 9}
                            md={onClickIndex === 1 ? 10 : 9}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onClick={() => {
                              setHeaderOpen(true);
                              setDialogData(item);
                            }}
                          >
                            <Typography
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                color: '#7F92A3',
                                // height: '25px',
                                fontSize: '14px',
                                paddingLeft: '20px',
                              }}
                            >
                              {item?.content}
                            </Typography>
                          </Grid>
                          {onClickIndex !== 1 && (
                            <Grid
                              item
                              xs={1}
                              sm={1}
                              md={1}
                              style={{
                                display: 'flex',
                                width: '90px!important',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}
                            >
                              {onClickIndex === 2 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    paddingRight: '10px',
                                  }}
                                  onClick={(event) => {
                                    setDialogData(item);
                                    return handlePopOverClick(event);
                                  }}
                                >
                                  <MoreHorizIcon />
                                </div>
                              )}
                              {onClickIndex === 3 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    // justifyContent: 'space-evenly',
                                    paddingRight: '10px',
                                  }}
                                >
                                  <MessageIcon />
                                  <WhatsAppIcon />
                                  <MailIcon />
                                </div>
                              )}
                            </Grid>
                          )}
                        </Grid>
                      ))}
                    </Paper>
                  </div>
                </>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={3} sm={3} md={3} spacing={2}>
          <div style={{ height: '80px' }}></div>
          <List dense={true}>
            <ListItem
              button
              onClick={() => {
                setOnClickIndex(1);
              }}
            >
              <ListItemIcon>
                <InboxIcon style={{ color: '#464D57' }} />
              </ListItemIcon>
              <ListItemText primary='Inbox' style={{ color: '#464D57' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setOnClickIndex(2);
              }}
            >
              <ListItemIcon>
                <MailIcon style={{ color: '#464D57' }} />
              </ListItemIcon>
              <ListItemText primary='Draft' style={{ color: '#464D57' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setOnClickIndex(3);
              }}
            >
              <ListItemIcon>
                <SendIcon style={{ color: '#464D57' }} />
              </ListItemIcon>
              <ListItemText primary='Sent' style={{ color: '#464D57' }} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <EventIcon style={{ color: '#7852CC' }} />
              </ListItemIcon>
              <ListItemText primary='Event' style={{ color: '#7852CC' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <EventNoteIcon style={{ color: '#EF005A' }} />
              </ListItemIcon>
              <ListItemText primary='Exam' style={{ color: '#EF005A' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <BeachAccessIcon style={{ color: '#F96C00' }} />
              </ListItemIcon>
              <ListItemText primary='Holiday' style={{ color: '#F96C00' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <InsertInvitationIcon style={{ color: '#62A7EB' }} />
              </ListItemIcon>
              <ListItemText primary='Time Table' style={{ color: '#62A7EB' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <SubjectIcon style={{ color: '#464D57' }} />
              </ListItemIcon>
              <ListItemText primary='General' style={{ color: '#464D57' }} />
            </ListItem>
          </List>
          <div style={{ height: '80px' }}></div>
          <Button
            variant='contained'
            color='primary'
            size='large'
            // className={classes.button}
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Create New
          </Button>
        </Grid>
      </Grid>
      <Dialog
        maxWidth={'md'}
        open={headerOpen}
        onClose={handleClose}
        aria-describedby='alert-dialog-description'
        style={{ backgroundColor: 'rgba(50, 43, 47, 0.63)' }}
      >
        {openPublish && (
          <DialogTitle
            id='max-width-dialog-title'
            style={{
              display: 'flex',
              color: 'black',
              justifyContent: 'center',
              margin: '-1% 0',
            }}
          >
            Are you sure you want to publish this draft?
          </DialogTitle>
        )}
        <DialogContent
          style={{
            borderLeft: '5px solid blue',
            margin: openPublish ? '1% 4%' : '0px',
            backgroundColor: '#EAEFF6',
            width: '65vw'
          }}
        >
          <DialogContentText style={{ width: '100%'}}>
            <Grid container>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div>
                  <Typography
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    {dialogData.created_user}
                  </Typography>
                </div>
                <div>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData.created_time).format('MM/DD/YYYY')}
                  </Typography>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData.created_time).format('hh:mm:ss a')}
                  </Typography>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {['Teachers', 'Students', 'Coordinators'].map(
                    (item) => (
                      <span
                        style={{
                          background: '#EBEBEB 0% 0% no-repeat padding-box',
                          border: '1px solid #EBEBEB',
                          borderRadius: 17,
                          opacity: '1',
                          textAlign: 'center',
                          fontSize: '12px',
                          margin: '5px 5px 0 0',
                          padding: '5px',
                        }}
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </Grid>
              <Grid item xs={8} sm={8} md={8} style={{width: '100%'}}>
                <div>{dialogData.title}</div>
                <div style={{ margin: '10px 0' }}>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {dialogData.content}
                  </Typography>
                </div>
                {dialogData.imageurl && (
                  <div style={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
                    <img
                      style={{ width: '80%', height: '80%' }}
                      src={dialogData.attachments[0]}
                    />
                  </div>
                )}
              </Grid>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {openPublish ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      height: '30px',
                    }}
                  >
                    <IconButton
                      title='Delete'
                      // onClick={}
                    >
                      <DeleteIcon style={{ color: '#FF006F' }} />
                    </IconButton>
                    <IconButton
                      title='Edit'
                      // onClick={}
                    >
                      <BorderColorIcon style={{ color: '#536476' }} />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Typography
                      style={{
                        color: '#0070D5',
                        fontSize: '12px',
                        marginRight: 5,
                      }}
                    >
                      Total {dialogData.total_members} Receipients
                    </Typography>
                    <CancelIcon
                      style={{
                        height: '12px',
                        width: '12px',
                        cursor: 'pointer',
                      }}
                      onClick={handleClose}
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        {openPublish && (
          <DialogActions
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button autoFocus onClick={handleClose} variant='contained' color='default'>
              Cancel
            </Button>
            <Button autoFocus variant='contained' color='primary'>
              Publish
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopOverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List style={{ cursor: 'pointer' }} dense={true}>
          <ListItem
            onClick={() => {
              setOpenPublish(true);
              setHeaderOpen(true);
            }}
          >
            <ListItemIcon>
              <SendIcon style={{ color: '#7852CC' }} />
            </ListItemIcon>
            <ListItemText primary='Publish' style={{ color: '#7852CC' }} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BorderColorIcon style={{ color: '#EF005A' }} />
            </ListItemIcon>
            <ListItemText primary='Edit' style={{ color: '#EF005A' }} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DeleteIcon style={{ color: '#EF005A' }} />
            </ListItemIcon>
            <ListItemText primary='Delete' style={{ color: '#EF005A' }} />
          </ListItem>
        </List>
      </Popover>
      <CreateAnouncement openModal={openModal} setOpenModal={setOpenModal} />
      <Menu
        open={!!menuPosition}
        onClose={() => setMenuPosition(null)}
        anchorReference='anchorPosition'
        anchorPosition={menuPosition}
      >
        <MenuItem onClick={handleItemClick}>
          <form className={classes.container} noValidate>
            <TextField
              id='date'
              label='Birthday'
              type='date'
              display='none'
              defaultValue='2017-05-24'
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </MenuItem>
        <NestedMenuItem
          label='Select by Grade'
          parentMenuOpen={!!menuPosition}
          onClick={handleItemClick}
        >
          <MenuItem onClick={handleItemClick}>Grade 1</MenuItem>
          <MenuItem onClick={handleItemClick}>Grade 2</MenuItem>
          <NestedMenuItem
            label='Grade 3'
            parentMenuOpen={!!menuPosition}
            onClick={handleItemClick}
          >
            <MenuItem onClick={handleItemClick}>
              Sub Grade 1{' '}
              <Checkbox
                color='primary'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </MenuItem>
            <MenuItem onClick={handleItemClick}>
              Sub Grade 2{' '}
              <Checkbox
                color='primary'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
      </Menu>
    </Layout>
  );
};

export default NewCommunication;
