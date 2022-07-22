import React, { useEffect, useContext , useState} from 'react';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../../config/axios.js';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'date-fns';
import MomentUtils from '@date-io/moment';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Loading from '../../../components/loader/loader';
import { useHistory } from 'react-router';
import './addorcido.scss';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tabRoot: {
    width: '100%',
    flexGrow: 1,
  },
  cardRoot: {
    maxHeight: 224,
    maxWidth: 434,
    border: '1px solid #8C8C8C',
    margin: 10,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    height: 300,
  },
}));

function AddNewOrchadio() {
  const classes = useStyles();
  const [tabValue, settabValue] = React.useState(0);
  const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState(null);
  const [selectedBranch, setSelectedBranch] = React.useState([]);
  const [branchList, setBranchList] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [duration, setDuration] = React.useState();
  const [albumTitle, setAlbumTitle] = React.useState(0);
  const [branchId, setBranchId] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  const [audioLink, setAudioLink] = React.useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [ liveTime , setLiveTime ] = useState('');
  const history = useHistory();
  const moduleId = localStorage.getItem('moduleIdOrchido');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time) => {
    console.log(time.toString().slice(16, 24), "time");
    setSelectedTime(time);
    setLiveTime(time.toString().slice(16, 24))
  };

  const handleOpen = () => {
    if (branchId && albumTitle && files.length) {
      setOpen(true);
    } else {
      setAlert('error', 'Please Fill All the fields');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
  };

  useEffect(() => {
      callApi(
        `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
        'academicYearList'
      );
  }, []);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }

  const getDaysAfter = (date, amount) => {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  const getDaysBefore = (date, amount) => {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  };
  const getFileNameAndSize = (filess) => {
    if (files.length) {
      const fileName =
        files &&
        files.map((file) => (
          <li key={file.name}>
            {file.name}
{' '}
-{file.size}
{' '}
bytes
</li>
        ));
      return fileName;
    }
    return null;
  };
  const audioUpload = (files) => {
    
    const formData = new FormData();
    formData.append('branch_name', branchId);
    formData.append('file', files[0]);
    setLoading(true);
    const src = [];
    axios
      .post(`${endpoints.orchadio.audioUpload}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          src.push(result.data.result);
          setAudioLink(src);
        } else {
          console.log(result.data.message); 
          setLoading(false);
        }
      })
      .catch((error) => {});
  };
  const onDrop = (files = []) => {
    console.log(files);
    if (!files) {
      setAlert('error', 'Please select only audio file format');
      return;
    }
    if (files.length > 1) {
      setAlert('error', 'You can select only a single audio at once');
      return;
    }
    if(files[0].type !== "audio/mpeg"){
      setAlert('error', 'Please upload mp3 file');
    }else{
      setFiles(files);
      audioUpload(files);

    }
    

  };
  const minsHoursSec = (duration) => {
    const mins_num = parseFloat(duration, 10); // don't forget the second param
    let hours = Math.floor(mins_num / 60);
    let minutes = Math.floor(mins_num - (hours * 3600) / 60);
    let seconds = Math.floor(mins_num * 60 - hours * 3600 - minutes * 60);

    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleRedirect = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectionView = +searchParams.get('wb_view');
    if (redirectionView) {
      history.push(`/orchadio/manage-orchadio/?wb_view=${redirectionView}`);
    } else {
      history.push('/orchadio/manage-orchadio');
    }
  };

  const handleSubmit = () => {
    if (branchId && albumTitle && files.length && selectedTime && selectedDate && duration && duration !== '0') {

      const dt = [
        {
          datetime: `${moment(selectedDate).format('DD-MM-YYYY')} ${liveTime}`,
        },
      ];

      setLoading(true);
      axios
        .post(`${endpoints.orchadio.createRadioProgram}`, {
          branch: [selectedBranch.branch.id],
          academic_year: selectedAcademicYear.id,
          files: audioLink,
          album_name: albumTitle,
          duration: minsHoursSec(duration),
          album_title: albumTitle,
          program_schedule: dt,
          users: [1],
        })
        .then((result) => {
          setLoading(false);
          if (result.data.status_code === 200) {
            
            setAlert('success', result.data.message);
            handleRedirect();
          } else {
            console.log(result.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'Something Went Wrong');
        });
      handleClose();
        // }
    } else {
      setAlert('error', 'Duration can not be empty and zero');
    }
  };

  return (
    <div className='addOrchido-container-div' id="addOrchidoContainer" >
      <Layout className='layout-container'>
        <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
          <div
            className='message_log_breadcrumb_wrapper'
            style={{ backgroundColor: '#F9F9F9' }}
          >
            {loading ? <Loading message='Loading...' /> : null}
            <CommonBreadcrumbs componentName='Orchadio' />
            <div className='create_group_filter_container'>
              <Grid container className="addOrchidofilterContainer" >
                    <Grid item md={3} xs={12} className="academicList" >
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedAcadmeicYear(value);
                console.log(value, 'test');
                if (value) {
                  callApi(
                    `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                    'branchList'
                  );
                }
                
                setSelectedBranch([]);
              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedAcademicYear || ''}
              options={academicYear || ''}
              getOptionLabel={(option) => option?.session_year || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedBranch([]);
                if (value) {
                  const selectedId = value.branch.id;
                  setSelectedBranch(value);
                  console.log(value);
                }
              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch || ''}
              options={branchList || ''}
              getOptionLabel={(option) => option?.branch?.branch_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
              </Grid>
            </div>
            <div className='create_group_filter_container'>
              <Grid container spacing={3}>
                <Grid item xs={11} md={4}>
                  <Typography style={{ padding: '10px', marginLeft: 10 }}>
                    <b>Album Name</b>
                  </Typography>

                  <TextField
                    fullWidth
                    style={{ marginLeft: 20 }}
                    id='outlined-basic'
                    inputProps={{ maxLength: 100 }}
                    onChange={(event) => setAlbumTitle(event.target.value)}
                    helperText={`${
                      albumTitle.length === undefined ? 0 : albumTitle.length
                    }/100`}
                    placeholder='Title should not be more than 100 character'
                    variant='outlined'
                    multiline
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.root}>
              <Grid container spacing={3}>
                <Grid item xs={10} md={3}>
                  <Typography style={{ paddingBottom: '35%', marginLeft: 10 }}>
                    <b>Upload File</b>
                    <span
                      style={{ marginLeft: '10px', fontSize: '12px', color: '#ff6b6b' }}
                    >
                      Maximum upload size : 100mb
                    </span>
                  </Typography>
                </Grid>
                {!isMobile ? (
                  <Grid item xs={8} md={3}>
                    <Dropzone onDrop={onDrop}>
                      {({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        isDragAccept,
                        isDragReject,
                      }) => (
                        <Card
                          elevation={0}
                          style={{
                            width: '100%',
                            height: '150px',
                            border: '1px solid #ff6b6b',
                            //   marginLeft: '-35%',
                          }}
                          {...getRootProps()}
                          className='dropzone'
                        >
                          <CardContent>
                            <input {...getInputProps()} />
                            <div>
                           
                              {isDragAccept && 'All files will be accepted'}
                              {isDragReject && 'Some files will be rejected'}
                              {!isDragActive && (
                                <>
                                  <CloudUploadIcon
                                    color='primary'
                                    style={{ marginLeft: '45%', marginTop: '15%' }}
                                  />
                                </>
                              )}
                            </div>
                            {getFileNameAndSize(files)}
                          </CardContent>
                        </Card>
                      )}
                    </Dropzone>
                  </Grid>
                ) : (
                  ''
                )}
                
                <Grid item xs={8} md={3}>
                  {isMobile ? (
                    <>
                      <input
                        accept='audio/mpeg3'
                        className={classes.input}
                        id='contained-button-file'
                        multiple
                        onChange={(e) => onDrop([e.target.files[0]])}
                        style={{ display: 'none' }}
                        type='file'
                      />
                      <label htmlFor='contained-button-file'>
                        <Button
                          style={{
                            fontSize: 'small',
                            width: 150,
                            position: 'absolute',
                            // margin: 10,
                            // marginTop: '115px',
                          }}
                          variant='contained'
                          color='primary'
                          component='span'
                        >
                          Attach
                        </Button>
                      </label>
                    </>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item xs={8} md={3}>
                  <Button
                    style={{
                      fontSize: 'small',
                      width: 150,
                      position: 'absolute',
                      marginTop: '30px',
                    }}
                    onClick={handleOpen}
                    color='primary'
                    size='small'
                    variant='contained'
                  >
                    Schedule
                  </Button>
                </Grid>

                <Modal
                  aria-labelledby='transition-modal-title'
                  aria-describedby='transition-modal-description'
                  className={classes.modal}
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={open}>
                    <div
                      className={classes.modalPaper}
                      style={isMobile ? { height: 400 } : { height: 300 }}
                    >
                      <h2 id='transition-modal-title'>Schedule</h2>
                      <TextField
                        fullWidth
                        id='outlined-number'
                        label='Duration in mins'
                        Required
                        type='number'
                        value={duration}
                        inputProps={{
                          pattern: '[0-9]*',
                        }}
                        onChange={(event) =>
                          setDuration(event.target.value >= 0 ? event.target.value : 0)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant='outlined'
                      />
                      <div style={{ marginTop: 20 }}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <Grid container justify='space-around'>
                            <KeyboardDatePicker
                              disableToolbar
                              variant='inline'
                              format='DD/MM/yyyy'
                              views={['year', 'month', 'date']}
                              margin='normal'
                              id='date-picker-inline'
                              label='Date picker inline'
                              value={selectedDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
                            <KeyboardTimePicker
                              margin='normal'
                              id='time-picker'
                              label='Time picker'
                              value={selectedTime}
                              onChange={handleTimeChange}
                              KeyboardButtonProps={{
                                'aria-label': 'change time',
                              }}
                            />
                          </Grid>
                        </MuiPickersUtilsProvider>
                        <Button
                          style={{
                            fontSize: 'small',
                            width: 150,
                            position: 'absolute',
                          }}
                          onClick={handleSubmit}
                          color='primary'
                          size='small'
                          variant='contained'
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Fade>
                </Modal>
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
export default AddNewOrchadio;
