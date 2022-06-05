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
    Collapse,
    Box,
    LinearProgress,
    Tab,
    Tabs,
} from '@material-ui/core';
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    PersonSharp as PersonSharpIcon,
    SearchSharp as SearchSharpIcon,
    AccountBalance as AccountBalanceIcon
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination, TabContext, TabList } from '@material-ui/lab';
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
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import moment from 'moment';
// import TabPanel from 'containers/online-class/tab-panel/TabPanel';
import TabPanel from "@material-ui/lab/TabPanel";
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import feeType from 'containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/feeType';

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
        color: '#98a4e9',
        fontWeight: 'bolder',
    },
    colorRed: {
        color: '#fda8ae',
        fontWeight: 'bolder',
    },
    colorGreen: {
        color: '#68d761',
        fontWeight: '900',
    },
    colorYellow: {
        color: '#fbcda3',
        fontWeight: '900'

    },
    filterDesign: {
        display: 'flex',
        // justifyContent:'space-between'
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        margin: '5px 0'
    }
}));


const TransactionDetails = (props) => {
    const classes = useStyles();
    const [volume, setVolume] = React.useState('');
    const history = useHistory();
    const [expanded, setExpanded] = useState(true);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = useState(false);
    const [tabHeader, setTabHeader] = useState([]);
    const [tabsId, setTabsId] = useState(null);
    const [TransactionsRows, setTransactionsRows] = useState([]);



    const {
        match: {
            params: { branchId, branchName },
        },
    } = props;

    // useEffect(()=>{
    //     console.log(history?.location?.state,'******99999999')
    //     // setBranchName(history?.location?.state?.branchName)
    // },[history])

    const { session_year: sessionYearId = '' } =
        JSON.parse(sessionStorage.getItem('acad_session')) || {};

    // let dateToday = moment().format('YYYY-MM-DD');

    const handleDateClass = (e) => {
        setDate(e.target.value);
    };

    const getTabData = (feeType) => {
        if (feeType === '001') {
            setLoading(true)
            axiosInstance
                .get(`${endpoints.ownerDashboard.transactionAllType}?academic_year=${sessionYearId}&branch=${branchId}&date=${date}`)
                .then((res) => {
                    setLoading(false)
                    setTransactionsRows(res?.data)

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err);
                });

        } else {
            setLoading(true)
            axiosInstance
                .get(`${endpoints.ownerDashboard.transactionAllType}?academic_year=${sessionYearId}&branch=${branchId}&payment_mode=${feeType}&date=${date}`)
                .then((res) => {
                    setLoading(false)
                    // console.log(res?.data, 'Filter')
                    setTransactionsRows(res?.data)

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err);
                });
        }
    }

    const handleChangeCustom = (event, newValue) => {
        // console.log(newValue, 'poooo')
        setValue(newValue);
        setTabsId(newValue)
        getTabData(newValue)

    };
    const handleVolumeChange = (event) => {
        setVolume(event?.target?.value);
    };

    useEffect(() => {
        TabsHandle()
    }, [])

    const TabsHandle = async () => {
        setLoading(true)
        axiosInstance
            .get(`${endpoints.ownerDashboard.transactionDetailsTab}`)
            .then((res) => {

                let tmpType = res?.data?.data;
                tmpType.unshift({
                    id: '001',
                    payment_method: "Total Amount"
                })
                setTabHeader(tmpType)
                getTabData('001')
                setValue('001')
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });
    }

    useEffect(() => {
        getTabData(value)
    }, [date])

    return (
        <Layout>
            <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Grid container spacing={3} justifyContent='space-between'>
                    <Grid item xs={12}>
                        <div className={clsx(classes.breadcrumb)}>
                            <IconButton size='small'                 onClick={() =>
                  history.push({
                    pathname: '/dashboard',
                    state: {
                      stateView: '2',
                    },
                  })
                }>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant='h6' className={clsx(classes.textBold)}>
                                Dashboard
                            </Typography>
                            <ArrowForwardIosIcon />
                            <Typography variant='h6' className={clsx(classes.textBold)}>
                                Fees Status
                            </Typography>
                            <ArrowForwardIosIcon />
                            {/* <Typography variant='h6' className={clsx(classes.textBold)}>
                                {branchName}
                            </Typography>
                            <ArrowForwardIosIcon /> */}
                            <Typography variant='h6' className={clsx(classes.textBold, classes.colorBlue)}>
                                Transaction Details
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}
                        className={clsx(classes.filterDesign)}
                    >
                        <Grid item xs={4}>
                            {/* <OutlinedInput
                                margin='dense'
                                style={{ borderRadius: '20px' }}
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
                        <Grid item md={4}></Grid>
                        <Grid item xs={2}>
                            {/* <FormControl fullWidth variant='outlined' margin='dense'>
                                <InputLabel id='volume'>Quarter</InputLabel>
                                <Select
                                    labelId='quarter'
                                    value={volume}
                                    label='Quarter'
                                    onChange={handleVolumeChange}
                                >
                                    <MenuItem value={10}>Volume 1</MenuItem>
                                    <MenuItem value={20}>Volume 2</MenuItem>
                                    <MenuItem value={30}>Volume 3</MenuItem>
                                </Select>
                            </FormControl> */}
                            <TextField
                                label='Select Date'
                                type='date'
                                variant='outlined'
                                margin='dense'
                                value={date}
                                // defaultValue="2017-05-24"
                                // sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setDate(e.target.value)}
                            />

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            {/* <TabContext value={value}> */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#eef3ff' }}>
                                <Tabs value={value} onChange={handleChangeCustom} aria-label="lab API tabs example" scrollButtons="auto" variant="scrollable">
                                    {tabHeader.map((each, index) => {
                                        return (
                                            <Tab wrapper label={each?.payment_method} value={each?.id} key={index} />
                                        )
                                    })}

                                </Tabs>
                            </Box>

                            {/* <TabPanel value="1"> */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell></TableCell> */}
                                        <TableCell>MODE</TableCell>
                                        <TableCell>NAME</TableCell>
                                        <TableCell>AMOUNT</TableCell>
                                        <TableCell>DATE</TableCell>
                                        {/* <TableCell>TIME</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {TransactionsRows.map((each) => {
                                        return (
                                            <TableRow>
                                                {/* <TableCell style={{border:'1px solid red'}}><AccountBalanceIcon size='small'/></TableCell> */}
                                                <TableCell style={{ display: 'flex' }}>
                                                    <Grid md={6} style={{ textAlign: 'right' }}>
                                                        <AccountBalanceIcon size='small' />
                                                    </Grid>
                                                    <Grid md={6} style={{ textAlign: 'left', padding: '5px' }}>
                                                        <b>{each.mode}</b>
                                                    </Grid>


                                                </TableCell>
                                                <TableCell> <b>{each.name}</b></TableCell>
                                                <TableCell> <b>{each.amount}</b></TableCell>
                                                <TableCell> <b>{each.date}</b></TableCell>
                                                {/* <TableCell> <b>{each.time}</b></TableCell> */}
                                            </TableRow>

                                        )
                                    })}
                                </TableBody>
                            </Table>
                            {/* </TabPanel> */}
                            {/* </TabContext> */}
                        </Box>

                    </Grid>
                </Grid>

                {loading && <Loader />}
            </div>
        </Layout>
    );
};

export default withRouter(TransactionDetails);
