import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import { generateQueryParamSting } from '../../../utility-functions';
import {
  Breadcrumb,
  Drawer,
  Select,
  Table,
  Tabs,
  Tag,
  message,
  Result,
  Empty,
} from 'antd';
import QuestionPaperInfo from './questionPaperInfo';
import endpoints from '../../../config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import axiosInstance from '../../../config/axios';
import './view-assessment.css';
import GrievanceModal from 'v2/FaceLift/myComponents/GrievanceModal';
import FeeReminderAssesment from 'containers/assessment-central/Feereminder';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { SmileOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const isOrchids =
  window.location.host.split('.')[0] === 'orchids' ||
  window.location.host.split('.')[0] === 'qa'
    ? true
    : false;

const getSearchParams = (propsObj) => {
  const { location: { search = '' } = {} } = propsObj;
  const urlParams = new URLSearchParams(search); // search = ?open=true&qId=123
  const searchParamsObj = Object.fromEntries(urlParams); // {open: "true", def: "[asf]", xyz: "5"}
  return searchParamsObj;
};

const { TabPane } = Tabs;
const ViewAssessments = ({ history, ...restProps }) => {
  const {
    user_id: user,
    role_details: { grades: userGrades },
  } = JSON.parse(localStorage.getItem('userDetails') || {});
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [loading, setLoading] = useState(true);
  const [testsList, setTestsList] = useState([]);
  const [pageNumber, setPageNumber] = useState(+getSearchParams(restProps).page || 1);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState(+getSearchParams(restProps).status || 0);
  const IsTestDone = JSON.parse(localStorage.getItem('is_test_comp')) || {};
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'));
  const getInfoDefaultVal = () => {
    const questionPaperId = getSearchParams(restProps).info;
    return questionPaperId || undefined;
  };
  const [showInfo, setShowInfo] = useState(getInfoDefaultVal());
  const [testDate, setTestDate] = useState();
  const [assessmentType, setAssessmentType] = useState();
  const query = new URLSearchParams(window.location.search);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();

  useEffect(() => {
    localStorage.setItem('is_retest', query.get('status') === '2');
    fetchSubjectData({
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      // module_id: moduleId,
      grade: userGrades[0]?.grade_id,
    });
  }, []);

  useEffect(() => {
    if (IsTestDone === true) {
      setStatus(1);
      localStorage.setItem('is_test_comp', false);
    }
    localStorage.setItem('is_test_comp', false);
  }, [IsTestDone]);

  useEffect(() => {
    setShowInfo();
  }, [window.location.pathname]);

  const fetchTestList = () => {
    setTotalCount(0);
    setLoading(true);
    const statusId = status == 0 ? 2 : 1;
    let params =
      status == 0 || status == 1
        ? {
            user: user,
            page: pageNumber,
            // page_size: 9,
            status: statusId,
            session_year: sessionYear?.id,
          }
        : {
            page: pageNumber,
            // page_size: 9,
            session_year: sessionYear?.id,
          };
    let endpoint =
      status == 0 || status == 1
        ? endpoints.assessment.questionPaperList
        : endpoints.assessment.retestQuestionPaperList;
    axiosInstance
      .get(`${endpoint}`, {
        params: { ...params, ...(subjectId ? { subjects: subjectId } : {}) },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setTestsList(response?.data?.result?.results);
          setTotalCount(response?.data?.result?.count);
        } else {
          const { data: { message } = {} } = response;
          message.error(`${message || 'Failed to fetch assessments.'}`);
        }
      })
      .catch((error) => {
        setTestsList([]);
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchSubjectData = (params = {}) => {
    axiosInstance
      .get(`${endpointsV2.lessonPlan.allSubjects}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  useEffect(() => {
    fetchTestList();
  }, [pageNumber, status, subjectId]);

  const handlePagination = (page) => {
    setPageNumber(page);
  };
  const handleCloseGrievanceModal = () => {
    setShowGrievanceModal(false);
  };

  const handleShowInfo = (paperInfoObj) => {
    setShowInfo(paperInfoObj.id);
    setTestDate(paperInfoObj.test_date);
    setAssessmentType(paperInfoObj?.test_type_name);
    setShowInfoDrawer(true);
  };

  useEffect(
    () =>
      history.push(
        `/assessment/?${generateQueryParamSting({
          page: pageNumber,
          info: showInfo,
          status,
        })}`
      ),
    [showInfo, pageNumber, status]
  );
  const handleCloseInfo = () => {
    setShowInfo(undefined);
    setShowInfoDrawer(false);
  };
  let columns = [
    {
      title: <span className='th-white th-fw-700 '>Sl no.</span>,
      render: (text, row, index) => (
        <span className='th-black-1 th-14 pl-4'>
          {(pageNumber - 1) * 15 + index + 1}.
        </span>
      ),
      visible: true,
    },
    {
      title: <span className='th-white th-fw-700'>Subject</span>,
      dataIndex: 'subject_name',
      render: (data) => (
        <div className='th-black-1 th-14 text-wrap th-width-100' title={data?.toString()}>
          {data?.map((el) => el).join(', ')}
        </div>
      ),
      visible: true,
    },
    {
      title: <span className='th-white th-fw-700'>Test Name</span>,
      dataIndex: 'test_name',
      width: '20%',
      render: (data) => (
        <div className='th-black-1 th-14 text-truncate th-width-95' title={data}>
          {data}
        </div>
      ),
      visible: true,
    },
    {
      title: <span className='th-white th-fw-700'>Test Mode</span>,
      dataIndex: 'test_mode',
      render: (data) => (
        <span className='th-black-1 th-14'>{data == '1' ? 'Online' : 'Offline'}</span>
      ),
      visible: true,
    },
    {
      title: <span className='th-white th-fw-700'>Test Type</span>,
      dataIndex: 'test_type_name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
      visible: status == 2 ? false : true,
    },
    {
      title: <span className='th-white th-fw-700'>Marks</span>,
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1 th-14'>
          {row?.is_test_completed?.marks_obtained != 'null'
            ? row?.is_test_completed?.marks_obtained
            : row?.test_mode == '1'
            ? 'Not Attempted'
            : 'Not Uploaded'}
        </span>
      ),
      visible: status == 1 ? true : false,
    },
    {
      title: <span className='th-white th-fw-700'>Test Date & Time</span>,
      dataIndex: 'test_date',
      width: '22%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data ? moment(data).format('llll') : '-'}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      render: (data) => (
        <div>
          <Tag
            color='processing'
            className='th-br-5 py-1 px-2 th-pointer'
            onClick={() => handleShowInfo(data)}
          >
            View More
          </Tag>
        </div>
      ),
      visible: true,
    },
  ].filter((el) => el?.visible !== false);

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });

  const TestListTable = () => {
    return (
      <div className='pb-3'>
        <div className='col-12 pb-2'>
          <div className='row align-items-center'>
            <div className='th-black-1 th-fw-600 th-16'>Subject</div>
            <div className='pl-2 col-sm-2 col-6'>
              <Select
                placeholder='Select Subject'
                showSearch
                allowClear
                value={subjectId}
                optionFilterProp='children'
                getPopupContainer={(trigger) => trigger.parentNode}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={(e) => {
                  setPageNumber(1);
                  if (e) {
                    setSubjectId(e);
                  } else {
                    setSubjectId(e);
                  }
                }}
                className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                bordered={true}
              >
                {subjectOptions}
              </Select>
            </div>
          </div>
        </div>
        <div className='col-md-12'>
          <Table
            className='th-table'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            columns={columns}
            dataSource={testsList}
            locale={{
              emptyText: (
                <div>
                  {!loading ? (
                    status == 0 ? (
                      <Result
                        icon={<SmileOutlined />}
                        title={
                          <span>
                            Great news! There are currently no tests scheduled for the
                            upcoming days.
                          </span>
                        }
                        subTitle={
                          <span>
                            It's a perfect opportunity to focus on your studies, revise
                            your lessons, and prepare for any future assessments.
                            Remember, consistent learning and practice are key to
                            achieving academic success.
                          </span>
                        }
                      />
                    ) : status == 1 ? (
                      <Result
                        icon={<InfoCircleOutlined />}
                        title={<span>There are no completed tests for you.</span>}
                        subTitle={
                          <span>
                            Remember, learning is a continuous journey, and there will be
                            more opportunities for growth and success in the future. Keep
                            up the excellent work and maintain your enthusiasm for
                            learning!
                          </span>
                        }
                      />
                    ) : (
                      <Empty description={'No Retest available'} />
                    )
                  ) : null}
                </div>
              ),
            }}
            pagination={{
              position: ['bottomCenter'],
              total: totalCount,
              current: Number(pageNumber),
              pageSize: 15,
              showSizeChanger: false,
              onChange: (e) => {
                handlePagination(e);
              },
            }}
            scroll={{ y: '400px' }}
          />
        </div>
      </div>
    );
  };
  return (
    <>
      <Layout>
        {user_level == 13 ? <FeeReminderAssesment /> : ''}
        <div className='row pt-3 align-items-center'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16'>Assessments</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-tabs th-bg-white th-assessment-tabs mb-3'>
              <Tabs
                type='card'
                onChange={(e) => {
                  setPageNumber(1);
                  setStatus(e);
                  setShowInfo(undefined);
                  localStorage.setItem('is_retest', e === 2);
                }}
                activeKey={status.toString()}
              >
                <TabPane tab='UPCOMING' key={'0'}>
                  {TestListTable()}
                </TabPane>
                <TabPane tab='COMPLETED' key={'1'}>
                  {TestListTable()}
                </TabPane>
                <TabPane tab='RETEST' key={'2'}>
                  {TestListTable()}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
        {(user_level == 13 || user_level == 12) && isOrchids ? (
          <div className='' style={{ position: 'fixed', bottom: '5%', right: '2%' }}>
            <div
              className='th-bg-white px-2 py-1 th-br-6 th-pointer'
              style={{ border: '1px solid #d9d9d9' }}
              onClick={() => setShowGrievanceModal(true)}
            >
              Issues with Assessment/ Marks? <br />
              <span className='th-primary pl-1' style={{ textDecoration: 'underline' }}>
                Raise your query
              </span>
            </div>
          </div>
        ) : null}
        {showGrievanceModal && (
          <GrievanceModal
            module={'Asssessment'}
            title={'Assessment Related Query'}
            showGrievanceModal={showGrievanceModal}
            handleClose={handleCloseGrievanceModal}
          />
        )}
        <Drawer
          title='Assessment Details'
          className='th-activity-drawer'
          visible={showInfoDrawer}
          onClose={() => {
            setShowInfo();
            setShowInfoDrawer(false);
          }}
          width={'50vw'}
          closable={null}
        >
          <QuestionPaperInfo
            assessmentId={showInfo}
            assessmentDate={testDate}
            assessmentType={assessmentType}
            key={showInfo}
            loading={loading}
            handleCloseInfo={handleCloseInfo}
          />
        </Drawer>
      </Layout>
    </>
  );
};
export default withRouter(ViewAssessments);
