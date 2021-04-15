import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Layout from '../Layout';
// import Button from '@material-ui/core/Button';
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
// import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axiosInstance from '../../config/axios';
// import './createcategory.css';
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

import {
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { result } from 'lodash';
import e from 'cors';
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
    //border: '1px solid',
    //borderColor: theme.palette.primary.main,
    // padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0px 0px 4px #00000029',
    border: '1px solid #E2E2E2',
    opacity: 1,
    margin: '20px',
    width: '400px',
    [theme.breakpoints.down("xs")]: {
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

  const { setAlert } = useContext(AlertNotificationContext)

  const [open, setOpen] = React.useState(false);
  const [eventType, setEventType] = useState([]);
  const [eventName, setEventName] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [chaTitle, setChaTitle] = useState(false)
  const [deleteFlag, setDeleteFlag] = useState(false)
  const [editFlag, setEditFlag] = useState(false)
  const limit = 9;
  const [dummyData, setDummyData] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  const [filterData, setFilterData] = useState({
    selectedEventType: '',
    // selectedEventName: '',
  });

  useEffect(() => {
    axiosInstance.get(`${endpoints.eventBat.getListCategories}`)
      .then((result) => {
        console.log('useEffect Data', result.data);
        setEventType(result.data.data)
        // setDummyData(result?.data.data.results);
        // setCategoryType([{val:1,category_name:'cat'},{val:2,category_name:'dog'}])
      });
  }, []);

  // useEffect(() => {
  //   axiosInstance.get(`${endpoints.eventCategory.eventCreate}?page_num=${pageNumber}&page_size=${limit}`).then((result) => {
  //     console.log('useEffect Data', result.data);
  //     setTotalGenre(result.data.data.count);
  //     setEventType(result?.data.data.results);
  //     // setCategoryType([{val:1,category_name:'cat'},{val:2,category_name:'dog'}])
  //   });
  // }, [pageNumber]);
  const handleClickOpen = () => {
    setOpen(true);
    setChaTitle(true);
  };
  const handleClickOpens = () => { setOpen(true); }

  const handleClear = () => {
    setFilterData({ selectedEventType: '' });
    setEventName('');
    setCustColor('red');
    setDummyData([]);
  };
  const handleEventName = (e, idx) => {
    // console.log("checknow",e,idx)
    console.log('checknow', e.target.value);

    setEventName(e.target.value);
  };
  function handleEventType(event, value) {
    console.log(value, '======================================');

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


  const handleFilter = (type) => {
    axiosInstance
      .get(`${endpoints.eventBat.filterEventCategory}?event_category_name=${type}&page_num=${pageNumber}&page_size=${limit}`) //queryparams pass need to done
      .then((result) => {
        setTotalGenre(result.data.data.count);
        setDummyData(result?.data.data.results);
      })
      .catch((error) => console.log(error));
  };

  const handleSave = () => {
    axiosInstance
      .post(`${endpoints.eventBat.postCreateEvent}`, {
        // event_category_type: eventName,
        event_category_name: eventName,
        event_category_color: custColor,
      })
      .then((result) => result.data.data.results);
    setEventName('')
    let fullData = eventType
    console.log('This is full data', fullData)
    fullData.push({
      event_category_name: eventName,
      event_category_color: custColor,
    })
    setEventType(fullData)
    setOpen(false);
    setAlert('success', 'Event Saved Successfully')
  };


  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const [custColor, setCustColor] = useState('red');

  const handleColor = (e) => {
    console.log('color:', e.target.value);
    setCustColor(e.target.value);
  };
  // const mystyle = {
  //   color: color,
  //   backgroundColor: custColor,
  //   padding: "5px",
  //   marginTop: '15px',
  //   fontFamily: 'Arial',
  //   borderRadius: '10px',
  //   width: 70,
  //   height: 70,
  // };

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    handleFilter(filterData.selectedEventType.event_category_name);
    //setIsEditId('');
    //setEventName('');
  }, [deleteFlag, editFlag, pageNumber])

  const handleClicknew = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // const handleClickAway = () => {
  //   setAnchorEl(false);
  //  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setIsEditId('');
    setEventName('');
    // localStorage.removeItem('Edit')
  };

  const handleDelete = (e, idx) => {
    axiosInstance.delete(`${endpoints.eventBat.deleteEventCategory}${e.id}`).then((result) => {
      console.log('deleted Data', result.data.data);
      setDeleteFlag(!deleteFlag);
      setAnchorEl(null);
      setAlert('success', 'Event Delete Successfully')
    }).catch((error) => console.log(error));
    setAlert('warning', 'Something went wrong')
  };

  const handleEdit = (data) => {
    //history.push(`/calendar1/${e.id}`);
    console.log(data);
    setChaTitle(false)
    handleClickOpens();
    setEditFlag(!editFlag)
    setAnchorEl(null);
    setIsEditId(data.id);
    setEventName(data.event_category_name);
  };

  // useEffect(() => {
  //   console.log(id, '|||||||||||||||||||||||');
  //   if (id) {
  //     axiosInstance.get(`${endpoints.eventCategory.eventRud}${id}`).then((result) => {
  //       console.log(result.data, 'data saved');
  //       setEventName(result.data?.data?.event_category_name);
  //       setCustColor(result.data?.data?.event_category_color);
  //       setIsEditId('');
  //       setEventName('')
  //     })
  //     .catch((error) => console.log(error));
  //   }
  // }, [id]);

  function handleUpdate() {
    //api call for update
    const params = {
      event_category_name: eventName,
      event_category_color: custColor,
    }
    axiosInstance
      .put(`${endpoints.eventBat.patchUpdateEvent}${isEditId}`, params)
      .then((result) => {
        console.log(result.data, 'Update Data');
        setIsEditId('');
        setEventName('');
        setEditFlag(!editFlag)
        setAlert('success', 'Event Updated Successfully')
      })
      .catch((error) => console.log(error))
    //history.push('/calendar1')
    setOpen(false);
    // setAlert('warning','Something went wrong')
  }

  //const handleClose1 = () => {};

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper' style={{ marginLeft: '-10px' }}>
        <CommonBreadcrumbs componentName='Create Event Category' />
      </div>
      {/* <Box m={{ xs: '1rem', sm: '2rem' }} className={classes.root} style={{marginRight:"10"}}>
        <CommonBreadcrumbs componentName='Create Event Category  ' />
        </Box> */}
      <form>


        {/* <Grid container direction='row'>
          <Grid item md={2} xs={12} sm={3} lg={2}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='medium' color='primary' />}
              aria-label='breadcrumb'
            >
              <Link color='textPrimary' onClick={handleClick}>
                Dashboard
              </Link>
              <Link color='textPrimary' onClick={handleClick}>
                Create event category
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid> */}
        <div className={classes.root}>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12} sm={5} md={3} className='arrow'>
              <Autocomplete
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
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={12} sm={4} md={2} lg={1} >
              <Button
                variant='contained'
                className='custom_button_master '
                size='medium'
                onClick={handleClear}
              >
                Clear
                </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={1}>
              <Button
                variant='contained'
                className='custom_button_master '
                // size='medium'
                color='primary'
                onClick={(e) =>
                  handleFilter(filterData.selectedEventType.event_category_name)
                }
              >
                Filter
                </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={1}>
              <Button
                variant='contained'
                color='primary'
                className='custom_button_master '
                onClick={handleClickOpen}
              >
                Create
                </Button>
            </Grid>
          </Grid>
          <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            classes={{ paper: classes.dialogPaper }}
          >
            <DialogTitle id='customized-dialog-title'>
              {chaTitle ? "Create Event Category" : "Update Event Category"}
            </DialogTitle>
            {/* <Grid container spacing={2} className={classes.dailog}> */}
            {/* <Grid item xs={12} sm={5} md={3} lg={3}> */}
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                //className='arrow'
                size='small'
                id='role'
                variant='outlined'
                label='Event Type Name'
                value={eventName || ''}
                onChange={handleEventName}
                placeholder='Event Type Name'
                required
              />
              {/* </Grid> */}
              {/* <Grid item xs={12} sm={5} md={3} lg={2}> */}

              {/* <ColorPicker */}
              <TextField
                type='color'
                // name='color'
                // defaultValue='color'
                value={custColor || ''}
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
              <Button autoFocus onClick={handleClose} color='primary'>
                Close
                    </Button>
              <Button
                autoFocus
                onClick={editFlag ? handleUpdate : handleSave}
                // onClick={handleSave}
                color='primary'
              >
                {editFlag ? 'UPDATE' : 'Save'}
              </Button>
            </DialogActions>
            {/* </Grid> */}
          </Dialog>


          <Grid container justify='flex-start' alignItems="flex-start" spacing={2} direction='row'>
            {dummyData.map((data) => {
              return (
                <div>
                  <Grid container>
                    <Grid item xs={12} sm={12} lg={12}>
                      <Card className={classes.cardstyle}>
                        <CardContent>
                          <Grid container spacing={2} direction="row" >
                            <Grid
                              item
                              style={{
                                backgroundColor: data.event_category_color,
                                marginTop: '13px',
                                fontFamily: 'Arial',
                                borderRadius: '10px',
                                width: 100,
                                height: 70,
                              }}
                              xs={4}>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant='subtitle1'
                                style={{
                                  marginTop: 8,
                                  // backgroundColor:'yellow',
                                  // marginLeft: 8,
                                  // marginRight: 70,
                                  color: '#01014a',
                                  textAlign: 'center',
                                  fontSize: '22px',
                                  fontweight: 'Bold',
                                }}
                              >

                                {data.event_category_name}
                              </Typography>
                            </Grid>

                            <Grid item xs={1}>
                              <IconButton
                                aria-controls='simple-menu'
                                aria-haspopup='true'
                                onClick={handleClicknew}
                              >
                                <MoreHorizIcon style={{ color: '#F7324D' }} />
                              </IconButton>
                              <Menu
                                // boxShadow={0}
                                // id='simple-menu'
                                anchorEl={anchorEl}
                                keepMounted
                                // className='new'
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                              >
                                <MenuItem onClick={(e) => handleEdit(data)}>Edit</MenuItem>
                                <MenuItem onClick={(e) => handleDelete(data)}>
                                  Delete
                                </MenuItem>

                              </Menu>




                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </div>)
            })}
          </Grid>

          {/* <Grid container justify='center'>
            <Grid item md={8}>
              <Divider />
            </Grid>
            <br />
          </Grid> */}
          <Grid container justify='center'>
            {totalGenre && totalGenre > 9 && (
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
    </Layout>
  );
};

export default Cal1;