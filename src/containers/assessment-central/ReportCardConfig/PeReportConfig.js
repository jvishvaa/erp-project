import { Button, Form, Select, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const PeReportConfig = () => {
  const history = useHistory();
  const { Option } = Select;
  const formRef = useRef();
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Report Card Config') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);

  const fetchBranches = async () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code == 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(res?.data?.data?.results);
          console.log(res?.data?.data?.results);
        } else {
          message.error(res?.data?.message);
        }
      });
  };

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${branch}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const branchListOptions = branchList?.map((each) => {
    console.log({ each });
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleChangeBranch = (each) => {
    console.log(each, 'testing');
    if (each.length > 0) {
      if (each.some((item) => item === 'all')) {
        //   const allBranch = branchList.map((item) => {
        //     console.log(item);
        //   });
        console.log(
          branchList.map((item) => item?.branch?.id),
          'branchhhh'
        );
        // const allBranch = branchList.map((item) => item);
        const allBranch = branchList.map((item) => item?.branch?.id);
        console.log({ allBranch });
        setSelectedBranch(allBranch);
        fetchGrade(allBranch);
        formRef.current.setFieldsValue({
          branch: branchList.map((item) => item?.branch?.id),
          grade: null,
        });
      } else {
        const singleBranch = each.map((item) => item).join(',');
        setSelectedBranch(singleBranch);
        console.log({ singleBranch });
        console.log({ selectedBranch });
        fetchGrade(singleBranch);
        formRef.current.setFieldsValue({
          grade: null,
        });
      }
    } else {
      setSelectedBranch([]);
      setSelectedGrade(null);
      setGradeList([]);
    }
  };

  const handleClearBranch = () => {
    setSelectedBranch([]);
  };

  const handleChangeGrade = (e) => {
    if (e) {
      setSelectedGrade(e);
    } else {
      formRef.current.setFieldsValue({
        grade: null,
      });
    }
  };

  const handleClearFilter = () => {
    setBranchList([]);
    setGradeList([]);
    setSelectedBranch(null);
    setSelectedGrade(null);
    formRef.current.resetFields();
  };

  const handleCreate = () => {
    history.push('/pe-report-config/create');
  };

  return (
    <React.Fragment>
      <div className='row mb-3'>
        <div className='col-md-12'>
          <Form id='filterForm' className='mt-1' layout={'vertical'} ref={formRef}>
            <div className='row'>
              <div className='col-md-3 col-sm-6 col-12'>
                <Form.Item name='branch'>
                  <Select
                    allowClear={true}
                    className='th-grey th-bg-white  w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeBranch(e, value)}
                    onClear={handleClearBranch}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Select Branch*'
                    mode='multiple'
                  >
                    {branchList.length > 0 && (
                      <>
                        <Option key={0} value={'all'}>
                          Select All
                        </Option>
                      </>
                    )}
                    {branchListOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 col-sm-6 col-12'>
                <Form.Item name='grade'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={1}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeGrade(value)}
                    // onClear={handleClearGrade}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Grade'
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 col-sm-6 col-12 text-right'>
                <div className='row no-gutters'>
                  <div className='col-md-6 col-sm-6 col-6 pr-2'>
                    <Button type='primary' className='btn-block th-br-4'>
                      Filter
                    </Button>
                  </div>
                  <div className='col-md-6 col-sm-6 col-6 pl-20'>
                    <Button
                      type='secondary'
                      className='btn-block mt-0 th-br-4'
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              <div className='col-md-3 col-sm-6 col-12 text-right'>
                <Button
                  type='primary'
                  className='btn-block th-br-4'
                  onClick={handleCreate}
                >
                  <PlusCircleOutlined /> Create
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PeReportConfig;
