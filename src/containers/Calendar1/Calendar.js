import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Layout from '../Layout';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Pagination from '@material-ui/lab/Pagination'
import ColorPicker from 'material-ui-color-picker';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import moment from 'moment';
import './calendar.scss';
import { InputAdornment } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { ClickAwayListener } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';



import {
    Paper,
    Card,
    CardContent,
    CardHeader,
    CardMedia, 
    IconButton,
    Tooltip,
    Typography,
  } from '@material-ui/core';
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
      // display: 'flex',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      // padding: '1rem',
      borderRadius: '10px',
  
      margin: '20px',
    },
    
  }));

 
const Cal1 = () =>{
    const classes = useStyles();
    const [datePopperOpen, setDatePopperOpen] = useState(false);
    // const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    // const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));
    const [dateRange, setDateRange] = useState([
      moment().startOf('isoWeek'),
      moment().endOf('week'),
    ]);
    function handleClick(event) {
      event.preventDefault();
      console.info('You clicked a breadcrumb.');
    }
    
   
  

    const dummyData=[
        {
          exam:"AnnualExams",
          test:"Maths Test",
          date:"2nd April 2021-3rd April 2022 ",

        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          date:"3rd April 2021-4th April 2022",

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          date:"5th April 2021-6th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"English Test",
          date:"7th April 2021-8th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"GK Test",
          date:"9th April 2021-10th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"Maths Test",
          date:"2nd April 2021-3rd April 2022",

        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          date:"3rd April 2021-4th April 2022",

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          date:"5th April 2021-6th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"English Test",
          date:"7th April 2021-8th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"GK Test",
          date:"9th April 2021-10th April 2022",

        },
        {
          exam:"AnnualExams",
          test:"Maths Test",
          date:"2nd April 2021-3rd April 2022",

        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          date:"3rd April 2021-4th April 2022",

        },
       
    ]
    const [custColor, setCustColor]= useState('red');

    const handleColor = (value)=>{
      console.log("color:",value);
      setCustColor(value);
  
    };
    const mystyle = {
      // color: color,
      backgroundColor: custColor,
      // padding: "5px",
      marginTop: "15px",
      fontFamily: "Arial",
      borderRadius: "10px",
      width:70,
      height:70
    };

    // const classes = useStyles();
    // const theme = useTheme();
    // const handleDelete = (value) => {
    //   // setLoading(true);
    //   axiosInstance
    //     .delete(`${endpoints.ebook.ebook}?ebook_id=${value}`)
    //     .then((result) => {
    //       if (result.data.status_code === 200) {
    //         setAlert('success', result.data);
    //       } else {
    //         setAlert('error', result.data);
    //       }
    //     })
    //     .catch((error) => {
    //       setAlert('error', error.message);
    //     });
    // };
    
  //   useEffect(() => {
  //     axiosInstance.get(endpoints.event.event).then((res) => {
  //       if (res.data.status_code === 200){
  //         console.log("review-response:",res)
  //         console.log('review-data:', res.data.result.data);
  //         setTotalCountreview(res.data.result.total_pages);
  //         setReviewdata(res.data.result.data);
  
  //       }else {
  //         setAlert('error', res.data.error_message);
  //       }
  //     })
  //     .catch((error) => {
  //       setAlert('error', error.message);
  //     });
      
  
  // },[queryID,delFlag, goBackFlag, pagereview, searchGrade]);
  



return(
    <Layout>
    <form>
    <Grid container direction='row'>
            <Grid item md={2} xs={12} md={3}lg={3}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="medium" color='primary' />} aria-label="breadcrumb">
                <Link color="textPrimary" onClick={handleClick}>
                  Dashboard
                </Link>
                <Link color="textPrimary" onClick={handleClick}>
                  Create event category
                </Link>
                
          </Breadcrumbs>
            </Grid>
       </Grid>
      <div className={classes.root}>
        <Grid container spacing={2} direction='row'>
          <Grid item xs={12} sm={5} md={3} lg={3}>
              <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{marginTop:25}}
                // getOptionLabel={(option) => option?.role_name}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Category type'
                    placeholder='role'
                    required
                  />
                )}
              />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={3}>
          <Autocomplete
                size='small'
                id='role'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Category Name'
                    placeholder='role'
                    required
                  />
                )}
              />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={3}>
            <div className='date-container' >
                  <ClickAwayListener onClickAway={(e) => {setDatePopperOpen(false)}}>
                    <LocalizationProvider
                      dateAdapter={MomentUtils}
                      style={{ backgroundColor: '#F9F9F9' }}
                    >
                      <DateRangePicker
                        id='date-range-picker-date'
                        disableCloseOnSelect={false}
                        startText='Date'
                        PopperProps={{ open: datePopperOpen }}
                        // endText='End-date'
                        value={dateRange}
                        // calendars='1'
                        onChange={(newValue) => {
                          console.log('onChange truggered', newValue);
                          const [startDate, endDate] = newValue;
                          const sevenDaysAfter = moment(startDate).add(6, 'days');
                          setDateRange([startDate, sevenDaysAfter]);
                          setDatePopperOpen(false);
                        }}
                        renderInput={(
                          // {
                          //   inputProps: { value: startValue, ...restStartInputProps },
                          //   ...startProps
                          // },
                          // {
                          //   inputProps: { value: endValue, ...restEndInputProps },
                          //   ...endProps
                          // }
                          { inputProps, ...startProps },
                          // startProps,
                          endProps
                        ) => {
                          //console.log('startProps ', startProps, 'endProps', endProps);
                          return (
                            <>
                              <TextField
                              fullWidth
                                 style={{ width: '100%' }}
                                 style={{ marginTop: 25 }}
                                // style={{ marginTop: 35 }}
                                {...startProps}
                                InputProps={{
                                  ...inputProps,
                                  value: `${moment(inputProps.value).format(
                                    'DD-MM-YYYY'
                                  )} - ${moment(endProps.inputProps.value).format(
                                    'DD-MM-YYYY'
                                  )}`,
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position='start'>
                                      <DateRangeIcon
                                        // style={{ width: '35px' }}
                                        color='primary'
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                size='small'
                                // style={{ minWidth: '250px' }}
                                onClick={() => {
                                  console.log('triggered');
                                  setDatePopperOpen(true);
                                }}
                              />
                              {/* <TextField {...startProps} size='small' /> */}
                              {/* <DateRangeDelimiter> to </DateRangeDelimiter> */}
                              {/* <TextField {...endProps} size='small' /> */}
                            </>
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </ClickAwayListener>
                </div>
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
            {/* <TextField 
              name='Assign color'
              label='Assign color'
              type='color'
              InputLabelProps={{ shrink: true, required: true }}
              variant='outlined'
              fullWidth
              size='small'
            
              style={{ marginTop: 25 }}
            /> */}
            <ColorPicker
            name='color'
            // backgroundColor='red'
            defaultValue='color'
            value={custColor}
            label='Assign color'
            variant='outlined'
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true, required: true }}
            style={{ marginTop: 25 }}
            // value={this.state.color} - for controlled component
            // onChange={color => console.log(color)}
            // onClick={() => 
            //   handlequeryID(name.subject.id)
            onChange={(e)=>
            handleColor(e)
            }
            
          
          />
          </Grid>


         
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid container spacing={2} style={{  margin: '10px' }} >
        <Grid
          item
          xs={12}
          sm={3}
          md={3}
         lg={1}
        >
          <Button
            variant='contained'
            className='custom_button_master labelColor'
            size='medium'
          
            // onClick={handleGoBack}
          >
            DELETE
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={2}
         
        >
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master'
            size='medium'
            type='submit'
          >
            Save Category
          </Button>
            </Grid>
         </Grid>
        </Grid>
        
        <Grid container spacing={2} direction='row'>
       
        { dummyData.map((data) => {
        return(
          <div>
          <Grid item xs={12} sm={12} >
            <Paper className={classes.cardstyle}>
              
                <CardContent className={classes.content}>
                  <Grid container direction="row" spacing={1} justify="flex-start" align="flex-start"> 
                    <Grid item style={mystyle} xs={2}>
                    </Grid>                  
                    <Grid item xs={8}justify="flex-start" align="flex-start">
                      <Typography variant='subtitle1' style={{marginTop:8,marginLeft:8,marginRight:70,color:'#036799',textAlign:'start'}}>{data.exam}</Typography>
                      <Typography variant='subtitle2' style={{marginLeft:8,marginRight:70,color:'#036799',textAlign:'start'}}>{data.test}</Typography>
                      <Typography variant='subtitle2'style={{marginLeft:8,color:'#036799',textAlign:'start'}}>{data.date}</Typography>
                    </Grid>
                
                  <Grid item xs={1}>
                  <CardHeader
                      action={
                        <IconButton
                          aria-label='settings'
                          // onClick={(e) => {
                          //   // e.preventDefault();
                          //   handleDelete(item.id);
                          // }}
                        >
                          <Tooltip title='Delete Book' arrow>
                            <MoreHorizIcon />
                          </Tooltip>
                        </IconButton>
                      }
                    />
            
                  </Grid>
                  </Grid>
                </CardContent>
                
            </Paper>
          </Grid>
          </div>)})}
        </Grid>
          
        {/* <Grid container justify='center'>
          <Grid item md={8}>
            <Divider />
          </Grid> */}
          <br />
          
        {/* </Grid> */}
        <Grid container justify='center'>
              {' '}
              <Pagination count={3} color='primary' />
            </Grid>

        

        </div>
    </form>
    </Layout>
          

        
         
         
);
};

export default Cal1;