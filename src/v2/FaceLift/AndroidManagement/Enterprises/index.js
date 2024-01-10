import React, { useEffect, useState, useRef } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  message,
  Form,
  Button,
  Table,
  Popconfirm,
  Tag,
  Drawer,
  Input,
  Modal,
  Space,
  Select,
  Spin,
  Image,
} from 'antd';
import axios from 'v2/config/axios';
import {
  EditOutlined,
  PlusCircleOutlined,
  TabletOutlined,
  FileProtectOutlined,
  DeleteOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

const EnterPrises = () => {
  const enterpriseFormRef = useRef(null);
  const history = useHistory();

  const [loading, setLoading] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showEnterpriseDrawer, setShowEnterpriseDrawer] = useState(false);
  const [editEnterPrise, setEditEnterPrise] = useState({});
  const [enterpriseList, setEnterpriseList] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [showEnrollMentModal, setShowEnrollMentModal] = useState(false);
  const [enrollMentQR, setEnrollMentQR] = useState();
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });

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
      title: <span className='th-white pl-4 th-fw-700 '>Enterprise Name</span>,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Enterprise Display Name</span>,
      align: 'center',
      dataIndex: 'enterpriseDisplayName',
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Actions</span>,
      align: 'center',
      render: (text, row) => {
        let enterpriseId = row?.name?.split('/')[row?.name?.split('/').length - 1];

        return (
          <Space>
            <Tag
              icon={<FileProtectOutlined />}
              color='processing'
              className='th-pointer th-br-4'
              onClick={() =>
                history.push(
                  `/enterprise-management/${row?.enterpriseDisplayName}/${enterpriseId}/policies`
                )
              }
            >
              Policies
            </Tag>
            <Tag
              icon={<PlusCircleOutlined />}
              color='processing'
              className='th-pointer th-br-4'
              onClick={() => {
                setShowEnrollMentModal(true);
                handleEnrollment(enterpriseId, 'policy8');
              }}
            >
              Enroll Device
            </Tag>
            <Tag
              icon={<TabletOutlined />}
              color='processing'
              className='th-pointer th-br-4'
              onClick={() =>
                history.push(
                  `/enterprise-management/${row?.enterpriseDisplayName}/${enterpriseId}/devices`
                )
              }
            >
              Devices
            </Tag>
            <Tag
              icon={<EditOutlined />}
              color='warning'
              className='th-pointer th-br-4'
              onClick={() => handleEditEnterprise(row)}
            >
              Edit
            </Tag>
            <Popconfirm
              placement='bottomRight'
              title={'Are you sure you want to delete this item?'}
              onConfirm={() => handleDeleteEnterprise(enterpriseId)}
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

  const fetchEnterpriseList = (params = {}) => {
    setLoading(true);
    axios
      .get(`/device/get-enterprises/`, { params: { ...params } })
      .then((res) => {
        console.log('enterprise', res);
        if (res?.status === 200) {
          setEnterpriseList(res?.data?.data?.enterprises);
          setPageDetails({ ...pageDetails, total: res?.data?.total });
          message.success(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShowEnterpriseDrawer = () => {
    setShowEnterpriseDrawer(true);
  };

  const handleCloseEnterpriseDrawer = () => {
    setShowEnterpriseDrawer(false);
    setEditEnterPrise({});
    enterpriseFormRef.current.restFields();
  };

  const handleCreateEnterprise = () => {
    const formValues = enterpriseFormRef.current.getFieldsValue();
    let payload = new FormData();
    payload.append('name', formValues?.name);
    payload.append('enterpriseDisplayName', formValues?.enterpriseDisplayName);
    payload.append('primaryColor', 4);
    payload.append('appAutoApprovalEnabled', true);
    setCreateLoading(true);
    if (editEnterPrise?.name) {
      let enterPriseId =
        editEnterPrise?.name?.split('/')[editEnterPrise?.name?.split('/').length - 1];
      axios
        .patch(`/device/get-enterprises/?enterpriseId=${enterPriseId}`, payload)
        .then((res) => {
          console.log('enterprise', res);
          if (res?.status === 200) {
            message.success('EnterPrise Updated');
            handleCloseEnterpriseDrawer();
            setEditEnterPrise({});
            fetchEnterpriseList({ page: pageDetails?.current });
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
        .post(`/device/get-enterprises/`, payload)
        .then((res) => {
          console.log('enterprise', res);
          if (res?.status === 200) {
            message.success('EnterPrise Created');
            handleCloseEnterpriseDrawer();
            fetchEnterpriseList({ page: pageDetails?.current });
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

  const handleEditEnterprise = (currentEnterprise) => {
    setEditEnterPrise(currentEnterprise);
    setShowEnterpriseDrawer(true);
    setTimeout(() => {
      enterpriseFormRef.current.setFieldsValue({
        name: currentEnterprise?.name?.split('/')[
          currentEnterprise?.name?.split('/').length - 1
        ],
        enterpriseDisplayName: currentEnterprise?.enterpriseDisplayName,
        primaryColor: 4,
        appAutoApprovalEnabled: true,
      });
    }, [100]);
  };

  const handleDeleteEnterprise = (enterpriseId) => {
    setDeleteLoading(true);
    axios
      .delete(`/device/get-enterprises/?enterpriseId=${enterpriseId}`)
      .then((res) => {
        console.log('enrollment', res);
        if (res?.status === 200) {
          message.success(res?.data?.message);
          fetchEnterpriseList({ page: pageDetails?.current });
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleEnrollment = (enterpriseId, policyId) => {
    setEnrollmentLoading(true);
    let payload = {
      name: 'etoken8',
      value: '',
      duration: '3600s',
      qrCode: '',
      oneTimeOnly: false,
      policyName: `enterprises/${enterpriseId}/policies/${policyId}`,
      additionalData: enterpriseId,
      user: {},
      allowPersonalUsage: 'ALLOW_PERSONAL_USAGE_UNSPECIFIED',
    };
    axios
      .post(`/device/get-enrollment-token/?enterpriseId=${enterpriseId}`, payload)
      .then((res) => {
        console.log('enrollment', res);
        if (res?.status === 200) {
          setEnrollMentQR(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setEnrollmentLoading(false);
      });
  };

  useEffect(() => {
    fetchEnterpriseList({ pageName: pageDetails?.current });
  }, [pageDetails?.current]);

  useEffect(() => {
    if (enrollMentQR) {
      let duration = Number(enrollMentQR?.duration.slice(0, -1));
      setTimeout(() => {
        setShowEnrollMentModal(false);
      }, 1000 * duration);
    }
  }, [enrollMentQR]);

  return (
    <Layout>
      <div className='row align-items-center'>
        <div className='col-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey th-16' href='/dashboard'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Enterprises</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-4 text-right'>
          <Button
            type='primary'
            className='th-br-8'
            icon={<PlusCircleOutlined />}
            onClick={() => {
              handleShowEnterpriseDrawer();
            }}
          >
            Create Enterprise
          </Button>
        </div>
        <div className='col-12 mt-3'>
          <Table
            columns={columns}
            dataSource={enterpriseList}
            className='th-table '
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            pagination={false}
            rowKey={(record) => record?.id}
          />
        </div>
      </div>
      <Drawer
        className='th-activity-drawer'
        visible={showEnterpriseDrawer}
        onClose={() => {
          handleCloseEnterpriseDrawer();
        }}
        closable={false}
        width={'40vw'}
        title={<span>{editEnterPrise ? 'Update' : 'Create'} Enterprise</span>}
        footer={
          <div className='d-flex justify-content-end'>
            <Button type='default' className='th-br-8'>
              Cancel
            </Button>
            <Button
              type='primary'
              className='th-br-8 mx-2'
              htmlType='submit'
              form='enterPriseForm'
              loading={createLoading}
            >
              {editEnterPrise ? 'Update' : 'Create'}{' '}
            </Button>
          </div>
        }
      >
        <Form
          ref={enterpriseFormRef}
          layout='vertical'
          id='enterPriseForm'
          onFinish={handleCreateEnterprise}
        >
          <div className='row'>
            <div className='col-12'>
              <Form.Item
                name='name'
                label='Enterprise Name'
                rules={[{ required: true, message: 'Please enter enterprise name' }]}
              >
                <Input placeholder='Enterprise Name' className='w-100' />
              </Form.Item>
              <Form.Item
                name='enterpriseDisplayName'
                label='Enterprise Display Name'
                rules={[
                  { required: true, message: 'Please enter enterprise display name' },
                ]}
              >
                <Input placeholder='Enterprise Display Name' className='w-100' />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
      <Modal
        centered
        visible={showEnrollMentModal}
        title={null}
        className='th-upload-modal'
        onCancel={() => {
          setShowEnrollMentModal(false);
        }}
        width={'60vw'}
        footer={null}
      >
        <Spin spinning={enrollmentLoading}>
          <div className='row py-3' style={{ minHeight: 500 }}>
            {enrollMentQR && (
              <>
                {' '}
                <div className='col-12 text-center'>
                  <Image src={enrollMentQR?.qrcode_url} alt='qr_code' />
                </div>
                <div className='col-12 text-center'>
                  <span className='th-black th-20 th-fw-500'>
                    Please scan this QR Code from you device{' '}
                  </span>
                  <p>
                    Valid till{' '}
                    {moment(enrollMentQR?.expirationTimestamp).format(
                      'DD-MM-YYYY HH:mm:ss A'
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </Spin>
      </Modal>
    </Layout>
  );
};

export default EnterPrises;
