import React, { useState, useEffect } from 'react';
import { Divider, makeStyles, withStyles, Typography, Button } from '@material-ui/core';
//import AttachmentIcon from '../components/icons/AttachmentIcon';
import moment from 'moment';
import JoinClass from './JoinClass';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import AssignModal from './assign-modal';

const useStyles = makeStyles({
    classDetailsBox: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #F9D474',
        borderRadius: '10px',
    },
    classHeader: {
        minHeight: '64px',
        padding: '8px 15px',
        backgroundColor: '#F9D474',
        borderRadius: '10px 10px 0px 0px',
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
        padding: '8px 15px',
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
        maxHeight: '415px',
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

const OutlineButton = withStyles({
    root: {
        marginTop: '12px',
        height: '31px',
        width: '100%',
        fontSize: '15px',
        fontFamily: 'Poppins',
        fontWeight: '',
        lineHeight: '27px',
        letterSpacing: 0,
        textTransform: 'capitalize',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        border: '1px solid #FFAF71',
        padding: '0px',
    }
})(Button);

const StyledButton = withStyles({
    root: {
        marginTop: '16px',
        marginLeft: '1rem',
        height: '31px',
        width: '100%',
        fontSize: '18px',
        fontFamily: 'Poppins',
        fontWeight: '',
        lineHeight: '27px',
        textTransform: 'capitalize',
        backgroundColor: '#FFAF71',
        borderRadius: '10px',
        '& :hover': {
        },
    }
})(Button);


const StyledAcceptButton = withStyles({
    root: {
        height: '2rem',
        width: '80px',
        padding: '0',
        fontSize: '18px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#ff6b6b',
        borderRadius: '5px',
        letterSpacing: 0,
    }
})(Button);

export default function ClassdetailsCardComponent(props) {
    const classes = useStyles({});
    // <<<<<<<<<<<>>>>>>>>>>>>MODAL >>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [teacherDropdown, setTeacherDropdown] = useState([])


    const [periodsData, setPeriodsData] = React.useState([]);
    //Periods date start
    const history = useHistory();

    
    let isTeacher =  props.classData && props.classData.hasOwnProperty('is_canceled');
    console.log(isTeacher,'==========')

    useEffect(() => {
        if(props.classData){
            axiosInstance.get(`erp_user/${props.classData.id}/online-class-details/`)
            .then((res) => {
                // console.log(res);
                setPeriodsData(res.data.data);
            })
        }       
    }, []);



    const handleAttendance = () => {
        history.push(`/aol-attendance-list/${props.classData.id}`);
    }


    const handleAssign = () => {
        setOpenAssignModal(true);
    }

    const handleReshuffle = () => {
        history.push(`/aol-reshuffle/${props.classData.online_class.aol_batch.id}`)
    }

    useEffect(() => {
        axiosInstance.get(`${endpoints.aol.teacherList}?branch_id=${props.filterData.branch.id}&grade_id=${props.filterData.grade.grade_id}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setTeacherDropdown(result.data.data)
                }
            })
    }, [])

    return (
        <>
            <div className={classes.classDetailsBox}>
                <div className={classes.classHeader}>
                    <div>
                        <Typography className={classes.classHeaderText}>
                            {props.classData && props.classData.online_class && props.classData.online_class.title}
                        </Typography>
                        <Typography className={classes.classHeaderTime}>
                            {props.classData && props.classData.online_class && moment(props.classData.join_time).format('h:mm:ss')}
                        </Typography>
                    </div>
                    <div>
                        <Typography className={classes.classHeaderSub}>
                            {props.classData && props.classData.online_class && props.classData.online_class.subject[0].subject_name}
                        </Typography>
                        {/* <StyledAcceptButton onClick={handleAssign}>ASSIGN</StyledAcceptButton> */}
                        {props.toggle ? <StyledAcceptButton onClick={handleAssign}>ASSIGN</StyledAcceptButton> : null}
                        {/* <Typography className={classes.subPeriods}>{periods + 1} periods</Typography> */}
                    </div>
                </div>
                <div className={classes.classDetails}>

                    <Typography className={classes.classDetailsTitle}>
                        Description
                </Typography>
                    <Divider className={classes.classDetailsDivider} />
                    <div className={classes.joinClassDiv}>
                        {props.toggle? '': periodsData !== undefined && periodsData.map((data, id) => (
                            <JoinClass
                                key={id}
                                data={data}
                                joinUrl={props.classData.join_url}
                                isTeacher={isTeacher}
                            />
                        ))}
                    </div>
                    <Divider className={classes.classDetailsDivider} />

                    {isTeacher ? (
                        <>
                            <StyledButton
                                onClick={handleAttendance}
                                color="primary"
                            >
                                Attendance
                    </StyledButton>
                            <StyledButton
                                onClick={handleReshuffle}
                                color="primary"
                            >
                                Reshuffle
                    </StyledButton>
                        </>
                    ) : (
                            <StyledButton color="primary">Resources</StyledButton>
                        )}
                    <StyledButton
                        color="primary">
                        View lesson plan
                </StyledButton>
                </div>
            </div>
            <AssignModal
                openAssignModal={openAssignModal}
                setOpenAssignModal={setOpenAssignModal}
                teacherDropdown={teacherDropdown}
            />
        </>
    )
}

export const ClassdetailsCard = React.memo(ClassdetailsCardComponent);