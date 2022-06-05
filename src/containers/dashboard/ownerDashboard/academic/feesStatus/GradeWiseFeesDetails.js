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
// import endpoints from 'config/endpoints';
import endpoints from 'config/endpoints';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import clsx from 'clsx';
import moment from 'moment';
import axiosInstance from 'config/axios';
import Loader from 'components/loader/loader';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
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


const GradeWiseFeesDetails = (props) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const classes = useStyles();
    const [volume, setVolume] = React.useState('');
    const history = useHistory();
    const [filterGradeList, setFilterGradeList] = useState([]);
    const [expanded, setExpanded] = useState(true);
    const [date, setDate] = useState('');
    const [selectedFilterGrade, setSelectedFilterGrade] = useState({});
    const [selectedFilterSection, setSelectedFilterSection] = useState({});
    const [loading, setLoading] = useState(false);
    const [gradeId, setGradeId] = useState([])
    const [sectionId, setSectionId] = useState([])
    const [section, setSection] = useState([])
    const [studentWiseDetails, setStudentWiseDetails] = useState(null);

    const [propsData, setPropsData] = useState([]);
    const {
        match: {
            params: { branchId },
        },
    } = props;

    let dateToday = moment().format('YYYY-MM-DD');

    const { session_year: sessionYearId = '' } =
        JSON.parse(sessionStorage.getItem('acad_session')) || {};


    useEffect(() => {
        // console.log(history.location.state,'Lamp')
        setPropsData(history?.location?.state)

    }, [history])

    useEffect(() => {
        fetchFilterGradeList()
        fetchFilterSectionList();
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
            console.error(error);
            setLoading(false)
        }
    }

    const fetchFilterSectionList = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get(`${endpoints.masterManagement.sectionsTable}`);
            if (data.status_code === 200) {
                // console.log(data.data.results, 'section')
                setSection(data.data?.results);
                setLoading(false)
            } else throw new Error(data?.message);
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

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


    // useEffect(() => {
    //     gradeWiseFeesDetails({ academic_year: '2021-22', grade: '5', section: 1, branch: 24 })
    //     setLoading(true);
    // }, [gradeId])



    const handleGradeFilter = (e, value) => {
        if (value) {
            // console.log(value, '20000')
            setSelectedFilterGrade(value);
            setGradeId(value?.id)
            // history.push(`/fees-section-status/${value?.grade_name}`)
        } else if (value === null) {
            setSelectedFilterGrade({});
        }
    }

    const handleSectionFilter = (e, value) => {
        if (value) {
            setSelectedFilterSection(value);
            setSectionId(value?.id)
        } else if (value === null) {
            setSelectedFilterGrade({});
        }
    }

    useEffect(() => {
        setLoading(true)
        let url = `${endpoints.ownerDashboard.feesDetailsStudentWise}?academic_year=${sessionYearId}&grade=${history?.location?.state?.gradeId}&section=${history?.location?.state?.sectionId}&branch=${history?.location?.state?.branchId}`
        // if(gradeId.length !== 0) url += `grade=${gradeId}`;
        axiosInstance
            .get(url)
            .then((result) => {
                //   console.log(result,'check')
                if (result.status === 200) {
                    // console.log(result.data, 'bottle')
                    setStudentWiseDetails(result.data)
                    setLoading(false)

                } else {
                    setAlert('error', result.data?.message || result.data?.msg);
                    setLoading(false)
                }
            })
            .catch((error) => {
                setAlert('error', error.message);
                setLoading(false)
            });
    }, [gradeId])

    // const gradeWiseFeesDetails = async (params = {}) => {
    //     let url =`${endpoints.ownerDashboard.feesDetailsStudentWise}`
    //     if(gradeId.length !== 0) url += `grade=${gradeId}`;

    //     // console.log(gradeId, 'gradeFilter')
    //     // const gradeParms = gradeId.length !== 0 ? `grade_id=${gradeId}` : '';
    //     axiosInstance
    //         // .get(`${endpoints.ownerDashboard.feesDetailsStudentWise}?${gradeParms}`, {
    //             .get(url), {
    //             params: { ...params },
    //         })
    //         .then((res) => {
    //             setLoading(false)
    //             console.log(res.data, 'bottle')
    //             setStudentWiseDetails(res.data)

    //         })
    //         .catch((error) => {
    //             setLoading(false)
    //             console.log(error);
    //         });
    // }

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
                                {propsData?.branchName}
                            </Typography>
                            <ArrowForwardIosIcon />
                            <Typography variant='h6' className={clsx(classes.textBold, classes.colorBlue)}>
                                Grade-wise Status
                            </Typography>
                            <ArrowForwardIosIcon />
                            <Typography variant='h6' className={clsx(classes.textBold, classes.colorBlue)}>
                                {propsData?.gradeName} - {propsData?.sectionName}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}
                        className={clsx(classes.filterDesign)}
                    >
                        <Grid item xs={2}>
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
                        </Grid>
                        <Grid item xs={2}>
                            {/* <Autocomplete
                                fullWidth
                                size='small'
                                className='filter-student meeting-form-input'
                                onChange={(e, value) => {
                                    handleSectionFilter(e, value);
                                }}
                                id='create__class-grade'
                                options={(section) || []}
                                getOptionLabel={(option) => option?.section_name || ''}
                                filterSelectedOptions
                                value={selectedFilterSection || {}}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant='outlined'
                                        label='Section'
                                        placeholder='Section'
                                    />
                                )}
                            /> */}
                        </Grid>
                        <Grid item xs={4}>
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
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ERP NO</TableCell>
                                        <TableCell>NAME</TableCell>
                                        <TableCell>TOTAL FEES</TableCell>
                                        <TableCell>PAID</TableCell>
                                        <TableCell>OUTSTANDING</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentWiseDetails?.map((each, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell >{each.erp}</TableCell>
                                                <TableCell className={clsx(classes.colorBlue)} ><b>{each.name}</b></TableCell>
                                                <TableCell className={clsx(classes.colorGreen)} ><b>{each.totalfees}</b></TableCell>
                                                <TableCell className={clsx(classes.colorRed)}><b>{each.paid}</b></TableCell>
                                                <TableCell className={clsx(classes.colorYellow)}><b>{each.outstanding}</b></TableCell>
                                                <TableCell></TableCell>
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

export default withRouter(GradeWiseFeesDetails);
