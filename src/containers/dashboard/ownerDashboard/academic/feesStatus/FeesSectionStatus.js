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
import Loader from 'components/loader/loader';
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
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
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
    filterDesign: {
        display: 'flex',
        // justifyContent:'space-between'
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        margin: '5px 0'
    }
}));
const arr = [
    {
        roll: 1,
        name: 'Student Name 1',
        fees: '1200000',
        paid: '8960000',
        outstanding: '450000',
    },
    {
        roll: 2,
        name: 'Student Name 2',
        fees: '200000',
        paid: '4960000',
        outstanding: '550000',
    },
    {
        roll: 3,
        name: 'Student Name 3',
        fees: '200000',
        paid: '4960000',
        outstanding: '550000',
    },
    {
        roll: 4,
        name: 'Student Name 4',
        fees: '200000',
        paid: '4960000',
        outstanding: '550000',
    },
];


function Row(props) {
    // console.log(props,'HUUUUUUU')
    const { row, params: { branchId, gradeId } } = props;
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [subTable, setSubTable] = useState([]);
    const [grade, setGrade] = useState(null)
    const [propsData, setPropsData] = useState([]);
    const [gradeName,setGradeName] = useState('')

    const { session_year: sessionYearId = '' } =
        JSON.parse(sessionStorage.getItem('acad_session')) || {};

    useEffect(() => {
        setPropsData(history?.location?.state)
    }, [history])

    const handleOpen = (e,name) => {
        if (open === true) {
            setOpen(!open)
        } else {
            setGrade(e)
            setGradeName(name)
            setLoading(true)
            setOpen(!open)
            axiosInstance
                .get(`${endpoints.ownerDashboard.sectionListFeesDetails}?academic_year=${sessionYearId}&grade=${e}&branch=${branchId}`,)
                .then((res) => {
                    setSubTable(res.data)
                    setLoading(false)
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false)
                })

        }

    }

    const handleRoute = (id, name) => {
        history.push({
            pathname: `/grade-wise-fees-details`,
            state: {
                branchId: branchId,
                branchName: propsData?.branch,
                gradeName: gradeName,
                gradeId: grade,
                sectionId: id,
                sectionName: name,
            }
        })
    }

    function LinearProgressWithLabel(props) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }
    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell component="th" scope="row">
                    <b>{row.grade_name}</b>
                </TableCell>
                <TableCell align="right" style={{ color: '#4180e7' }} ><b>{Math.round(row.totalfees)}</b></TableCell>
                <TableCell align="right" style={{ color: '#08cf39' }}><b>{Math.round(row.paid)}</b></TableCell>
                <TableCell align="right" style={{ color: '#ff3573' }}><b>{Math.round(row.outstanding)}</b></TableCell>
                <TableCell align="right">
                    <Box>
                        <LinearProgressWithLabel value={Math.round(row?.percentage)} />
                    </Box>
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleOpen(row?.grade, row?.grade_name)}
                    // onClick ={handleOpen(e)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{ margin: 1 }}
                        >
                            <Table aria-label="purchases">
                                {/* <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}></TableCell>
                                        <TableCell style={{ textAlign: 'left' }}></TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead> */}
                                <TableBody>
                                    {subTable.map((historyRow) => (
                                        <TableRow style={{ textAlign: 'left' }}>
                                            <TableCell

                                                style={{ textAlign: 'left' }}>
                                                <b>{historyRow?.section_name}</b>
                                            </TableCell>

                                            <TableCell style={{ textAlign: 'left', color: '#4180e7' }}>
                                                <b>{Math.round(historyRow?.totalfees)}</b>
                                            </TableCell>
                                            {/* <TableCell></TableCell> */}
                                            <TableCell style={{ textAlign: 'left', color: '#08cf39' }}>
                                                <b>{Math.round(historyRow?.paid)}</b>
                                            </TableCell>
                                            {/* <TableCell></TableCell> */}
                                            <TableCell style={{ textAlign: 'left', color: '#ff3573' }}> <b>{Math.round(historyRow?.outstanding)}</b></TableCell>
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                            <TableCell style={{ textAlign: 'left' }}>
                                                <Box>
                                                    <LinearProgressWithLabel value={Math.round(historyRow?.percentage)} />
                                                </Box>
                                            </TableCell>
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                            <TableCell>
                                                <IconButton size='large'
                                                    onClick={() => handleRoute(historyRow?.section, historyRow.section_name)}
                                                >
                                                    <ArrowCircleRightIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            {loading && <Loader />}
        </React.Fragment>
    );
}



const FeesSectionStatus = (props) => {

    const classes = useStyles();
    const [volume, setVolume] = React.useState('');
    const history = useHistory();
    const [expanded, setExpanded] = useState(true);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [gradeData, setGradeData] = useState([])
    const [historyData, setHistoryData] = useState('')


    useEffect(() => {
        // console.log(history.location.state,'MO*****8888888')
        setHistoryData(history.location.state)
    }, [history])

    const { session_year: sessionYearId = '' } =
        JSON.parse(sessionStorage.getItem('acad_session')) || {};

    const {
        match: {
            params: { branchId, gradeId },
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

    useEffect(() => {
        gradeFeesHandle()

    }, [])

    const gradeFeesHandle = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get(`${endpoints.ownerDashboard.gradeListFeesDetails}?academic_year=${sessionYearId}&branch=${branchId}`);
            if (data) {
                setLoading(false)
                // console.log(data,'KIIIIII')
                setGradeData(data)

            } else {
                throw new Error(data?.message);
                setLoading(false)

            }
        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }

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
                                Fees Status
                            </Typography>
                            <ArrowForwardIosIcon />
                            <Typography variant='h6' className={clsx(classes.textBold)}>
                                {historyData.branch}
                            </Typography>
                            <ArrowForwardIosIcon />
                            <Typography variant='h6' className={clsx(classes.textBold, classes.colorBlue)}>
                                {/* {gradeId} */}
                                Grade-wise Fee Details
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>

                                        <TableCell>Grade</TableCell>
                                        <TableCell align="right">TOTAL FEES</TableCell>
                                        <TableCell align="right">PAID</TableCell>
                                        <TableCell align="right">OUTSTANDING</TableCell>
                                        <TableCell align="right">%FEES PAID</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {gradeData.map((row) => (
                                        <Row key={row.grade} row={row} params={props.match.params} />
                                    ))}
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

export default withRouter(FeesSectionStatus);
