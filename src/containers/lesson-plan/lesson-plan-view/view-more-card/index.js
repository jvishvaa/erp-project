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
import axiosInstance from '../../../../config/axios'

const ViewMoreCard = ({ viewMoreData, setViewMore, filterDataDown, periodDataForView, bulkDownloadPath, completedStatus }) => {
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const { setAlert } = useContext(AlertNotificationContext);
    const [onComplete, setOnComplete] = useState(false);
    const {
        year: { session_year, id: yearId },
        grade: { grade__grade_name, id: gradeId },
        subject: { subject_name, id: subjectId },
        chapter: { chapter_name, id: chapterId },
        volume: { volume_name, id: volumeId }
    } = filterDataDown;

    const handleComplete = () => {
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
                    setOnComplete(result.data.result.is_completed);
                } else {
                    setAlert('error', result.data.message);
                    setOnComplete(false);
                }
            })
            .catch(error => {
                setAlert('error', error.message);
                setOnComplete(false);
            })
    }

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
                            onClick={() => setViewMore(false)}
                        >
                            <CloseIcon color='primary' />
                        </IconButton>
                    </div>
                    <div className="headerContent">
                        {(onComplete || completedStatus) &&
                            <div className="lessonCompleted">Lesson Completed</div>}
                    </div>
                </div>
            </div>
            <div className="resourceBulkDownload">
                <div>Resources</div>
                <div className="downloadAllContainer">
                    <div className="downloadAllIcon">
                        <a href={bulkDownloadPath} target="_blank">
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ height: '21px', width: '21px' }}
                                        src={downloadAll}
                                        alt='downloadAll'
                                    />
                                )}
                            />
                        </a>
                    </div>
                    <div className="downloadAllText">
                        Download All
                    </div>
                </div>
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
                                    <a href={`${endpoints.s3}lesson_plan/${file}/`} target="_blank">
                                        <SvgIcon
                                            component={() => (
                                                <img
                                                    style={{ height: '21px', width: '21px' }}
                                                    src={download}
                                                    alt='download'
                                                />
                                            )}
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {!completedStatus && !onComplete &&
                <div className="completed_button_view_more">
                    <Button
                        variant='contained'
                        style={{ color: 'white' }}
                        color="primary"
                        className="custom_button_master"
                        size='small'
                        onClick={handleComplete}
                    >
                        Completed
                </Button>
                </div>}
        </Paper>
    );
}

export default ViewMoreCard;