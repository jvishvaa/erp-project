import React, { useState, useEffect, createRef, useRef } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
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
  Radio,
} from 'antd';
import { PlusOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const Observation = () => {
  const formRef = useRef();
  const [obseravationsList, setObseravationsList] = useState([]);
  const [isStudent, setIsStudent] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [observation, setObseravation] = useState({
    title: '',
    status: true,
    isStudent: isStudent,
    observations: [
      {
        label: '',
        score: '',
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableView, setTableView] = useState('teacher');
  useEffect(() => {
    fetchObservationList({ is_student: tableView === 'teacher' ? false : true });
  }, [tableView]);

  const handleAddObservations = () => {
    let newObservations = observation?.observations?.concat({ label: '', score: '' });
    setObseravation({ ...observation, observations: newObservations });
  };
  const handleDeleteObservations = (index) => {
    let newObservations = observation?.observations?.slice();
    newObservations.splice(index, 1);
    setObseravation({ ...observation, observations: newObservations });
  };
  const fetchObservationList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.observations.observationList}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setObseravationsList(result?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
          setObseravationsList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  console.log({ observation });
  // const getObservationArea = (params = {}) => {
  //   const result = axios
  //     .get(`${endpoints.observationName.observationArea}`, {
  //       params: { ...params },
  //     })
  //     .then((result) => {
  //       if (result.status === 200) {
  //         setObseravationsList(result?.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleEdit = (data) => {
    setEditId(data?.id);
    // axios.get(`${endpoints.observations.observationList}${id}/`).then((res) => {
    //   formRef.current.setFieldsValue({
    //     observation: res.data.result.title,
    //     is_student: res.data.result.is_student,
    //   });
    setObseravation(data);
    setIsStudent(data.is_student);
    setDrawerOpen(true);
    // });
  };

  const handleStatus = (id, status) => {
    let body = {
      status: status ? false : true,
    };
    axios
      .put(`${endpoints.observations.observationList}${id}/`, body)
      .then((res) => {
        fetchObservationList({ is_student: tableView === 'teacher' ? false : true });
      })
      .catch((error) => console.log(error));
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.observations.observationList}${id}/`)
      .then((result) => {
        if (result.status === 204) {
          message.success('Successfully Deleted');
          fetchObservationList({ is_student: tableView === 'teacher' ? false : true });
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
    const isFieldNull = observation?.observations.forEach(function (v, i) {
      if (
        Object.keys(v).some(function (k) {
          return v[k] == null || v[k] == '';
        })
      )
        return true;
      else {
        return false;
      }
    });
    console.log({ isFieldNull });
    // const updateValues = formRef.current.getFieldsValue();
    if (!observation?.title) {
      message.error('Please fill the observation title');
      return;
    }
    if (isFieldNull) {
      message.error('Please fill all the details');
      return;
    } else {
      setRequestSent(true);
      // const valuess = new FormData();
      // valuess.append('observation', updateValues.observation);
      // valuess.append('score', updateValues.score);
      // valuess.append('observation_area', updateValues.observation_area);
      // valuess.append(
      //   'is_student',
      //   updateValues.is_student ? updateValues.is_student : false
      // );
      // if (!editId) {
      //   valuess.append('status', true);
      // }

      if (editId) {
        axios
          .put(`${endpoints.observations.updateObservation}`, observation)
          .then((result) => {
            if (result?.data?.status_code == 200) {
              message.success('Observation updated successfully');
              setTableView(isStudent ? 'student' : 'teacher');
              fetchObservationList({
                is_student: isStudent ? true : false,
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
      } else {
        axios
          .post(`${endpoints.observations.observationList}`, observation)
          .then((result) => {
            if (result?.data?.status_code == 200) {
              message.success('Observation created successfully');
              setTableView(isStudent ? 'student' : 'teacher');
              fetchObservationList({
                is_student: isStudent ? true : false,
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
    }
  };

  const handleApplicableFor = (e) => {
    setIsStudent(e.target.value);
    formRef.current.resetFields(['observation_area']);
  };

  const handleTableView = (e) => {
    setTableView(e.target.value);
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
      dataIndex: 'title',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    // {
    //   title: <span className='th-white th-fw-700'>Observation Area</span>,
    //   key: 'observation_area',
    //   render: (data) => (
    //     <span className='th-black-1 th-14'>
    //       {data?.observation_area?.observation_area_name}
    //     </span>
    //   ),
    // },
    // {
    //   title: <span className='th-white th-fw-700'>Score</span>,
    //   align: 'center',
    //   dataIndex: 'score',
    //   render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    // },
    {
      title: (
        <span className='th-white th-fw-700'>
          <div className='d-flex align-items-center'>
            <div className='col-md-2'></div>
            <div className='col-md-7'>Label</div>
            <div className='col-md-3 text-center'>Score</div>
          </div>
        </span>
      ),
      key: 'observation',
      render: (record, item, index) =>
        record.observations?.map((item, i) => {
          return (
            <div className='d-flex  align-items-center py-1 '>
              <div className='col-md-2 th-14'>{i + 1}</div>
              <div className='col-md-7'>
                <div>{item?.label}</div>
              </div>
              <div className='col-md-3 text-center'>
                <div>{item?.score}</div>
              </div>
            </div>
          );
        }),
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

  // const observationAreaOptions = obseravationsList?.map((item) => {
  //   return (
  //     <Option key={item.id} value={item.id}>
  //       {item.observation_area_name}
  //     </Option>
  //   );
  // });
  console.log({ observation });
  const handleChangeObservations = (value, index, type) => {
    let updatedObservations = observation;
    updatedObservations.observations[index][type] = value;
    setObseravation({ ...updatedObservations });
  };
  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Observation</Breadcrumb.Item>
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
                dataSource={obseravationsList}
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
          width={'40vw'}
          visible={drawerOpen}
          closable={null}
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
          <Form id='filterForm' ref={formRef} layout={'vertical'}>
            <div className='col-md-12'>
              {/* <Form.Item
                name='observation'
                label='Enter Observation Title'
                rules={[{ required: true, message: 'Please enter Observation Name' }]}
              > */}
              <Input
                placeholder='Enter Observation Name'
                onChange={(e) => {
                  console.log(e.target.value);
                  e.preventDefault();
                  setObseravation({ ...observation, title: e.target.value });
                }}
                value={observation.title}
                className='th-br-5'
              />
              {/* </Form.Item> */}
            </div>
            <div className='col-md-12'>
              <Form.Item label='Applicable for' name='is_student' defaultValue={false}>
                <Radio.Group
                  value={isStudent}
                  onChange={handleApplicableFor}
                  defaultValue={false}
                >
                  <Radio value={false}> Teacher </Radio>
                  <Radio value={true}> Student </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            {/* <div className='col-md-12'>
              <Form.Item
                name='observation_area'
                label='Select Observation Area'
                rules={[{ required: true, message: 'Please Select Observation Area' }]}
              >
                <Select
                  showSearch
                  placeholder='Select Observation Area'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {observationAreaOptions}
                </Select>
              </Form.Item>
            </div> */}
            {observation?.observations?.map((item, index) => {
              return (
                <div className='row py-2 align-item-center'>
                  <div className='col-7'>
                    {/* <Form.Item
                      name='label'
                      label='Enter Label'
                      rules={[{ required: true, message: 'Please enter Label' }]}
                    > */}
                    <Input
                      onChange={(e) => {
                        e.preventDefault();
                        handleChangeObservations(e.target.value, index, 'label');
                      }}
                      className='w-100 th-br-5'
                      value={item?.label}
                      placeholder='Enter Label'
                    />
                    {/* </Form.Item> */}
                  </div>
                  <div className='col-4'>
                    {/* <Form.Item
                      name='score'
                      label='Enter Score'
                      rules={[{ required: true, message: 'Please enter Score' }]}
                    > */}
                    <InputNumber
                      onChange={(e) => {
                        handleChangeObservations(e, index, 'score');
                      }}
                      className='w-100 th-br-5'
                      value={item?.score}
                      placeholder='Enter Score'
                    />
                    {/* </Form.Item> */}
                  </div>
                  {observation?.observations?.length > 1 && (
                    <div className='col-1'>
                      <CloseCircleOutlined
                        className='th-pointer'
                        onClick={() => handleDeleteObservations(index)}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className='row'>
              <div className='col-12 text-right'>
                <Button
                  icon={<PlusOutlined />}
                  type='primary'
                  className='th-br-8'
                  onClick={handleAddObservations}
                >
                  Add
                </Button>
              </div>
            </div>
          </Form>
        </Drawer>
      </Layout>
    </React.Fragment>
  );
};

export default Observation;
