import React, { useState, useEffect, createRef, useRef } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'axios';
import {
  Table,
  Breadcrumb,
  message,
  Drawer,
  Form,
  Switch,
  Tag,
  Space,
  Input,
  Button,
  Popconfirm,
  Select,
  Radio,
} from 'antd';
import { PlusOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const ObservationArea = () => {
  const formRef = useRef();
  const [observationsList, setObservationsList] = useState([]);
  const [observationAreaList, setObservationAreaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [tableView, setTableView] = useState('teacher');
  const [userLevelList, setUserLevelList] = useState([]);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchUserLevel();
  }, []);
  useEffect(() => {
    fetchObservationList({
      is_student: tableView === 'teacher' ? false : true,
      status: true,
    });
    fetchObservationAreaList({ is_student: tableView === 'teacher' ? false : true });
  }, [tableView]);
  const fetchObservationList = (params = {}) => {
    axios
      .get(`${endpoints.observations.observationList}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setObservationsList(result?.data?.result);
        } else {
          setLoading(false);
          setObservationsList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchObservationAreaList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.observations.observationAreaList}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setObservationAreaList(result?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
          setObservationAreaList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const fetchUserLevel = () => {
    axiosInstance
      .get(`${endpoints.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (data) => {
    setEditId(data?.id);
    setDrawerOpen(true);

    setTimeout(() => {
      formRef.current.setFieldsValue({
        observation_area_name: data?.observation_area_name,
        levels: data?.levels?.map((each) => {
          return each?.id;
        }),
        is_student: data?.is_student,
        observation: data?.observation?.id,
      });
    }, 100);
    setIsStudent(data.is_student);
    // });
  };

  const handleStatus = (id, data) => {
    let body = {
      observation_area_name: data.observation_area_name,
      is_student: data.is_student ? data.is_student : false,
      levels: data?.levels?.map((item) => item.id).toString(),
      observation: data?.observation.id,
      status: data.status ? false : true,
    };
    axios
      .put(`${endpoints.observations.updateObservationArea}${id}/`, body)
      .then((result) => {
        if (result.data?.status_code === 200) {
          message.success('Successfully Updated');
          fetchObservationAreaList({
            is_student: tableView === 'teacher' ? false : true,
          });
        } else {
          message.error('Something went wrong');
        }
      })
      .catch((error) => console.log(error));
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.observations.updateObservationArea}${id}/`)
      .then((result) => {
        if (result.data?.status_code === 200) {
          message.success('Successfully Deleted');
          fetchObservationAreaList({
            is_student: tableView === 'teacher' ? false : true,
          });
          // observationGet({ is_student: tableView === 'teacher' ? false : true });
        } else {
          message.error('Something went wrong');
        }
      })
      .catch(() => {
        message.error('Something went wrong');
      });
  };

  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const onClose = () => {
    setDrawerOpen(false);
    setEditId(null);
    formRef.current.resetFields();
  };
  const onSubmit = () => {
    const updateValues = formRef.current.getFieldsValue();
    if (updateValues.observation_area_name && updateValues.observation) {
      if (!updateValues.observation_area_name.trim().length) {
        message.error('Observation Area name can not be empty');
        return false;
      }
      if (updateValues.observation_area_name.length > 100) {
        message.error('Observation Area name should be less than 100 characters');
        return false;
      }
      let payload = {
        observation_area_name: updateValues.observation_area_name,
        is_student: updateValues.is_student ? updateValues.is_student : false,
        levels: updateValues?.levels?.toString(),
        observation: updateValues.observation,
        status: true,
      };
      setRequestSent(true);
      if (editId) {
        axios
          .put(`${endpoints.observations.updateObservationArea}${editId}/`, payload)
          .then((result) => {
            if (result?.data?.status_code == 200) {
              onClose();
              setTableView(updateValues.is_student ? 'student' : 'teacher');
              fetchObservationAreaList({
                is_student: updateValues.is_student ? true : false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setRequestSent(false);
          });
      } else {
        axios
          .post(`${endpoints.observations.observationAreaList}`, payload)
          .then((result) => {
            if (result?.data?.status_code == 200) {
              setTableView(updateValues.is_student ? 'student' : 'teacher');
              fetchObservationAreaList({
                is_student: updateValues.is_student ? true : false,
              });
              onClose();
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setRequestSent(false);
          });
      }
    } else {
      message.error('Enter All Required fields');
    }
  };

  const handleApplicableFor = (e) => {
    setIsStudent(e.target.value);
    fetchObservationList({
      is_student: e.target.value,
      status: true,
    });
  };

  const handleTableView = (e) => {
    setTableView(e.target.value);
    console.log(e.target.value);
  };
  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });
  const observationsListOptions = observationsList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.title}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S. No.</span>,
      width: '8%',
      align: 'center',
      render: (value, item, index) => (
        <span className='th-black-1 th-16'>{index + 1}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Observation Area</span>,
      dataIndex: 'observation_area_name',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Observation </span>,
      dataIndex: 'observation',
      render: (data) => <span className='th-black-1 th-16'>{data?.title}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      align: 'center',
      width: '10%',
      dataIndex: 'over_all',
      render: (data) => <span className='th-black-1 th-16'>{data?.over_all}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      align: 'center',
      dataIndex: 'levels',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data
            ?.map((item) => {
              return userLevelList.filter((each) => each.id == item?.id)[0]?.level_name;
            })
            ?.toString()}
        </span>
      ),
    },

    {
      title: <span className='th-white th-fw-700'>Status</span>,
      align: 'center',
      key: 'status',
      render: (data) => {
        return (
          <Switch
            checked={data.status ? true : false}
            onChange={() => handleStatus(data.id, data)}
          />
        );
      },
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={<EditOutlined />}
              className='th-br-6 th-bg-primary th-white'
              style={{ cursor: 'pointer' }}
              onClick={() => handleEdit(data)}
            >
              Edit
            </Tag>
            <Popconfirm title='Sure to delete?' onConfirm={(e) => onDelete(data.id)}>
              <Tag
                icon={<CloseCircleOutlined />}
                color='error'
                style={{ cursor: 'pointer' }}
              >
                Delete
              </Tag>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Observation Area
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-3 text-right th-radio'>
            <Radio.Group onChange={handleTableView} value={tableView} buttonStyle='solid'>
              <Radio.Button value={'teacher'}>Teacher</Radio.Button>
              <Radio.Button value={'student'}>Student</Radio.Button>
            </Radio.Group>
          </div>
          <div className='row mt-3'>
            <div className='col-12'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={observationAreaList}
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 220px)' }}
              />
            </div>
          </div>
        </div>
        <div
          style={{ position: 'fixed', bottom: '5%', right: '2%' }}
          className='th-bg-primary th-white th-br-6 px-4 py-3 th-fw-500 th-pointer'
          onClick={showDrawer}
        >
          <span className='d-flex align-items-center'>
            <PlusOutlined size='small' className='mr-2' />
            Add Observation Area
          </span>
        </div>
        <Drawer
          title={editId ? 'Edit Observation Area' : 'Create Observation Area'}
          placement='right'
          onClose={onClose}
          visible={drawerOpen}
          closable={null}
          width={window.innerWidth < 600 ? '90vw' : ' 40vw'}
          className='th-activity-drawer'
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                form='incomeForm'
                onClick={onSubmit}
                disabled={requestSent}
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </div>
          }
        >
          <div className='px-2'>
            <Form id='filterForm' ref={formRef} layout={'vertical'}>
              <Form.Item
                name='observation_area_name'
                label='Enter Observation Area'
                rules={[{ required: true, message: 'Please enter Observation Area' }]}
              >
                <Input placeholder='Enter Observation Area' />
              </Form.Item>

              <Form.Item label='Applicable for' name='is_student'>
                <Radio.Group
                  value={isStudent}
                  onChange={handleApplicableFor}
                  defaultValue={false}
                >
                  <Radio value={false}> Teacher </Radio>
                  <Radio value={true}> Student </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name='levels'
                label='Select User Level'
                rules={[{ required: true, message: 'Please select userlevels' }]}
              >
                <Select
                  mode='multiple'
                  allowClear={true}
                  className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                  placement='bottomRight'
                  showArrow={true}
                  dropdownMatchSelectWidth={false}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {userLevelListOptions}
                </Select>
              </Form.Item>
              <Form.Item
                name='observation'
                label='Select Observation'
                rules={[{ required: true, message: 'Please select Observation' }]}
              >
                <Select
                  className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                  placement='bottomRight'
                  showArrow={true}
                  dropdownMatchSelectWidth={true}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {observationsListOptions}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Drawer>
      </Layout>
    </React.Fragment>
  );
};

export default ObservationArea;
