import React, { useState } from 'react';
import DashboardChildDrawer from './DashboardChildDrawer';
import { Switch, Table, Tag } from 'antd';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DashboardChildCard = ({
  dashboardLevel,
  startDate,
  endDate,
  cardData,
  setDashboardLevel,
  tableData,
  fetchSubjectWise,
  fetchStudentList,
  acad_session_id,
  level1Data,
  level2Data,
  level3Data,
  visibleLevel,
  secMapId,
  showAbsolute,
  loading,
  tableLoading,
  subjectId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [evaluationChart, setEvaluationChart] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userDetails'));

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  console.log({ dashboardLevel });

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

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectCard = (index) => {
    setSelectedCardIndex(index);
  };

  const tableColumns = [
    {
      title: (
        <span className='th-white th-12 th-fw-500 '>
          {visibleLevel === 'branch' && dashboardLevel === 0
            ? 'Grade'
            : visibleLevel === 'branch' && dashboardLevel === 1
            ? 'Subject'
            : visibleLevel === 'grade' && dashboardLevel === 0
            ? 'Section'
            : visibleLevel === 'grade' && dashboardLevel === 1
            ? 'Student'
            : null}
        </span>
      ),
      width: '18%',
      align: 'left',
      dataIndex: 'name',
      render: (data) => <span className='th-black-1 th-10'>{data}</span>,
    },
    {
      title: (
        <span className='th-white th-10 th-fw-500'>
          Pending {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-10'>
          {showAbsolute
            ? record?.numberCounts?.pending
            : record?.percentageCounts?.p_pending}
        </span>
      ),
    },

    {
      title: (
        <span className='th-white th-10 th-fw-500'>
          Submitted {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-10'>
          {showAbsolute
            ? record?.numberCounts?.submitted
            : record?.percentageCounts?.p_submitted}
        </span>
      ),
    },
    {
      title: (
        <span className='th-white th-10 th-fw-500'>
          Evaluated {showAbsolute ? '' : '(%)'}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data, record) => (
        <span className='th-black-1 th-10'>
          {showAbsolute
            ? record?.numberCounts?.evaluated
            : record?.percentageCounts?.p_evaluated}
        </span>
      ),
    },
    {
      title: <span className='th-white th-10 th-fw-500'>Total</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'numberCounts',
      render: (data) => <span className='th-black-1 th-10'>{data?.assigned}</span>,
    },
    {
      title: <span className='th-white th-10 th-fw-500'>Action</span>,
      width: '10%',
      align: 'center',
      hidden: visibleLevel !== 'branch',
      render: (data, record) => (
        <>
          {visibleLevel === 'branch' ? (
            <span
              className='th-10 th-pointer text-primary'
              onClick={() => {
                if (dashboardLevel === 1) {
                  fetchStudentList({
                    start_date: startDate,
                    end_date: endDate,
                    subject: record?.id,
                    section_mapping: level2Data[selectedCardIndex]?.id,
                    acad_session: acad_session_id,
                  });
                }
                showDrawer();
              }}
            >
              <EyeOutlined />
            </span>
          ) : (
            <span></span>
          )}
        </>
      ),
    },
  ].filter((e) => !e?.hidden);

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
                  ? level2Data[selectedCardIndex]?.numberCounts?.evaluated
                  : level2Data[selectedCardIndex]?.percentageCounts?.p_eval_sub,
              ],
              [
                'Non Evaluated',
                showAbsolute
                  ? level2Data[selectedCardIndex]?.numberCounts?.non_evaluated
                  : level2Data[selectedCardIndex]?.percentageCounts?.p_non_eval_sub,
              ],
            ]
          : [
              [
                'Pending',
                showAbsolute
                  ? level2Data[selectedCardIndex]?.numberCounts?.pending
                  : level2Data[selectedCardIndex]?.percentageCounts?.p_pending,
              ],
              [
                'submitted',
                showAbsolute
                  ? level2Data[selectedCardIndex]?.numberCounts?.submitted
                  : level2Data[selectedCardIndex]?.percentageCounts?.p_submitted,
              ],
            ],
        size: '80%',
        innerSize: '50%',
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-7 col-12 pl-0 dashboard-stat'>
          {Array.isArray(level2Data) && level2Data?.length > 0
            ? level2Data?.map((item, index) => (
                <div
                  className='stat-card row th-bg-white py-2 th-br-12 mb-2 align-items-center'
                  key={index}
                  style={{
                    border: selectedCardIndex === index ? '1px solid #1B4CCB' : '',
                  }}
                  onClick={(e) => selectCard(index)}
                >
                  <div className='col-md-9'>
                    <h4 className='th-20 mb-1 text-primary'>{item?.name}</h4>
                    <div className='stat-count th-bg-grey th-br-6'>
                      <div className='d-flex justify-content-between px-3 py-2 align-items-center'>
                        <div className='th-10 th-grey'>
                          {showAbsolute
                            ? `${item?.numberCounts?.pending} `
                            : `${item?.percentageCounts?.p_pending}% `}
                          Pending
                        </div>
                        <div className='th-10 th-grey'>
                          {showAbsolute
                            ? `${item?.numberCounts?.submitted} `
                            : `${item?.percentageCounts?.p_submitted}% `}
                          Submitted
                        </div>
                        <div className='th-10 th-grey'>
                          {showAbsolute
                            ? `${item?.numberCounts?.evaluated} `
                            : `${item?.percentageCounts?.p_evaluated}% `}
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
                    {console.log({ dashboardLevel })}
                    {dashboardLevel <= 1 && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => {
                          if (visibleLevel === 'branch' && dashboardLevel === 1) {
                            fetchSubjectWise({
                              start_date: startDate,
                              end_date: endDate,
                              section_mapping_id: item?.id,
                              subject_id: subjectId,
                            });
                          } else if (visibleLevel === 'grade' && dashboardLevel === 1) {
                            fetchStudentList({
                              start_date: startDate,
                              end_date: endDate,
                              subject: item?.id,
                              section_mapping: secMapId,
                              acad_session: selectedBranch?.id,
                              teacher_id: visibleLevel === 'grade' && userData?.user_id,
                              subject_id: subjectId,
                            });
                          }
                          toggleCollapse();
                        }}
                      >
                        {visibleLevel === 'branch'
                          ? `Subject`
                          : visibleLevel === 'grade'
                          ? `Student`
                          : ``}{' '}
                        <RightCircleOutlined />
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
            <div className='row mt-2'>
              <div className='col-8 text-left'>{level2Data[selectedCardIndex]?.name}</div>
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
      <DashboardChildDrawer
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        cardData={cardData}
        level1Data={level1Data}
        level2Data={level2Data}
        level3Data={level3Data}
        startDate={startDate}
        endDate={endDate}
        dashboardLevel={dashboardLevel}
        setDashboardLevel={setDashboardLevel}
        fetchSubjectWise={fetchSubjectWise}
        tableData={tableData}
        acad_session_id={acad_session_id}
        visibleLevel={visibleLevel}
        loading={loading}
      />
    </React.Fragment>
  );
};

export default DashboardChildCard;
