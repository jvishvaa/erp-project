import React, { useEffect, useState, useRef } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  message,
  Form,
  Button,
  Skeleton,
  Popconfirm,
  Tag,
  Drawer,
  Input,
  Space,
  Card,
  Empty,
} from 'antd';
import axios from 'v2/config/axios';
import moment from 'moment';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EyeFilled,
  AndroidOutlined,
  TabletOutlined,
} from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';

const Devices = () => {
  const deviceFormRef = useRef(null);
  const history = useHistory();
  const { enterPriseName, enterPriseId } = useParams();
  const [loading, setLoading] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showDeviceDrawer, setShowDeviceDrawer] = useState(false);
  const [editDevice, setEditDevice] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });

  const getSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(parseFloat(bytes / Math.pow(k, i))) + ' ' + sizes[i];
  };

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Sl No.</span>,
      align: 'center',
      width: '10%',
      render: (text, row, index) => (
        <span className='pl-md-4 th-black-1 th-16'>{index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Model Info</span>,
      align: 'center',
      dataIndex: 'hardwareInfo',
      render: (data) => (
        <span>
          {data.brand}&nbsp;{data?.model}
        </span>
      ),
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Enrollment Time</span>,
      align: 'center',
      dataIndex: 'enrollmentTime',
      render: (data) => <span>{moment(data).format('DD-MM-YYYY hh:mm A')}</span>,
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>User</span>,
      align: 'center',
      dataIndex: 'userName',
      render: (data) => <span>{data?.split('/')[data.split('/').length - 1]}</span>,
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Actions</span>,
      align: 'center',
      render: (text, row) => {
        let id = row?.name?.split('/')[row?.name?.split('/').length - 1];
        return (
          <Space>
            <Tag icon={<EyeFilled />} color='processing' className='th-pointer th-br-4'>
              View
            </Tag>
            <Popconfirm
              placement='bottomRight'
              title={'Are you sure you want to delete this item?'}
              onConfirm={() => handleDeleteDevice(row.id)}
              okText='Yes'
              cancelText='No'
              okButtonProps={{ loading: deleteLoading }}
            >
              <Tag
                icon={<DeleteOutlined />}
                color='volcano'
                className='th-pointer th-br-4'
              >
                Delete
              </Tag>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const fetchDeviceList = (params = {}) => {
    setLoading(true);
    axios
      .get(`/device/get-devices/`, { params: { ...params } })
      .then((res) => {
        if (res?.status === 200) {
          setDeviceList(res?.data?.data?.devices);
          setPageDetails({ ...pageDetails, total: res?.data?.total });
          // message.success(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShowDeviceDrawer = () => {
    setShowDeviceDrawer(true);
  };

  const handleCloseDeviceDrawer = () => {
    setShowDeviceDrawer(false);
  };

  const handleCreateDevice = () => {
    const formValues = deviceFormRef.current.getFieldsValue();
    let payload = new FormData();
    payload.append('name', formValues?.name);
    payload.append('DeviceDisplayName', formValues?.DeviceDisplayName);
    payload.append('primaryColor', 4);
    payload.append('appAutoApprovalEnabled', true);
    setCreateLoading(true);
    if (editDevice) {
      axios
        .put(`/apiV1/get-devices/`, payload)
        .then((res) => {
          console.log('device', res);
          if (res?.status === 201) {
            message.success('Device Updated');
            handleCloseDeviceDrawer();
            setEditDevice(false);
            fetchDeviceList({
              pageName: pageDetails?.current,
              enterpriseId: enterPriseId,
            });
          }
        })
        .catch((error) => {
          message.error(error?.message);
        })
        .finally(() => {
          setCreateLoading(false);
        });
    } else {
      axios
        .post(`device/get-devices/`, payload)
        .then((res) => {
          console.log('device', res);
          if (res?.status === 201) {
            message.success('Device Created');
            handleCloseDeviceDrawer();
            fetchDeviceList({
              pageName: pageDetails?.current,
              enterpriseId: enterPriseId,
            });
          }
        })
        .catch((error) => {
          message.error(error?.message);
        })
        .finally(() => {
          setCreateLoading(false);
        });
    }
  };

  const handleDeleteDevice = () => {};
  useEffect(() => {
    fetchDeviceList({ pageName: pageDetails?.current, enterpriseId: enterPriseId });
  }, [pageDetails?.current]);

  return (
    <Layout>
      <div className='row align-items-center'>
        <div className='col-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() => history.push('/dashboard')}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() => history.push('/enterprise-management/enterprises')}
            >
              {enterPriseName}
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Devices</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-4 text-right'>
          <Button
            type='primary'
            className='th-br-8'
            icon={<PlusCircleOutlined />}
            onClick={() => {
              handleShowDeviceDrawer();
            }}
          >
            Add Device
          </Button>
        </div>
        <div className='col-12 mt-3'>
          {/* <Table
            columns={columns}
            dataSource={deviceList}
            className='th-table '
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            pagination={false}
            rowKey={(record) => record?.id}
          /> */}
          <div className='row'>
            {loading ? (
              [...Array(4).keys()]?.map((el) => (
                <div className='col-6'>
                  <Skeleton.Button
                    active
                    block
                    shape='square'
                    style={{ height: 150, width: '100%', marginBottom: 10 }}
                  />
                </div>
              ))
            ) : deviceList?.length > 0 ? (
              deviceList?.map((el, index) => {
                return (
                  <div className='col-4 th-device-card'>
                    {/* <div
                        className='th-br-12 th-bg-grey'
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        <div className='col-12'>dfsfdsf4534534</div>
                        <div className='col-12 th-bg-white'>dfsdfdsfsd</div> */}
                    <Card
                      // actions={[
                      //   <Button type='text'>
                      //     <span className='th-grey th-fw-500'>View Details &gt;</span>
                      //   </Button>,
                      // ]}
                      title={
                        <div className='d-flex justify-content-between'>
                          <div className='d-flex justify-content-start '>
                            <div className='pr-1'>
                              <TabletOutlined className='th-25' />
                            </div>
                            <div className='d-flex flex-column'>
                              <span className='pb-2'>
                                {' '}
                                {
                                  el?.userName.split('/')[
                                    el?.userName.split('/').length - 1
                                  ]
                                }
                              </span>

                              <span className='th-14 th-grey th-fw-500'>
                                Last Seen 18 hrs ago
                              </span>
                            </div>
                          </div>

                          <div>
                            <AndroidOutlined className='th-20' />
                          </div>
                        </div>
                      }
                      style={{ borderRadius: 12 }}
                    >
                      <div className='row'>
                        <div className='col-12 th-grey-2 th-fw-500'>
                          <div className='text-capitalize pb-2'>
                            {el?.hardwareInfo?.manufacturer}&nbsp;
                            {el?.hardwareInfo?.hardware} {el?.hardwareInfo?.model}
                          </div>
                          <div className='text-capitalize pb-2'>
                            &bull; RAM - {getSize(el?.memoryInfo?.totalRam)} &bull;
                            Storage - {getSize(el?.memoryInfo?.totalInternalStorage)}
                          </div>
                        </div>
                      </div>
                    </Card>
                    {/* </div> */}
                  </div>
                );
              })
            ) : (
              <div className='col-12'>
                <div className='d-flex justify-content-center py-4'>
                  <Empty
                    image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                    imageStyle={{
                      height: 60,
                    }}
                    description={
                      <span className='th-grey2 th-fw-600 th-20'>
                        No devices added yet !
                      </span>
                    }
                  ></Empty>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Drawer
        className='th-activity-drawer'
        visible={showDeviceDrawer}
        onClose={() => {
          handleCloseDeviceDrawer();
        }}
        closable={false}
        width={'40vw'}
        title={<span>{editDevice ? 'Update' : 'Create'} Device</span>}
        footer={
          <div className='d-flex justify-content-end'>
            <Button type='default' className='th-br-8'>
              Cancel
            </Button>
            <Button
              type='primary'
              className='th-br-8 mx-2'
              htmlType='submit'
              form='deviceForm'
            >
              {editDevice ? 'Update' : 'Create'}{' '}
            </Button>
          </div>
        }
      >
        <Form
          ref={deviceFormRef}
          layout='vertical'
          id='deviceForm'
          onFinish={handleCreateDevice}
        >
          <div className='row'>
            <div className='col-12'>
              <Form.Item
                name='name'
                label='Device Name'
                rules={[{ required: true, message: 'Please enter device name' }]}
              >
                <Input placeholder='Device Name' className='w-100' />
              </Form.Item>
              <Form.Item
                name='DeviceDisplayName'
                label='Device Display Name'
                rules={[{ required: true, message: 'Please enter device display name' }]}
              >
                <Input placeholder='Device Display Name' className='w-100' />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default Devices;
