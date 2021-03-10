import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more-general.css';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { ExpandLessOutlined } from '@material-ui/icons';

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
  grade,
  branch,
  section,
  mapping_bgs
}) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);

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
  const pic=viewMoreData?.documents?.map(a=>a)
  console.log(viewMoreData, '=====', branch);
  return (
    <>
      <Paper className='rootViewMoreGeneral'>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData.title}</div>
            <div className='headerTitle'>
              Created On:{viewMoreData.created_at.substring(0, 10)}
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
          <div className='bodyTitle'>Title</div>
          <Divider className='titleDivider' />
          <div className='bodyContent'>{viewMoreData.title}</div>
          <div className='bodyTitle'>Message</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.message}</div>
          <div className='bodyTitle'>Media</div>
          {/* <div className='mediaBody'>xxxxxxxx</div> */}
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
          <IconButton
          //  onClick={handleBulkDownload}
           style={{fontSize:'1.1rem',color:'#ff6b6b'}}
            className="bulkDownloadIconViewMore">
              <a  target='_blank' href={`${endpoints.s3}/dev/circular_files/${pic}`}>
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ height: '21px', width: '21px' }}
                                        src={downloadAll}
                                        alt='downloadAll'
                                    />
                                )}
                            /></a>Download
                        </IconButton>
          </div>
        </div>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreCard;
