import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Form,
  Popconfirm,
  Result,
  Select,
  Table,
  message,
  Rate,
} from 'antd';
import { Input, Space, Upload } from 'antd';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import axios from 'axios';
import '../BranchStaffSide/branchside.scss';
import dragDropIcon from 'v2/Assets/dashboardIcons/announcementListIcons/dragDropIcon.svg';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Badge, Calendar } from 'antd';
import moment from 'moment';
import './index.scss';

const EvaluatorDash = () => {
  const history = useHistory();
  const [branch, setBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
  const searchRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event.',
          },
        ];
        break;
      case 10:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event.',
          },
        ];
        break;
      case 15:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event',
          },
        ];
        break;
      case 29:
        listData = [
          {
            type: 'warning',
            content: 'This is warning event',
          },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    console.log(value, listData, 'list');
    return (
      <div className='events'>
        {listData.map((item) => (
          <div className='col-md-12'>
            <p className='m-0'>320</p>
            <div style={{ borderBottom: '2px solid black' }}></div>
            <p className='m-0'>360</p>
          </div>
        ))}
      </div>
    );
  };

  let todaysDate = moment().format('DD-MM-YYYY');
  const disabledDate = (date) => {
    if (date) {
      return true;
    }
    return false;
  };

  const getValue = (value) => {
    setSelectedDate(value);
    console.log(value, 'value');
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Evaluator</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='col-md-12 d-flex justify-content-center'>
                <div className='th-25 py-1'>Date : {todaysDate}</div>
              </div>
              <div className='row col-md-12 justify-content-center'>
                <div className='th-22'>{selectedDate.format('MMMM')}</div>
                <div className='th-22 px-1'>{selectedDate.format('YYYY')}</div>
              </div>
              <div className='col-md-12 d-flex justify-content-center'>
                <div className='col-md-8 evaluator-calendar'>
                  <Calendar
                    dateCellRender={dateCellRender}
                    disabledDate={disabledDate}
                    onPanelChange={getValue}
                  />
                </div>
              </div>
              <div className='col-md-12 d-flex justify-content-center '>
                <div
                  className='p-2'
                  style={{ background: '#d0d0d0', borderRadius: '10px' }}
                >
                  <div className='th-20' style={{ borderBottom: '2px solid black' }}>
                    Total Assessed/Total Alloted
                  </div>
                  <div className='th-20 row justify-content-center'>120/10800</div>
                </div>
              </div>
              <div className='row justify-content-center py-2'>
                <Button>Start Assessment</Button>
              </div>
              <div className='row justify-content-center'>
                <div
                  className='th-18 col-md-4'
                  style={{ borderBottom: '2px solid black', textAlign: 'center' }}
                >
                  Avik Das
                </div>
              </div>
              <div className='row justify-content-center'>
                <div
                  className='th-16 col-md-4 py-1'
                  style={{ borderBottom: '2px solid black', textAlign: 'center' }}
                >
                  Your last 30 days Assessment Ratings
                </div>
              </div>
              <div className='row justify-content-center'>
                <Rate allowHalf defaultValue={2.5} disabled={true} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default EvaluatorDash;
