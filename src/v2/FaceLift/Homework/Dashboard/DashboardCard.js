import React, { useState } from 'react';
import DashboardDrawer from './DashboardDrawer';
import { Switch, Table, Tag } from 'antd';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useHistory } from 'react-router-dom';

const DashboardCard = ({
  dashboardLevel,
  startDate,
  endDate,
  visibleLevel,
  level1Data,
  level2Data,
  level3Data,
  setDashboardLevel,
  fetchGradeWise,
  fetchSectionWise,
  tableData,
  fetchSubjectWise,
  fetchStudentList,
  teacherId,
  subjectId,
  showAbsolute,
  loading,
  tableLoading,
}) => {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [secMapId, setSecMapId] = useState();
  const [evaluationChart, setEvaluationChart] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userDetails'));

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  console.log({ dashboardLevel, isCollapsed, selectedCardIndex });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showDrawer = (data) => {
    setDrawerVisible(true);
    setDashboardLevel(parseInt(dashboardLevel) + 1);
    setIsCollapsed(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setDashboardLevel(parseInt(dashboardLevel) - 1);
    setIsCollapsed(true);
  };

  const selectCard = (index) => {
    setSelectedCardIndex(index);
  };

  const tableColumns = [
    {
      title: (
        <span className='th-white th-12 th-fw-500 '>
          {visibleLevel === 'branch'
            ? 'Grade'
            : visibleLevel === 'grade'
            ? 'Section'
            : null}
        </span>
      ),
      width: '18%',
      align: 'left',
      dataIndex: 'name',
      render: (data, record) => <span className='th-black-1 th-12'>{data}</span>,
    },
    {
      title: (
        <span className='th-white th-12 th-fw-500'>
          Pending {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-12'>
          {showAbsolute
            ? record?.numberCounts?.pending
            : record?.percentageCounts?.p_pending}
        </span>
      ),
    },

    {
      title: (
        <span className='th-white th-12 th-fw-500'>
          Submitted {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-12'>
          {showAbsolute
            ? record?.numberCounts?.submitted
            : record?.percentageCounts?.p_submitted}
        </span>
      ),
    },
    {
      title: (
        <span className='th-white th-12 th-fw-500'>
          Evaluated {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-12'>
          {showAbsolute
            ? record?.numberCounts?.evaluated
            : record?.percentageCounts?.p_eval_sub}
        </span>
      ),
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Total</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'numberCounts',
      render: (data, record) => (
        <span className='th-black-1 th-12'>{data?.assigned}</span>
      ),
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Action</span>,
      width: '10%',
      align: 'center',
      render: (data, record) => (
        <span
          className='th-12 th-pointer text-primary'
          onClick={() => {
            if (visibleLevel === 'branch') {
              fetchSectionWise({
                start_date: startDate,
                end_date: endDate,
                grade_id: record?.id,
                acadsession_id: level1Data?.[selectedCardIndex]?.acad_session_id,
                teacher_id: teacherId,
                subject_id: subjectId,
              });
            } else if (visibleLevel === 'grade') {
              fetchSubjectWise({
                start_date: startDate,
                end_date: endDate,
                section_mapping_id: record?.id,
                teacher_id: visibleLevel === 'grade' && userData?.user_id,
                subject_id: subjectId,
              });
              setSecMapId(record?.id);
            }
            showDrawer();
          }}
        >
          <EyeOutlined />
        </span>
      ),
    },
  ];

  const optionPie = {
    chart: {
      type: 'pie',
    },

    title: {
      verticalAlign: 'middle',
      floating: true,
      text:
        visibleLevel === 'branch' && dashboardLevel === 0
          ? 'Branch'
          : visibleLevel === 'branch' && dashboardLevel === 1
          ? 'Section'
          : visibleLevel === 'grade' && dashboardLevel === 0
          ? 'Grade'
          : visibleLevel === 'subject' && dashboardLevel === 1
          ? 'Subject'
          : null,
      y: 18,
    },
    colors: ['#065471', '#FFC045', '#0A91AB'],
    // colors: ['#05B187', '#16BCC7', '#FEC90F'],
    credits: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        shadow: false,
      },
    },
    tooltip: {
      formatter: function () {
        return (
          '<b>' + this.point.name + '</b>: ' + this.y + `${!showAbsolute ? ' %' : ''}`
        );
      },
    },
    series: [
      {
        data: evaluationChart
          ? [
              [
                'Evaluated',
                showAbsolute
                  ? level1Data[selectedCardIndex]?.numberCounts?.evaluated
                  : level1Data[selectedCardIndex]?.percentageCounts?.p_eval_sub,
              ],
              [
                'Non Evaluated',
                showAbsolute
                  ? level1Data[selectedCardIndex]?.numberCounts?.non_evaluated
                  : level1Data[selectedCardIndex]?.percentageCounts?.p_non_eval_sub,
              ],
            ]
          : [
              [
                'Pending',
                showAbsolute
                  ? level1Data[selectedCardIndex]?.numberCounts?.pending
                  : level1Data[selectedCardIndex]?.percentageCounts?.p_pending,
              ],
              [
                'submitted',
                showAbsolute
                  ? level1Data[selectedCardIndex]?.numberCounts?.submitted
                  : level1Data[selectedCardIndex]?.percentageCounts?.p_submitted,
              ],
            ],
        size: '80%',
        innerSize: '50%',
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-7 col-12 pl-0 dashboard-stat p-1'>
          {Array.isArray(level1Data) && level1Data?.length > 0
            ? level1Data?.map((item, index) => (
                <div
                  className='stat-card row th-bg-white py-2 th-br-12 mb-2 align-items-center'
                  key={index}
                  style={{
                    outline: selectedCardIndex === index ? '1px solid #1B4CCB' : '',
                  }}
                  onClick={(e) => selectCard(index)}
                >
                  <div className='col-md-9'>
                    <h4 className='th-20 mb-1 text-primary'>{item?.name}</h4>
                    <div className='stat-count th-bg-grey th-br-6'>
                      <div className='d-flex justify-content-between px-3 py-2 align-items-center'>
                        <div className='th-12 th-grey'>
                          <span className='th-fw-600'>
                            {showAbsolute
                              ? `${item?.numberCounts?.pending} `
                              : `${item?.percentageCounts?.p_pending}% `}
                          </span>
                          Pending
                        </div>
                        <div className='th-12 th-grey'>
                          <span className='th-fw-600'>
                            {showAbsolute
                              ? `${item?.numberCounts?.submitted} `
                              : `${item?.percentageCounts?.p_submitted}% `}
                          </span>
                          Submitted
                        </div>
                        <div className='th-12 th-grey'>
                          <span className='th-fw-600'>
                            {showAbsolute
                              ? `${item?.numberCounts?.evaluated} `
                              : `${item?.percentageCounts?.p_eval_sub}% `}
                          </span>
                          Evaluated
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-3 text-center'>
                    <h4 className='mb-0 th-16 text-right'>
                      {item?.numberCounts?.assigned}{' '}
                      <span className='th-grey'>Assigned</span>
                    </h4>
                    {dashboardLevel <= 1 && visibleLevel !== 'subject' && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => {
                          if (visibleLevel === 'branch') {
                            fetchGradeWise({
                              start_date: startDate,
                              end_date: endDate,
                              acadsession_id: item?.acad_session_id,
                              subject_id: subjectId,
                              teacher_id: visibleLevel === 'branch' && teacherId,
                            });
                          } else if (visibleLevel === 'grade') {
                            fetchSectionWise({
                              start_date: startDate,
                              end_date: endDate,
                              grade_id: item?.id,
                              acadsession_id: selectedBranch?.id,
                              teacher_id: visibleLevel === 'grade' && userData?.user_id,
                              subject_id: subjectId,
                            });
                          }
                          toggleCollapse();
                        }}
                      >
                        {visibleLevel === 'branch'
                          ? 'Grade'
                          : visibleLevel === 'grade'
                          ? 'Section'
                          : null}

                        <RightCircleOutlined />
                      </Tag>
                    )}
                    {visibleLevel === 'subject' && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => history.push(`/homework/student`)}
                      >
                        Homework <RightCircleOutlined />
                      </Tag>
                    )}
                  </div>

                  {!isCollapsed && selectedCardIndex === index ? (
                    <div
                      className={`dashboard-table-collapse ${
                        isCollapsed ? 'dashboard-content-collapsed' : ''
                      }`}
                    >
                      <div className='col-md-12 mt-2 dashboard-table'>
                        <Table
                          size='small'
                          className='th-table'
                          columns={tableColumns}
                          rowKey={(record) => record?.id}
                          dataSource={tableData}
                          pagination={false}
                          loading={tableLoading}
                          scroll={{ y: '100px' }}
                          style={{ minHeight: 100 }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            : null}
        </div>
        <div className='col-md-5 text-center col-12' style={{ minHeight: '150px' }}>
          <div className='th-bg-white th-br-10 p-3'>
            <div className='row align-items-center mt-2'>
              <div className='col-8 text-left'>{level1Data[selectedCardIndex]?.name}</div>
              <div className='col-4'>
                <Switch
                  checkedChildren='Evaluation'
                  unCheckedChildren='Submission'
                  className='float-right'
                  defaultChecked={evaluationChart}
                  onChange={() => setEvaluationChart(!evaluationChart)}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <HighchartsReact highcharts={Highcharts} options={optionPie} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {console.log({ level1Data })}
      <DashboardDrawer
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        level1Data={level1Data}
        level2Data={level2Data}
        level3Data={level3Data}
        startDate={startDate}
        endDate={endDate}
        teacherId={teacherId}
        subjectId={subjectId}
        dashboardLevel={dashboardLevel}
        setDashboardLevel={setDashboardLevel}
        fetchSubjectWise={fetchSubjectWise}
        fetchStudentList={fetchStudentList}
        tableData={tableData}
        acad_session_id={level1Data?.[selectedCardIndex]?.acad_session_id}
        visibleLevel={visibleLevel}
        secMapId={secMapId}
        loading={loading}
        tableLoading={tableLoading}
      />
    </React.Fragment>
  );
};

export default DashboardCard;
