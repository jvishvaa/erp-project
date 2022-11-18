import React, { useState, useEffect, createRef, useRef } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
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
  InputNumber,
} from 'antd';
import { PlusOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const Observation = () => {
  const formRef = useRef();
  const [data, setData] = useState([]);
  const [obseravationAreaData, setObseravationAreaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    observationGet();
    getObservationArea({ status: true });
  }, []);

  const observationGet = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.observationName.observationGet}`, {
        params: { ...params },
      })
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

  const getObservationArea = (params = {}) => {
    const result = axios
      .get(`${endpoints.observationName.observationArea}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result.status === 200) {
          setObseravationAreaData(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    setEditId(id);
    setDrawerOpen(true);
    axios.get(`${endpoints.observationName.observationGet}${id}/`).then((res) => {
      formRef.current.setFieldsValue({
        observation: res.data.observation,
        observation_area: res.data?.observation_area?.id,
        score: res.data.score,
      });
    });
  };

  const handleStatus = (id, status) => {
    let body = {
      status: status ? false : true,
    };
    axios
      .put(`${endpoints.observationName.observationGet}${id}/`, body)
      .then((res) => {
        observationGet();
      })
      .catch((error) => console.log(error));
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.observationName.observationGet}${id}/`)
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
    if (updateValues.observation) {
      const valuess = new FormData();
      valuess.append('observation', updateValues.observation);
      valuess.append('score', updateValues.score);
      valuess.append('observation_area', updateValues.observation_area);
      if (!editId) {
        valuess.append('status', true);
      }

      if (editId) {
        axios
          .put(`${endpoints.observationName.observationGet}${editId}/`, valuess)
          .then((result) => {
            observationGet();
            onClose();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post(`${endpoints.observationName.observationGet}`, valuess)
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
      title: <span className='th-white th-fw-700'>Observation</span>,
      dataIndex: 'observation',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Observation Area</span>,
      key: 'observation_area',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {data?.observation_area?.observation_area_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Score</span>,
      align: 'center',
      dataIndex: 'score',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
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

  const observationAreaOptions = obseravationAreaData?.map((item) => {
    return (
      <Option key={item.id} value={item.id}>
        {item.observation_area_name}
      </Option>
    );
  });

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-12' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Observation</Breadcrumb.Item>
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
            Add Observation
          </span>
        </div>
        <Drawer
          title={editId ? 'Edit Observation' : 'Create Observation'}
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
            <div className='col-md-12'>
              <Form.Item
                name='observation'
                label='Enter Observation'
                rules={[{ required: true, message: 'Please enter Observation' }]}
              >
                <TextArea placeholder='Enter Observation' rows={4} />
              </Form.Item>
            </div>
            <div className='col-md-12'>
              <Form.Item
                name='observation_area'
                label='Select Observation Area'
                rules={[{ required: true, message: 'Please Select Observation Area' }]}
              >
                <Select placeholder='Select Observation Area'>
                  {observationAreaOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-12'>
              <Form.Item
                name='score'
                label='Enter Score'
                rules={[{ required: true, message: 'Please enter Score' }]}
              >
                <InputNumber className='w-100' min={0} placeholder='Enter Score' />
              </Form.Item>
            </div>
          </Form>
        </Drawer>
      </Layout>
    </React.Fragment>
  );
};

export default Observation;
