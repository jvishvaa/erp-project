/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Input,
  OutlinedInput,
  TableBody,
  Paper,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  PersonSharp as PersonSharpIcon,
  SearchSharp as SearchSharpIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import clsx from 'clsx';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },

  cardContantFlex: {
    display: 'flex',
    alignItems: 'center',
  },
  cardLetter: {
    padding: '6px 10px',
    borderRadius: '8px',
    margin: '0 10px 0 0',
    fontSize: '1.4rem',
  },
  absentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid red',
    padding: '0 5px',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  colorBlue: {
    color: 'blue',
  },
  colorGreen: {
    color: 'lightgreen',
  },
  colorRed: {
    color: 'red',
  },
  colorWhite: {
    color: 'white',
  },
  backgrounColorGreen: {
    backgroundColor: 'lightgreen',
  },
  backgrounColorBlue: {
    backgroundColor: 'lightblue',
  },
  backgrounColorRed: {
    backgroundColor: 'lightpink',
  },
}));
const arr = [
  {
    erp: 9876543456,
    name: 'A',
    present: true,
    absent: null,
    moreAbsent: null,
  },
  {
    erp: 9876345456,
    name: 'B',
    present: null,
    absent: true,
    moreAbsent: null,
  },
  {
    erp: 987654796,
    name: 'C',
    present: null,
    absent: null,
    moreAbsent: 4,
  },
  {
    erp: 9876543456,
    name: 'D',
    present: true,
    absent: null,
    moreAbsent: null,
  },
];

const StuffTypeAdminWiseStuffAttendance = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [date, setDate] = useState('');
  const {
    match: {
      params: { branchId, stuffTypeID },
    },
  } = props;

  let dateToday = moment().format('YYYY-MM-DD');

  const handleDateClass = (e) => {
    setDate(e.target.value);
  };

  const handleChange = () => {
    console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3} justifyContent='space-between'>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Dashboard
              </Typography>
              <ArrowForwardIosIcon />
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Attendance
              </Typography>
              <ArrowForwardIosIcon />
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Branch Name 1
              </Typography>
              <ArrowForwardIosIcon />
              <Typography
                variant='h6'
                className={clsx(classes.textBold, classes.colorBlue)}
              >
                Other Stuff
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <OutlinedInput
              margin='dense'
              // type={values.showPassword ? 'text' : 'password'}
              // value={values.password}
              // onChange={handleChange('password')}
              placeholder='Search'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    //   onClick={handleClickShowPassword}
                    //   onMouseDown={handleMouseDownPassword}
                  >
                    <SearchSharpIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label='Till Date'
              type='date'
              variant='outlined'
              margin='dense'
              // defaultValue="2017-05-24"
              // sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => console.log(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ERP NO</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Present</TableCell>
                    <TableCell>Absent</TableCell>
                    <TableCell>ABSENT FOR MORE THAN 3 DAYS</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arr?.map((each, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{each.erp}</TableCell>
                        <TableCell>{each.name}</TableCell>
                        <TableCell className={clsx(classes.colorGreen)}>
                          {each.present === true ? 'P' : ''}
                        </TableCell>
                        <TableCell className={clsx(classes.colorRed)}>
                          {each.absent === true ? 'A' : ''}
                        </TableCell>
                        <TableCell className={clsx(classes.colorRed)}>
                          {each.moreAbsent !== null ? `${each.moreAbsent} Days` : ''}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              history.push(
                                `/staff-attendance-report/staff-details/${branchId}/${stuffTypeID}/${each.erp}`
                              )
                            }
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* {loading && <Loader />} */}
      </div>
    </Layout>
  );
};

export default withRouter(StuffTypeAdminWiseStuffAttendance);
