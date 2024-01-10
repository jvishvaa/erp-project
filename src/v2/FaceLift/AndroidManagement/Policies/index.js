import React, { useEffect, useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import {
  Breadcrumb,
  message,
  Select,
  Form,
  Button,
  Table,
  DatePicker,
  Radio,
  Popconfirm,
  Tag,
  Drawer,
  Switch,
  Space,
  Modal,
  Input,
} from 'antd';
import axios from 'v2/config/axios';
import moment from 'moment';
import {
  EditOutlined,
  DeleteOutlined,
  EyeFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import PolicyDetailsModal from './PolicyDetailsModal';

const Policies = () => {
  const { enterPriseName, enterPriseId } = useParams();
  const policyFormRef = useRef();
  const [policyLoading, setPolicyLoading] = useState(false);
  const [createPolicyLoading, setCreatePolicyLoading] = useState(false);
  const [deletePolicyLoading, setDeletePolicyLoading] = useState(false);
  const [assignedPoliciesList, setAssignedPoliciesList] = useState([]);
  const [showPolicyDrawer, setShowPolicyDrawer] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [pageDetails, setPageDetails] = useState({ current: 1, total: 0 });
  const [policyDetails, setPolicyDetails] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAssignedPolicyList = (params = {}) => {
    setPolicyLoading(true);
    axios
      .get(`/device/get-policies/`, { params: { ...params } })
      .then((res) => {
        console.log('policies', res);
        if (res?.status === 200) {
          setAssignedPoliciesList(res?.data?.data?.policies);
          message.success(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setPolicyLoading(false);
      });
  };

  const handleClosePolicyDrawer = () => {
    setShowPolicyDrawer(false);
  };
  const handleShowCreateModal = () => {
    setShowCreateModal(true);
    setPolicyDetails({ name: '', version: 1, applications: [] });
  };
  const handleShowPolicyModal = () => {
    setShowPolicyModal(true);
  };
  const handleClosePolicyModal = () => {
    setShowPolicyModal(false);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setPolicyDetails({});
  };
  const handleDeletePolicy = (policyId) => {
    setDeletePolicyLoading(true);
    axios
      .delete(`device/get-policies/?enterpriseId=${enterPriseId}&policyId=${policyId}`)
      .then((res) => {
        if (res?.status === 200) {
          message.success(res?.data?.message);
          fetchAssignedPolicyList({
            pageName: pageDetails?.current,
            enterpriseId: enterPriseId,
          });
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setDeletePolicyLoading(false);
      });
  };
  const policyColumns = [
    {
      title: <span className='th-white th-fw-700 '>Sl No.</span>,
      align: 'center',
      width: '10%',
      render: (text, row, index) => (
        <span className='pl-md-4 th-black-1 th-16'>{index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Policy Name</span>,
      align: 'center',
      dataIndex: 'name',
      render: (data) => <span> {data?.split('/')[data?.split('/').length - 1]}</span>,
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Version</span>,
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: <span className='th-white pl-4 th-fw-700 '>Actions</span>,
      align: 'center',
      render: (text, row) => {
        let id = row?.name?.split('/')[row?.name?.split('/').length - 1];

        return (
          <Space>
            <Tag
              icon={<EditOutlined />}
              color='warning'
              className='th-pointer th-br-4'
              onClick={() => {
                setPolicyDetails({
                  ...row,
                });
                // setShowPolicyDrawer(true);
                // setShowPolicyModal(true);
                handleShowPolicyModal();
              }}
            >
              Edit
            </Tag>
            <Popconfirm
              placement='bottomRight'
              title={'Are you sure you want to delete this policy?'}
              onConfirm={() => handleDeletePolicy(id)}
              okText='Yes'
              cancelText='No'
              okButtonProps={{ loading: deletePolicyLoading }}
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

  const handleUpdatePolicy = () => {
    setCreatePolicyLoading(true);
    let payload = { ...policyDetails };
    let policyId =
      policyDetails?.name?.split('/')[policyDetails?.name?.split('/').length - 1];
    axios
      .patch(
        `/device/get-policies/?enterpriseId=${enterPriseId}&policyId=${policyId}`,
        payload
      )
      .then((res) => {
        if (res?.status === 200) {
          message.success(res?.data?.message);
          setShowPolicyDrawer(false);

          fetchAssignedPolicyList({
            pageName: pageDetails?.current,
            enterpriseId: enterPriseId,
          });
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setCreatePolicyLoading(false);
      });
  };
  const handleCreatePolicy = (currentData) => {
    setCreatePolicyLoading(true);
    let payload = { ...currentData };
    let policyId =
      currentData?.name?.split('/')[currentData?.name?.split('/').length - 1];
    axios
      .patch(
        `/device/get-policies/?enterpriseId=${enterPriseId}&policyId=${policyId}`,
        payload
      )
      .then((res) => {
        if (res?.status === 200) {
          message.success(res?.data?.message);
          handleCloseCreateModal();
          handleClosePolicyModal();
          fetchAssignedPolicyList({
            pageName: pageDetails?.current,
            enterpriseId: enterPriseId,
          });
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setCreatePolicyLoading(false);
      });
  };

  useEffect(() => {
    fetchAssignedPolicyList({
      pageName: pageDetails?.current,
      enterpriseId: enterPriseId,
    });
  }, [pageDetails?.current]);
  return (
    <Layout>
      <div className='row align-items-center'>
        <div className='col-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey th-16'>
              Android Management
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16'>{enterPriseName}</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Policies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-4 text-right'>
          <Button
            className='th-br-8'
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={handleShowCreateModal}
          >
            Add Policy
          </Button>
        </div>
        <div className='col-12 mt-3'>
          <Table
            columns={policyColumns}
            dataSource={assignedPoliciesList}
            className='th-table '
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={policyLoading}
            pagination={false}
            rowKey={(record) => record?.id}
          />
        </div>
      </div>

      <Modal
        visible={showCreateModal}
        title={'Create Policy'}
        className='th-upload-modal'
        onCancel={() => {
          handleCloseCreateModal();
        }}
        centered
        footer={[
          <Button
            type='primary'
            className='th-br-8'
            loading={createPolicyLoading}
            onClick={() => handleCreatePolicy(policyDetails)}
          >
            Submit
          </Button>,
        ]}
      >
        <div className='row py-3'>
          <div className='col-12'>
            <Input
              placeholder='Enter policy name'
              onChange={(e) =>
                setPolicyDetails({
                  ...policyDetails,
                  name: e.target.value?.replace(' ', ''),
                })
              }
            />
          </div>
        </div>
      </Modal>
      <PolicyDetailsModal
        currentPolicyDetails={policyDetails}
        showPolicyModal={showPolicyModal}
        handleClosePolicyModal={handleClosePolicyModal}
        handleShowPolicyModal={handleShowPolicyModal}
        createPolicyLoading={createPolicyLoading}
        handleCreatePolicy={handleCreatePolicy}
      />
    </Layout>
  );
};

export default Policies;
