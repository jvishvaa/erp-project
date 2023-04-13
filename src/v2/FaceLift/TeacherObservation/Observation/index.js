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
import _ from 'lodash';
const { Option } = Select;
const { TextArea } = Input;

const Observation = () => {
  const [obseravationsList, setObservationsList] = useState([]);
  const [isStudent, setIsStudent] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [observation, setObservation] = useState({
    title: '',
    status: true,
    is_student: isStudent,
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
    fetchObservationList({
      is_student: tableView === 'teacher' ? false : true,
    });
  }, [tableView]);

  const handleAddObservations = () => {
    let newObservations = observation?.observations?.concat({ label: '', score: '' });
    setObservation({ ...observation, observations: newObservations });
  };
  const handleDeleteObservations = (index) => {
    let newObservations = observation?.observations?.slice();
    newObservations.splice(index, 1);
    setObservation({ ...observation, observations: newObservations });
  };
  const fetchObservationList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.observations.observationList}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setObservationsList(result?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
          setObservationsList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleEdit = (data) => {
    setEditId(data?.id);
    setDrawerOpen(true);
    var currentData = _.cloneDeep(data);
    setObservation(currentData);
    setIsStudent(data.is_student);
  };
  const handleStatus = (id, data) => {
    let body = {
      title: data?.title,
      status: data?.status ? false : true,
      is_student: data?.is_student,
      observations: data?.observations,
    };
    axios
      .put(`${endpoints.observations.updateObservation}${id}/`, body)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success('Observation status updated');
          fetchObservationList({ is_student: tableView === 'teacher' ? false : true });
        }
      })
      .catch((error) => {
        message.success('Observation status updation failed');
        console.log(error);
      });
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.observations.updateObservation}${id}/`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
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
    setObservation({
      title: '',
      status: true,
      is_student: isStudent,
      observations: [
        {
          label: '',
          score: '',
        },
      ],
    });
  };

  const onSubmit = () => {
    const isFieldNull = observation?.observations.filter(function (el) {
      return el.score == '' || el.label.trim() == '';
    });
    const isLimit = observation?.observations.filter(function (el) {
      return el.score >= 99;
    });
    const isLabelCharacterExceed = observation?.observations.filter(function (el) {
      return el.label.length > 399;
    });
    if (!observation?.title.trim().length) {
      message.error('Please fill the observation title');
      return;
    }
    if (observation?.title.length > 100) {
      message.error('Observation title must be less than 100 character');
      return;
    }
    if (isFieldNull.length > 0) {
      message.error('Labels and Score can not be empty');
      return;
    }
    if (isLimit.length > 0) {
      message.error('Scores must be less than 100');
      return;
    }
    if (isLabelCharacterExceed.length > 0) {
      message.error('Labels must be less than 400 character');
      return;
    } else {
      setRequestSent(true);
      if (editId) {
        axios
          .put(`${endpoints.observations.updateObservation}${editId}/`, observation)
          .then((result) => {
            if (result?.data?.status_code == 200) {
              message.success('Observation updated successfully');
              setTableView(isStudent ? 'student' : 'teacher');
              fetchObservationList({
                is_student: isStudent ? true : false,
              });
              onClose();
            } else {
              message.error('Observation update failed, please try again');
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
            message.error('Observation creation failed, please try again');
          })
          .finally(() => {
            setRequestSent(false);
          });
      }
    }
  };

  const handleApplicableFor = (e) => {
    setIsStudent(e.target.value);
    setObservation({ ...observation, is_student: e.target.value });
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
    {
      title: (
        <span className='th-white th-fw-700'>
          <div className='d-flex align-items-center'>
            <div className='col-md-2'></div>
            <div className='col-md-7'>Label</div>
            <div className='col-md-3 text-center px-0'>Score</div>
          </div>
        </span>
      ),
      key: 'observation',
      dataIndex: 'observations',
      render: (data) =>
        data?.map((item, i) => {
          return (
            <div className='d-flex  align-items-center py-1 '>
              <div className='col-md-2 th-14'>{/* {i + 1} */}</div>
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
              onClick={(e) => handleEdit(data)}
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

  const handleChangeObservations = (value, index, type) => {
    let updatedObservations = Object.assign({}, observation);
    updatedObservations.observations[index][type] = value;
    setObservation({ ...updatedObservations });
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
                scroll={{
                  x: window.innerWidth < 600 ? 'max-content' : null,
                  y: 'calc(100vh - 220px)',
                }}
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
          width={window.innerWidth < 600 ? '90vw' : ' 40vw'}
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
                onClick={onSubmit}
                disabled={requestSent}
                type='primary'
                // htmlType='submit'
              >
                Submit
              </Button>
            </div>
          }
        >
          <div className='col-md-12'>
            <div className='mb-2'>Enter Observation Title *</div>
            <Input
              placeholder='Enter Observation Title'
              onChange={(e) => {
                e.preventDefault();
                setObservation({ ...observation, title: e.target.value });
              }}
              value={observation.title}
              className='th-br-5'
            />
          </div>
          <div className='col-md-12 py-2'>
            <div className='mb-2'>Applicable for</div>
            <Radio.Group
              value={isStudent}
              onChange={handleApplicableFor}
              defaultValue={false}
            >
              <Radio value={false}> Teacher </Radio>
              <Radio value={true}> Student </Radio>
            </Radio.Group>
          </div>
          {observation?.observations?.map((item, index) => {
            return (
              <div className='row py-2 align-item-center'>
                <div className='col-7'>
                  <Input
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value.toString().length > 400) {
                        message.error('Label must be less than 400 character');
                      } else {
                        handleChangeObservations(e.target.value, index, 'label');
                      }
                    }}
                    className='w-100 th-br-5'
                    value={item?.label}
                    required
                    placeholder='Enter Label *'
                  />
                </div>
                <div className='col-4'>
                  <InputNumber
                    onChange={(e) => {
                      if (e > 99) {
                        message.error('Score must be of 2 digit only');
                      } else {
                        handleChangeObservations(e, index, 'score');
                      }
                    }}
                    className='w-100 th-br-5'
                    value={item?.score}
                    placeholder='Max. Score *'
                    type='number'
                    maxLength={3}
                  />
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
        </Drawer>
      </Layout>
    </React.Fragment>
  );
};

export default Observation;
