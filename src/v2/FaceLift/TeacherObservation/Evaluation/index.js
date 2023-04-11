import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import {
  Breadcrumb,
  Select,
  Input,
  Radio,
  Button,
  message,
  Table,
  InputNumber,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';

const { Option } = Select;

const Evaluation = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [data, setData] = useState([]);
  const [observationAreaList, setObservationAreaList] = useState([]);
  const [selectedObservationArea, setSelectedObservationArea] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [gradeID, setGradeID] = useState([]);
  const [sectionID, setSectionID] = useState();
  const [subjectID, setSubjectID] = useState();
  const [sectionMappingID, setSectionMappingID] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [teacherId, setTeacherId] = useState();
  const [teacherName, setTeacherName] = useState();
  const [teacherErp, setTeacherErp] = useState();
  const [studentId, setStudentId] = useState();
  const [studentName, setStudentName] = useState();
  const [studentErp, setStudentErp] = useState();
  const [overallRemarks, setOverallRemarks] = useState('');
  const [teacherData, setTeacherData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { role_details } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [tableView, setTableView] = useState('teacher');
  const [selectedFile, setSelectedFile] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const allowedFiles = ['.jpeg', '.jpg', '.png', '.pdf', '.mp4'];
  // useEffect(() => {
  //   observationGet({ levels__id__in: user_level, status: true });
  // }, []);
  const uploadProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    // '.xls,.xlsx',
    multiple: false,
    onRemove: () => {
      setSelectedFile(null);
    },
    beforeUpload: (...file) => {
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
      } else {
        message.error(' Please select the correct file type');
      }

      return false;
    },
    selectedFile,
  };

  const fetchObservationAreasList = (params = {}) => {
    setSelectedObservationArea(null);
    //  setLoading(true);
    axios
      .get(`${endpointsV2.observations.observationAreaList}`, { params: { ...params } })
      .then((result) => {
        if (result.data?.status_code === 200) {
          setObservationAreaList(result?.data?.result);
          //  setLoading(false);
        } else {
          //  setLoading(false);
          setObservationAreaList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        //  setLoading(false);
      });
  };
  useEffect(() => {
    if (selectedObservationArea) {
      setLoading(false);

      axios
        .get(
          `${endpointsV2.observations.observationList}?id=${selectedObservationArea?.observation?.id}`
        )
        .then((result) => {
          if (result.data?.status_code === 200) {
            setTableData([
              {
                id: selectedObservationArea?.value,
                observation_area_name: selectedObservationArea?.children,
                observations: result.data?.result[0]?.observations,
              },
            ]);
            modifyData([
              {
                id: selectedObservationArea?.value,
                observation_area_name: selectedObservationArea?.children,
                is_student: selectedObservationArea?.details?.is_student,
                status: selectedObservationArea?.details?.status,
                observation_area_name: selectedObservationArea?.children,
                observations: result.data?.result[0]?.observations,
              },
            ]);
            setLoading(false);
          } else {
            setLoading(false);
            setTableData([]);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      // setTableData({
      //   id: 2,
      //   title: 'ROHIT abcd',
      //   status: true,
      //   is_student: false,
      //   observations: [
      //     {
      //       id: 378,
      //       score: 5,
      //       label: 'ABC2',
      //     },
      //     {
      //       id: 379,
      //       score: 4,
      //       label: 'PQR2',
      //     },
      //   ],
      // });
      // }
      //   observationGet({
      //     is_student: tableView === 'teacher' ? false : true,
      //     levels__id__in: user_level,
      //     status: true,
      //   });
      // } else {
      //   setData([]);
    }
  }, [selectedObservationArea]);
  useEffect(() => {
    fetchObservationAreasList({
      is_student: tableView === 'teacher' ? false : true,
      status: true,
    });
  }, [tableView]);
  const modifyData = (paramData) => {
    let arr = [];
    for (let i = 0; i < paramData?.length; i++) {
      var obj = {};
      let innerArr = [];
      obj.id = paramData[i].id;
      obj.status = paramData[i].status;
      obj.observation_area_name = paramData[i].observation_area_name;
      // for (let j = 0; j < paramData[i].observations?.length; j++) {
      //   var innerObj = {};
      //   innerObj.observationarea = paramData[i].observations[j].observation;
      //   innerObj.id = paramData[i].observations[j].id;
      //   // innerObj.status = paramData[i].observation[j].status;
      //   innerObj.status = true;
      //   // innerObj.observation = paramData[i].observation_area_name;
      //   innerObj.description = '';
      //   innerObj.score = 0;
      //   // innerObj.observationScore = paramData[i].observations[j].score;
      //   innerArr.push(innerObj);
      // }
      obj.observations = paramData[i].observations;
      obj.is_student = paramData[i].is_student;
      arr.push(obj);
    }
    setModifiedData(arr);
  };

  const handleScoreDesciption = (e, id, subId, field) => {
    let tempData = modifiedData;
    if (field === 'description') {
      e.preventDefault();
      tempData[id].observations[subId].description = e.target.value;
    } else {
      if (parseInt(e) <= parseInt(tempData[id].observations[subId].score)) {
        tempData[id].observations[subId].observationScore = e;
      } else {
        message.error("Obtained marks can't exceeds Observation max marks");
      }
    }
    setModifiedData([...tempData]);
  };

  const handleSubmit = () => {
    setRequestSent(true);
    const formData = new FormData();

    // let flatttenData = modifiedData?.map((item) => item?.observation).flat();
    if (subjectID && teacherErp) {
      formData.append('acad_session', selectedBranch?.id);
      formData.append('date', moment().format('YYYY-MM-DD'));
      formData.append('erp_user', teacherId);
      formData.append('teacher_name', teacherName);
      formData.append('teacher_erp', teacherErp);
      formData.append('remark', overallRemarks);
      formData.append('score', marksObtained);
      formData.append('report', JSON.stringify(modifiedData));
      formData.append('subject_map', subjectID);
      formData.append('is_student', false);
      formData.append('reviewed_by', role_details?.erp_user_id);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      // var obj = {
      //   acad_session: selectedBranch?.id,
      //   date: moment().format('YYYY-MM-DD'),
      //   erp_user: teacherId,
      //   teacher_name: teacherName,
      //   teacher_erp: teacherErp,
      //   remark: overallRemarks,
      // score: _.sumBy(flatttenData, 'score'),
      // score: marksObtained,
      // report: JSON.stringify(modifiedData),
      // subject_map: subjectID,
      // section_mapping: sectionID,
      // is_student: false,
      // reviewed_by: role_details?.erp_user_id,
      // file: selectedFile,
      // };
    } else if (studentErp && subjectID) {
      // var obj = {
      //   acad_session: selectedBranch?.id,
      //   date: moment().format('YYYY-MM-DD'),
      //   erp_user: studentId,
      //   teacher_name: studentName,
      //   teacher_erp: studentErp,
      //   remark: overallRemarks,
      // score: _.sumBy(flatttenData, 'score'),
      // score: marksObtained,
      // report: JSON.stringify(modifiedData),
      // subject_map: subjectID,
      // section_mapping: sectionID,
      //   student: studentId,
      //   is_student: true,
      //   reviewed_by: role_details?.erp_user_id,
      //   file: selectedFile,
      // };
      formData.append('acad_session', selectedBranch?.id);
      formData.append('date', moment().format('YYYY-MM-DD'));
      formData.append('erp_user', studentId);
      formData.append('teacher_name', studentName);
      formData.append('teacher_erp', studentErp);
      formData.append('remark', overallRemarks);
      formData.append('score', marksObtained);
      formData.append('report', JSON.stringify(modifiedData));
      formData.append('subject_map', subjectID);
      formData.append('is_student', true);
      formData.append('reviewed_by', role_details?.erp_user_id);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
    } else {
      message.error('Please select all required fields ');
      return;
    }
    axios
      .post(`${endpoints.observationName.observationReport}`, formData)
      .then((res) => {
        if (res.status === 201) {
          message.success('Successfully Submitted');
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        message.error(error.message);
        console.log('error');
      })
      .finally(() => {
        setRequestSent(false);
      });
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchGradeData();
    }
  }, [moduleId]);

  const fetchTeacherList = (gradeId) => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      grade_id: gradeId,
    };
    axios
      .get(`${endpoints.aol.teacherList}`, { params })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setTeacherData(result?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeDropdown(result?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleGrade = (e, value) => {
    setSectionDropdown([]);
    if (e) {
      setGradeID(e);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: e,
        module_id: moduleId,
      };
      fetchTeacherList(e);
      axios
        .get(`${endpoints.academics.sections}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const sectionData = result?.data?.data || [];
            setSectionDropdown(sectionData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const fetchStudentList = (sectionID) => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      grade: gradeID,
      section: sectionID,
    };
    axios
      .get(`${endpoints.communication.studentUserList}`, { params })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setStudentData(result?.data?.data?.results);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const handleClearGrade = () => {
    setSectionDropdown([]);
    setSubjectDropdown([]);
  };

  const handleClearSection = () => {
    setSubjectDropdown([]);
  };
  const handleSection = (each) => {
    if (each) {
      fetchStudentList(each?.value);
      setSectionID(each?.value);
      setSectionMappingID(each?.mappingId);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        grade: gradeID,
        section: each.value,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.subjects}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setSubjectDropdown(result?.data?.data);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const handleSubject = (e) => {
    if (e) {
      setSubjectID(e.value);
    }
  };
  const handleClearTeacher = () => {
    setTeacherId(null);
    setTeacherName(null);
    setTeacherErp(null);
  };

  const handleTeacher = (e) => {
    if (e) {
      setTeacherId(e.value);
      setTeacherName(e.teacherName?.split('(')[0]);
      setTeacherErp(e.teacherName?.split('(')[1]?.split(')')[0]);
    }
  };

  const handleClearStudent = () => {
    setStudentId(null);
    setStudentName(null);
    setStudentErp(null);
  };

  const handleStudent = (e) => {
    if (e) {
      setStudentId(e.id);
      setStudentName(e.studentName);
      setStudentErp(e.value);
    }
  };
  const handleTableView = (e) => {
    setTableView(e.target.value);
    setGradeID(null);
    setSectionID(null);
    setSubjectID(null);
    setSelectedObservationArea(null);
    setModifiedData([]);
    setTeacherData([]);
    setStudentData([]);
    handleClearGrade();
    handleClearSection();
    handleClearStudent();
    handleClearTeacher();
  };

  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionDropdown?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const subjectOptions = subjectDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id} id={each?.id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const teacherOptions = teacherData?.map((each) => {
    return (
      <Option
        key={each?.user__id}
        value={each?.tutor_id}
        id={each?.user__id}
        teacherName={each?.name}
      >
        {each?.name}
      </Option>
    );
  });

  const studentOptions = studentData?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each?.erp_id}
        id={each?.id}
        studentName={each?.user?.first_name + ' ' + each?.user?.last_name}
      >
        {each?.user?.first_name + ' ' + each?.user?.last_name}
      </Option>
    );
  });
  const observationAreaListOptions = observationAreaList?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        observation={each?.observation}
        details={each}
      >
        {each?.observation_area_name}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S. No.</span>,
      width: '8%',
      align: 'center',
      render: (value, item, index) => (
        <span className='th-black-1 th-16'>{index + 1}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Observation Area</span>,
      width: '20%',
      align: 'center',
      dataIndex: 'observation_area_name',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          <div className='d-flex align-items-center'>
            <div className='col-md-6 pl-0'> {'Observation'}</div>
            <div className='col-md-3'>Description</div>
            <div className='col-md-3 pl-0'>Score</div>
          </div>
        </span>
      ),
      key: 'observation',
      render: (record, item, index) =>
        record.observations?.map((item, i) => {
          return (
            <div className='d-flex border-bottom align-items-center py-1 '>
              <div className='col-md-6 pl-0 th-14'>
                {i + 1}. {item.label}
              </div>
              <div className='col-md-3'>
                <Input.TextArea
                  placeholder='Description *'
                  onChange={(e) => handleScoreDesciption(e, index, i, 'description')}
                />
              </div>
              <div className='col-md-3 pl-0'>
                <InputNumber
                  className='w-100'
                  max={item?.score}
                  min={0}
                  placeholder={`Score Max * (${item?.score})`}
                  onChange={(e) => handleScoreDesciption(e, index, i, 'score')}
                />
              </div>
            </div>
          );
        }),
    },
  ];

  let overallScore = _.sumBy(
    modifiedData?.map((item) => item?.observations).flat(),
    'score'
  );
  let marksObtained = _.sumBy(
    modifiedData?.map((item) => item?.observations).flat(),
    'observationScore'
  );
  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Evaluation</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='col-md-3 text-right th-radio'>
            <Radio.Group onChange={handleTableView} value={tableView} buttonStyle='solid'>
              <Radio.Button value={'teacher'}>Teacher</Radio.Button>
              <Radio.Button value={'student'}>Student</Radio.Button>
            </Radio.Group>
          </div>

          <div className='row mt-3'>
            <div className='col-md-3 col-sm-6 col-12'>
              <Select
                className='th-width-100 th-br-6'
                onChange={(e, value) => setSelectedObservationArea(value)}
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={'Select Observation Area'}
                value={selectedObservationArea}
                showSearch
                optionFilterProp='children'
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {observationAreaListOptions}
              </Select>
            </div>
          </div>
          {modifiedData.length > 0 ? (
            <div className='row mt-3'>
              <div className='col-12'>
                <Table
                  className='th-table'
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                  }
                  loading={loading}
                  columns={columns}
                  rowKey={(record) => record?.id}
                  dataSource={modifiedData}
                  pagination={false}
                  bordered
                  scroll={{ y: '58vh' }}
                />
              </div>
            </div>
          ) : (
            <div className='row justify-content-center my-3 th-24 th-black-2'>
              Please select the filter to show data!
            </div>
          )}
          {modifiedData?.length > 0 ? (
            <div className='row py-2 text-left align-items-center'>
              <div className='col-md-3 py-2'>
                <Select
                  className='th-width-100 th-br-6'
                  onChange={handleGrade}
                  placeholder='Grade *'
                  allowClear
                  onClear={handleClearGrade}
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={gradeID}
                >
                  {gradeOptions}
                </Select>
              </div>
              <div className='col-md-3 py-2'>
                <Select
                  className='th-width-100 th-br-6'
                  onChange={(e, value) => handleSection(value)}
                  placeholder='Section *'
                  allowClear
                  onClear={handleClearSection}
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={sectionID}
                >
                  {sectionOptions}
                </Select>
              </div>

              <div className='col-md-3 py-2'>
                <Select
                  className='th-width-100 th-br-6'
                  onChange={(e, value) => handleSubject(value)}
                  placeholder='Select Subject *'
                  allowClear
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={subjectID}
                >
                  {subjectOptions}
                </Select>
              </div>

              {tableView === 'teacher' ? (
                <div className='col-md-3 py-2'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleTeacher(value)}
                    placeholder='Select Teacher*'
                    allowClear
                    onClear={handleClearTeacher}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {teacherOptions}
                  </Select>
                </div>
              ) : (
                <div className='col-md-3 py-2'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e, value) => handleStudent(value)}
                    placeholder='Select Student*'
                    allowClear
                    onClear={handleClearStudent}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {studentOptions}
                  </Select>
                </div>
              )}

              <div className='col-md-3 py-2'>
                <Input.TextArea
                  rows={4}
                  placeholder='Overall Remarks *'
                  onChange={(e) => setOverallRemarks(e.target.value)}
                />
              </div>
              <div className='col-md-3 py-2 th-16'>
                Total Score:{' '}
                <span className='pl-1 th-fw-600'>
                  {marksObtained ? marksObtained : 0}/{overallScore}
                </span>
              </div>
              <div className='col-md-3 py-2 th-16'>
                <Upload {...uploadProps} className='w-75'>
                  <Button icon={<UploadOutlined />}>
                    {selectedFile ? 'Change' : 'Upload'} File
                  </Button>
                </Upload>

                {!selectedFile ? (
                  <div className='th-10 mt-2'>
                    {' '}
                    Accepted Files: Images , PDF, Audio & Video{' '}
                  </div>
                ) : (
                  <div className='mt-2 th-14'>
                    <div className='d-flex jusify-content-between pl-1 py-2  align-items-center'>
                      <div
                        className='th-12 th-black-1 text-truncate th-width-90'
                        title={selectedFile?.name}
                      >
                        {selectedFile?.name}
                      </div>

                      <div className='th-pointer ml-2'>
                        <img src={smallCloseIcon} onClick={() => setSelectedFile(null)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='col-md-3 py-2'>
                <Button
                  onClick={handleSubmit}
                  type='primary'
                  className='w-50'
                  disabled={requestSent}
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default Evaluation;
