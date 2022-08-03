import React, { useState, useEffect, useRef, createRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Select, Input, Button, DatePicker, message, Form } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import ENVCONFIG from 'v2/config/config';
import { useHistory } from 'react-router-dom';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import deleteIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/deleteIcon.svg';
import editIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/editIcon.svg';
import { PlusOutlined } from '@ant-design/icons';

import { Editor } from '@tinymce/tinymce-react';

const { TINYMCE_API_KEY } = ENVCONFIG || {};
const { Option } = Select;
const { TextArea } = Input;

const AssignHomework = () => {
  const history = useHistory();
  const editorRef = useRef(null);
  const formRef = createRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();

  const [questionList, setQuestionList] = useState([{ id: '', text: '' }]);

  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: 2,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.academics.subjects}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: null,
      subject: null,
    });
    setSectionData([]);
    setSubjectData([]);
    if (e) {
      setGradeId(e);

      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: 2,
        grade_id: e,
      });
    }
  };
  const handleSection = (e) => {
    formRef.current.setFieldsValue({
      subject: null,
    });
    setSubjectData([]);
    if (e) {
      setSectionId(e);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        module_id: 2,
        grade: gradeId,
        section: e,
      });
    }
  };
  const handleSubject = (e) => {
    setSubjectId(e);
  };
  const handleClearSubject = () => {
    setSubjectId('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject__id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const handleClearSection = () => {
    setSectionId('');
  };
  const handleClearGrade = () => {
    setGradeId('');
    setSectionId('');
  };

  useEffect(() => {
    fetchGradeData();
  }, []);

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-homework' className='th-grey'>
              Teacher Homework
            </Breadcrumb.Item>

            <Breadcrumb.Item className='th-black-1'>Assign Homework</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-md-2 col-6 px-0'>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder='Select Grade'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleGrade(e);
                      }}
                      onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0'>
                  <Form.Item name='section'>
                    <Select
                      allowClear
                      placeholder='Select Section'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSection(e);
                      }}
                      onClear={handleClearSection}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {sectionOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                  <Form.Item name='subject'>
                    <Select
                      placeholder='Select Subject'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSubject(e);
                      }}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div className='col-md-12 mt-3'>
          <div className='row th-bg-white p-2'>
            <div className='row py-2'>
              <div className='col-md-4 py-3 py-md-0'>
                <span className='th-grey th-14'>Title</span>
                <Input className='th-br-4 mt-1 th-16' />
              </div>
              <div className='col-md-2 py-3 py-md-0'>
                <div className='th-grey th-14'>Due Date</div>
                <DatePicker
                  allowClear={false}
                  placement='bottomRight'
                  placeholder={'Till Date'}
                  showToday={false}
                  suffixIcon={<img src={calendarIcon} className='pl-2' />}
                  className='th-black-1 th-16 pt-2 pb-1 mt-1 th-date-picker th-width-100'
                  format={'DD/MM/YYYY'}
                />
              </div>
            </div>
            <div className='row py-1'>
              <div className='col-md-12 py-3 py-md-0'>
                <span className='th-grey th-14'>Description</span>
                <Input className='th-br-4 mt-1 th-16' />
              </div>
              <div className='row py-2'>
                <div className='col-md-12 py-3 py-md-0'>
                  <span className='th-grey th-14'>Instructions</span>
                  <Input.TextArea rows={3} className='th-br-4 mt-1 th-16' />
                </div>
              </div>
              {questionList?.map((item, index) => (
                <div className='row py-2'>
                  <div className='col-12'>
                    <div className='d-flex justify-content-between'>
                      {' '}
                      <div className='th-grey th-14'>Question {index + 1}</div>
                      {questionList?.length > 1 && (
                        <div className='pr-2'>
                          <img src={editIcon} className='mr-4 th-pointer' />
                          <img
                            src={deleteIcon}
                            className='th-pointer'
                            onClick={() => {
                              const newQuestionList = questionList.slice();
                              newQuestionList.splice(index, 1);
                              setQuestionList(newQuestionList);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className='th-editor py-2'>
                      <Editor
                        name='tinymce'
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        init={{
                          height: 250,
                          menubar: false,
                          statusbar: false,

                          plugins: [
                            'autolink lists link image charmap print preview anchor',
                            'searchreplace code fullscreen',
                            'insertdatetime media table paste code  media ',
                          ],
                          toolbar:
                            'bold italic fontsizeselect | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent ' +
                            'image',

                          content_style:
                            'body { font-family:Inter,sans-serif; font-size:16px;margin:1rem; border:0px solid #D9D9D9 }',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className='row mt-3 py-2 justify-content-md-end px-2'>
                <div className='col-md-4 py-4 py-md-0 d-flex'>
                  <Button
                    className='th-bg-grey th-black-2 th-br-4 th-fw-500 th-14 th-pointer col-6 mr-2 '
                    style={{ border: '1px solid #D9D9D9' }}
                    onClick={() =>
                      setQuestionList([
                        ...questionList,
                        { id: questionList?.length + 1, text: '' },
                      ])
                    }
                  >
                    <span className='d-flex align-items-center justify-content-center'>
                      <PlusOutlined size='small' className='mr-2' />
                      Add Question
                    </span>
                  </Button>

                  <Button className='th-bg-primary th-white th-br-4 th-fw-500 th-14 th-pointer col-6'>
                    Finish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignHomework;
