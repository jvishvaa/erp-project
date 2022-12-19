import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message, Select } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const { Option } = Select;

const GradewiseDiaryReport = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [diaryType, setDiaryType] = useState(2);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [gradewiseDiaryData, setGradewiseDiaryData] = useState([]);
  const [gradewiseDiaryStats, setGradewiseDiaryStats] = useState();
  const [sectionwiseDiaryData, setSectionwiseDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInner, setLoadingInner] = useState(false);

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    }
  };

  const handleDiaryType = (e) => {
    setDiaryType(Number(e));
  };
  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    setSectionwiseDiaryData([]);
    if (expanded) {
      keys.push(record.grade_id);
      fetchSectionwiseReport({
        acad_session_id: selectedBranch?.id,
        diary_type: diaryType,
        date: date,
        grade_id: record.grade_id,
      });
    }

    setExpandedRowKeys(keys);
  };
  const fetchGradewiseReport = (params = {}) => {
    setGradewiseDiaryData([]);
    setExpandedRowKeys([]);
    setLoading(true);
    axios
      .get(`${endpoints.diaryReport.gradewiseReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradewiseDiaryData(res?.data?.result?.data);
          setGradewiseDiaryStats(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchSectionwiseReport = (params = {}) => {
    setLoadingInner(true);
    axios
      .get(`${endpoints.diaryReport.sectionwiseReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionwiseDiaryData(res?.data?.result?.data);
        }
        setLoadingInner(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingInner(false);
      });
  };

  const expandedRowRender = (record) => {
    const innerdailyColumn = [
      {
        dataIndex: 'sections_count',
        align: 'center',
        width: '25%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'section_name',
        align: 'center',
        width: tableWidthCalculator(25) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'diary_count',
        align: 'center',
        width: '25%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'pending_diaries',
        align: 'center',
        width: '20%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        render: () => <RightOutlined className='th-grey th-pointer' />,
      },
    ];
    const innerGeneralColumns = [
      {
        dataIndex: 'section_name',
        align: 'center',
        width: tableWidthCalculator(30) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'sections_count',
        align: 'center',
        width: '30%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'diary_count',
        align: 'center',
        width: '35%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        render: () => <RightOutlined className='th-grey th-pointer' />,
      },
    ];
    return (
      <Table
        columns={diaryType == 2 ? innerdailyColumn : innerGeneralColumns}
        dataSource={sectionwiseDiaryData}
        rowKey={(record) => record?.id}
        pagination={false}
        loading={loadingInner}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        rowClassName={(record, index) => 'th-pointer th-row'}
        onRow={(row, rowIndex) => {
          return {
            onClick: (event) => {
              history.push({
                pathname:
                  diaryType == 1
                    ? '/teacherwise-diary-report'
                    : '/subjectwise-diary-report',
                state: {
                  diaryType,
                  data: row,
                  date,
                },
              });
            },
          };
        }}
      />
    );
  };

  useEffect(() => {
    if (date) {
      fetchGradewiseReport({
        acad_session_id: selectedBranch?.id,
        diary_type: diaryType,
        date: date,
      });
    }
  }, [date, diaryType]);

  useEffect(() => {
    if (history.location.state) {
      if (history.location.state?.diaryType)
        setDiaryType(history.location.state?.diaryType);
      setDate(history.location.state?.date);
    }
  }, [window.location.pathname]);

  const generalDiaryColumns = [
    {
      title: <span className='th-white pl-md-5 th-fw-700 '>GRADE</span>,
      dataIndex: 'grade_name',
      align: 'left',
      width: '30%',
      render: (data) => <span className='pl-md-5 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL SECTIONS</span>,
      dataIndex: 'section_count',
      align: 'center',
      width: '30%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL ASSIGNED</span>,
      dataIndex: 'diary_count',
      align: 'center',
      width: '35%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
  ];

  const dailyDiarycolumns = [
    {
      title: <span className='th-white pl-md-5 th-fw-700 '>GRADE</span>,
      dataIndex: 'grade_name',
      align: 'left',
      width: '25%',
      render: (data) => <span className='pl-md-5 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL SECTIONS</span>,
      dataIndex: 'section_count',
      align: 'center',
      width: '25%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL ASSIGNED</span>,
      dataIndex: 'diary_count',
      align: 'center',
      width: '25%',
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
        <div className='col-md-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16 th-pointer'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              {diaryType == 1 ? 'General Diary Report ' : 'Daily Diary Report'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <div>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder='Select Diary Type'
              defaultValue={'2'}
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              onChange={handleDiaryType}
              className='w-50 text-left th-black-1 th-bg-white th-br-6'
              bordered={false}
              value={diaryType.toString()}
            >
              <Option value='1'>General Diary</Option>
              <Option value='2'>Daily Dairy</Option>
            </Select>
          </div>
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
        {gradewiseDiaryStats && (
          <div
            className='row mt-3 mx-3 th-grey th-bg-white py-2 th-br-10'
            style={{ border: '1px solid #d9d9d9' }}
          >
            <div className='col-md-3'>
              Total No. of Sections :&nbsp;
              <span className='th-primary'>
                {gradewiseDiaryStats?.total_number_of_sections}
              </span>
            </div>
            <div className='col-md-3 pt-2 px-1 pt-md-0'>
              Total No. of Diaries Assigned : &nbsp;
              <span className='th-primary'>{gradewiseDiaryStats?.total_diary_count}</span>
            </div>
            {diaryType == 2 && (
              <div className='col-md-3 pt-2 px-1 pt-md-0'>
                Total No. of Diaries Pending : &nbsp;
                <span className='th-primary'>
                  {gradewiseDiaryStats?.total_number_of_pending_diaries}
                </span>
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
              columns={diaryType == 2 ? dailyDiarycolumns : generalDiaryColumns}
              expandRowByClick={true}
              rowKey={(record) => record?.grade_id}
              expandable={{ expandedRowRender }}
              dataSource={gradewiseDiaryData}
              pagination={false}
              expandIconColumnIndex={4}
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
              scroll={{ x: gradewiseDiaryData.length > 0 ? 'max-content' : null, y: 600 }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GradewiseDiaryReport;
