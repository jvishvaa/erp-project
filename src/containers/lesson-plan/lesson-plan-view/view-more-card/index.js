import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more.css';
import endpoints from '../../../../config/endpoints';
import download from '../../../../assets/images/download.svg';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from '../../../../components/attachment-previewer/attachment-previewer-contexts';


const ViewMoreCard = ({ viewMoreData, setViewMore, filterDataDown, periodDataForView, completedStatus, setSelectedIndex, setLoading, centralGradeName, centralSubjectName, setCompletedStatus }) => {
    const themeContext = useTheme();
    const { openPreview, closePreview } = React.useContext(AttachmentPreviewerContext) || {};
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const { setAlert } = useContext(AlertNotificationContext);
    const [onComplete, setOnComplete] = useState(false);
    const location = useLocation();
    const {
        year: { session_year, id: yearId },
        grade: { grade__grade_name, id: gradeId },
        subject: { subject_name, id: subjectId },
        chapter: { chapter_name, id: chapterId },
        volume: { volume_name, id: volumeId }
    } = filterDataDown;

    const handleComplete = () => {
        setLoading(true);
        let request = {
            "academic_year": session_year,
            "academic_year_id": yearId,
            "volume_id": volumeId,
            "volume_name": volume_name,
            "subject_id": subjectId,
            "chapter_id": chapterId,
            "chapter_name": chapter_name,
            "central_gs_mapping_id": viewMoreData[0]?.mapping_id,
            "period_id": periodDataForView?.id,
        };
        axiosInstance.post(`${endpoints.lessonPlan.periodCompleted}`, request)
            .then(result => {
                if (result.data.status_code === 200) {
                    setAlert('success', result.data.message);
                    setCompletedStatus(result.data.result.is_completed)
                    // setOnComplete(result.data.result.is_completed);
                } else {
                    setAlert('error', result.data.message);
                    // setOnComplete(false);
                }
                setLoading(false);
            })
            .catch(error => {
                setAlert('error', error.message);
                // setOnComplete(false);
                setLoading(false);
            })
    }

    const handleBulkDownload = () => {
        const formData = new FormData();
        formData.append('academic_year', session_year);
        formData.append('volume', volume_name);
        formData.append('grade', centralGradeName);
        formData.append('subject', centralSubjectName);
        formData.append('chapter', chapter_name);
        formData.append('period', periodDataForView?.period_name);
        axios.post(`${endpoints.lessonPlan.bulkDownload}`, formData, {
            headers: {
                'x-api-key': 'vikash@12345#1231',
            }
        }).then(result => {
            if (result.data.status_code === 200) {
                let a = document.createElement("a");
                if (result.data.result) {
                    a.href = result.data.result;
                    a.click();
                    a.remove();
                } else {
                    setAlert('error', 'Nothing to download!');
                }
            } else {
                setAlert('error', result.data.description);
            }
        })
            .catch(error => {
                setAlert('error', error.message);
            })
    }

    // const getS3DomainURL = (file, p)=>{
    //     `${endpoints.lessonPlan.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${centralGradeName}/${centralSubjectName}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`
    //     return `${endpoints.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${grade_name}/${subject_name}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${fileSrc}`
    // }


    return (
        <Paper className="rootViewMore">
            <div className="viewMoreHeader">
                <div className="leftHeader">
                    <div className="headerTitle">
                        {periodDataForView?.period_name}
                    </div>
                    <div className="headerContent">
                        {filterDataDown?.chapter?.chapter_name}
                    </div>
                </div>
                <div className="rightHeader">
                    <div className="headerTitle closeIcon">
                        <IconButton
                            onClick={() => {
                                setViewMore(false);
                                setSelectedIndex(-1);
                            }}
                        >
                            <CloseIcon color='primary' />
                        </IconButton>
                    </div>
                    <div className="headerContent">
                        {completedStatus &&
                            <div className="lessonCompleted">Lesson Completed</div>}
                    </div>
                </div>
            </div>
            <div className="resourceBulkDownload">
                <div>Resources</div>
                {/* <div className="downloadAllContainer">
                    <div className="downloadAllIcon">
                        <IconButton onClick={handleBulkDownload} className="bulkDownloadIconViewMore">
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ height: '21px', width: '21px' }}
                                        src={downloadAll}
                                        alt='downloadAll'
                                    />
                                )}
                            />
                        </IconButton>
                    </div>
                    <div className="downloadAllText">
                        Download All
                    </div>
                </div> */}
            </div>

            {viewMoreData?.map(p => (
                <div className="viewMoreBody">
                    <div className="bodyTitle">
                        {p?.document_type}
                    </div>
                    <div className="scrollableContent">
                        {p.media_file.map(file => (
                            <div className="bodyContent">
                                <div>{file}</div>
                                <div>
                                    <a 
                                    // href={`${endpoints.lessonPlan.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${centralGradeName}/${centralSubjectName}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`} 
                                    onClick={
                                        ()=>{
                                            openPreview({
                                                currentAttachmentIndex:0,
                                                attachmentsArray: [
                                                    {
                                                        // src: getS3DomainURL(file, p),
                                                        // src: `${endpoints.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${grade_name}/${subject_name}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`,
                                                        src: `${endpoints.lessonPlan.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${centralGradeName}/${centralSubjectName}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`,
                                                        name: `${p?.document_type}`,
                                                        extension: '.' + file.split('.')[file.split('.').length-1],
                                                    }
                                                ]
                                            })
                                        }
                                    }
                                    rel="noopener noreferrer"
                                    target="_blank">
                                        <SvgIcon
                                            component={() => (
                                                // <img
                                                //     style={{ height: '21px', width: '21px' }}
                                                //     src={download}
                                                //     alt='download'
                                                // />
                                                <VisibilityIcon />
                                            )}
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {location.pathname === "/lesson-plan/teacher-view" &&
                <>
                    {!completedStatus &&
                        <div key={`btn-div-${periodDataForView?.id}`} className="completed_button_view_more">
                            <Button
                                key={`btn-${periodDataForView?.id}`} 
                                variant='contained'
                                style={{ color: 'white' }}
                                color="primary"
                                className="custom_button_master modifyDesign"
                                size='small'
                                onClick={handleComplete}
                            >
                                Completed
                                </Button>
                        </div>}
                </>}
        </Paper>
    );
}

export default ViewMoreCard;