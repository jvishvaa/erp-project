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
  ChevronRight as ArrowCircleRightIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
import Layout from '../../../../Layout';
import clsx from 'clsx';
import moment from 'moment';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
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
  colorRed: {
    color: 'lightpink',
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
  colorBlue: {
    color: '#4180e7',
    fontWeight: 'bolder',
  },
  colorRed: {
    color: '#ff3573',
    fontWeight: 'bolder',
  },
  colorGreen: {
    color: '#08cf39',
    fontWeight: '900',
  },
  colorYellow: {
    color: '#f89910',
    fontWeight: '900'

  },
  clickable: {
    cursor: 'pointer',
  },
}));


const FeesTableStatus = (props) => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const branch = data?.role_details?.branch;
  const selectedBranchId = branch?.map((el) => el?.id);
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [feesStatus, setFeesStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState('');
  // const {
  //   match: {
  //     params: { branchId },
  //   },
  // } = props;

  // console.log(selectedBranchId.toString(),'Branch---->')

  const { session_year: sessionYearId = '' } =
    JSON.parse(sessionStorage.getItem('acad_session')) || {};

  // console.log(sessionYearId,'YEARPPPPPPP')

  let dateToday = moment().format('YYYY-MM-DD');

  // const handleDateClass = (e) => {
  //   setDate(e.target.value);
  // };

  const handleChange = () => {
    // console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    if (history?.location?.state?.filter === true) {
      const branchIds = history?.location?.state?.branch.map((el) => el?.branch?.id)
      feesStatusAllBranch({ academic_year: sessionYearId, branch: branchIds.toString() })
    } else {
      feesStatusAllBranch({ academic_year: sessionYearId, branch: selectedBranchId.toString() });
    }
    setLoading(true);
  }, []);

  const feesStatusAllBranch = async (params = {}) => {
    axiosInstance
      .get(`${endpoints.ownerDashboard.getFeesForAllBranch}`, {
        params: { ...params },
      })
      .then((res) => {
        setLoading(false)
        setFeesStatus(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRote = (branchName, branchId) => {
    history.push({
      pathname: `/fees-status-branch-wise-details/${branchId}`,
      state: {
        branchName: branchName,
        branchId: branchId
      }
    })
    // history.push(`/fees-status-branch-wise-details/${branchId}`)
  }

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3} justifyContent='space-between'>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small'>
                <ArrowBackIcon onClick={() => history.goBack()} />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Dashboard
              </Typography>
              <ArrowForwardIosIcon />
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Fees Status
              </Typography>
              <ArrowForwardIosIcon />
            </div>
          </Grid>
          <Grid item xs={6}>
            {/* <OutlinedInput
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
            /> */}
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>BRANCH NAME</TableCell>
                    <TableCell>TOTAL FEES</TableCell>
                    <TableCell>TOTAL COLLECTED</TableCell>
                    <TableCell>TOTAL PENDING</TableCell>
                    <TableCell>TOTAL ADMISSION</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feesStatus?.map((each, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className={clsx(classes.clickable)} onClick={() => history.push(`/fees-status-branch-wise-details/${each?.branch}`)}>{each.branch_name}</TableCell>
                        <TableCell className={clsx(classes.colorBlue)} > <b> ₹{Math.round(each?.totalfees).toLocaleString()}</b></TableCell>
                        <TableCell className={clsx(classes.colorGreen)} ><b>  ₹{Math.round(each?.paid).toLocaleString()}</b></TableCell>
                        <TableCell className={clsx(classes.colorRed)}><b>  ₹ {Math.round(each?.outstanding).toLocaleString()}</b></TableCell>
                        <TableCell className={clsx(classes.colorYellow)}><b>{Math.round(each?.no_of_admission).toLocaleString()}</b></TableCell>
                        <TableCell>
                          <IconButton size='large'
                            onClick={() => handleRote(each.branch_name, each?.branch)}
                          >
                            <ArrowCircleRightIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(FeesTableStatus);
