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
  Tag,
  Tooltip,
} from 'antd';
import { DownOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import _ from 'lodash';

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
  const [requestSent, setRequestSent] = useState(false);
  const [reasonId, setReasonId] = useState(null);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleSubmit = () => {
    let payload = {
      date,
      teacher_id: selectedTeacher?.user_id,
      subject: subjectID,
      section_mapping_id: selectedSection?.section_mapping,
      is_class_cancled: isClassCancelled,
      data: description,
    };
    // if (!isClassCancelled) {
    // }
    // if (!isClassCancelled) {
    if (!description) {
      return;
    }
    // }
    setRequestSent(true);
    if (reasonId) {
      payload['id'] = reasonId;
      axios
        .put(`academic/diary/reason/update/`, payload)
        .then((res) => {
          if (res.data.status_code === 200) {
            message.success('Reason updated successfully');
            setReasonId(null);
            handleCloseFeedbackModal();
            fetchTeacherwiseReport({
              acad_session_id: selectedBranch?.id,
              section_mapping: selectedSection?.section_mapping,
              subject_id: subjectID,
              date,
            });
          } else {
            message.error(res.data.message);
            setRequestSent(false);
          }
        })
        .catch((error) => {
          message.error(error.message);
          setRequestSent(false);
        });
    } else {
      axios
        .post(`academic/diary/reason/create/`, payload)
        .then((res) => {
          if (res.data.status_code === 201) {
            message.success('Reason mentioned successfully');
            handleCloseFeedbackModal();
            fetchTeacherwiseReport({
              acad_session_id: selectedBranch?.id,
              section_mapping: selectedSection?.section_mapping,
              subject_id: subjectID,
              date,
            });
          } else {
            message.error(res.data.message);
            setRequestSent(false);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
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
  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setRequestSent(false);
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
    setSubjectwiseStats();
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
        width: tableWidthCalculator(20) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: <span className='th-white th-fw-700 '>TEACHER'S NAME</span>,
        // dataIndex: 'name',
        align: 'center',
        width: '20%',
        render: (data, text) => (
          <span className='th-black-2'>
            {data?.name} {data?.is_substitute_diary ? `(Substitute)` : null}
          </span>
        ),
      },
      {
        title: <span className='th-white th-fw-700 '>CREATED AT</span>,
        dataIndex: 'created_at',
        align: 'center',
        width: '30%',
        render: (data) => (
          <span className='th-black-2'>
            {data !== 0 ? moment(data).format('hh:mm a') : null}
          </span>
        ),
      },
      {
        title: <span className='th-white th-fw-700 '>REASON</span>,
        dataIndex: 'reason',
        align: 'center',
        width: '30%',

        render: (text, row) =>
          !_.isEmpty(row?.reason_details) ? (
            <div className='d-flex justify-content-center'>
              <div className='text-truncate' style={{ maxWidth: 200 }}>
                <Tooltip
                  placement='bottomRight'
                  title={<span className=''>{row?.reason_details?.reason}</span>}
                  trigger='hover'
                  className='th-pointer'
                  zIndex={2000}
                >
                  <span className=''>
                    {row?.reason_details?.is_class_cancelled
                      ? 'Class Cancelled'
                      : row?.reason_details?.reason}
                  </span>
                </Tooltip>
              </div>
              {user_level !== 11 && (
                <div>
                  <Tag
                    icon={<EditOutlined />}
                    color='geekblue'
                    className='th-pointer th-br-6 ml-2'
                    onClick={() => {
                      setSelectedTeacher(row);
                      setShowFeedbackModal(true);
                      setReasonId(row?.reason_details?.reason_id);
                      setTimeout(() => {
                        formRef.current.setFieldsValue({
                          description: row?.reason_details?.reason,
                        });
                      }, 100);
                      setIsClassCancelled(row?.reason_details?.is_class_cancelled);
                    }}
                  >
                    Edit
                  </Tag>
                </div>
              )}
            </div>
          ) : user_level == 11 || row?.created_at !== 0 ? null : (
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
        title: '',
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
        showHeader={true}
        bordered={false}
        style={{ width: '100%' }}
        className='th-inner-table-head-bg'
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
          {user_level == 11
            ? null
            : // tableExpanded
              //   ? 'TOTAL TEACHERS'
              //   : null
              'TOTAL TEACHERS'}
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
      title: <span className='th-white th-fw-700'>TOTAL ASSIGNED</span>,
      dataIndex: 'diary_count',
      align: 'center',
      width: '30%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PENDING</span>,
      dataIndex: 'pending_diaries',
      align: 'center',
      width: '30%',
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
              <div className='row row pb-2 pt-1'>
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
            onCancel={handleCloseFeedbackModal}
            className='th-upload-modal'
            centered
            footer={[
              <>
                <Button
                  className='text-center th-br-10 th-bg-grey th-black-2'
                  onClick={() => {
                    formRef.current.setFieldsValue({ description: null });
                    setDescription('');
                  }}
                >
                  Clear
                </Button>

                <Button
                  className='text-center th-br-10 th-bg-primary th-white'
                  onClick={handleSubmit}
                  form='reasonForm'
                  htmlType='submit'
                  disabled={requestSent}
                >
                  <strong>{reasonId ? 'Update' : 'Submit'}</strong>
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
                      checked={isClassCancelled}
                      onChange={handleCancellationCheck}
                    />
                  </Form.Item>
                </div>
                <div className='col-12'>
                  <Form.Item
                    name='description'
                    label='Reason'
                    rules={[
                      {
                        required: isClassCancelled ? false : true,
                        message: 'Please Add Description',
                      },
                    ]}
                  >
                    <TextArea
                      rows={5}
                      // disabled={isClassCancelled}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Enter Reason'
                      maxLength={150}
                      showCount={true}
                      // value={description}
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
