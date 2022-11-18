import React, { useState, useEffect, createRef, useRef } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
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
} from 'antd';
import { PlusOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const ObservationArea = () => {
  const formRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userLevelList, setUserLevelList] = useState([]);

  useEffect(() => {
    observationGet();
    fetchUserLevel();
  }, []);

  const observationGet = () => {
    setLoading(true);
    axios
      .get(`${endpoints.observation.observationGet}`)
      .then((result) => {
        if (result.status === 200) {
          setData(result?.data);
          setLoading(false);
        } else {
          setLoading(false);
          setData([]);
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

  const handleEdit = (id) => {
    setEditId(id);
    setDrawerOpen(true);
    axios.get(`${endpoints.observation.observationGet}${id}/`).then((res) => {
      formRef.current.setFieldsValue({
        observation_area_name: res.data.result.observation_area_name,
        levels: res.data?.result?.levels_data?.map((each) => {
          return each?.id;
        }),
      });
    });
  };

  const handleStatus = (id, status) => {
    let body = {
      status: status ? false : true,
    };
    axios
      .put(`${endpoints.observation.observationGet}${id}/`, body)
      .then((res) => {
        observationGet();
      })
      .catch((error) => console.log(error));
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.observation.observationGet}${id}/`)
      .then((result) => {
        if (result.status === 204) {
          message.success('Successfully Deleted');
          observationGet();
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
    if (updateValues.observation_area_name) {
      const valuess = new FormData();
      valuess.append('observation_area_name', updateValues.observation_area_name);

      valuess.append('levels', updateValues.levels?.toString());

      if (!editId) {
        valuess.append('status', true);
      }

      if (editId) {
        axios
          .put(`${endpoints.observation.observationGet}${editId}/`, valuess)
          .then((result) => {
            observationGet();
            onClose();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post(`${endpoints.observation.observationGet}`, valuess)
          .then((result) => {
            observationGet();
            onClose();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      message.error('Enter All Required fields');
    }
  };

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
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
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      align: 'center',
      dataIndex: 'score',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      align: 'center',
      dataIndex: 'levels_data',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data
            ?.map((item) => {
              return item?.level_name;
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
            onChange={() => handleStatus(data.id, data.status)}
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
              onClick={() => handleEdit(data.id)}
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
          <div className='col-md-12' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Observation Area
              </Breadcrumb.Item>
            </Breadcrumb>
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
                dataSource={data}
                pagination={false}
                // scroll={{ y: '400px' }}
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
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </div>
          }
        >
          <Form id='filterForm' ref={formRef} layout={'vertical'}>
            <Form.Item
              name='observation_area_name'
              label='Enter Observation Area'
              rules={[{ required: true, message: 'Please enter Observation Area' }]}
            >
              <Input placeholder='Enter Observation Area' />
            </Form.Item>
            <Form.Item name='levels' label='Select User Level'>
              <Select
                mode='multiple'
                allowClear={true}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                // onChange={(e, value) => handleUserLevel(e, value)}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {userLevelListOptions}
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
      </Layout>
    </React.Fragment>
  );
};

export default ObservationArea;
