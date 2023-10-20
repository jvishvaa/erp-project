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
    if (semItem?.activity_type_id) {
      let sub_name = categoryList.find((e) => e.act_type_id == semItem.activity_type_id);
      fetchCriteria(sub_name?.sub_type);
    }
  }, [terms]);

  useEffect(() => {
    if (isEdit) {
      semItem?.activity_type_id && fetchCriteria('Gym');
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

    // activityformRef.current.setFieldsValue({
    //   [`activity${termIndex}${activityIndex}`]: [],
    //   [`category${termIndex}${activityIndex}`]: null,
    // });
    // let resetField = activityformRef.current.resetFields()
    let filteredActivity = terms[termIndex]?.activities.filter((item, index) => {
      // if (index !== activityIndex) {
      //   let sub_name = categoryList.find((e) => e.act_type_id == item.activity_type_id);
      //   console.log({ sub_name });
      //   fetchCriteria(sub_name?.sub_type);
      // }
      return index !== activityIndex;
    });
    // let newActivity = [...terms[termIndex]?.activities, ...newSemester];
    let updatedTerms = [...terms];
    updatedTerms[termIndex].activities = filteredActivity;
    setTerms(updatedTerms);
    // activityformRef.current.setFieldsValue({
    //   [`activity${termIndex}${activityIndex}`]: [],
    // });
  };
  const handleCategory = (e, value, termIndex, semIndex) => {
    setActivityList([]);
    if (e) {
      fetchCriteria(value?.name);
      let updatedTerms = [...terms];
      updatedTerms[termIndex].activities[semIndex].activity_type_id = e;
      setTerms(updatedTerms);
      activityformRef.current.setFieldsValue({
        [`activity${termIndex}${semIndex}`]: [],
      });
    } else {
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
              {/* <Form.Item name={`category${termIndex}${semIndex}`} key={`category${termIndex}${semIndex}`} > */}
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
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                showSearch
                placeholder='Select Category*'
                value={semItem.activity_type_id ? semItem.activity_type_id : null}
                defaultValue={semItem.activity_type_id ? semItem.activity_type_id : null}
              >
                {categoryOptions}
              </Select>
              {/* </Form.Item> */}
            </div>
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='text-left'>Activity*</div>
              {/* <Form.Item name={`activity${termIndex}${semIndex}`} key={`activity${termIndex}${semIndex}`}> */}
              <Select
                key={semItem.activity_type_id}
                getPopupContainer={(trigger) => trigger.parentNode}
                maxTagCount={2}
                mode='multiple'
                allowClear={true}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleActivity(e, value, termIndex, semIndex)}
                value={semItem.criterias ? semItem.criterias : null}
                onClear={() => handleCleaActivity(termIndex, semIndex)}
                // value={1}
                dropdownMatchSelectWidth={true}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                showSearch
                placeholder='Select Activity*'
              >
                {semItem.activity_type_id && (
                  <>
                    {activityList.length > 1 && (
                      <Option key={0} value={'all'}>
                        Select All
                      </Option>
                    )}
                    {activityOptions}
                  </>
                )}
              </Select>
              {/* </Form.Item> */}
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
