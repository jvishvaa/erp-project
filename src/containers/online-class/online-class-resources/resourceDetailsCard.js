import React from 'react';
import { Divider, makeStyles, withStyles, Typography, Button } from '@material-ui/core';
//import AttachmentIcon from '../components/icons/AttachmentIcon';
import moment from 'moment';
import ResourceClass from './resourceClass';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ResourceDialog } from './resourceDialog';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CloseIcon from '@material-ui/icons/Close';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
//import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const useStyles = makeStyles({
    classDetailsBox: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #F9D474',
        borderRadius: '5px',
    },
    classHeader: {
        minHeight: '64px',
        padding: '8px 15px',
        backgroundColor: '#F9D474',
        borderRadius: '5px 5px 0px 0px',
    },
    classHeaderText: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        lineHeight: '25px',
    },
    closeDetailCard: {
        float: 'right',
        fontSize: '20px',
        color: '#014B7E',
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
        width: '140px',
        overflowWrap: 'break-word',
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
        padding: '8px 10px',
        backgroundColor: '#FFFFFF',
        borderRadius: '0px 0px 10px 10px',
    },
    classDetailsTitle: {
        marginTop: '10px',
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        lineHeight: '25px',
    },
    classDetailsDivider: {
        color: '#014B7E',
        marginBottom: '10px',
    },
    joinClassDiv: {
        height: '320px',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    classDetailsDescription: {
        display: 'inline-block',
        height: '50px',
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        overflow: 'hidden',
    },
})

const StyledButton = withStyles({
    root: {
        marginTop: '6px',
        height: '31px',
        width: '100%',
        fontSize: '18px',
        fontFamily: 'Poppins',
        fontWeight: '',
        lineHeight: '27px',
        textTransform: 'capitalize',
        backgroundColor: '#ff6b6b',
        borderRadius: '10px',
    }
})(Button);

export default function ResourceDetailsCardComponent(props) {
    const classes = useStyles({});
    const location = useLocation();
    const { setAlert } = React.useContext(AlertNotificationContext);
    const [noOfPeriods, setNoOfPeriods] = React.useState([]);

    //Periods date start
    const startDate = new Date(props.resourceData.online_class.start_time);
    const endDate = new Date(props.resourceData.online_class.end_time);
    const Difference_In_Time = endDate.getTime() - startDate.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let periods;
    if(moment(startDate).format('ll') === moment(endDate).format('ll')) {
        periods = 0;
    }
    else {
        periods = Math.floor(Difference_In_Days + 1);
    }
    //console.log(startDate.setDate(startDate.getDate() + 1));

    let dateArray = [];
    for(var i = 0; i <= periods; i++){
        let day;
        if(i === 0) {
            day = startDate.setDate(startDate.getDate());
        }
        else {
            day = startDate.setDate(startDate.getDate() + 1);
        }
        dateArray.push(day);
        //console.log(moment(day).format('ll'));
    }
    ////Periods date end
/**
    React.useEffect(() => {
        const params = {
            online_class_id: props.resourceData.id,
            class_date: '31-01-2021'
        };
        axiosInstance.get(endpoints.onlineClass.resourceFile,params)
        .then((res) => {
            console.log(res.data);
            //setPeriodsData(res.data.data);
        })
        .catch((error) => console.log(error))
    },[]);
 */
    // resource module
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    React.useEffect(() => {
        if (props.resourceData) {
            setNoOfPeriods([]);
            axiosInstance
            .get(`erp_user/${props.resourceData && props.resourceData.id}/online-class-details/`)
            .then((res) => {
              //console.log(res.data );
              setNoOfPeriods(res.data.data);
            })
            .catch((error) => setAlert('error', error.message));
        }
    }, [props.resourceData]);

    return (
        <div className={classes.classDetailsBox}>
            <div className={classes.classHeader}>
                <div>
                    <Typography className={classes.classHeaderText}>
                        {props.resourceData.online_class.title}
                    </Typography>
                    <CloseIcon  onClick={(e) => props.hendleCloseDetails() } className={classes.closeDetailCard}/>
                </div>
            </div>
            <div className={classes.classDetails}>
                <div className={classes.joinClassDiv}>
                    { noOfPeriods && noOfPeriods.length > 0 && noOfPeriods.map((data) => (
                        <ResourceClass
                            key={data.zoom_id}
                            date={data.date}
                            resourceId={props.resourceData.online_class.id}
                        />
                    ))}
                    {/*dateArray && dateArray.length > 0 && dateArray.map((date, id) => (
                        <ResourceClass
                            key={id}
                            date={date}
                            resourceId={props.resourceData.online_class.id}
                        />
                    ))*/}
                </div>
            </div>
            <ResourceDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                title={props.resourceData.online_class.title}
                resourceId={props.resourceData.online_class.id}
                startDate={props.resourceData.online_class.start_time}
                endDate={props.resourceData.online_class.end_time}
                hendleCloseDetails={props.hendleCloseDetails}
            />
        </div>
    )
}

export const ResourceDetailsCard = React.memo(ResourceDetailsCardComponent);