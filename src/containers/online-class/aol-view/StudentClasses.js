import React from 'react';
import ClassCard from './ClassCard';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField } from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import ClassdetailsCard from './ClassdetailCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Pagination from './Pagination';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Loader from '../../../components/loader/loader';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        //margin: '20px 200px 50px 70px',
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

const StudentClasses = () => {
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
        { id: 1, type: 'Optional Class' },
        { id: 2, type: 'Special Class' },
        { id: 3, type: 'Parent Class' },
    ]
    );

    const [classType, setClassType] = React.useState('');
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [isLoding, setIsLoding] = React.useState(false);
    //const [startDate, setStartDate] = React.useState(moment(date).format('YYYY-MM-DD'));
    //const [endDate, setEndDate] = React.useState(moment(date).format('YYYY-MM-DD'));

    const themeContext = useTheme();
    const isTabDivice = useMediaQuery(themeContext.breakpoints.down('sm'));

    //api call
    const getClasses = () => {
        // student view api
        console.log(location.pathname);
        setClassesdata([]);
        setIsLoding(false);
        //if (location.pathname === "/online-class/attend-class") {
            // axiosInstance.get('erp_user/student_online_class/?user_id=78&page_number=1&page_size=15')
                // .then((res) => {
                //     setClassesdata(res.data.data);
                //     setIsLoding(true);
                // })
                // .catch((error) => console.log(error))
        //}
        // teacher view api
        /*
        setClassesdata([]);
        setIsLoding(false);
        if (location.pathname === "/online-class/view-class") {
            axiosInstance.get('erp_user/teacher_online_class/?module_id=4&page_number=1&page_size=15&branch_ids=5&class_type=' + classType?.id)
                .then((res) => {
                    setClassesdata(res.data.data);
                    setIsLoding(true);
                })
                .catch((error) => console.log(error))
        }
        */
    }
    if (!apiCall) {
        getClasses();
        setApiCall(true);
    }

    const handleSelctedClass = (data) => {
        console.log(data);
        setItemSize(4);
        setSize(9);
        setClassData(data);
        setSelected(data.id);

        console.log('TAb : ' + isTabDivice);
        if (isTabDivice) {
            console.log('**** TAb *****');
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
    }

    const clearAll = () => {
        setStartDate(null);
        setEndDate(null);
        setClassType(null);
        getClasses();
    }


    const classCardData = classesData && classesData.slice(pagination.start, pagination.end).filter((data) => {
        const classData = data.zoom_meeting ? data.zoom_meeting : data;
        if (startDate === null && endDate === null) {
            return data;
        }
        else if (startDate === moment(classData.online_class && classData.online_class.start_time).format('YYYY-MM-DD') && endDate === moment(classData.online_class && classData.online_class.end_time).format('YYYY-MM-DD')) {
            return data;
        }
    }).map((data, id) => {
        return (
            <Grid item sm={itemSize} xs={12} key={id}>
                <ClassCard
                    classData={data}
                    selectedId={selected}
                    handleSelctedClass={handleSelctedClass}
                />
            </Grid>
        )
    });

    return (
        <>
            <div className='breadcrumb-container-create' style={{ marginLeft: '15px' }}>
                <CommonBreadcrumbs
                    componentName='Online Class'
                    childComponentName='AOL Class View'
                />
            </div>
            <Grid container spacing={4} className={classes.topFilter}>
                <Grid item xs={12} sm={4}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
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
                </Grid>
                <Grid item>
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
                        {!isLoding ? (<Loader />) : (classCardData)}
                    </Grid>
                </Grid>

                {classData && (
                    <Grid item sm={3} xs={12}>
                        <ClassdetailsCard classData={classData} />
                    </Grid>
                )}
            </Grid>
            {classesData.length > showPerPage && (
                <div>
                    <Pagination
                        showPerPage={showPerPage}
                        onPaginationChange={onPaginationChange}
                        totalCategory={classesData.length}
                    />
                </div>
            )}
        </>
    )
}

export default StudentClasses; 