import React, { useState, useEffect, createRef } from 'react';
import { Select, Form, message, Spin, Breadcrumb, Table, Tooltip, Button } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import { useHistory, useLocation } from 'react-router-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import Layout from 'containers/Layout';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  CaretRightOutlined,
  RightCircleOutlined,
  RightOutlined,
  EyeFilled,
} from '@ant-design/icons';
import {  PlusOutlined} from '@ant-design/icons';

const { Option } = Select;

const Chapterwise = () => {
  const formRef = createRef();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // const questionId = query.get('question');
  // const section = query.get('section');
  // const isEdit = query.get('isedit');
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState('');
  const [boardListData, setBoardListData] = useState([]);
  const [boardId, setBoardId] = useState();
  const [YCPPlanData, setYCPPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [annualPlanData, setAnnualPlanData] = useState([]);
  const [keyConceptsData, setKeyConceptsData] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [loadingInner, setLoadingInner] = useState(false);
  const [selectedKeyConcept, setSelectedKeyConcept] = useState([]);
  const [boardName , setBoardName] = useState('CBSE')
  const filters = history?.location?.state?.filters
  const [questionId , setQuestionId] = useState(query.get('question'))
  const [section , setSection] = useState(query.get('section'))
  const [isEdit , setIsEdit] = useState(query.get('isedit'))
  // const fetchchapterwiseData = (params = {}) => {
  //   setFiltered(true);
  //   setLoading(true);
  //   axios
  //     .get(`academic/annual-plan/volumes/`, {
  //       params: { ...params },
  //     })
  //     .then((res) => {
  //       if (res?.data?.status === 200) {
  //         setAnnualPlanData(res?.data?.data);
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //         setAnnualPlanData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       message.error(error.message);
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
if(filters){
setBoardName(filters?.boardName)
setSubjectName(filters?.subjectName)
// setGradeName(filters?.gradeName)
setBoardId(filters?.boardId)
// setGradeId(filters?.gradeId)
// setSubjectId(filters?.subjectId)
handleGrade({
  value : filters?.grade,
  children : filters?.gradeName
})
handleSubject({
  value : filters?.subjectId,
  children : filters?.subjectName
})
if(filters.questionId){
  setQuestionId(filters?.questionId)
  setSection(filters?.section)
  setIsEdit(filters?.isEdit)
}

}
  },[filters])

  // useEffect(()=>{
  //   if(filters && gradeId){
      
  //   }

  // },[gradeId])

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          if (user_level == 13) {
            setGradeId(res?.data?.data[0]?.grade_id);
            setGradeName(res?.data?.data[0]?.grade__grade_name);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.subjects}`, {
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
  // const fetchBoardListData = () => {
  //   axios
  //     .get(`/academic/get-board-list/`)
  //     .then((result) => {
  //       if (result?.data?.status_code === 200) {
  //         setBoardListData(result?.data?.result);
  //         // if (!boardFilterArr.includes(window.location.host)) {
  //         let data = result?.data?.result?.filter(
  //           (item) => item?.board_name === 'CBSE'
  //         )[0];
  //         setBoardId(data?.id);
  //         setBoardName(data?.board_name)
  //         // }
  //       }
  //     })
  //     .catch((error) => {
  //       message.error(error.message);
  //     });
  // };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      // subject: null,
      // board: null,
    });
    setSubjectData([]);
    setSubjectId('');
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: item.value,
      });
    }
  };
  const handleClearGrade = () => {
    setGradeId('');
    setGradeName('');
    setSubjectId('');
    setSubjectName('');
  };
  const handleSubject = (item) => {
    // formRef.current.setFieldsValue({
    //   board: [],
    // });
    if (item) {
      setSubjectId(item.value);
      setSubjectName(item.children);
    }
  };
  const handleClearSubject = () => {
    setSubjectId('');
    setSubjectName('');
  };
  const handleBoard = (e,value) => {
    setBoardId(e);
    setBoardName(value?.children)
  };
  const handleClearBoard = () => {
    setBoardId('');
    setBoardName('')
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  useEffect(() => {
    if (moduleId) {
      fetchGradeData();
      // fetchBoardListData();
      // fetchResourceYear();
    }
  }, [moduleId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Question Bank') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (subjectId && gradeId) {
      fetchAnnualPlanData({
        grade: gradeId,
        // volume_id: 38,
        subject: subjectId,
        academic_session: selectedBranch?.id,
        academic_year : selectedAcademicYear?.session_year,
        session_year : selectedAcademicYear?.id
        // board: boardId,
      });
    }
  }, [subjectId, boardId, gradeId]);

  const fetchKeyConceptsData = (params = {}) => {
    setLoadingInner(true);
    axios
    .get(`assessment/question_count/?chapter_id=${params?.chapter_id}&is_central=${params?.is_central ? 1 : 0}`, {
      // .get(`academic/annual-plan/key-concepts/`, { 
        // params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setKeyConceptsData(result?.data?.result);
          setLoadingInner(false);
        } else {
          setLoadingInner(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingInner(false);
      });
  };

  const fetchAnnualPlanData = (params = {}) => {
    setFiltered(true);
    setLoading(true);
    axios
      .get(`assessment/v1/questions-list/`, { //questions-list-V1/
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let filteredchapters = result?.data?.result?.filter((item) => item?.keyconcept !== null)
          setAnnualPlanData(filteredchapters);
          // setYCPData(result?.data?.data?.lp_ycp_data);
          // setFiltered(false)
          setLoading(false);
        } else {
          setAnnualPlanData([]);
          // setYCPData([]);
          // setFiltered(false)
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        // setFiltered(false)
        setLoading(false);
      });
  };

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    setKeyConceptsData([]);
    if (expanded) {
      keys.push(record.chapter_id);
      setSelectedChapter(record);
      fetchKeyConceptsData({
        chapter_id: record.chapter_id,
        is_central : record?.is_central
      });
    }

    setExpandedRowKeys(keys);
  };

  const fetchQuestionCards = (data) => {
    setLoading(true);
    const params = {
      grade: gradeId,
      academic_session: selectedBranch?.id,
      topic: data?.id,
      chapter: data?.chapter_id,
      boardName: boardName,
      boardId : boardId,
      gradeName : gradeName,
      subjectName : subjectName,
      subjectId : subjectId,
      questionId :  questionId,
      section :  section,
      isEdit :  isEdit,
       
      // request_type : 1
    };
    history.push({
      pathname: '/question-bank',
      state: {
        params : params
      } 
    });
  };

  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '15%',
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '30%',
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '25%',
        visible: 'false',
      },
      {
        title: '',
        dataIndex: 'topic_name',
        align: 'center',
        width: tableWidthCalculator(40) + '%',
        render: (text, row, index) => {
          return (
            <div
              className='th-black-1 th-pointer'
              // style={{ maxWidth: window.innerWidth < 768 ? '140px' : '300px' }}
            >
              {/* <div className='col-md-2 col-0'></div>
              <div className='col-md-10 col-12 px-md-0'> */}
              <Tooltip
                placement='bottom'
                title={<span>{row.topic_name}</span>}
              >
                {/* <div className='text-truncate th-width-95 text-center'> */}
                {index + 1}. {row.topic_name}
                {/* </div> */}
              </Tooltip>
              {/* </div> */}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '15%',
        render: (text , row , index) => {return (
          // <span className='th-black-1'>{data}</span>
          <div row style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className='w-20'>
            {row?.eduvate_qp_count != 0 ? <div //onClick={fetchQuestionCards(data)}
              style={{ border: '1px solid #0DCFE0', background: '#0DCFE0', width: '100%',color:'white' , borderRadius:'15px' }}
            > 
              {row?.eduvate_qp_count}
            </div> : null}
            </div>
          <div className='w-20'>
          {row?.school_qp_count !=0 ? <div
              style={{ border: '1px solid #B83AF4', background: '#B83AF4', width: '100%' ,color:'white',borderRadius:'15px'}}
            >
             {row?.school_qp_count}

            </div> : null}
          </div>
            
          </div>
        )}
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: '5%',
        render: (data) => (
          <span className='th-black-1'>
            <RightOutlined />
          </span>
        ),
      },
    ].filter((item) => item.visible !== 'false');

    return (
      <Table
        columns={innerColumn}
        dataSource={keyConceptsData}
        loading={loadingInner}
        pagination={false}
        showHeader={false}
        bordered={false}
        rowClassName={(record, index) => 'th-pointer th-row'}
        onRow={(row, rowIndex) => {
          return {
            onClick: (event) => {
              setSelectedKeyConcept(row);
              // fetchLessonResourcesData(row);
              fetchQuestionCards(row);
            },
          };
        }}
      />
    );
  };

  const columns = [
    {
      title: <span className='th-white pl-md-4 th-fw-700 '>SL NO.</span>,
      align: 'center',
      width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },

    {
      title: <span className='th-white th-fw-700 '>CHAPTER</span>,
      dataIndex: 'chapter_name',
      width: '30%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MODULE</span>,
      dataIndex: 'chapter__lt_module__lt_module_name',
      width: '25%',
      align: 'left',
      visible: 'false',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>KEY CONCEPTS</span>,
      dataIndex: 'keyconcept',
      width: '40%',
      align: 'center',
      render: (data) => <span className='th-black-1'>{data === null ? 0 : data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Question Count</span>,
      dataIndex: '',
      width: '15%',
      align: 'center',
      render: (text , row, index) => {
        return (
          // <div className='d-flex justify-content-center' >
          // <div style={{ border: '1px solid #0DCFE0', background: '#0DCFE0', width:'45%' }}>{data}</div>
          // </div>
          <div row style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className='w-20'>{(row?.eduvate_qp_count != 0 && row?.eduvate_qp_count != null) ? <div
            style={{ border: '1px solid #0DCFE0', background: '#0DCFE0', width: '100%',color:'white' ,borderRadius:'15px'}}
            >
              {row?.eduvate_qp_count}
            </div>: null}</div>
            <div className='w-20'>
            {(row?.school_qp_count != 0 && row?.school_qp_count != null) ? <div
            style={{ border: '1px solid #B83AF4', background: '#B83AF4', width: '100%',color:'white', borderRadius:'15px' }}
            >
              {row?.school_qp_count  === null ? 0 : row?.school_qp_count}
            </div> : null}
            </div>
            
          </div>
        );
      },
    },
  ].filter((item) => item.visible !== 'false');

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-8 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-18'>Assessment</Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                Question Bank
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row th-bg-white py-2'>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                {/* {boardFilterArr.includes(window.location.host) && ( */}
                  {/* <div className='col-md-2 col-6 pl-0'>
                    <div className='mb-2 text-left'>Board</div>
                    <Form.Item name='board'>
                      <Select
                      allowClear
                        placeholder='Select Board'
                        showSearch
                        defaultValue={boardName}
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e,value) => {
                          handleBoard(e,value);
                        }}
                        onClear={handleClearBoard}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={false}
                      >
                        {boardOptions}
                      </Select>
                    </Form.Item>
                  </div> */}
                {/* )} */}
                <div className='col-md-2 col-6 px-0 pl-0'>
                  <div className='mb-2 text-left' style={{marginLeft : '4%'}}>Grade</div>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder={
                        gradeName ? (
                          <span className='th-black-1'>{gradeName}</span>
                        ) : (
                          'Select Grade'
                        )
                      }
                      showSearch
                      disabled={user_level == 13}
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
                      onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                  <div className='mb-2 text-left' style={{marginLeft : '4%'}}>Subject</div>
                  <Form.Item name='subject'>
                    <Select
                    allowClear
                      placeholder={
                        subjectName ? (
                          <span className='th-black-1'>{subjectName}</span>
                        ) : (
                          'Select Subject'
                        )
                      }
                      showSearch
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      // defaultValue={subjectName}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>

                </div>
                <div
                  className='col-md-6 col-12 px-0'
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  {section && questionId && <Button
                    type='primary'
                    onClick={
                      isEdit
                        ? () => history.push(`/create-question-paper/${isEdit}`)
                        : () => history.push(`/create-question-paper?show-question-paper=true`)
                    }
                    shape="round"
                    style={{marginLeft : '30%'}}
                    className='th-br-6 w-30 th-fw-500'
                  >
                    Back
                  </Button>}

                  <Button
                    type='primary'
                    onClick={() => history.push('/create-question')}
                    style={{marginRight:'2%'}}
                    // size={'small'}
                    shape="round"
                    className='th-br-6 w-30 th-fw-500'
                  >
                  <PlusOutlined size='small'/>
                    Create New
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className='col-12' style={{ display: 'flex', justifyContent: 'flex-end' , marginBottom:'1%'}}>
            <div
              className='col-md-6 col-8 pl-0'
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <div className='col-md-3 col-3 px-0'>Questions Index :</div>
              <div
                className='col-md-2 col-3 px-0'
                style={{
                  background: '#0DCFE0',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '15px',
                  marginRight: '32px',
                  color:'white'
                }}
              >
                Eduvate
              </div>
              <div
                className='col-md-2 col-3 px-0'
                style={{
                  background: '#B83AF4',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '15px',
                  color:'white'
                }}
              >
                School
              </div>
            </div>
          </div>
          {!filtered ? (
            <div className='row justify-content-center my-3 th-24 th-black-2'>
              Please select the filters to show data!
            </div>
          ) : (
            <>
              {loading ? (
                <div className='row justify-content-center my-3'>
                  <Spin title='Loading...' />
                </div>
              ) : annualPlanData.length > 0 ? (
                <div className='col-12'>
                  <Table
                    className='th-table '
                    rowClassName={(record, index) =>
                      `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                    }
                    expandRowByClick={true}
                    columns={columns}
                    rowKey={(record) => record?.chapter_id}
                    expandable={{ expandedRowRender }}
                    dataSource={annualPlanData}
                    pagination={false}
                    loading={loading}
                    onExpand={onTableRowExpand}
                    expandedRowKeys={expandedRowKeys}
                    expandIconColumnIndex={5}
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
                    scroll={{ x: 'max-content', y: 600 }}
                  />
                </div>
              ) : (
                <div className='row justify-content-center my-5'>
                  <img src={NoDataIcon} />
                </div>
              )}
            </>
          )}
        </div>
        {/* <TableView /> */}
      </Layout>
    </React.Fragment>
  );
};

export default Chapterwise;
