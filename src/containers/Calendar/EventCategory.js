import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import DialogContentText from '@material-ui/core/DialogContentText';
import Layout from '../Layout';
import Loader from '../../components/loader/loader';
import FormControl from '@material-ui/core/FormControl';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Pagination } from '@material-ui/lab';
import ColorPicker from 'material-ui-color-picker';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import moment from 'moment';
// import './calendar.scss';
import { InputAdornment } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { ClickAwayListener } from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axiosInstance from '../../config/axios';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import endpoints from '../../config/endpoints';
import { shadows } from '@material-ui/system';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import SearchBar from 'material-ui-search-bar';
import {
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Tooltip,
  Typography,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { result } from 'lodash';
import e from 'cors';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 20,
  },
  cardsPagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
    color: '#ffffff',
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  paperSize: {
    width: ' 399px',
    height: '109px',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  inputLabel: {
    marginLeft: 20,
    width: '70%',
  },

  margin: {
    margin: 40,
  },
  formControl: {
    marginTop: 24,
    width: '100%',
  },
  cardstyle: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    boxShadow: '0px 0px 4px #00000029',
    border: '1px solid #E2E2E2',
    opacity: 1,
    margin: '20px',
    width: '330px',
    height: '110px',
    [theme.breakpoints.down('xs')]: {
      width: '290px',
    },
  },
  dailog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogPaper: {
    minHeight: '45vh',
    maxHeight: '45vh',
  },
  dgsize: {
    width: '100%',
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Cal1 = () => {
  const classes = useStyles();

  const { setAlert } = useContext(AlertNotificationContext);
  const [Diaopen, setdiaOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [eventType, setEventType] = useState([]);
  const [eventName, setEventName] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [chaTitle, setChaTitle] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const limit = 9;
  const [dummyData, setDummyData] = useState([]);
  const { id } = useParams();
  const history = useHistory();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [searchData, setSearchData] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [element_id, setElementId] = useState('');
  const [filterData, setFilterData] = useState({
    selectedEventType: '',
  });

  console.log(searchData, 'searchinggggggg');
  // useEffect(() => {
  //   if (moduleId) {
  //     axiosInstance
  //       .get(`${endpoints.eventBat.getListCategories}?module_id=${moduleId}`)
  //       .then((result) => {
  //         console.log('useEffect Data', result.data);
  //         setEventType(result.data.data);
  //       });
  //   }
  // }, [moduleId, updateFlag]);


  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(
          `${endpoints.eventBat.getPaginatedCategories}?page_num=${pageNumber}&page_size=${limit}&module_id=${moduleId}`
        )
        .then((result) => {
          setDummyData(result?.data?.data?.results);

          setTotalGenre(result?.data?.data?.count);
        });
    }
    setEditFlag(false)
  }, [moduleId, updateFlag, pageNumber, deleteFlag]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Event Category') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);
  console.log(moduleId, 'MODULE_ID');

  const handleClickOpen = () => {
    setOpen(true);
    setCustColor("black")
    setChaTitle(true);
  };
  const handleClickOpens = () => {
    setOpen(true);
  };
  const DiaClickOpen = () => {
    setdiaOpen(true);
  };

  const DiaClose = () => {
    setdiaOpen(false);
  };

  const handleClear = () => {
    setFilterData({ selectedEventType: '' });
    setEventName('');
    setCustColor('');
    setSearchData('')
    // setDummyData([]);
    setTotalGenre('');
  };
  const handleEventName = (e, idx) => {
    // console.log("checknow",e,idx)
    console.log('checknow', e.target.value);

    setEventName(e.target.value);
  };
  function handleEventType(event, value) {
    setFilterData({ ...filterData, selectedEventType: '' });
    if (value) {
      setFilterData({ ...filterData, selectedEventType: value });
    }
  }
  const handlePagination = (event, page) => {
    setPageNumber(page);
    // setGenreActiveListResponse([]);
    // setGenreInActiveListResponse([]);
    // getData();
    setDummyData([]);
  };



  const handleSave = () => {
    setLoading(true);
    // setEditFlag(false)
    if (eventName) {
      axiosInstance
        .post(`${endpoints.eventBat.postCreateEvent}?module_id=${moduleId}`, {
          event_category_name: eventName,
          event_category_color: custColor,
        })

        .then((result) => {
          console.log(result, "yuj")
          setLoading(false);
          setEventName('');
          let fullData = eventType;
          console.log('This is full data', fullData);
          fullData.push({
            event_category_name: eventName,
            event_category_color: custColor,
          });
          axiosInstance
            .get(
              `${endpoints.eventBat.getPaginatedCategories}?page_num=${pageNumber}&page_size=${limit}&module_id=${moduleId}`
            )
            .then((result) => {
              setDummyData(result?.data?.data?.results);

              setTotalGenre(result?.data?.data?.count);
            });
          // setDummyData([...dummyData,result.data.data])
          // setEventType(fullData);
          setOpen(false);
          setAlert('success', 'Event Saved Successfully');
          console.log(result.data.data.results);
        })
        .catch((err) => {
          setLoading(false);
          setAlert('error', err);
          console.log(err);
        });
    } else {
      setAlert('warning', 'Please Select Event Name First!');
    }
  };

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }


  const [custColor, setCustColor] = useState('black');

  const handleColor = (e) => {
    console.log('color:', e.target.value);
    setCustColor(e.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  // useEffect(() => {
  //   if(searchData && pageNumber){
  //   handleSearch(searchData);
  //    }
  //   //setIsEditId('');
  //   //setEventName('');
  // }, [deleteFlag, editFlag, pageNumber]);

  const handleClicknew = (event, id) => {
    setAnchorEl(event.currentTarget);
    setElementId(id);
    setEventName('')
    console.log(id, 'checking id');
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setIsEditId('');
    setEditFlag(false);
    setEventName('');
  };


  const handleClears = () => {
    if (moduleId) {
      axiosInstance
        .get(
          `${endpoints.eventBat.getPaginatedCategories}?page_num=${pageNumber}&page_size=${limit}&module_id=${moduleId}`
        )
        .then((result) => {
          setDummyData(result?.data?.data?.results);

          setTotalGenre(result?.data?.data?.count);
        });
    }
    setEditFlag(false)
  };



  const handleDelete = (e, idx) => {
    axiosInstance
      .delete(`${endpoints.eventBat.deleteEventCategory}${element_id}?module_id=${moduleId}`)
      .then((result) => {
        console.log('deleted Data', result.data.data);
        setDeleteFlag(!deleteFlag);
        setAnchorEl(null);
        setdiaOpen(false);
        setAlert('success', 'Event Delete Successfully');
        // history.push({
        //   pathname: '/event-category',
        // });
      })
      .catch((error) => setAlert('warning', 'Something went wrong'));
  };
  const handleSearch = (e, value) => {
    console.log(typeof (e), pageNumber, "checking search")
    if (e.length === 0) {
      axiosInstance
        .get(
          `${endpoints.eventBat.getPaginatedCategories}?page_num=${pageNumber}&page_size=${limit}&module_id=${moduleId}`
        )
        .then((result) => {
          setDummyData(result?.data?.data?.results);

          setTotalGenre(result?.data?.data?.count);
        });
    }
    if (e.length > 0) {
      axiosInstance
        .get(
          `${endpoints.eventBat.filterEventCategory}?event_category_name=${e}&page_num=${1}&page_size=${limit}&module_id=${moduleId}`
        )
        .then((result) => {
          setDummyData(result?.data?.data?.results);

          setTotalGenre(result?.data?.data?.count);
        })

        // setDummyData([])
        .catch((err) => {
          setDummyData([])
          setAlert('warning', "something went Wrong");
        });
    }
    setSearchData(e);
    console.log(e.length, 'chhhhh');
  };
  console.log(searchData, 'fffff');
  const handleEdit = () => {
    console.log(element_id, 'item id');
    const temp = dummyData.find((item) => item.id == element_id);
    console.log(temp);
    setChaTitle(false);
    handleClickOpens();
    setEditFlag(true);
    setAnchorEl(null);
    setIsEditId(temp.id);
    setEventName(temp.event_category_name);
    setCustColor(temp.event_category_color)
    // setCustColor(temp.event_category_color);
    // console.log(temp.event_category_color);
  };
  function handleUpdate() {
    //api call for update
    const params = {
      event_category_name: eventName,
      event_category_color: custColor,
    };
    axiosInstance
      .put(`${endpoints.eventBat.patchUpdateEvent}${isEditId}`, params)
      .then((result) => {
        console.log(result, "kopila")
        if (result.status === 200) {
          console.log(result.data, 'Update Data');
          setIsEditId('');
          setEventName('');
          for (let i = 0; i < dummyData.length; i++) {
            if (dummyData[i].id === isEditId) {
              dummyData[i].event_category_color = result.data.event_category_color
              dummyData[i].event_category_name = result.data.event_category_name
            }
          }
          console.log(dummyData, "chkkl")
          setDummyData([...dummyData])
          setEditFlag(!editFlag);
          handleSearch(searchData)
        }
        setAlert('success', 'Event Updated Successfully');
      })
      .catch((error) => console.log(error));
    setOpen(false);
    setUpdateFlag(!updateFlag);
  }

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper'>
        <CommonBreadcrumbs componentName='Create Event Category' />
      </div>
      <form>
        <div className={classes.root}>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12} sm={5} md={3} className='arrow'>
              {/* <Autocomplete
                size='small'
                id='role'
                fullWidth
                style={{ marginTop: 25 }}
                value={filterData?.selectedEventType || ''}
                onChange={handleEventType}
                options={eventType}
                getOptionLabel={(option) => option?.event_category_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Event Category Type'
                    placeholder='Event Category Type'
                    required
                  />
                )}
              /> */}
              <SearchBar
              style = {{borderRadius : "10px"}}
                // value={filterData?.selectedEventType || ''}
                onCancelSearch={(e) => { handleClears(e) }}
                value={searchData}
                onChange={(e) => handleSearch(e)}
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Divider /> */}
            </Grid>
          </Grid>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button
                variant='contained'
                color='primary'
                style={{color:'white', width: '100%' }}
                // className={classes.buttonCol}
                onClick={handleClickOpen}
              >
                ADD EVENT
              </Button>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            classes={{ paper: classes.dialogPaper }}
          >
            <DialogTitle id='customized-dialog-title'>
              {chaTitle ? 'Create Event Category' : 'Update Event Category'}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                color="secondary"
                fullWidth
                size='small'
                id='role'
                variant='outlined'
                label='Event Type Name'
                inputProps={{
                  maxlength: '20'
                }}
                value={eventName || ''}
                onChange={handleEventName}
                placeholder='Event Type Name'
                required
              />
              <TextField
                type='color'
                value={custColor || ''}
                defaultValue="#000000"
                backgroundColor='custColor'
                label='Assign color'
                variant='outlined'
                fullWidth
                size='small'
                InputLabelProps={{ shrink: true, required: true }}
                style={{ marginTop: 30 }}
                onChange={(e) => handleColor(e)}
              />
              {/* </Grid> */}
            </DialogContent>
            <DialogActions>
              <Button autoFocus variant="contained" onClick={handleClose} className = "labelColor cancelButton">
                Close
              </Button>
              <Button
               variant="contained"
                autoFocus
                onClick={editFlag ? handleUpdate : handleSave}
                // onClick={handleSave}
                color='primary'
                style={{color : "white"}}
              >
                {editFlag ? 'UPDATE' : 'Save'}
              </Button>
            </DialogActions>
            {/* </Grid> */}
          </Dialog>

          <Grid
            container
            justify='flex-start'
            alignItems='flex-start'
            spacing={2}
            direction='row'
          >
            {console.log(dummyData, "dummmm")}
            {dummyData.map((item) => {

              return (
                <div key={item.event_category_name}>
                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <Card className={classes.cardstyle}>
                        <CardContent>
                          <Grid container spacing={2} direction='row'>
                            <Grid
                              item
                              style={{
                                backgroundColor: item.event_category_color,
                                marginTop: '13px',
                                fontFamily: 'Arial',
                                borderRadius: '10px',
                                width: 100,
                                height: 70,
                              }}
                              xs={4}
                            ></Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant='subtitle1'
                                color = "secondary"
                                style={{
                                  marginTop: 8,
                                  textAlign: 'center',
                                  fontSize: '20px',
                                  fontweight: 'Bold',
                                }}
                              >
                                {item.event_category_name}
                              </Typography>
                            </Grid>

                            <Grid item xs={1}>
                              <IconButton
                                aria-controls='simple-menu'
                                aria-haspopup='true'
                                onClick={(event) => handleClicknew(event, item.id)}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                              >
                                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                {/* <MenuItem onClick={handleDelete}>Delete</MenuItem> */}
                                <MenuItem color="primary" onClick={DiaClickOpen}>Delete</MenuItem>
                                <Dialog
                                  open={Diaopen}
                                  onClose={DiaClose}
                                  style={{ backgroundColor: 'transparent', opacity: '0.4' }}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">{"Conformation For Delete"}</DialogTitle>
                                  <DialogContent >
                                    <DialogContentText id="alert-dialog-description">
                                      Are You Sure to Delete the EventCategory.
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleDelete} color="primary">
                                      yes
                                    </Button>
                                    <Button onClick={DiaClose} color="primary" autoFocus>
                                      No
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Menu>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </div>
              );
            })}
          </Grid>

          <Grid container justify='center'>
            {dummyData && totalGenre > 9 && (
              <Pagination
                onChange={handlePagination}
                // style={{ paddingLeft: '150px' }}
                count={Math.ceil(totalGenre / limit)}
                color='primary'
                page={pageNumber}
                color='primary'
              />
            )}
          </Grid>
        </div>
      </form>
      {!dummyData
        ? !totalGenre && (
          <div style={{ width: '10%', marginLeft: '40%' }}>
            <SvgIcon component={() => <img src={unfiltered} />} />
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '20px', width: '250px' }
                      : { height: '50px', width: '400px' }
                  }
                  src={selectfilter}
                />
              )}
            />
          </div>
        )
        : []}
      {loading && <Loader />}
    </Layout>
  );
};

export default Cal1;
