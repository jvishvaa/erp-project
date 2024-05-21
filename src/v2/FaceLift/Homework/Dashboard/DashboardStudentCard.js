import React, { useState } from 'react';
import { Switch, Tag } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DashboardStudentCard = ({
  dashboardLevel,
  level3Data,
  visibleLevel,
  showAbsolute,
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [evaluationChart, setEvaluationChart] = useState(false);
  const selectCard = (index) => {
    setSelectedCardIndex(index);
  };

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
          : visibleLevel === 'branch' && dashboardLevel === 2
          ? 'Section'
          : visibleLevel === 'grade' && dashboardLevel === 0
          ? 'Grade'
          : visibleLevel === 'grade' && dashboardLevel === 1
          ? 'Subject'
          : visibleLevel === 'subject' && dashboardLevel === 0
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
                  ? level3Data[selectedCardIndex]?.numberCounts?.evaluated
                  : level3Data[selectedCardIndex]?.percentageCounts?.p_eval_sub,
              ],
              [
                'Non Evaluated',
                showAbsolute
                  ? level3Data[selectedCardIndex]?.numberCounts?.non_evaluated
                  : level3Data[selectedCardIndex]?.percentageCounts?.p_non_eval_sub,
              ],
            ]
          : [
              [
                'Pending',
                showAbsolute
                  ? level3Data[selectedCardIndex]?.numberCounts?.pending
                  : level3Data[selectedCardIndex]?.percentageCounts?.p_pending,
              ],
              [
                'submitted',
                showAbsolute
                  ? level3Data[selectedCardIndex]?.numberCounts?.submitted
                  : level3Data[selectedCardIndex]?.percentageCounts?.p_submitted,
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
        <div className='col-md-7 p-1 col-12 pl-0 dashboard-stat'>
          {Array.isArray(level3Data) && level3Data?.length > 0
            ? level3Data?.map((item, index) => (
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
                          {showAbsolute
                            ? `${item?.numberCounts?.pending} `
                            : `${item?.percentageCounts?.p_pending}% `}
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
                    {visibleLevel === 'subject' && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                      >
                        Homework <RightCircleOutlined />
                      </Tag>
                    )}
                  </div>
                </div>
              ))
            : null}
        </div>
        <div className='col-md-5 text-center col-12' style={{ minHeight: '150px' }}>
          <div className='th-bg-white th-br-10 p-3'>
            <div className='row align-items-center mt-2'>
              <div className='col-8 text-left'>{level3Data[selectedCardIndex]?.name}</div>
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
    </React.Fragment>
  );
};

export default DashboardStudentCard;
