import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Grid,
  makeStyles,
  AppBar,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Divider,
  Button,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state'
import { Link, useHistory } from 'react-router-dom';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loader from '../../components/loader/loader';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
    // marginLeft:'10px',
    // border:'1px solid black'
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const ContactUs = () => {
  const history = useHistory();

  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([])
  const [selectedBranch, setSelectedBranch] = useState([])
  const [num,setNum]=useState('')
  const [num1,setNum1]=useState('')
  const [num2,setNum2]=useState('')
  const moduleId = 175;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(moduleId){
    callApi(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`, 'academicYearList')
    }
  }, [moduleId]);

  const handleNumber=(e)=>{
      const re=/^[0-9]+$/g
      if((e.target.value==="" || re.test(e.target.value))&& (e.target.value.length<=10)){
          setNum(e.target.value)
      }
  }
  const handleNumber1=(e)=>{
    const re=/^[0-9]+$/g
    if((e.target.value==="" || re.test(e.target.value))&& (e.target.value.length<=10)){
        setNum1(e.target.value)
    }
}
const handleNumber2=(e)=>{
  const re=/^[0-9]+$/g
  if((e.target.value==="" || re.test(e.target.value))&& (e.target.value.length<=10)){
      setNum2(e.target.value)
  }
}
  function callApi(api, key) {
    setLoading(true);
    axiosInstance.get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || [])
            setAcademicYear(result?.data?.data || [])
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [])
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

  return (
    <Layout>
      <div style={{ marginTop: '20px', marginLeft: '-10px' }}>
        <CommonBreadcrumbs componentName='Contact Us' />
      </div>
      <Grid
        container
        direction ="row"
        className={classes.root}
        spacing={3}
      >
        <AppBar position="static" style={{color:'white'}}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="POST CONTACT NUMBER" {...a11yProps(0)} />
            <Tab label="UPDATE CONTACT NUMBER" {...a11yProps(1)} />
            </Tabs>
        </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container direction="row" spacing={3} className={classes.root}>
        <Grid item md={5} xs={12} >
          <Autocomplete
            size='small'
            fullWidth
            style={{width:'100%'}}
            onChange={(event, value) => {
              setSelectedAcadmeicYear(value)
              console.log(value, "test")
              if (value) {
                callApi(
                  `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                  'branchList'
                );
              }
              setSelectedBranch([])

            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedAcademicYear || ""}
            options={academicYear || ""}
            getOptionLabel={(option) => option?.session_year || ""}
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
        <Grid item md={5} xs={12}>
          <Autocomplete
            // multiple
            fullWidth
            size='small'
            style={{width:'100%'}}
            onChange={(event, value) => {
              setSelectedBranch([])
              if (value) {
                // const ids = value.map((el)=>el)
                const selectedId = value.branch.id
                setSelectedBranch(value)
                console.log(value)
                callApi(
                  `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                  'gradeList'
                );
              }
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch || ""}
            options={branchList || ""}
            getOptionLabel={(option) => option?.branch?.branch_name || ""}
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
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="foe-contact-number" label="FOE Contact Number" type="text" fullWidth  value={num||""} onChange={(e)=>handleNumber(e)}/>
            <br />
            <br />
            <TextField id="operational-manager-number" label="Operational Manager Contact Number" type="text" value={num1||""} onChange={(e)=>handleNumber1(e)} fullWidth/>
            <br />
            <br />
            <TextField id="campus-incharge-number" label="Campus Incharge Contact Number" type="text" value={num2||""} fullWidth onChange={(e)=>handleNumber2(e)}/>
            <br />
            <br />
            <Button variant="contained" color="primary">
                Send
            </Button>
        </form>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container direction="row" spacing={3} className={classes.root} alignItems="center" alignContent="center">
        <Grid item md={4} xs={12} >
          <Autocomplete
            size='small'
            fullWidth
            style={{width:'100%'}}
            onChange={(event, value) => {
              setSelectedAcadmeicYear(value)
              console.log(value, "test")
              if (value) {
                callApi(
                  `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                  'branchList'
                );
              }
              setSelectedBranch([])

            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedAcademicYear || ""}
            options={academicYear || ""}
            getOptionLabel={(option) => option?.session_year || ""}
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
        <Grid item md={4} xs={12}>
          <Autocomplete
            // multiple
            fullWidth
            size='small'
            style={{width:'100%'}}
            onChange={(event, value) => {
              setSelectedBranch([])
              if (value) {
                // const ids = value.map((el)=>el)
                const selectedId = value.branch.id
                setSelectedBranch(value)
                console.log(value)
                callApi(
                  `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                  'gradeList'
                );
              }
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch || ""}
            options={branchList || ""}
            getOptionLabel={(option) => option?.branch?.branch_name || ""}
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
        <Grid item xs={12} md={4} alignItems="center" alignContent="center" justify="center">
        <Button variant="contained" color="primary">
                Filter
            </Button>
        </Grid>
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="foe-contact-number" label="FOE Contact Number" type="text" fullWidth  value={num||""} onChange={(e)=>handleNumber(e)}/>
            <br />
            <br />
            <TextField id="operational-manager-number" label="Operational Manager Contact Number" type="text" value={num1||""} onChange={(e)=>handleNumber1(e)} fullWidth/>
            <br />
            <br />
            <TextField id="campus-incharge-number" label="Campus Incharge Contact Number" type="text" value={num2||""} fullWidth onChange={(e)=>handleNumber2(e)}/>
            <br />
            <br />
            <Button variant="contained" color="primary">
                Send
            </Button>
        </form>
        </Grid>
      </TabPanel>
          </Grid>
        {/* {loading && <Loader />} */}
    </Layout>
  );
};

export default ContactUs;
