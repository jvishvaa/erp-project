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
    makeStyles,
    Tab,
    Tabs,
    Box,
} from '@material-ui/core';
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    // ArrowForwardIos as ArrowForwardIosIcon,
    PersonSharp as PersonSharpIcon,
    MonetizationOn as MonetizationOnIcon
} from '@material-ui/icons';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { withRouter, useHistory } from 'react-router-dom';
import Layout from '../../../../Layout';
import clsx from 'clsx';
import moment from 'moment';
import TabPanel from '@material-ui/lab/TabPanel';
import { Autocomplete, TabContext, TabList } from '@material-ui/lab';
import axiosInstance from 'config/axios';
import axios from "axios";
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
    cardContantFlexCustom: {
        margin: '5px'
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
    textCenter: {
        textAlign: 'center',
    },
    colorRed: {
        color: 'green',
    },
    textFontSmall: {
        fontSize: '15px'
    },
    colorBlue: {
        color: 'blue'
    },
    numberTransaction: {
        fontSize: '15px',
        textAlign: 'center',
        marginTop: '81px'
    },
    colorYellow: {
        backgroundColor: '#f89910'
    },
    colorGreen: {
        backgroundColor: '#00be2a'
    },
    colorDeepRed: {
        backgroundColor: '#ff0036'
    },
    colorPurpel: {
        backgroundColor: '#c200d2',
        color: 'white'
    },
    colorLightBlue: {
        backgroundColor: '#00cdb7',
        color: 'white'
    },
    colorPink: {
        backgroundColor: '#fb0049',
        color: 'white'
    },
    colorBlueBackground: {
        backgroundColor: '#224bca'
    },
    textColorGreen: {
        color: '#00be2a'
    },
    textColorBlue: {
        color: '#224bca'
    },
    textColorLightBlue: {
        color: '#00cdb7'
    },
    textColorRed: {
        color: '#fb0049'
    },
    textColorYellow: {
        color: '#f89910'
    }


}));



const FeesStatusBranchWise = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [volume, setVolume] = React.useState('');
    const [loading, setLoading] = useState(false);
    const [totalCollected, settotalCollected] = useState(null);
    const [filterGradeList, setFilterGradeList] = useState([]);
    const [selectedFilterGrade, setSelectedFilterGrade] = useState({});
    const [paymentTypeData, setPaymentTypeData] = useState([]);
    const [gradeId, setGradeId] = useState([])
    const [tabsId, setTabsId] = useState(null);
    const [tabsData, setTabsData] = useState(null)
    const [value, setValue] = React.useState(0);
    const [fessData, setFeesData] = useState([])
    const [totalOverView, setTotalOverView] = useState('')
    const [historyBranch, setHistoryBranch] = useState('')

    const {
        match: {
            params: { branchId },
        },
    } = props;

    const { session_year: sessionYearId = '' } =
        JSON.parse(sessionStorage.getItem('acad_session')) || {};

    useEffect(() => {
        setHistoryBranch(history.location.state)
    }, [])

    const getTabData = (feeType) => {
        setLoading(true)
        // setTabsData(feeType)
        if (feeType === 'Total Fees') {
            axiosInstance
                .get(`${endpoints.ownerDashboard.getFeesForAllBranch}?academic_year=${sessionYearId}&branch=${branchId}`)
                .then((res) => {
                    // console.log(res,'MO8888888')
                    setFeesData(res?.data)
                    setTotalOverView(res?.data[0]?.totalfees)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                })

        } else {

            axiosInstance
                .get(`${endpoints.ownerDashboard.typeFeesData}?academic_year=${sessionYearId}&branch=${branchId}&fee_type=${feeType}`)
                .then((res) => {
                    // console.log(res,'Kop')
                    let temp = []
                    setFeesData([...temp, res.data])
                    setLoading(false)

                })
                .catch((err) => {
                    console.log(err);
                })

        }

    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTabsId(newValue);
        getTabData(newValue)
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    useEffect(() => {
        fetchFilterGradeList()
        // setLoading(true)
    }, [])



    const fetchFilterGradeList = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get(`${endpoints.masterManagement.grades}`);
            if (data.status_code === 200) {
                setFilterGradeList(data.result.results);
                setLoading(false)
            } else throw new Error(data?.message);
        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    };

    const handleGradeFilter = (e, value) => {
        // console.log(value,e, 'jiii')
        if (value) {
            // console.log(value.props.value, '20000')
            setSelectedFilterGrade(value.props.value);
            setGradeId(value.props?.value)
            history.push({
                pathname: `/fees-section-status/${branchId}/${value?.props.children}`,
                state: {
                    branch: historyBranch.branchName,
                    grade: value?.props?.value,
                    gradeName: value?.props?.children
                }
            })
        } else if (value === null) {
            setSelectedFilterGrade({});
        }
    }

    useEffect(() => {
        gettotalCollected({ academic_year: sessionYearId, branch: branchId });
        typeTransaction({ academic_year: sessionYearId, branch: branchId });
    }, []);

    const gettotalCollected = async (params = {}) => {
        setLoading(true)
        axiosInstance
            .get(`${endpoints.ownerDashboard.getTotalReceiptStatus}`, {
                params: { ...params },
            })
            .then((res) => {
                setLoading(false)
                // console.log(res);
                settotalCollected(res.data);
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });
    };

    const typeTransaction = async (params = {}) => {
        setLoading(true)
        axiosInstance
            .get(`${endpoints.ownerDashboard.getPaymentType}`, {
                params: { ...params },
            })
            .then((res) => {
                // console.log(res.data.data, 'bottle');
                // settotalCollected(res.data);
                let tmpType = res.data.data;
                tmpType.unshift({
                    fee_type_name: "Total Fees",
                    id: '001'
                })
                setPaymentTypeData(tmpType,)
                // setPaymentTypeData(res.data.data.unshift({
                //     fee_type_name: "Total Fees",
                //     id: '001'
                // }))

                getTabData('Total Fees')
                setValue('Total Fees')
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });
    };

    const handleRoute = () => {
        history.push({
            pathname: `/trasaction-details/${branchId}/${historyBranch?.branchName}`,
            state: {
                branchName: historyBranch?.branchName,
            }
        })
    }

    const handleAllGradeRoute = () => {
        history.push({
            pathname: `/fees-section-status/${branchId}`,
            state: {
                branch: historyBranch.branchName

            }
        })
    }

    return (
        <Layout>
            <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Grid container spacing={3} justifyContent='space-between'>
                    <Grid item xs={12}>
                        <div className={clsx(classes.breadcrumb)}>
                            <Typography variant='h6' className={clsx(classes.textBold, classes.textFontSmall)}>
                                Dashboard
                            </Typography>
                            <ArrowForwardIosIcon style={{ fontSize: '15px' }} />
                            <Typography variant='h6' className={clsx(classes.textBold, classes.textFontSmall)}>
                                Fees Status
                            </Typography>
                            <ArrowForwardIosIcon style={{ fontSize: '15px' }} />
                            <Typography variant='h6' className={clsx(classes.textBold, classes.textFontSmall, classes.colorBlue)}>
                                {historyBranch?.branchName}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Card elevation={1}>
                            <CardContent style={{ padding: '0' }}>
                                <div
                                    style={{
                                        borderRadius: '4px 4px 0 0',
                                        // backgroundColor: 'lightblue',
                                        padding: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ width: '80%' }}>
                                        <Typography> <b>Fees</b></Typography>
                                    </div>
                                    <div style={{ width: '20%', textAlign: 'right' }}>
                                        {/* <Autocomplete
                                            fullWidth
                                            size='small'
                                            className='filter-student meeting-form-input'
                                            onChange={(e, value) => {
                                                handleGradeFilter(e, value);
                                            }}
                                            id='create__class-grade'
                                            options={(filterGradeList && filterGradeList) || []}
                                            getOptionLabel={(option) => option?.grade_name || ''}
                                            filterSelectedOptions
                                            value={selectedFilterGrade || {}}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant='outlined'
                                                    label='Grade'
                                                    placeholder='Grade'
                                                />
                                            )}
                                        /> */}
                                        {/* <FormControl fullWidth variant='outlined' margin='dense'>
                                            <InputLabel id='subject'>Grade </InputLabel>
                                            <Select
                                                labelId='subject'
                                                value={selectedFilterGrade}
                                                label='Subject'
                                                onChange={(e, value) => {
                                                    handleGradeFilter(e, value)
                                                }}
                                            >
                                                <MenuItem value={''}>All Grade</MenuItem>
                                                {filterGradeList &&
                                                    filterGradeList.map((each, index) => {
                                                        return (
                                                            <MenuItem value={each?.id} key={index}>
                                                                {each?.grade_name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                        </FormControl> */}
                                        <ArrowForwardIosIcon style={{ cursor: 'pointer' }} onClick={() => handleAllGradeRoute()} fontSize='small' />
                                    </div>
                                </div>
                                <Divider />
                                <div
                                >
                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                        {/* <TabContext value={value}> */}
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#eef3ff' }}>
                                            <Tabs value={value} onChange={handleChange} scrollButtons="auto" variant="scrollable" >
                                                {paymentTypeData.map((each, index) => {
                                                    return (
                                                        <Tab wrapped label={each.fee_type_name} value={each?.fee_type_name} key={index} />
                                                    )
                                                })}
                                            </Tabs>
                                        </Box>
                                        {/* </TabContext> */}
                                    </Box>

                                    <Grid style={{ margin: '5px' }} container spacing={2}>


                                        <Grid item xs={4}>
                                            <Card elevation={1}>
                                                <CardContent>
                                                    <Typography variant='h6' className={clsx(classes.textBold, classes.colorRed)}>
                                                        {/* {totalOverView} */}
                                                        {fessData[0]?.totalfees}
                                                    </Typography>
                                                    <Typography variant='body1' className={clsx(classes.textFontSmall)}>Total Fees All Grades</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        {/* <Grid container> */}
                                        <Grid item xs={4}>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorDeepRed,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'> <b>{fessData[0]?.outstanding}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall)}>Total Outstanding</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* </Grid> */}
                                        <Grid item xs={4}>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                // className={clsx(classes.cardContantFlexCustom)}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorYellow,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'> <b>{fessData[0]?.paid}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall)}>Paid</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        {/* <Grid item xs={3}>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                // className={clsx(classes.cardContantFlexCustom)}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorGreen,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'> <b>{fessData[0]?.totalfees}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall)}>Fees Collected</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid> */}
                                    </Grid>

                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card elevation={1}>
                            <CardContent style={{ padding: '0' }}>
                                <div
                                    style={{
                                        borderRadius: '4px 4px 0 0',
                                        // backgroundColor: 'lightblue',
                                        padding: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div>
                                        <Typography> <b>Today's Fee Collection All Grade</b></Typography>
                                        {/* <Typography>ERP No. : {erpId}</Typography> */}
                                    </div>
                                </div>
                                <Divider />
                                <div
                                // style={{ padding: '10px' }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <Card elevation={1}>
                                                <CardContent>
                                                    <Typography variant='body1' className={clsx(classes.textCenter)}>Total Fee Collected</Typography>
                                                    <Typography variant='h6' className={clsx(classes.textBold, classes.colorRed, classes.textCenter)}>
                                                        ₹ {totalCollected?.total_fee_collected}
                                                    </Typography>
                                                    <Typography className={clsx(classes.numberTransaction)} >
                                                        {totalCollected?.no_of_transaction} transaction done Today
                                                    </Typography>
                                                    <div style={{ color: 'blue', marginLeft: "58%", textAlign: "center", cursor: "pointer", fontSize: "14px" }} onClick={() => handleRoute()}>
                                                        <p>View All
                                                            <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        {/* <Grid container> */}
                                        <Grid item xs={3}>
                                            <Grid item xs={12}>
                                                <Card elevation={1} className={clsx(classes.cardContantFlexCustom)}>
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorBlueBackground,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'> <b>₹ {totalCollected?.Cash}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.colorBlue, classes.textColorBlue)}>By Cash</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                    className={clsx(classes.cardContantFlexCustom)}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorPurpel,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'><b>₹ {totalCollected?.Cheque}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.colorBlue, classes.textColorPurpel)}>Bank Cheque</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* </Grid> */}
                                        <Grid item xs={3}>
                                            <Grid item xs={12}>
                                                <Card elevation={1} className={clsx(classes.cardContantFlexCustom)}>
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorLightBlue,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'><b>₹{totalCollected?.bbps}</b></Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.colorBlue, classes.textColorLightBlue)}>Bank Deposit</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                    className={clsx(classes.cardContantFlexCustom)}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorGreen,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'><b>₹{totalCollected?.Swipe}</b> </Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.colorBlue, classes.textColorGreen)}>Debit/Credit Card</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Grid item xs={12}>
                                                <Card elevation={1} className={clsx(classes.cardContantFlexCustom)}>
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorYellow,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'><b>₹{totalCollected?.Online}</b></Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.colorBlue, classes.textColorYellow)}>UPI Transfer</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Card elevation={1}
                                                    className={clsx(classes.cardContantFlexCustom)}
                                                >
                                                    <CardContent className={clsx(classes.cardContantFlex)} >
                                                        <span
                                                            className={clsx(
                                                                classes.cardLetter,
                                                                classes.colorPink,
                                                                classes.colorWhite,
                                                                classes.textBold
                                                            )}
                                                        >
                                                            <MonetizationOnIcon fontSize="small" style={{ color: 'white' }} />
                                                        </span>
                                                        <div>
                                                            <Typography variant='h6'><b>₹{totalCollected?.Internet}</b></Typography>
                                                            <Typography variant='body1' className={clsx(classes.textFontSmall, classes.textColorRed)}>Internet Banking</Typography>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {loading && <Loader />}
            </div>
        </Layout>
    );
};

export default FeesStatusBranchWise;
