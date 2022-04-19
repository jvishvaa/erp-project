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
import { Autocomplete } from '@material-ui/lab';
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
import { connect, useSelector } from 'react-redux';
import FilterFramesIcon from '@material-ui/icons/FilterFrames';

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
  const [filterOn, setFilterOn] = useState(false);
  const currentDate = moment(new Date()).format('DD/MM/YYYY');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [defaultdate, setDefaultDate] = useState(moment().format('YYYY-MM-DD'));
  const [branchList, setBranchList] = useState([]);
  const [selectedbranchListData, setSelectedbranchListData] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [selectedGradeListData, setSelectedGradeListData] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionListData, setSelectedSectionListData] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState([]);
  const [selectedSectionMappingId, setSelectedSectionMappingId] = useState([]);

  const branches = JSON.parse(localStorage.getItem('userDetails'))?.role_details?.branch;
  const branchId = branches.map((item) => item.id);
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
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const rowsData = (filterOn) => {
    let url = '';
    let baseurl = `date=${defaultdate}&section_mapping=${selectedSectionMappingId.toString()}`;
    if (filterOn && selectedSectionMappingId.length > 0) {
      if (onClickIndex == 1) {
        url = `${endpoints.announcementNew.inbox}?${baseurl}`;
      }
      if (onClickIndex == 2) {
        url = `${endpoints.announcementNew.inbox}?is_draft=True&${baseurl}`;
      }
      if (onClickIndex == 3) {
        url = `${endpoints.announcementNew.inbox}?is_sent=True&${baseurl}`;
      }
    } else {
      if (onClickIndex == 1) {
        url = `${endpoints.announcementNew.inbox}`;
      }
      if (onClickIndex == 2) {
        url = `${endpoints.announcementNew.inbox}?is_draft=True`;
      }
      if (onClickIndex == 3) {
        url = `${endpoints.announcementNew.inbox}?is_sent=True`;
      }
    }

    axiosInstance
      .get(`${url}`, {
        headers: {
          // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
          'X-DTS-HOST': window.location.host,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setRows(result?.data?.data);
          // setFilterOn(false);
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    rowsData();
  }, [onClickIndex]);

  const dateUpdatefun = (event) => {
    setDefaultDate(event.target.value);
  };

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${
          selectedAcademicYear?.id
        }&module_id=${2}` //module id hardcorded right now
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(allBranchData);
        } else {
          setBranchList([]);
        }
      });
  };

  const getGrade = () => {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${branchId}&module_id=${2}` //moduleId hardcore for right now
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          setBranchList([]);
        }
      });
  };

  const handleGrade = (e, value) => {
    if (value?.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.grade_id);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData(data);
      setSelectedGradeId(ids);
    } else {
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData([]);
      setSelectedGradeId([]);
    }
  };

  const handleSection = (e, value) => {
    if (value?.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.section_id);
      const sectionMappingIds = value.map((el) => el.id);
      setSelectedSectionId(ids);
      setSelectedSectionListData(data);
      setSelectedSectionMappingId(sectionMappingIds);
    } else {
      setSelectedSectionListData([]);
    }
  };

  const getSection = () => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${branchId}&grade_id=${selectedGradeId}&module_id=${2}` //module id hardcorded right now
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionList(res?.data?.data);
        } else {
          setSectionList([]);
        }
      });
  };

  useEffect(() => {
    getBranch();
    getGrade();
    getSection();
  }, [selectedGradeId]);

  const updatePublish = (id) => {
    const params = {
      is_draft: false,
    };
    axiosInstance
      .patch(`${endpoints.announcementNew.publish}/${id}/`, params)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          handleClose();
          rowsData();
        } else {
          setSectionList([]);
        }
      });
  };

  const updateDelete = (id) => {
    axiosInstance.delete(`${endpoints.announcementNew.publish}/${id}/`).then((res) => {
      if (res?.data?.status_code === 200) {
        handleClose();
        rowsData();
      } else {
        setSectionList([]);
      }
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const Output = rows.reduce((initialValue, data) => {
    const date = moment(data.created_time).format('MM/DD/YYYY');
    if (!initialValue[date]) {
      initialValue[date] = [];
    }
    initialValue[date].push(data);
    return initialValue;
  }, {});

  // Edit: to add it in the array format instead
  const dateWiseEvents = Object.keys(Output)
    .sort()
    .map((date) => {
      return {
        date,
        events: Output[date],
      };
    });

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  const resolveRole = (type) => {
    switch (type) {
      case 11:
        return 'Teacher';
      case 13:
        return 'Student';
      case 1:
        return 'Super Admin';
      case 8:
        return 'Principal';
      default:
        return '--';
    }
  };

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
                <Typography
                  onClick={handleRightClick}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  Filters <FilterFramesIcon />
                </Typography>
              </div>
            </div>
            {dateWiseEvents?.reverse().map((announcement) => {
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
                    {announcement?.date == moment(new Date()).format('MM/DD/YYYY')
                      ? 'Today, '
                      : announcement?.date ==
                        moment().subtract(1, 'days').format('MM/DD/YYYY')
                      ? 'Yesterday, '
                      : ''}
                    {announcement?.date}
                  </div>
                  <div>
                    <Paper>
                      {announcement?.events.map((item) => (
                        <Grid
                          container
                          style={{
                            height: '40px',
                            marginBottom: '5px',
                            borderLeft: '5px solid #F96C00',
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
                              {item?.title}
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
                              {extractContent(item?.content)}
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
                                  {/* <MessageIcon />
                                  <WhatsAppIcon />
                                  <MailIcon /> */}
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
          <List dense={true}>
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
          <div style={{ height: '30px' }}></div>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            style={{ marginLeft: '17px', borderRadius: 20 }}
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
            width: '65vw',
          }}
        >
          <DialogContentText style={{ width: '100%' }}>
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
                      width: '100%',
                    }}
                  >
                    {dialogData?.created_user}
                  </Typography>
                </div>
                <div>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData?.created_time).format('MM/DD/YYYY')}
                  </Typography>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {moment(dialogData?.created_time).format('hh:mm:ss a')}
                  </Typography>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {dialogData?.role?.map((item) => {
                    return (
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
                        {resolveRole(item)}
                      </span>
                    );
                  })}
                </div>
              </Grid>
              <Grid item xs={8} sm={8} md={8} style={{ width: '100%' }}>
                <div>{dialogData?.title}</div>
                <div style={{ margin: '10px 0' }}>
                  <Typography
                    style={{
                      color: '#7F92A3',
                      fontSize: '12px',
                    }}
                  >
                    {extractContent(dialogData?.content)}
                  </Typography>
                </div>
                {dialogData.attachments && (
                  <div style={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
                    <img
                      style={{ width: '80%', height: '80%' }}
                      src={`${endpoints.lessonPlan.s3erp}announcement/${dialogData?.attachments[0]}`}
                      alt='image not available'
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
                      onClick={() => updateDelete(dialogData?.id)}
                    >
                      <DeleteIcon style={{ color: '#FF006F' }} />
                    </IconButton>
                    {/* <IconButton
                      title='Edit'
                      // onClick={}
                    >
                      <BorderColorIcon style={{ color: '#536476' }} />
                    </IconButton> */}
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
                      Total {dialogData?.total_members} Receipients
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
            <Button
              autoFocus
              variant='contained'
              color='primary'
              onClick={() => updatePublish(dialogData?.id)}
            >
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
          {/* <ListItem
            onClick={() => {
              setOpenPublish(true);
              setHeaderOpen(true);
            }}
          >
            <ListItemIcon>
              <BorderColorIcon style={{ color: '#EF005A' }} />
            </ListItemIcon>
            <ListItemText primary='Edit' style={{ color: '#EF005A' }} />
          </ListItem> */}
          <ListItem
            onClick={() => {
              setOpenPublish(true);
              setHeaderOpen(true);
            }}
          >
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
        style={{ width: '25vw' }}
      >
        <MenuItem onClick={handleItemClick}>
          <form className={classes.container} noValidate>
            <TextField
              id='date'
              label='Select Date'
              type='date'
              display='none'
              defaultValue={defaultdate}
              value={defaultdate || moment().format('YYYY-MM-DD')}
              onChange={dateUpdatefun}
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </MenuItem>

        <MenuItem>
          <Grid xs={12} md={12} lg={12} item>
            <b>Grade</b>
            <Autocomplete
              multiple
              size='small'
              onChange={handleGrade}
              value={selectedGradeListData}
              id='message_log-smsType'
              className='multiselect_custom_autocomplete'
              options={gradeList || []}
              limitTags='2'
              getOptionLabel={(option) => option.grade__grade_name || {}}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  // label={'Choose Branch'}
                  placeholder={'Choose Grade'}
                />
              )}
            />
          </Grid>
        </MenuItem>
        <MenuItem>
          <Grid xs={12} md={12} lg={12} item>
            <b>Section</b>
            <Autocomplete
              multiple
              size='small'
              onChange={handleSection}
              value={selectedSectionListData}
              id='message_log-smsType'
              className='multiselect_custom_autocomplete'
              options={sectionList || []}
              limitTags='2'
              getOptionLabel={(option) => option.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  className='message_log-textfield'
                  {...params}
                  variant='outlined'
                  placeholder={'Choose Sections'}
                />
              )}
            />
          </Grid>
        </MenuItem>
        <MenuItem>
          <Button variant='contained' color='primary' onClick={() => rowsData(true)}>
            {' '}
            Apply
          </Button>
        </MenuItem>
      </Menu>
    </Layout>
  );
};

export default NewCommunication;
