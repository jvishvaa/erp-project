import React, { useContext, useState, useEffect } from 'react';
import { makeStyles,
  Divider,
  TextField,
  Grid ,
  Button,
  FormControl, 
  Card,
  CardContent,
  CardHeader,
  CardMedia, 
  IconButton,
  Tooltip,
  Typography,} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete ,Pagination } from '@material-ui/lab';
import Layout from '../Layout';
import ColorPicker from 'material-ui-color-picker';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import './calendar.scss'

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
    
  }));

const Calendar = () =>{
    const classes = useStyles();
    const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const handleDateChange = (event, value) => {
      setDateValue(value);
      console.log('date', value);
    };
    const dummyData=[
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
    ]
    const [custColor, setCustColor]= useState('#D76363');

    const handleColor = (value)=>{
      console.log("color:",value);
      setCustColor(value);
  
    };
    const mystyle = {
      backgroundColor: custColor,
      padding: "40px",
      fontFamily: "Arial"
    };

return(
    <Layout>
    <form>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={5} md={3}>
            <FormControl variant='outlined' className={classes.formControl} size='small'>
              <Autocomplete
                size='small'
                style={{ width: '50%' }}
                style={{marginRight:50}}
                options={[
                  { id: 1, name: 'AnnualExams' },
                  { id: 2, name: 'Half-Yearly Exams' },
                  { id: 3, name: 'Quaterly Exams'}
                ]}
                getOptionLabel={(option) => option.name}
                // getOptionLabel={(option) => option?.role_name}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Category type'
                    placeholder='Category type'
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <Autocomplete
                size='small'
                style={{ width: '100%' }}
                style={{ marginTop: 25 }}
                options={[
                  { id: 1, name: '' },
                  { id: 2, name: '' },
                  { id: 3, name: ''}
                ]}
                getOptionLabel={(option) => option.name}
                
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Category Name'
                    placeholder='Category Name'
                    required
                  />
                )}
              />
          </Grid>
          <Grid item xs={12} sm={5} md={3} lg={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker'
              label='Date'
              maxDate={new Date()}
              inputVariant='outlined'
              value={dateValue}
              style={{ background: 'white' }}
              style={{ marginTop: 25}}
              fullWidth
              required
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={5} md={2} lg={2}>
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
          <Grid container spacing={1} style={{ width: '45%', margin: '10px' }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
         
        >
          <Button
            variant='contained'
            className='custom_button_master labelColor'
            size='medium'
          
            // onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={3}
         
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
        <br />
        <br />
        <br />
        <br />
        <Grid container direction='row'>
       
        { dummyData.map((data) => {
        return(<Grid item md={3}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
              
            />
            <div >
            <CardHeader
                      action={
                        <IconButton
                          aria-label='settings'
                          x
                        >
                          <Tooltip title='Edit Category' arrow>
                            <MoreHorizIcon />
                          </Tooltip>
                        </IconButton>
                      }
                    />
              <CardContent>
                <Grid container direction="row" >
                <Grid><div  style={mystyle} >
                     
                    </div></Grid>
                
                <Grid >
                <Typography >{data.exam}</Typography>
                <Typography>{data.test}</Typography>
                <Typography style={{marginLeft:20}}>{data.date}</Typography>
                </Grid>
                </Grid>
              </CardContent>
              
            </div>
          </Card>
        </Grid>)})}
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

export default Calendar;