import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Tooltip, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const CurriculumCompletion = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [moduleId, setModuleId] = useState('');
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const fetchCurriculumData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.curriculumCompletion}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCurriculumData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const getCurriculumData = () => {
    if (selectedAcademicYear)
      fetchCurriculumData({ session_year: selectedAcademicYear?.id });
  };

  useEffect(() => {
    getCurriculumData();
  }, []);
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  return (
    <div
      className='th-bg-white th-br-5 py-3 px-2 mt-3 shadow-sm'
      style={{ minHeight: 260 }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Curriculum Completion{' '}
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'>
            {/* <ReloadOutlined onClick={getCurriculumData} className='pl-md-3' /> */}
          </span>
        </div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : curriculumData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
                <div className='col-4 th-grey th-fw-400 th-12 text-center'>Subject</div>
                <div className='col-4 th-grey th-fw-400 th-12 px-0 text-center'>
                  Avg. Completion %
                </div>
              </div>
              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {curriculumData?.map((item, i) => {
                  let section = item.section_name.charAt(item.section_name.length - 1);
                  return (
                    <div
                      className='th-bg-grey mb-2 th-br-6'
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className='row justify-content-between py-3 th-br-6 align-items-center'
                        onClick={() =>
                          history.push({
                            pathname: '/curriculum-completion-branchWise',
                            state: {
                              branchData: [selectedBranch],
                              module_id: moduleId,
                              iscurriculam: true,
                            },
                          })
                        }
                      >
                        <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 text-truncate text-capitalize'>
                          <Tooltip
                            placement='top'
                            title={
                              <span className='text-capitalize'>
                                {item?.grade_name} {section}
                              </span>
                            }
                          >
                            {item?.grade_name} {section}
                          </Tooltip>
                        </div>
                        <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 pl-1 text-center'>
                          {item?.subject_name}
                        </div>
                        <div className='col-4 text-center th-16 th-fw-600 th-green-1 pr-0'>
                          {item?.percentage_completion}%{' '}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoDataIcon} />
        </div>
      )}
    </div>
  );
};

export default CurriculumCompletion;
