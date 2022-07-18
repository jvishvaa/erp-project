import React, { useState, useEffect } from 'react';
import FeesListCard from 'v2/FaceLift/myComponents/FeesListCard';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';

const { Option } = Select;
const getMonth = (value) => {
  switch (value) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
  }
};

const FeesOverview = () => {
  const history = useHistory();
  const [feeOverviewFilter, setFeeOverviewFilter] = useState('Monthly');
  const [feesStats, setFeesStats] = useState('');
  const [feesOverviewData, setFeesOverviewData] = useState([]);
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const [branchId, setBranchId] = useState('');
  const [branchSelected, setBranchSelected] = useState([]);
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const user_level = data?.user_level;

  const branchOptions = branchList?.map((each) => {
    return (
      <Option selected={each} value={each?.branch?.id} key={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const handleBranchChange = (item) => {
    setBranchId(item?.value);
    setBranchSelected([item?.selected]);
  };

  const handleChange = (e) => {
    setFeeOverviewFilter(e.target.value);
  };
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  let yearlyData = [];
  let categories = [];

  const fetchFeesData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.feesOverviewData}`, { params: { ...params } })
      .then((response) => {
        if (response.status === 200) {
          setFeesOverviewData(response?.data);
        }
      })
      .catch((error) => console.log(error));
  };
  feesOverviewData.map((item) => {
    Object.keys(item).map((key, index) => yearlyData.push(item[key]));
  });
  feesOverviewData.map((item) => {
    Object.keys(item).map((key, index) => categories.push(getMonth(Number(key))));
  });

  const fetchFeesStats = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.feesStatsData}`, { params: { ...params } })
      .then((response) => {
        if (response.status === 200) {
          setFeesStats(response?.data);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (selectedBranch) {
      const selectedBranchId = branchId ? branchId : selectedBranch?.branch?.id;
      fetchFeesData({
        branch_id: selectedBranchId,
        finance_session_year_id: selectedAcademicYear?.id,
        finance_session_year: selectedAcademicYear?.session_year,
      });
      fetchFeesStats({
        branch_id: selectedBranchId,
        finance_session_year_id: selectedAcademicYear?.id,
        finance_session_year: selectedAcademicYear?.session_year,
      });
    }
  }, [selectedBranch, selectedAcademicYear, branchId]);

  const showFeesDetails = () => {
    if (user_level != 10) {
      if (branchId) {
        history.push({
          pathname: '/fees-table-status',
          state: {
            branch: branchSelected,
            filter: true,
          },
        });
      } else {
        history.push('/fees-table-status');
      }
    }
  };
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: ' ',
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        text: ' ',
      },
    },

    series: [
      {
        name: 'Total Fees Collected',
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#1B4CCB'],
            [1, '#8193df'],
          ],
        },
        data: yearlyData,
        marker: true,
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 0.9 },
          stops: [
            [
              0,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0.7)
                .get('rgba'),
            ],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get('rgba'),
            ],
          ],
        },
      },
    ],
  };
  const feesListdata = [
    { duration: 'Last 24 hours', amount: feesStats?.fee_daily_data },
    { duration: 'Last Week', amount: feesStats?.fee_weekely_data },
    { duration: 'Last Quater', amount: feesStats?.fee_quarter_data },
  ];

  return (
    <>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-8 th-16 mt-2 th-fw-500 th-black-1 pr-0'>
            Fees Overview <span className='th-12'>(Monthly)</span>
          </div>
          <div className='col-4 px-0 mt-2'>
            <Select
              className='th-primary th-bg-grey th-br-4 th-width-100 text-left'
              placement='bottomRight'
              allowClear={true}
              showSearch={true}
              bordered={false}
              suffixIcon={<DownOutlined className='th-primary' />}
              placeholder='Select Branch'
              dropdownMatchSelectWidth={false}
              onChange={(e, value) => handleBranchChange(value)}
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {branchOptions}
            </Select>
          </div>
          {/* <div className='col-4 text-right px-0'>
            <Select
              defaultValue={'monthly'}
              className='th-primary th-bg-grey th-br-4 th-select'
              bordered={false}
              placement='bottomRight'
              suffixIcon={<DownOutlined className='th-primary' />}
              dropdownMatchSelectWidth={false}
            >
              <Option value={'monthly'}>Monthly</Option>
            </Select>
          </div> */}
        </div>
        <div className='my-2 p-2'>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className='my-2 '>
          <div className='col-md-12 th-16 mt-2 th-fw-500 th-black-1'>
            Total Collections
          </div>
          {feesListdata?.map((item) => (
            <FeesListCard data={item} />
          ))}
        </div>
        <div className='col-md-12 text-right'>
          <div className='th-primary th-pointer'>
            <u onClick={showFeesDetails}>{'View All >'}</u>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeesOverview;
