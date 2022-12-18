import React, { useState, useEffect, useRef } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  Table,
  DatePicker,
  Breadcrumb,
  message,
  Button,
  Input,
  Form,
  Switch,
  Modal,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

const SubjectwiseDiaryReport = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const formRef = useRef();
  const [date, setDate] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [subjectwiseReport, setSubjectwiseReport] = useState([]);
  const [subjectwiseStats, setSubjectwiseStats] = useState();
  const [description, setDescription] = useState('');
  const [isClassCancelled, setIsClassCancelled] = useState(false);
  const [teacherwiseReport, setTeacherwiseReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInner, setLoadingInner] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [diaryType, setDiaryType] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const [tableExpanded, setTableExpanded] = useState(false);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleSubmit = () => {
    let payload = {
      date,
      teacher_id: selectedTeacher?.user_id,
      subject: subjectID,
      section_mapping_id: selectedSection?.section_mapping,
      is_class_cancled: isClassCancelled,
    };
    if (!isClassCancelled) {
      payload['data'] = description;
    }
    axios
      .post(`academic/diary/reason/create/`, payload)
      .then((res) => {
        if (res.data.status_code === 201) {
          message.success('Reason mentioned successfully');
          handleCloseFeedbackeModal();
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleCancellationCheck = (event) => {
    setIsClassCancelled(event);
    setDescription('');
  };
  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    }
  };
  const handleCloseFeedbackeModal = () => {
    setShowFeedbackModal(false);
    fetchTeacherwiseReport({
      acad_session_id: selectedBranch?.id,
      section_mapping: selectedSection?.section_mapping,
      subject_id: subjectID,
      date,
    });
  };
  const onTableRowExpand = (expanded, record) => {
    setTableExpanded(false);
    const keys = [];
    setTeacherwiseReport([]);
    if (expanded) {
      setTableExpanded(true);
      keys.push(record.subject_id);
      setSubjectID(record.subject_id);
      fetchTeacherwiseReport({
        acad_session_id: selectedBranch?.id,
        section_mapping: selectedSection?.section_mapping,
        subject_id: record.subject_id,
        date,
      });
    }

    setExpandedRowKeys(keys);
  };
  const fetchSubjectwiseReport = (params = {}) => {
    setSubjectwiseReport([]);
    setLoading(true);
    setExpandedRowKeys([]);
    axios
      .get(`${endpoints.diaryReport.subjectwiseReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSubjectwiseReport(res?.data?.result?.data);
          setSubjectwiseStats(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchTeacherwiseReport = (params = {}) => {
    setLoadingInner(true);
    axios
      .get(`${endpoints.diaryReport.subjectTeacherReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setTeacherwiseReport(res?.data?.result?.data);
        }
        setLoadingInner(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingInner(false);
      });
  };
  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        dataIndex: 'subject__subject_name',
        align: 'center',
        width: tableWidthCalculator(40) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'name',
        align: 'center',
        width: '20%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'created_at',
        align: 'center',
        width: '20%',
        render: (data) => <span className='th-black-2'>{data > 0 ? data : null}</span>,
      },
      {
        dataIndex: 'reason',
        align: 'center',
        width: '20%',
        render: (text, row) =>
          user_level == 11 ? null : row?.reason_details.reason_id !== null ? (
            <div className='text-truncate'>{row?.reason_details?.reason}</div>
          ) : (
            <Button
              className='th-black-2 th-button-active th-br-6 th-pointer'
              onClick={() => {
                setSelectedTeacher(row);
                setShowFeedbackModal(true);
              }}
            >
              Feedback
            </Button>
          ),
      },

      {
        title: 'icon',
        align: 'center',
        width: '5%',
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={teacherwiseReport}
        pagination={false}
        loading={loadingInner}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        rowClassName={(record, index) => 'th-pointer th-row'}
      />
    );
  };

  useEffect(() => {
    if (date)
      fetchSubjectwiseReport({
        acad_session_id: selectedBranch?.id,
        grade_id: selectedSection?.grade_id,
        section_mapping: selectedSection?.section_mapping,
        date,
      });
  }, [date]);

  useEffect(() => {
    if (history.location.state) {
      setSelectedSection(history.location.state.data);
      setDate(history.location.state.date);
      setDiaryType(history.location.state.diaryType);
    }
  }, [window.location.pathname]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>SUBJECTS</span>,
      dataIndex: 'subject_name',
      align: 'left',
      width: '20%',
      render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          {user_level == 11 ? null : 'TOTAL TEACHERS'}
        </span>
      ),
      align: 'center',
      width: '20%',
      render: (text, row) =>
        user_level == 11 ? null : (
          <span className='th-fw-400 th-black-1'>{row?.teacher_count}</span>
        ),
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          {tableExpanded ? "TEACHER'S NAME" : null}
        </span>
      ),
      align: 'center',
      width: '20%',
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL ASSIGNED</span>,
      dataIndex: 'diary_count',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PENDING</span>,
      dataIndex: 'pending_diaries',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16 th-pointer'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() =>
                history.push({
                  pathname: '/gradewise-diary-report',
                  state: {
                    date,
                    diaryType,
                  },
                })
              }
            >
              Diary Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Subjectwise Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <DatePicker
            disabledDate={(current) => current.isAfter(moment())}
            allowClear={false}
            value={moment(date)}
            placement='bottomLeft'
            onChange={(event, value) => handleDateChange(value)}
            showToday={false}
            bordered={false}
            suffixIcon={<DownOutlined className='th-black-1' />}
            className='th-black-2 pl-0 th-date-picker th-br-6'
            format={'DD/MM/YYYY'}
          />
        </div>
        {!loading && (
          <div
            className='row mt-3 mx-3 th-bg-white th-br-10'
            style={{ border: '1px solid #d9d9d9' }}
          >
            <div className='row py-2'>
              <div className='col-3 text-capitalize th-fw-500 th-grey'>
                Grade :{' '}
                <span className='th-primary'>
                  {selectedSection?.grade_name},{selectedSection?.section_name}
                </span>
              </div>
            </div>
            {subjectwiseStats && (
              <div className='row py-1'>
                <div className='col-md-3 th-grey'>
                  Total No. of Subjects :{' '}
                  <span className='th-primary'>{subjectwiseStats?.no_of_subjects}</span>
                </div>
                <div className='col-md-3 pt-2 px-1 pt-md-0 th-grey'>
                  Total No. of Diaries Assigned :{' '}
                  <span className='th-primary'>{subjectwiseStats?.diary_count}</span>
                </div>
                <div className='col-md-3 pt-2 px-1 pt-md-0 th-grey'>
                  Total No. of Diaries Pending :{' '}
                  <span className='th-primary'>
                    {subjectwiseStats?.pernding_diaries_count}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              loading={loading}
              columns={columns}
              expandRowByClick={true}
              rowKey={(record) => record?.subject_id}
              expandable={{ expandedRowRender }}
              dataSource={subjectwiseReport}
              pagination={false}
              expandIconColumnIndex={5}
              expandedRowKeys={expandedRowKeys}
              onExpand={onTableRowExpand}
              expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                  <UpOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <DownOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              }
              scroll={{ x: subjectwiseReport.length > 0 ? 'max-content' : null, y: 600 }}
            />
          </div>
        </div>
        {showFeedbackModal && (
          <Modal
            title={'Feedback for Pending Diary'}
            visible={showFeedbackModal}
            onCancel={handleCloseFeedbackeModal}
            className='th-upload-modal'
            centered
            footer={[
              <>
                <Button
                  className='text-center th-br-10 th-bg-grey th-black-2'
                  onClick={handleCloseFeedbackeModal}
                >
                  Close
                </Button>

                <Button
                  htmlType='submit'
                  className='text-center th-br-10 th-bg-primary th-white'
                  onClick={handleSubmit}
                >
                  <strong>Submit</strong>
                </Button>
              </>,
            ]}
          >
            <Form id='reasonForm' layout='vertical' ref={formRef}>
              <div className='row px-2 pt-2'>
                <div className='col-12'>
                  <Form.Item name='class_cancelled'>
                    <span className='mr-2'>Was the Class cancelled?</span>
                    <Switch
                      checkedChildren='Yes'
                      unCheckedChildren='No'
                      onChange={handleCancellationCheck}
                    />
                  </Form.Item>
                </div>
                <div className='col-12'>
                  <Form.Item
                    name='description'
                    label='Reason'
                    rules={[{ required: true, message: 'Please Add Description' }]}
                  >
                    <TextArea
                      rows={5}
                      disabled={isClassCancelled}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Enter Reason'
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default SubjectwiseDiaryReport;
