import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more.css';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { ExpandLessOutlined } from '@material-ui/icons';
import {Context} from '../context/context'

const ViewMoreDailyDairyCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
  grade,
  branch,
  section,
}) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);
  //const sectionId = viewMoreData.section[0].id ?? '';
  //const gradeId =  viewMoreData.grade.id ?? 0;
  console.log(grade +" === "+ section);
  console.log(viewMoreData.grade);
  const handleBulkDownload = () => {
    const formData = new FormData();
    // formData.append('branch',[5]);
    // formData.append('grade',[54]);
    // formData.append('section',[75])
    // formData.append('academic_year', session_year);
    // formData.append('volume', volume_name);
    // formData.append('grade', grade_name);
    // formData.append('subject', subject_name);
    // formData.append('chapter', chapter_name);
    // formData.append('period', periodDataForView?.period_name);
    axiosInstance
      .post(`${endpoints.circular.fileUpload}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          let a = document.createElement('a');
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
      .catch((error) => {
        setAlert('error', error.message);
      });
  };
  // const pic=viewMoreData?.media?.map(a=>a)
  console.log(viewMoreData, '=====');
  const pic=viewMoreData?.documents?.map(a=>a)

  return (
    <>
      <Paper className='rootViewMore'>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData.subject.subject_name}</div>
            <div style={{align:'left'}}>
              Created On:
            </div>
            <div style={{align:'left'}}>
            {viewMoreData.created_at.substring(0, 10)}
            </div>

            {/* <div className='headerContent'>{periodDataForView?.section_name}</div> */}
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
            {/* <div className='headerContent'>
          <IconButton
           onClick={handleBulkDownload}
           style={{fontSize:'1.1rem',color:'#ff6b6b'}}
            className="bulkDownloadIconViewMore">
              <a  target='_blank' href={`${endpoints.s3}/dev/circular_files/${branch.branch_name}/${pic}`}>
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
                            Download All Attachments
                        </IconButton>
          </div> */}
          </div>
        </div>
        <div>
          <div className='bodyTitle'>Recap of previous class</div>
          <Divider className='titleDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.previous_class}</div>
          <div className='bodyTitle'>Details of classwork</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.class_work}</div>
          <div className='bodyTitle'>Summary</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.summary}</div>
          <div className='bodyTitle'>Tools Used</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.tools_used}</div>
          <div className='bodyTitle'>Homework</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.homework}</div>
          <div className='bodyTitle'>Media</div>
          {/* <div className='mediaBody'>xxxxxxxx</div> */}

          <IconButton
          //  onClick={handleBulkDownload} dev/dairy/ORCHIDS/54/59/2021-02-08 18:21:57.036513_Group 7767.png  || dev/dairy/ORCHIDS/${gradeId}/${sectionId}/${pic}
            style={{fontSize:'1.1rem',color:'#ff6b6b',paddingLeft:'5%',marginTop:'3%'}}
            className="bulkDownloadIconViewMore"
          >
            <a  target='_blank' href={`${endpoints.s3}/dev/dairy/ORCHIDS/54/59/2021-02-08 18:21:57.036513_Group 7767.png`}>
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
            Download Attachments
          </IconButton>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreDailyDairyCard;
