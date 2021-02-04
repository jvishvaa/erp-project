import React, {useContext} from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Loader from '../../../components/loader/loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ResourceCard from './resourceCard';
import ResourceDetailsCard from './resourceDetailsCard';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField } from '@material-ui/core';
import Layout from '../../Layout/index';
import ResourceFilter from './components/resourceFilter';
import { OnlineclassViewContext } from '../online-class-context/online-class-state';

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

const Resources = () => {
    const classes = useStyles({});
    const [ startDate, setStartDate ] = React.useState(null);
    const [ endDate, setEndDate ] = React.useState(null);
    const [ selected, setSelected ] = React.useState(0);
    const [ itemSize, setItemSize ] = React.useState(3);
    const [ size, setSize ] = React.useState(12);
    const [ resourceData, setResourceData ] = React.useState();

    const {
        resourceView: {
          resourceOnlineClasses,
          totalPages,
          loadingResourceOnlineClasses,
          currentPage,
          count,
        },
        setResourcePage,
      } = useContext(OnlineclassViewContext);

    console.log(resourceOnlineClasses);

    const handleTypeOfClass = () => {
    }
    const handleStartDate = () => {
    }
    const handleEndDate = () => {
    }
    const handleFilter = () => {
    }
    const clearAll = () => {

    }

    const handleSelctedClass = (data) => {
        //console.log(data);
        setItemSize(4);
        setSize(8);
        setResourceData(data);
        setSelected(0);
    }

    /* 
    
    const classCardData = classesData && classesData.slice(pagination.start, pagination.end).filter((data) => {
        const classData =  data.zoom_meeting ?  data.zoom_meeting :  data;
        if(startDate === null && endDate === null){
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
        )});

    */

   const [ classTypeList, setClassTypeList ] = React.useState([
        { id: 0, type: 'Compulsory Class' },
        { id: 1, type: 'Optional Class' },
        { id: 2, type: 'Special Class' },
        { id: 3, type: 'Parent Class' },
    ]);
    const [ classType, setClassType ] = React.useState('');
    return (
        <>
                <div className='breadcrumb-container-create' style={{ marginLeft: '15px'}}>
                    <CommonBreadcrumbs
                        componentName='Online Class'
                        childComponentName='Resources'
                    />
                </div>
                <Grid container spacing={4} className={classes.topFilter}>
                    <Grid item xs={12}>
                        <ResourceFilter />
                    </Grid>
                    {/** 
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
                    */}
                </Grid>
                <Divider />
                <Grid container spacing={3} className={classes.root}>
                    <Grid item sm={size} xs={12}>
                        <Grid container spacing={3}>
                            {/* !isLoding ? ( <Loader /> ) : (classCardData) */}
                            {resourceOnlineClasses && resourceOnlineClasses.map((data, id) => (
                                <Grid item sm={itemSize} xs={12} key={id}>
                                    <ResourceCard
                                        resourceData={data}
                                        selectedId={selected}
                                        handleSelctedClass={handleSelctedClass}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {resourceData && (
                        <Grid item sm={4} xs={12}>
                            <ResourceDetailsCard resourceData={resourceData}/>
                        </Grid>
                    )}
                </Grid>
        </>
    )
}

export default Resources;