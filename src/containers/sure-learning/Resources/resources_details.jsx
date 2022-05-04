import { Button, Divider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import FileViewer from 'react-file-viewer';
import './resources_details.scss';
import './resource_detail.css';
import axios from 'axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';

const ResourceDetailViewer = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [fileDataInfo, setFileDataInfo] = useState(null);
  const loginData = JSON.parse(localStorage.getItem('UserLogin'));
  const adminRole = loginData?.personal_info?.role;
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  console.log(props.eachData);
  useEffect(() => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }, []);

  let selectedFile = props?.eachData?.filter(
    (each) => each?.documents === props?.resource
  );
  console.log(selectedFile[0]?.is_approved, 'selectedFile');
  const handleDataUnPublish = (data) => {
    console.log(data);
    const temp = {
      id: data.id,
      status: false,
    };
    console.log(data);
    axios
      .post(`${endpoints.sureLearning.approveResources}`, temp, {
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Resources_data'),
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        setAlert('success', response.data.message);
        props.close();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDataPublish = (data) => {
    console.log(data);
    const temp = {
      id: data.id,
      status: true,
    };
    console.log(data);
    axios
      .post(`${endpoints.sureLearning.approveResources}`, temp, {
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: localStorage.getItem('Resources_data'),
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        setAlert('success', response.data.message);

        props.close();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setFileDataInfo(props.resource);
    console.log(props.resource, 'resources coming for display');
  }, [props.resource]);
  return (
    <div className='resource-details-parent-containers'>
      <div className='attendance-form'>
        <div className='customer-basic-details-from'>
          <div style={{ margin: '3%', height: '100%', width: '100%' }}>
            {fileDataInfo?.endsWith('.mp4') ||
            fileDataInfo?.endsWith('.mp3') ||
            fileDataInfo?.includes('.mp4') ||
            fileDataInfo?.includes('.mp3') ? (
              <video
                id='attachment-iframe'
                style={{
                  width: '100%',
                  // objectFit: 'contain',
                  height: '100%',
                  // height: fullscreen ? '92vh' : '69vh',
                }}
                controls
                // autoPlay
                controlsList='nodownload'
              >
                {fileDataInfo?.endsWith('.mp4') || fileDataInfo?.includes('.mp4') ? (
                  <source src={fileDataInfo} type='video/mp4' />
                ) : (
                  <source src={fileDataInfo} type='audio/mp3' />
                )}
                Your browser does not support HTML5 video.
              </video>
            ) : fileDataInfo?.endsWith('.docx') ||
              fileDataInfo?.endsWith('.doc') ||
              fileDataInfo?.endsWith('.xlsx') ||
              fileDataInfo?.endsWith('.pdf') ||
              fileDataInfo?.endsWith('.csv') ? (
              <div>
                <FileViewer
                  fileType={
                    fileDataInfo?.endsWith('.docx')
                      ? 'docx'
                      : fileDataInfo?.endsWith('.doc')
                      ? 'doc'
                      : fileDataInfo?.endsWith('.xlsx')
                      ? 'xlsx'
                      : fileDataInfo?.endsWith('.pdf')
                      ? 'pdf'
                      : 'csv'
                  }
                  filePath={fileDataInfo}
                />
              </div>
            ) : fileDataInfo?.endsWith('.pptx') || fileDataInfo?.endsWith('.ppt') ? (
              <iframe
                style={{ width: '100%' }}
                id='attachment-iframe'
                title='attachment-iframe'
                height={'100%'}
                src={
                  fileDataInfo?.endsWith('.pptx')
                    ? `https://view.officeapps.live.com/op/embed.aspx?src=${fileDataInfo}`
                    : `https://view.officeapps.live.com/op/embed.aspx?src=${fileDataInfo}`
                }
                className='attachment-viewer-frame-preview-iframe'
              />
            ) : (
              <img style={{ width: '100%' }} src={fileDataInfo} />
            )}
          </div>
        </div>
      </div>
      <Divider className='divider-2' />
      <div className='action-button'>
        <div className='action-all-buttons'>
          {localStorage.getItem('Resources_data') !== 'null' &&
          adminRole?.toString().toLowerCase() === 'admin' ? (
            selectedFile[0]?.is_approved === true ? (
              <Button
                variant='outlined'
                // onClick={handleDataPublish}
                onClick={() => handleDataUnPublish(selectedFile[0])}
                className='action-button-cancel'
                // disabled={selectedFile[0]?.is_approved === true}
              >
                UnPublish
              </Button>
            ) : (
              <Button
                variant='outlined'
                // onClick={handleDataPublish}
                onClick={() => handleDataPublish(selectedFile[0])}
                className='action-button-cancel'
                // disabled={selectedFile[0]?.is_approved === true}
              >
                Publish
              </Button>
            )
          ) : (
            ''
          )}
          <Button
            // variant='outlined'
            color='primary'
            onClick={props.close}
            // className='action-button-cancel'
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailViewer;
