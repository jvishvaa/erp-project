import React, { useState, useEffect, useRef } from 'react';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Button, Form, Select } from 'antd';
import { DownOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

const PeReportCardActivity = ({
  termIndex,
  termItem,
  semItem,
  semIndex,
  terms,
  setTerms,
  isEdit,
}) => {
  const { Option } = Select;
  const activityformRef = useRef();
  const [categoryList, setCategoryList] = useState([]);
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (isEdit) {
      semItem?.activity_type_id && fetchCriteria('Gym');
      activityformRef.current.setFieldsValue({
        [`activity${termIndex}${semIndex}`]: semItem?.criterias,
        [`category${termIndex}${semIndex}`]: !semItem?.activity_type_id
          ? null
          : semItem?.activity_type_id,
      });
    }
  }, [semItem]);

  const fetchCriteria = (sub_activity) => {
    axiosInstance
      .get(`${endpoints.peReportCardConfig.criteriaList}?sub_activity=${sub_activity}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        setActivityList(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCategory = () => {
    axiosInstance
      .get(`${endpoints.peReportCardConfig.categoryList}`, {
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCategoryList(result?.data?.sub_types);
        }
      })
      .catch((error) => {
        console.log(error?.message);
      });
  };

  const handleRemoveTermsActivity = (termIndex, activityIndex) => {
    let filteredActivity = terms[termIndex]?.activities.filter(
      (item, index) => index !== activityIndex
    );
    // let newActivity = [...terms[termIndex]?.activities, ...newSemester];
    let updatedTerms = [...terms];
    updatedTerms[termIndex].activities = filteredActivity;
    setTerms(updatedTerms);
  };

  const handleCategory = (e, value, termIndex, semIndex) => {
    if (e) {
      fetchCriteria(value?.name);
      let updatedTerms = [...terms];
      updatedTerms[termIndex].activities[semIndex].activity_type_id = e;
      setTerms(updatedTerms);
      activityformRef.current.setFieldsValue({
        [`activity${termIndex}${semIndex}`]: [],
      });
    } else {
      setActivityList([]);
      let updatedTerms = [...terms];
      updatedTerms[termIndex].activities[semIndex].activity_type_id = '';
      setTerms(updatedTerms);
      activityformRef.current.setFieldsValue({
        [`activity${termIndex}${semIndex}`]: [],
      });
    }
  };

  const handleActivity = (each, value, termIndex, semIndex) => {
    if (each.length > 0) {
      if (each.some((item) => item === 'all')) {
        const allActivity = activityList.map((item) => item?.id);
        let updatedTerms = [...terms];
        updatedTerms[termIndex].activities[semIndex].criterias = allActivity;
        setTerms(updatedTerms);
        activityformRef.current.setFieldsValue({
          [`activity${termIndex}${semIndex}`]: allActivity,
        });
      } else {
        //set null
        const singleActivity = each.map((item) => item);
        let updatedTerms = [...terms];
        updatedTerms[termIndex].activities[semIndex].criterias = singleActivity;
        setTerms(updatedTerms);
      }
    }
  };

  const handleCleaActivity = (termIndex, semIndex) => {
    let updatedTerms = [...terms];
    updatedTerms[termIndex].activities[semIndex].criterias = [];
    setTerms(updatedTerms);
  };

  const categoryOptions = categoryList?.map((each) => {
    return (
      <Option key={each?.act_type_id} value={each.act_type_id} name={each.sub_type}>
        {each?.sub_type}
      </Option>
    );
  });

  const activityOptions = activityList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.criteria_title}
      </Option>
    );
  });

  return (
    <React.Fragment>
      <Form id='activityform' className='mt-1' layout={'vertical'} ref={activityformRef}>
        <div className='mt-3'>
          <div className='row pl-5'>
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='text-left'>Category*</div>
              <Form.Item name={`category${termIndex}${semIndex}`}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear={true}
                  suffixIcon={<DownOutlined className='th-grey' />}
                  className='th-grey th-bg-grey th-br-4 w-100 text-left'
                  placement='bottomRight'
                  showArrow={true}
                  onChange={(e, value) => handleCategory(e, value, termIndex, semIndex)}
                  dropdownMatchSelectWidth={true}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  showSearch
                  placeholder='Select Category*'
                >
                  {categoryOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='text-left'>Activity*</div>
              <Form.Item name={`activity${termIndex}${semIndex}`}>
                <Select
                  key={semItem.activity?.length}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  maxTagCount={5}
                  mode='multiple'
                  allowClear={true}
                  suffixIcon={<DownOutlined className='th-grey' />}
                  className='th-grey th-bg-grey th-br-4 w-100 text-left'
                  placement='bottomRight'
                  showArrow={true}
                  onChange={(e, value) => handleActivity(e, value, termIndex, semIndex)}
                  value={semItem.activity}
                  onClear={() => handleCleaActivity(termIndex, semIndex)}
                  // dropdownRender={(menu) => (
                  //   <div>
                  //     <Checkbox
                  //       defaultChecked={
                  //         activityList?.length ==
                  //           semItem?.activity?.length &&
                  //         activityList.length > 0
                  //           ? true
                  //           : false
                  //       }
                  //       onChange={(e, value) => {
                  //         handleAllActivity(e, termIndex, semIndex);
                  //         console.log(
                  //           'length',
                  //           activityList?.length,
                  //           semItem?.activity?.length
                  //         );
                  //       }}
                  //       // defaultChecked={activityList?.length === semItem.activity.length}
                  //       style={{ margin: '8px 8px 4px' }}
                  //     >
                  //       Select All
                  //     </Checkbox>
                  //     {menu}
                  //   </div>
                  // )}
                  defaultValue={semItem.activity}
                  // value={1}
                  dropdownMatchSelectWidth={true}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  showSearch
                  placeholder='Select Activity*'
                >
                  {activityList.length > 1 && (
                    <>
                      <Option key={0} value={'all'}>
                        Select All
                      </Option>
                    </>
                  )}
                  {activityOptions}
                </Select>
              </Form.Item>
            </div>
            {termItem?.activities?.length > 1 && (
              <div className='col-md-3 col-sm-6 col-12 mt-2' style={{ display: 'flex' }}>
                <div className='row no-gutters' style={{ alignItems: 'center' }}>
                  <div className='col-md-6 col-sm-6 col-6 pr-2'>
                    <Button
                      type='primary'
                      className='btn-block th-br-4'
                      onClick={() => handleRemoveTermsActivity(termIndex, semIndex)}
                    >
                      <MinusCircleOutlined /> Remove
                    </Button>
                  </div>
                  <div className='col-md-6 col-sm-6 col-6 pl-20'></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default PeReportCardActivity;
