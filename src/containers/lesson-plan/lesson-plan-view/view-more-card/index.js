import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { IconButton, SvgIcon, Button, makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({
  rootViewMore: theme.rootViewMore,
}));

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  filterDataDown,
  periodDataForView,
  completedStatus,
  setSelectedIndex,
  setLoading,
  centralGradeName,
  centralSubjectName,
  setCompletedStatus,
}) => {
  const classes = useStyles();
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [onComplete, setOnComplete] = useState(false);
  const location = useLocation();
  const {
    year: yearData = {},
    grade: gradeData = {},
    subject: subjectData = {},
    chapter: chapterData = {},
    volume: volumeData = {},
  } = filterDataDown;
  const { session_year = '', id: yearId = '' } = yearData || {};
  const { grade__grade_name = '', id: gradeId = '' } = gradeData || {};
  const {
    subject_name = '',
    id: subjectMappingId = '',
    subject_id: subjectId = '',
  } = subjectData || {};
  const { chapter_name = '', id: chapterId = '' } = chapterData || {};
  const { volume_name = '', id: volumeId = '' } = volumeData || {};

  const handleComplete = () => {
    setLoading(true);
    let request = {
      academic_year: session_year,
      academic_year_id: yearId,
      volume_id: volumeId,
      volume_name: volume_name,
      subject_id: subjectId,
      chapter_id: chapterId,
      chapter_name: chapter_name,
      central_gs_mapping_id: viewMoreData[0]?.mapping_id,
      period_id: periodDataForView?.id,
    };
    axiosInstance
      .post(`${endpoints.lessonPlan.periodCompleted}`, request)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setCompletedStatus(result?.data?.result?.is_completed);
          // setOnComplete(result.data.result.is_completed);
        } else {
          setAlert('error', result?.data?.message);
          // setOnComplete(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        // setOnComplete(false);
        setLoading(false);
      });
  };

  return (
    <Paper className={classes.rootViewMore}>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          <div className='headerTitle'>{periodDataForView?.period_name}</div>
          <div className='headerContent'>{filterDataDown?.chapter?.chapter_name}</div>
        </div>
        <div className='rightHeader'>
          <div className='headerTitle closeIcon'>
            <IconButton
              onClick={() => {
                setViewMore(false);
                setSelectedIndex(-1);
              }}
            >
              <CloseIcon color='primary' />
            </IconButton>
          </div>
          <div className='headerContent'>
            {completedStatus && <div className='lessonCompleted'>Lesson Completed</div>}
          </div>
        </div>
      </div>
      <div className='resourceBulkDownload'>
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

      {viewMoreData?.map((p) => (
        <div className='viewMoreBody'>
          <div className='bodyTitle'>{p?.document_type}</div>
          <div>
            {p.media_file.map((file) => (
              <div className='bodyContent'>
                <div>{(file || '-/No file').split('/').splice(-1)[0]}</div>
                <div>
                  <a
                    // href={`${endpoints.lessonPlan.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${centralGradeName}/${centralSubjectName}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`}
                    onClick={() => {
                      openPreview({
                        currentAttachmentIndex: 0,
                        attachmentsArray: [
                          {
                            // src: getS3DomainURL(file, p),
                            // src: `${endpoints.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${grade_name}/${subject_name}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`,
                            // src: `${endpoints.lessonPlan.s3}dev/lesson_plan_file/${session_year}/${volume_name}/${centralGradeName}/${centralSubjectName}/${chapter_name}/${periodDataForView?.period_name}/${p?.document_type}/${file}`,
                            src: `${endpoints.lessonPlan.s3}${file}`,
                            name: `${p?.document_type}`,
                            extension: '.' + file.split('.')[file.split('.').length - 1],
                          },
                        ],
                      });
                    }}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
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
      {location.pathname === '/lesson-plan/teacher-view' && (
        <>
          {!completedStatus && (
            <div
              key={`btn-div-${periodDataForView?.id}`}
              className='completed_button_view_more'
            >
              <Button
                key={`btn-${periodDataForView?.id}`}
                variant='contained'
                style={{color:'white', width: '100%' }}
                color='primary'
                size='small'
                onClick={handleComplete}
              >
                Completed
              </Button>
            </div>
          )}
        </>
      )}
    </Paper>
  );
};

export default ViewMoreCard;
