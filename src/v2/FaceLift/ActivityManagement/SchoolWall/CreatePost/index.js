import { Modal, Select, Form, message, Input, Upload, Button, Image, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
import imageIcon from 'v2/Assets/images/images.png';
import audioIcon from 'v2/Assets/images/audio.png';
import videoIcon from 'v2/Assets/images/film.png';
import fileIcon from 'v2/Assets/images/fileIcon.png';
import pdfIcon from 'v2/Assets/images/pdf.png';
import endpoints from 'v2/config/endpoints';
import { DeleteOutlined, DownOutlined, EyeFilled } from '@ant-design/icons';
import { Profanity } from 'components/file-validation/Profanity';

const { Option } = Select;
const CreatePost = ({ showCreatePostModal, handleClosePostModal, fetchNewPosts }) => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const fileRef = useRef();
  const { first_name } = JSON.parse(localStorage?.getItem('userDetails'));
  const formRef = useRef();
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [gradeID, setGradeID] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionIDs, setSectionIDs] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  console.log({ branchList });
  const fetchGradeData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/grademapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axiosInstance
      .get(`/erp_user/sectionmapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });
  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionsOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleBranch = (each) => {
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    if (each?.length > 0) {
      let branchParam;
      if (each.some((item) => item.value === 'all')) {
        const allBranches = branchList.map((item) => item?.branch?.id).join(',');
        branchParam = allBranches;
        setSelectedBranch(allBranches);
        formRef.current.setFieldsValue({
          branch: branchList.map((item) => item?.branch?.id),
        });
      } else {
        setSelectedBranch(each.map((item) => item.value).join(','));
        branchParam = each.map((item) => item.value).join(',');
      }
      console.log({ branchParam });
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: branchParam,
      });
    } else {
      setGradeData([]);
      setSectionData([]);
      setGradeID([]);
      setSectionIDs([]);
    }
  };
  const handleGrade = (each) => {
    formRef.current.setFieldsValue({
      section: [],
    });
    if (each?.length > 0) {
      let gradeParam;
      if (each.some((item) => item.value === 'all')) {
        const allGrades = [...new Set(gradeData.map((item) => item.grade_id))].join(',');
        gradeParam = allGrades;
        setGradeID(allGrades);
        formRef.current.setFieldsValue({
          grade: [...new Set(gradeData.map((item) => item.grade_id))],
        });
      } else {
        setGradeID([...new Set(each.map((item) => item.value))].join(','));
        gradeParam = [...new Set(each.map((item) => item.value))].join(',');
      }
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch,
        grade_id: gradeParam,
      });
    } else {
      setSectionData([]);
      setSectionIDs([]);
    }
  };
  const handleChangeSection = (each) => {
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionData.map((item) => item.id);
      setSectionIDs(allsections);
      formRef.current.setFieldsValue({
        section: sectionData.map((item) => item.id),
      });
    } else {
      setSectionIDs(each.map((item) => item.value));
    }
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    const extension = file.name.split('.').pop();
    if (file?.size > 5249338) {
      message.error('Image must be less than 5 MB');
      return;
    }
    if (!extension.match(/(jpg|jpeg|png|gif|avif|webp|mp4|ogg|mp3|webm|avi|3gp|pdf)/i)) {
      message.error('Please select image, pdf, audio & video files only');
      return;
    }
    let formData = new FormData();

    formData.append('file', file);
    axiosInstance
      .post(`/social-media/upload-social-media-file/`, formData)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          message.success('File uploaded successfully');
          let fileDetails = {
            name: res?.data?.data,
            type: res?.data?.file_type,
            media_path: res?.data?.media_path,
          };
          setAttachmentList((prevState) => [...prevState, fileDetails]);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        // setProfileLoading(false);
      });
  };

  const handleRemoveAttachment = (index) => {
    let list = attachmentList.slice();
    list.splice(index, 1);
    setAttachmentList(list);
  };

  const handleCreatePost = () => {
    const updatedValues = formRef.current?.getFieldsValue();
    if (Profanity(updatedValues?.description)) {
      message.error('Description contains foul word, try harder ohh yeahh');
      return;
    }
    let payload = {
      section_mapping: sectionIDs,
      description: updatedValues?.description,
      category: 1,
    };
    if (attachmentList?.length > 0) {
      payload['media_files'] = attachmentList.map((item) => item?.media_path);
    }
    setCreateLoading(true);
    axiosInstance
      .post(`${endpoints?.schoolWall?.getPosts}`, payload)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success(res?.data?.message);
          fetchNewPosts();
          handleClosePostModal();
        }
      })
      .catch((err) => {
        message.error('Something went wrong !!');
      })
      .finally(() => {
        setCreateLoading(false);
      });
  };

  return (
    <Modal
      className='th-upload-modal'
      title='Create Post'
      visible={showCreatePostModal}
      onCancel={handleClosePostModal}
      centered
      width={'75vw'}
      okText='Create'
      okButtonProps={{
        loading: createLoading,
        htmlType: 'submit',
        form: 'filterForm',
      }}
    >
      <div className='p-3'>
        <Form
          id='filterForm'
          ref={formRef}
          layout={'vertical'}
          onFinish={handleCreatePost}
        >
          <div className='d-flex py-3 flex-wrap'>
            <div className='col-4'>
              <Form.Item
                name='branch'
                label='Branch'
                rules={[{ required: true, message: 'This is required' }]}
              >
                <Select
                  style={{ borderRadius: 16 }}
                  allowClear
                  placeholder='Select Branch*'
                  showSearch
                  mode='multiple'
                  required={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleBranch(value);
                  }}
                  className='w-100 text-left th-black-1 th-br-16'
                >
                  {branchList?.length > 1 && (
                    <>
                      <Option key={0} value={'all'}>
                        All
                      </Option>
                    </>
                  )}
                  {branchOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-4'>
              <Form.Item
                name='grade'
                label='Grade'
                rules={[{ required: true, message: 'This is required' }]}
              >
                <Select
                  allowClear
                  placeholder='Select Grade*'
                  showSearch
                  mode='multiple'
                  required={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleGrade(value);
                  }}
                  className='w-100 text-left th-black-1 th-br-4'
                >
                  {gradeData?.length > 1 && (
                    <>
                      <Option key={0} value={'all'}>
                        All
                      </Option>
                    </>
                  )}
                  {gradeOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-4'>
              <Form.Item
                name='section'
                label='Sections'
                rules={[{ required: true, message: 'This is required' }]}
              >
                <Select
                  placeholder='Select Sections'
                  showSearch
                  required={true}
                  mode='multiple'
                  maxTagCount={1}
                  value={sectionIDs}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp='children'
                  suffixIcon={<DownOutlined className='th-grey' />}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleChangeSection(value);
                  }}
                  allowClear
                  className='w-100 text-left th-black-1 th-br-4'
                >
                  {sectionData?.length > 1 && (
                    <>
                      <Option key={0} value={'all'}>
                        All
                      </Option>
                    </>
                  )}
                  {sectionsOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-12'>
              <Form.Item
                name='description'
                label=''
                rules={[{ required: true, message: 'This is required' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={`What's on your mind, ${first_name}?`}
                  className='th-br-16 w-100 mt-3'
                />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div className='my-3 d-flex align-items-center'>
          <div className='col-md-1 col-sm-2 col-2'>
            <label>
              <img
                src={imageIcon}
                width={40}
                onClick={() => fileRef.current.click()}
                className='th-pointer'
              />
            </label>
            <input
              ref={fileRef}
              type='file'
              className='d-none'
              multiple
              accept='image/*, video/*, audio/*, application/pdf'
              onChange={(e) => handleFile(e)}
            />
          </div>

          <div className='th-12'>
            <i> Accepts only image,video,audio and PDF files</i>
          </div>
        </div>
        {attachmentList.length > 0 && (
          <div className='th-br-16 th-bg-grey m-3 p-3 '>
            <i>
              {attachmentList.length} attachment{attachmentList.length > 1 ? 's' : ''}
            </i>
            <div className='d-flex flex-wrap py-2'>
              {attachmentList?.map((item, index) => {
                const extension = item?.media_path?.split('.').pop();
                return (
                  <div className='px-2 d-flex flex-column align-items-center' title=''>
                    {extension.match(/(jpg|jpeg|png|gif|avif|webp)/i) ? (
                      <Image
                        preview={{
                          mask: <EyeFilled />,
                          previewText: null,
                        }}
                        src={item?.media_path}
                        height={80}
                        width={80}
                        style={{ borderRadius: 16, objectFit: 'cover' }}
                      />
                    ) : extension.match(/(mp4|ogg|avi)/i) ? (
                      <img src={videoIcon} width={40} />
                    ) : extension.match(/(mp3|webm)/i) ? (
                      <img src={audioIcon} width={40} />
                    ) : extension.match(/pdf/i) ? (
                      <img src={pdfIcon} width={40} />
                    ) : (
                      <img src={fileIcon} width={40} />
                    )}
                    <Tag
                      color='volcano'
                      icon={<DeleteOutlined />}
                      className='th-pointer mt-2 th-br-8 th-12'
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      Remove
                    </Tag>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreatePost;
