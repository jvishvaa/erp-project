import React, { useState, useEffect } from 'react';
import { Divider, makeStyles, withStyles, Typography, Button } from '@material-ui/core';
import moment from 'moment';
import JoinClass from './JoinClass';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import AssignModal from './assign-modal';
import CloseIcon from '@material-ui/icons/Close';
import { Pointer } from 'highcharts';
import ReassignModal from './re-assign-modal';

const useStyles = makeStyles({
    classDetailsBox: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #F9D474',
        borderRadius: '10px',
    },
    classHeader: {
        minHeight: '64px',
        padding: '8px 8px 15px 15px',
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
        marginTop: '5px',
    },
    classHeaderTime: {
        display: 'inline-block',
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        float: 'right',
        marginTop: '5px',
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
    closeDetailCard: {
        float: 'right',
        fontSize: '30px',
        color: '#014B7E',
    },
})

const StyledButton = withStyles({
    root: {
        marginTop: '10px',
        height: '31px',
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
        height: '30px',
        width: '110px',
        padding: '0',
        fontSize: '18px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#ff6b6b',
        borderRadius: '5px',
        letterSpacing: 0,
        cursor: 'pointer'
    }
})(Button);

export default function ClassdetailsCardComponent(props) {
    const classes = useStyles({});
    // <<<<<<<<<<<>>>>>>>>>>>>MODAL >>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [teacherDropdown, setTeacherDropdown] = useState([])
    const [cancelFlag, setCancelFlag] = useState(false)
    // <<<<<<<<<<<<<<<<<<<<<<<Reassign Modal>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [openReassignModal,setOpenReassignModal] = useState(false)

    const assignData = props
    const [periodsData, setPeriodsData] = React.useState([]);
    //Periods date start
    const history = useHistory();


    // let isTeacher = props.classData && props.classData.hasOwnProperty('is_canceled');

    useEffect(() => {
        if (props.classData) {
            axiosInstance.get(`erp_user/${props?.classData?.id}/online-class-details/`)
                .then((res) => {
                    setPeriodsData(res.data.data);
                })
        }
    }, [props.classData, cancelFlag]);

    const handleAttendance = () => {
        history.push(`/aol-attendance-list/${props?.classData?.id}`);
    }


    const handleAssign = () => {
        setOpenAssignModal(true);
    }

    const handleReassign=()=>{
        setOpenReassignModal(true);
    }

    const handleReshuffle = () => {
        if (props.toggle) {
            history.push(`/aol-reshuffle/${props?.classData?.id}`)
        } else {
            history.push(`/aol-reshuffle/${props?.classData?.online_class?.aol_batch_id}`)

        }
    }
    const handleCoursePlan = () => {
        history.push(`/view-period/${props.filterData && props?.filterData?.course?.id}`)
    }

    useEffect(() => {
        axiosInstance.get(`${endpoints.aol.teacherList}?branch_id=${props?.filterData?.branch?.id}&grade_id=${props?.filterData?.grade?.grade_id}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setTeacherDropdown(result.data.data)
                }
            })
    }, [])
    console.log(props,'==============')
    return (
        <>
            <div className={classes.classDetailsBox}>
                <div className={classes.classHeader}>
                    <div>
                        <CloseIcon  onClick={(e) => props.hendleCloseDetails()} className={classes.closeDetailCard} />
                    </div>
                    {props.classData.online_class && (
                        <>

                            <div>
                                <Typography className={classes.classHeaderText}>
                                    {props.classData && props.classData.online_class && props.classData.online_class.title}
                                </Typography>
                                <Typography className={classes.classHeaderTime}>
                                    {props.classData && props.classData.online_class && moment(props.classData.online_class.start_time).format('h:mm:ss')}
                                </Typography>
                            </div>
                        </>
                    )}
                    <div>
                        {/* {props.classData.online_class && (
                            <Typography className={classes.classHeaderSub}>
                                {props.classData && props.classData.online_class.subject[0] && props.classData.online_class.subject[0].subject_name}
                            </Typography>
                        )} */}

                        <Typography className={classes.classHeaderSub}>
                            {props.toggle ? props.classData.batch_name : ''}
                            {props.toggle ? <StyledAcceptButton onClick={handleAssign}>ASSIGN</StyledAcceptButton> : <StyledAcceptButton onClick={handleReassign}>RE-ASSIGN</StyledAcceptButton>}
                        </Typography>
                    </div>
                </div>
                <div className={classes.classDetails}>
                    {props?.toggle ? '' :
                        <Typography className={classes.classDetailsTitle}>
                            Description
                        </Typography>
                    }

                    <Divider className={classes.classDetailsDivider} />
                    <div className={classes.joinClassDiv}>
                        {/* {props.toggle ? '' : periodsData.length > 0 && periodsData.map((data, id) => ( */}
                        {props.toggle ? '' :
                            periodsData.length > 0 && periodsData.map((data, id) => (

                                <JoinClass
                                    // key={id}
                                    // data={props.classData}
                                    data={data}
                                    joinUrl={props.classData?.presenter_url}
                                    cancelFlag={cancelFlag}
                                    setCancelFlag={setCancelFlag}
                                // isTeacher={isTeacher}
                                />
                            ))
                        }
                    </div>
                    <Divider className={classes.classDetailsDivider} />

                    {props.toggle === false ? (
                        <>
                            <StyledButton
                                onClick={handleAttendance}
                                color="primary"
                                fullWidth
                            >
                                Attendance
                            </StyledButton>
                            <StyledButton
                                onClick={handleReshuffle}
                                color="primary"
                                fullWidth
                            >
                                Reshuffle
                            </StyledButton>
                        </>
                    ) : (
                            <>
                                <StyledButton
                                    onClick={handleReshuffle}
                                    color="primary"
                                    fullWidth
                                >
                                    Reshuffle
                            </StyledButton>
                                {/* <StyledButton color="primary">Resources</StyledButton> */}
                            </>
                        )}
                    <StyledButton
                        color="primary"
                        onClick={handleCoursePlan}
                        fullWidth
                    >
                        View Course Plan
                    </StyledButton>
                </div>
            </div>
            <AssignModal
                openAssignModal={openAssignModal}
                setOpenAssignModal={setOpenAssignModal}
                teacherDropdown={teacherDropdown}
                assignData={assignData}
                reload={props.reload}
                setReload={props.setReload}
                hendleCloseDetails={props.hendleCloseDetails}
            />
            <ReassignModal
            openReassignModal={openReassignModal}
            setOpenReassignModal={setOpenReassignModal}
            teacherDropdown={teacherDropdown}
            selectedTeacher={props.classData.online_class.teacher}
            allData={props.classData}
            getClasses={props.getClasses}
            />
        </>
    )
}

export const ClassdetailsCard = React.memo(ClassdetailsCardComponent);
