import React, { useState, useEffect, useContext } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';

import endpoints from '../../config/endpoints';

import './styles.scss';
import moment from 'moment';
import { Breadcrumb, Button, Tabs, Rate, Drawer, Space, Input, Avatar, Spin } from 'antd';

const StudentBlog = () => {
  const [value, setValue] = useState();
  const history = useHistory();
  const User_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const todayDate = moment();

  const [desc, setDesc] = useState('');

  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
  const changeHandle = (e) => {
    setDesc(e.target.value);
  };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [activityId, setActivityId] = useState('');
  const [submission, setSubmission] = useState('');
  const [imageData, setImageData] = useState('');
  const [blogData, setBlogData] = useState(null);

  const goBack = () => {
    history.push('/blog/studentview');
  };

  console.log(history, 'history');
  const [previewData, setPreviewData] = useState();

  useEffect(() => {
    if (history?.location?.pathname === '/blog/activityedit') {
      setTitle(history?.location?.state?.blogData?.title);
      setDescription(history?.location?.state?.blogData?.description);
      setSubmission(history?.location?.state?.blogData?.submission_date);
      setActivityId(history?.location?.state?.blogData?.id);
      setBlogData(history?.location?.state?.blogData);
    }
    showdata();
  }, [history]);

  const showdata = () => {
    axios
      .get(
        `${endpoints.newBlog.previewDetails}${history?.location?.state?.blogData?.id}/`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        // setAssignPreview(response);
        setImageData(JSON.parse(response?.data?.result?.template?.html_file));
        setPreviewData(response?.data?.result);
      });
  };

  const handleSubmit = () => {
    if (desc.length === 0) {
      return;
    }
    const dummyData = JSON.parse(previewData?.template?.html_file);
    dummyData[0].placeholder = desc;
    // const formData = new FormData();
    // formData.append('activity_detail_id', activityId);
    // formData.append('user_id', User_id?.id);
    // formData.append('submitted_on', submission);
    // formData.append('created_at', submission);
    // formData.append('is_submitted', true);
    let body = {
      booking_detail: {
        activity_detail_id: activityId,
        user_id: User_id?.id,
        submitted_on: todayDate.format().slice(0, 19),
        created_at: todayDate.format().slice(0, 19),
        is_submitted: true,
      },
      content: {
        html_text: desc,
        // image_data:previewData?.template?.html_file,
      },
    };

    axios
      .post(`${endpoints.newBlog.studentSideWriteApi}`, body, {
        headers: {
          // Authorization: `${token}`,
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 400) {
          history.push('/blog/studentview');
          return;
        } else {
          history.push('/blog/studentview');
        }
      });
  };
  return (
    <div>
      <Layout>
        <div className='px-2'>
          <div className='row'>
            <div className='col-6' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/blog/wall/redirect' className='th-grey th-16'>
                  Activities Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-16'>
                  Blog Activity
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-12'>
              <div
                className='th-bg-white th-br-10 p-3'
                style={{ outline: '1px solid #d9d9d9' }}
              >
                <div>
                  <span className='th-black-2'>Title : </span>
                  <span className='th-16 th-fw-600 th-black-1'>{blogData?.title}</span>
                </div>
                <div className='py-2 th-grey th-10'>
                  Assigned on : {moment(blogData?.issue_date).format('MMM Do, YYYY')}
                </div>
                <div className='mt-2'>
                  <div className='th-grey'>Instructions : </div>
                  <div>{blogData?.description}</div>
                </div>
                <div className='my-2 th-grey'>Write you Blog</div>
                <div
                  style={{
                    background: 'white',
                    width: '500px',
                    marginLeft: '35px',
                    height: '685px',
                    marginTop: '12px',
                    marginBottom: '30px',
                  }}
                >
                  <div
                    style={{
                      background: `url(${blogData?.template?.template_path})`,
                    }}
                    className='background-image-write'
                  >
                    <div className='certificate-text-center certificate-input-box'>
                      <textarea
                        className='certificate-box'
                        style={{
                          width: `${imageData[0]?.width}px`,
                          height: `${imageData[0]?.height}px`,
                          top: `${imageData[0]?.x_cordinate}px`,
                          left: `${imageData[0]?.y_cordinate}px`,
                        }}
                        onChange={changeHandle}
                        placeholder='type text here...'
                      />
                    </div>
                  </div>
                </div>
                <div className='d-flex ml-5'>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='medium'
                    onClick={goBack}
                    className='mr-3'
                  >
                    Back
                  </Button>{' '}
                  <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default StudentBlog;
