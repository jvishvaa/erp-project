import React, { useState, useEffect, useContext } from 'react';
import ClassCard from './ClassCard';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField, Switch, FormControlLabel, Typography } from '@material-ui/core';
import ClassdetailsCard from './ClassdetailCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import Pagination from './Pagination';
import { Pagination } from '@material-ui/lab';
// import MomentUtils from '@date-io/moment';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import { LocalizationProvider, DateRangePicker, KeyboardDate } from '@material-ui/pickers-4.2';
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Loader from '../../../components/loader/loader';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../config/axios'
import endpoints from '../../../config/endpoints'
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import filterImage from '../../../assets/images/unfiltered.svg'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '55px 100px 20px 100px',
        width: '85%',
        border: '1px solid #D8D8D8',
        borderRadius: '5px',
        [theme.breakpoints.down('xs')]: {
            margin: '55px 30px 20px 30px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '55px 40px 20px 40px',
        },
    },
    topFilter: {
        width: '85%',
        margin: '30px 100px 0px 100px',
        [theme.breakpoints.down('xs')]: {
            margin: '55px 30px 20px 30px',
        },
    },
    classDetailsBox: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #F9D474',
        borderRadius: '10px',
    },
    classHeader: {
        padding: '8px 21px',
        backgroundColor: '#F9D474',
        borderRadius: '10px 10px 0px 0px'
    },
    classHeaderText: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 300,
        fontFamily: 'Poppins',
        lineHeight: '25px',
    },
    classHeaderTime: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        float: 'right',
    },
    classHeaderSub: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        lineHeight: '25px',
    },
    subPeriods: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        float: 'right',
    },
    classDetails: {
        padding: '8px 21px',
        backgroundColor: '#FFFFFF',
        borderRadius: '0px 0px 10px 10px',
    },
    classDetailsTitle: {
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        lineHeight: '25px',
    },
    classDetailsDivider: {
        color: '#014B7E',
    },
    classDetailsDescription: {
        height: '50px',
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        overflow: 'hidden',
        marginBottom: '12px',
    },
    cardHover: {
        border: '1px solid #004087',
        borderRadius: '5px',
    }
}))


const StyledButton = withStyles({
    root: {
        marginTop: '16px',
        height: '31px',
        fontSize: '18px',
        fontFamily: 'Poppins',
        fontWeight: '',
        lineHeight: '27px',
        textTransform: 'capitalize',
        backgroundColor: '#FFAF71',
        borderRadius: '10px',
        marginRight: '40px',
    }
})(Button);

const UpcomingClasses = () => {
    const { setAlert } = useContext(AlertNotificationContext);
    const location = useLocation();
    const classes = useStyles({});
    const [classesData, setClassesdata] = React.useState([]);
    const [classData, setClassData] = React.useState();
    const [apiCall, setApiCall] = React.useState(false);
    const [itemSize, setItemSize] = React.useState(3);
    const [size, setSize] = React.useState(12);
    const [selected, setSelected] = React.useState();
    const [classTypeList, setClassTypeList] = React.useState([
        { id: 0, type: 'Compulsory Class' },
        { id: 1, type: 'Special Class' },
        { id: 2, type: 'Parent Class' },
        { id: 3, type: 'Optional Class' },
    ]);

    const [classType, setClassType] = React.useState('');
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [isLoding, setIsLoding] = React.useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [gradeDropdown, setGradeDropdown] = useState([])
    const [courseDropdown, setCourseDropdown] = useState([])
    const [batch, setBatch] = useState([])
    const [toggle, setToggle] = useState(false)
    const [toggledData, setToggledData] = useState([])

    const [reload, setReload] = useState(false)
    const limit = 15;

    const [dateRangeTechPer, setDateRangeTechPer] = useState([
        moment().subtract(6, 'days'),
        moment(),
    ]);
    const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
    const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));


    const themeContext = useTheme();
    const isTabDivice = useMediaQuery(themeContext.breakpoints.down('sm'));

    //batches view <<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const branchDrop = [{ id: 5, branch_name: 'AOL' }]



    // Filter data for batchev view<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [filterData, setFilterData] = useState({
        branch: '',
        grade: '',
        course: '',
        batch: '',
    })


    function getDaysAfter(date, amount) {
        return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
    }
    function getDaysBefore(date, amount) {
        return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
    }
    const handlePagination = (event, page) => {
        setPage(page);
    };

    const handleBranch = (event, value) => {
        setFilterData({ ...filterData, branch: '' })
        if (value) {
            setFilterData({ ...filterData, branch: value })
            axiosInstance.get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
                .then((result) => {
                    if (result.data.status_code === 200) {
                        setGradeDropdown(result.data.data)
                    }
                    else {
                        setGradeDropdown([])
                    }
                })
        }
    }

    const handleGrade = (event, value) => {
        setFilterData({ ...filterData, garde: '' })
        if (value) {
            setFilterData({ ...filterData, grade: value })
            axiosInstance.get(`${endpoints.aol.courseList}?grade=${value.grade_id}`)
                .then((result) => {
                    if (result.data.status_code === 200) {
                        setCourseDropdown(result.data.result)
                    }
                    else {
                        setCourseDropdown([])
                    }
                })
        }
    }
    const handleCourse = (event, value) => {
        setFilterData({ ...filterData, course: '' })
        setBatch([])
        if (value) {
            setFilterData({ ...filterData, course: value })
            axiosInstance.get(`${endpoints.aol.batchLimitList}?course_id=${value.id}`)
                .then((result) => {
                    if (result.data.status_code === 200) {
                        setBatch(result.data.result)
                    }
                    else {
                        setBatch([])
                    }

                })
                .catch((error) => console.log(error, error.description))
        }
    }

    const handleBatch = (event, value) => {
        setFilterData({ ...filterData, batch: '' })
        if (value) {
            setFilterData({ ...filterData, batch: value })
        }
    }

    //api call
    const getClasses = () => {
        const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
        if (!filterData.grade) {
            setAlert('warning', 'Select Grade');
            return;
        }
        if (!filterData.course) {
            setAlert('warning', 'Select Course');
            return;
        }
        if (!filterData.batch) {
            setAlert('warning', 'Select Batch Limit');
            return;
        }
        if (!dateRangeTechPer) {
            setAlert('warning', 'Select Start Date');
            return;
        }
        if (toggle) {
            axiosInstance.get(`${endpoints.aol.draftBatch}?course_id=${filterData.course.id}&batch_limit=${filterData.batch.batch_size}&grade_id=${filterData.grade.grade_id}&is_aol=1&start_date=${startDateTechPer.format('YYYY-MM-DD')}&end_date=${endDateTechPer.format('YYYY-MM-DD')}`)
                .then(result => {
                    setToggledData(result.data.result)
                    setClassesdata([]);
                })
        }
        else {
            axiosInstance.get(`${endpoints.aol.classes}?page_number=${page}&page_size=${limit}&class_type=1&is_aol=1&course=${filterData.course.id}&batch_limit=${filterData.batch.batch_size}&start_date=${startDateTechPer.format('YYYY-MM-DD')}&end_date=${endDateTechPer.format('YYYY-MM-DD')}`)
                // axiosInstance.get(`${endpoints.aol.classes}?class_type=1&page_number=1&aol_batch=4&page_size=15&is_aol=1&start_date=2021-02-06&end_date=2021-04-1`)
                .then(result => {
                    setTotalCount(result.data.count)
                    setClassesdata(result.data.data)
                    setToggledData([]);
                })
        }




        // student view api
        // console.log(location.pathname);
        /*
        setClassesdata([]);
        setIsLoding(false);
        if (location.pathname === "/online-class/attend-class") {
            axiosInstance.get('erp_user/student_online_class/?user_id=78&page_number=1&page_size=15&class_type=' + classType?.id)
                .then((res) => {
                    setClassesdata(res.data.data);
                    setIsLoding(true);
                })
                .catch((error) => console.log(error))
        }
        */
        // teacher view api
        // setClassesdata([]);
        // setIsLoding(false);
        // if (location.pathname === "/online-class/view-class") {
        //     + classType?.id
        //     axiosInstance.get('?module_id=4&page_number=1&page_size=15&branch_ids=5&class_type=1')
        //     axiosInstance.get(`${endpoints.aol.cardData}?module_id=4&page_number=1&page_size=15&branch_ids=5&class_type=1`)
        //         .then((res) => {
        //             setClassesdata(res.data.data);
        //             setIsLoding(true);
        //         })
        //         .catch((error) => console.log(error))
        // }
    }



    const handleSelctedClass = (data) => {
        setItemSize(4);
        setSize(9);
        setClassData(data);
        if (!toggle) {
            //setToggledData([]);
        }
        // setToggledData(data);
        setSelected(data.id);
        if (isTabDivice) {
            // console.log('**** TAb *****');
        }
    }

    // pagination
    const [showPerPage, setShowPerPage] = React.useState(12);
    const [pagination, setPagination] = React.useState({
        start: 0,
        end: showPerPage,
    });

    const onPaginationChange = (start, end) => {
        setPagination({
            start: start,
            end: end
        });
    }

    // Filter start

    const handleTypeOfClass = (event, value) => {
        //setClassType('');
        if (value) {
            setClassType(value);
        }
    }

    const handleStartDate = (event, value) => {
        //setStartDate('');
        const isFutureTime = startDate > new Date();
        if (!isFutureTime) {
            setStartDate(value);
        }
    }

    const handleEndDate = (event, value) => {
        //setEndDate('');
        const isFutureTime = startDate > new Date();
        if (!isFutureTime) {
            setEndDate(value);
        }
    }
    const handleFilter = () => {
        getClasses();
        hendleCloseDetails();
    }

    const clearAll = () => {
        setStartDate([]);
        setEndDate([]);
        setClassType([]);
        setFilterData([])
        setClassesdata([])
        setToggledData([])
        setClassData('');
        setItemSize(3);
        setSize(12);
    }

    const handleToggle = () => {
        setToggle(!toggle);
        setClassesdata([]);
        setToggledData([]);
        if (!toggle) {
            setToggledData([]);
        }
        setClassData(null);
        setSelected();
    }

    const hendleCloseDetails = () => {
        setItemSize(3);
        setSize(12);
        setSelected(0);
        setClassData('');
        //setFilter(false);
    }

    if (reload) {
        getClasses();
        setReload(!reload)
    }

    console.log(totalCount, '====================')
    return (
        <>
            <div className='breadcrumb-container-create' style={{ marginLeft: '15px' }}>
                <CommonBreadcrumbs
                    componentName='Online Class'
                    childComponentName='AOL Class View'
                />
            </div>
            <Grid container spacing={4} className={classes.topFilter}>
                {/* <Grid item xs={12} sm={4}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        id="tags-outlined"
                        value={classType}
                        options={classTypeList}
                        getOptionLabel={(option) => option?.type}
                        filterSelectedOptions
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Type of Class"

                            />
                        )}
                        onChange={handleTypeOfClass}
                    />
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            size='small'
                            // disableToolbar
                            variant='dialog'
                            format='YYYY-MM-DD'
                            margin='none'
                            id='date-picker'
                            label='Start date'
                            value={startDate}
                            //defaultValue={new Date()}
                            onChange={handleStartDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            size='small'
                            // disableToolbar
                            variant='dialog'
                            format='YYYY-MM-DD'
                            margin='none'
                            id='date-picker'
                            label='End date'
                            value={endDate}
                            onChange={handleEndDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid> */}
                <Grid item xs={12} sm={4} >
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleBranch}
                        id='grade'
                        className='dropdownIcon'
                        value={filterData?.branch}
                        options={branchDrop}
                        getOptionLabel={(option) => option?.branch_name}
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
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleGrade}
                        id='volume'
                        className='dropdownIcon'
                        value={filterData?.grade}
                        options={gradeDropdown}
                        getOptionLabel={(option) => option?.grade__grade_name}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label='Grade'
                                placeholder='Grade'
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleCourse}
                        id='volume'
                        className='dropdownIcon'
                        value={filterData?.course}
                        options={courseDropdown}
                        getOptionLabel={(option) => option?.course_name}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label='Course'
                                placeholder='Course'
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleBatch}
                        id='batch'
                        className='dropdownIcon'
                        value={filterData?.batch}
                        options={batch}
                        getOptionLabel={(option) => option ? `1 : ${JSON.stringify(option.batch_size)}` : ''}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label='Batch Limit'
                                placeholder='Batch Limit'
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={MomentUtils}>
                        <DateRangePicker
                            startText='Select-date-range'
                            value={dateRangeTechPer}
                            onChange={(newValue) => {
                                setDateRangeTechPer(newValue);
                            }}
                            renderInput={({ inputProps, ...startProps }, endProps) => {
                                return (
                                    <>
                                        <TextField
                                            {...startProps}
                                            inputProps={{
                                                ...inputProps,
                                                value: `${inputProps.value} - ${endProps.inputProps.value}`,
                                                readOnly: true,
                                            }}
                                            size='small'
                                            style={{ minWidth: '100%' }}
                                        />
                                    </>
                                );
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        className='switchLabel'
                        control={
                            <Switch
                                checked={toggle}
                                onChange={handleToggle}
                                name="optional"
                                color="primary"
                            />}
                        label={toggle ? 'Yet To Start' : 'Started'}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={clearAll}
                    >
                        Clear All
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={handleFilter}
                    >
                        Get Classes
                    </StyledButton>
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={3} className={classes.root}>
                <Grid item sm={size} xs={12}>
                    <Grid container spacing={3}>
                        {classesData.length === 0 && toggledData.length === 0 && (
                            <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                                <img
                                    src={filterImage}
                                    alt='crash'
                                    height='250px'
                                    width='250px'
                                />
                                <Typography>
                                    Please select the filter to dislpay classes
                                </Typography>
                            </Grid>
                        )}
                        {classesData.length > 0 && classesData.map((data, id) => {
                            return (
                                <Grid item sm={itemSize} xs={12} key={id}>
                                    <ClassCard
                                        classData={data}
                                        selectedId={selected}
                                        handleSelctedClass={handleSelctedClass}
                                        toggle={toggle}
                                    />
                                </Grid>
                            )
                        })}
                        {toggledData.length > 0 && toggledData.map((data, id) => {
                            return (
                                <Grid item sm={itemSize} xs={12} key={id}>
                                    <ClassCard
                                        classData={data}
                                        selectedId={selected}
                                        handleSelctedClass={handleSelctedClass}
                                        toggle={toggle}
                                    />
                                </Grid>
                            )
                        })}

                    </Grid>
                </Grid>

                {classData && (
                    <Grid item sm={3} xs={12}>
                        <ClassdetailsCard
                            classData={classData}
                            filterData={filterData}
                            toggle={toggle}
                            reload={reload}
                            setReload={setReload}
                            hendleCloseDetails={hendleCloseDetails}
                        />
                    </Grid>
                )}
                {/*toggledData.length > 0 && (
                    <Grid item sm={3} xs={12}>
                        <ClassdetailsCard
                            toggledData={toggledData}
                            filterData={filterData}
                            toggle={toggle}
                            
                        />
                    </Grid>
                ) */}
            </Grid>
            {classesData?.length > 0 && (
                <div style={{ alignItems: 'center' }}>
                    <Pagination
                        onChange={handlePagination}
                        style={{ marginTop: 25, marginLeft: '38rem' }}
                        count={Math.ceil(totalCount / limit)}
                        color='primary'
                        page={page}
                    />
                </div>
            )}
            {toggledData?.length > 0 && (
                <div>

                    <Pagination
                        onChange={handlePagination}
                        style={{ marginTop: 25, marginLeft: '38rem' }}
                        count={Math.ceil(toggledData?.length / limit)}
                        color='primary'
                        page={page}
                    />
                </div>
            )}
        </>
    )
}

export default UpcomingClasses; 