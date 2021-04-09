import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Layout from '../Layout';
// import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Pagination from '@material-ui/lab/Pagination'
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




import {
    Paper,
    Card,
    CardContent,
    CardHeader,
    CardMedia, 
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
    paperSize:{
      width:" 399px",
      height: "109px",
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
      // border: '1px solid',
      // borderColor: theme.palette.primary.main,
      // padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0px 0px 4px #00000029',
      border: '1px solid #E2E2E2',
      opacity: 1,
      margin: '20px',
      width: '3600',
      
      
    },
    dailog:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    dialogPaper: {
      minHeight: '40vh',
        maxHeight: '40vh',
  },
    dgsize: {
      width: '100%',
    },
   
    // cardstyle: {
    //   // background: transparent url('img/Rectangle 5407.png') 0% 0% no-repeat padding-box;
    //   boxShadow: '0px 0px 4px #00000029',
    //   border: '1px solid #E2E2E2',
    //   borderRadius: '12px',
    //   opacity: 1,
    //   width: '399px',
    //   height: '109px',
            
    // },

    
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
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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

 
const Cal1 = () =>{
    const classes = useStyles();

    const { setAlert } = useState();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
    const handleDelete = (value) => {
      // setLoading(true);
      axiosInstance
        .delete()
        .then((result) => {
          if (result.data.status_code === 200) {
            setAlert('success', result.data);
          } else {
            setAlert('error', result.data);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    };

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
        test:" Science Test",
       

      },
        {
          exam:"AnnualExams",
          test:"Social Test",
          date:"3rd April 2021-4th April 2022",

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          

        },
        {
          exam:"AnnualExams",
          test:"English Test",
          

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
         

        },
        {
          exam:"AnnualExams",
          test:"English Test",
         

        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          

        },
        {
          exam:"AnnualExams",
          test:"English Test",
          
        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          

        },
        {
          exam:"AnnualExams",
          test:" Science Test",
          

        },
        {
          exam:"AnnualExams",
          test:"Maths Testffhhjghh jhjk",
          
        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          

        },
        {
          exam:"AnnualExams",
          test:"English Test text",
          
        },
        {
          exam:"AnnualExams",
          test:"English Test",
          

        },
        {
          exam:"AnnualExams",
          test:"Social Test",
          

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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClicknew = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose1 = () => {
      setAnchorEl(null);
    };
    
  
return(
    <Layout>
    <form>
    <CommonBreadcrumbs componentName='Create Event Category' />
  
      <div className={classes.root}>
        <Grid container spacing={2} direction='row'>
          <Grid item xs={12} sm={5} md={3} className='arrow'>
              <Autocomplete
                size='small'
                id='role'
                fullWidth
                style={{marginTop:25}}
                // getOptionLabel={(option) => option?.role_name}
                
                renderInput={(params) => (
                  <TextField
                     
                    {...params}
                    variant='outlined'
                    label='Event type'
                    placeholder='role'
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
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
         lg={1}
        >
          <Button
            variant='contained'
            className='custom_button_master '
            // size='medium'
            
          
            // onClick={handleGoBack}
          >
            Clear All
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
         lg={1}
        >
          <Button
            variant='contained'
            className='custom_button_master '
            // size='medium'
            color='primary'
          
            // onClick={handleGoBack}
          >
            Filter
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
         lg={1}
        >
          <Button
            variant='contained'
            className='custom_button_master '
            // size='medium'
            color='primary'
            onClick={handleClickOpen}
            // onClick={handleGoBack}
          >
            Create
          </Button>
        </Grid>
          {/* <Grid
            item
            xs={12}
            sm={3}
            md={3}
          lg={1}
          >
            <Button variant="outlined" onClick={handleClickOpen}>
              Create
            </Button>
        </Grid> */}
      </Grid>
     
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} classes={{ paper: classes.dialogPaper }}>
      
        <DialogTitle id="customized-dialog-title" >
          Create Event Category
        </DialogTitle>
        <DialogContent>
          <TextField
          
                autoFocus
                size='small'
                id='role'
                variant='outlined'
                fullWidth
                label='Event Name'
                placeholder='role'
                required
               
              />
            
            <ColorPicker
            name='color'
            defaultValue='color'
            value={custColor}
            label='Assign color'
            variant='outlined'
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true, required: true }}
            style={{ marginTop: 30 }}
            
            onChange={(e)=>
            handleColor(e)
            }
          
          
          />
          {/* </Grid> */}
        </DialogContent>  
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        {/* </Grid> */}
      </Dialog>
        
      <Grid container justify="center" alignItems="center" spacing={2}  direction="row" >
       
        { dummyData.map((data) => {
        return(
          <div>
          <Grid container>
           <Grid item xs={12} sm={12} lg={12}>
            <Card className={classes.cardstyle}>
              
                <CardContent >
                  <Grid container  spacing={2} direction="row" > 
                    <Grid item style={mystyle} xs={2}>
                    </Grid>                  
                    <Grid item xs={8}>
                      <Typography variant='subtitle1' style={{marginTop:8,marginLeft:8,marginRight:70,color:'#036799',textAlign:'start'}}>{data.exam}</Typography>
                      <Typography variant='subtitle2' style={{marginLeft:8,color:'#036799',textAlign:'start'}}>{data.test}</Typography>     
                    </Grid>
                
                  <Grid item xs={1} >
                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClicknew}>
                      <MoreHorizIcon style={{ color: "#F7324D" }}/> 
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose1}>Edit</MenuItem>
                      <MenuItem onClick={handleClose1}>Delete</MenuItem>
                    
                    </Menu>
            
                  </Grid>
                  </Grid>
                </CardContent>
                
            </Card>
          </Grid>
          </Grid>
          </div>)})}
        </Grid>
        {/* </Grid> */}
          
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