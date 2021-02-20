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
import Pagination from '../../../components/Pagination';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectFilter from '../../../assets/images/selectfilter.svg';
import Filter from './components/filters';

const useStyles = makeStyles((theme) => ({
    root: {
        //margin: '20px 200px 50px 70px',
        margin: '55px auto 20px auto',
        width: '90%',
        border: '1px solid #D8D8D8',
        borderRadius: '5px',
        [theme.breakpoints.down('xs')]: {
            margin: '50px 20px 20px 20px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '55px 40px 20px 40px',
        },
    },
    topFilter: {
        width: '90%',
        margin: '30px auto 0px auto',
        [theme.breakpoints.down('xs')]: {
            margin: '55px 20px 20px 20px',
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
    },
    selectFilterGrid: {
        height: '400px',
        justifyContent: 'center',
    },
    unfilteredImg: {
        display: 'block',
        height: '50%',
        margin: 'auto',
        marginTop: '20px',
    },
    unfilteredTextImg: {
        display: 'block',
        marginTop: '10px',
        margin: 'auto',
    }
}));


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
    const [resourceOnlineClasses, setResourceOnlineClasses] = React.useState([]);
    /**
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
       */

    const handleSelctedClass = (data) => {
        setItemSize(4);
        setSize(8);
        setResourceData(data);
        setSelected(data.id);
    }

    const hendleCloseDetails = () => {
        setItemSize(3);
        setSize(12);
        setResourceData('');
        setSelected(0);
    }

    // pagination
    const [ showPerPage, setShowPerPage ] = React.useState(12);
    const [ pagination, setPagination ] = React.useState({
        start: 0,
        end: showPerPage,
    });

    const onPaginationChange = (start, end) => {
        setPagination({
            start: start,
            end: end
        });
    }
    const getResourceData = (data) => {
        setResourceOnlineClasses(data);
    }

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
                    <Filter getResourceData={getResourceData}/>
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={3} className={classes.root}>
                <Grid item sm={size} xs={12}>
                    <Grid container spacing={3}>
                        {/* !isLoding ? ( <Loader /> ) : (classCardData) */}
                        {resourceOnlineClasses.length > 0 && resourceOnlineClasses.slice(pagination.start, pagination.end).map((data, id) => (
                            <Grid item sm={itemSize} xs={12} key={id}>
                                <ResourceCard
                                    resourceData={data}
                                    selectedId={selected}
                                    handleSelctedClass={handleSelctedClass}
                                />
                            </Grid>
                        ))}
                        {resourceOnlineClasses.length === 0 && (
                            <Grid item xs={12} className={classes.selectFilterGrid}>
                                <img
                                    src={unfiltered}
                                    alt="unFilter"
                                    className={classes.unfilteredImg}
                                />
                                <img
                                    src={selectFilter}
                                    alt="unFilter"
                                    className={classes.unfilteredTextImg}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {resourceData && resourceOnlineClasses.length !== 0 && (
                    <Grid item sm={4} xs={12}>
                        <ResourceDetailsCard resourceData={resourceData} hendleCloseDetails={hendleCloseDetails}/>
                    </Grid>
                )}
            </Grid>
            {resourceOnlineClasses.length > showPerPage && (
                <div>
                    <Pagination
                        showPerPage={showPerPage}
                        onPaginationChange={onPaginationChange}
                        totalCategory={resourceOnlineClasses.length}
                    />
                </div>
            )}
        </>
    )
}

export default Resources;
