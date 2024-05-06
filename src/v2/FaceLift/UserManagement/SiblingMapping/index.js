import React, { useEffect, useRef, useState } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../../config/endpoints';
import countryList from 'containers/user-management/list';

const SiblingMapping = () => {
  const siblingFormRef = useRef();
  const searchRef = useRef(null);
  const contactFormRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [selectedParent, setSelectedParent] = useState([]);
  const [parentRowKeys, setParentRowKeys] = useState(null);
  const [isAssignSiblingModalOpen, setIsAssignSiblingModalOpen] = useState(false);
  const [erpData, setErpData] = useState(false);
  const [erpVerifying, setErpVerifying] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [parentContactCode, setParentContactCode] = useState('+91');

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContactData, setSelectedContactDta] = useState();
  const [updatingContact, setUpdatingContact] = useState(false);

  const openAssignSiblingModal = (record) => {
    setSelectedParent(record);
    setIsAssignSiblingModalOpen(true);
  };

  const closeAssignSiblingModal = () => {
    setErpData(null);
    siblingFormRef.current.resetFields();
    setIsAssignSiblingModalOpen(false);
  };

  const openContactModal = (record) => {
    setSelectedContactDta(record);
    setSelectedParent(record);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    contactFormRef.current.resetFields();
    setIsContactModalOpen(false);
  };

  const ParentColumns = [
    {
      title: <span className='th-white th-fw-700 '>Name</span>,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (data, row) => (
        <span className='th-black-1 th-14'>
          {row?.father_first_name} {row?.father_last_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp_code',
      key: 'erp_code',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Contact</span>,
      dataIndex: 'contact_details',
      key: 'contact_details',
      width: '25%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      width: '20%',
      key: 'action',
      render: (data, record) => {
        return (
          <>
            <Tag
              icon={<EditOutlined />}
              color='processing'
              style={{ cursor: 'pointer' }}
              onClick={() => openAssignSiblingModal(record)}
            >
              Assign Sibling
            </Tag>

            <Tag
              icon={<EditOutlined />}
              className='mt-2'
              color='processing'
              style={{ cursor: 'pointer' }}
              onClick={() => openContactModal(record)}
            >
              Update Contact
            </Tag>
          </>
        );
      },
    },
  ];

  const searchParent = async (code, contact) => {
    if (contact?.length === 10) {
      try {
        setLoading(true);
        let contactParams = `${code}-${contact}`;
        const result = await axiosInstance(
          `${endpoints.userManagement.serachParent}?contact=${contactParams}`
        );

        if (result?.data?.status_code === 200) {
          let parentdata = result?.data?.result?.results;
          const newData = parentdata.map(({ children, ...rest }) => ({
            sibling: children,
            ...rest,
          }));
          setParentData(newData);
        }
      } catch (error) {
        message.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    } else {
      setParentData(null);
    }
  };

  const onParentExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.id);
    }
    setParentRowKeys(keys);
  };

  const fetchERPDetails = async (erp) => {
    setErpVerifying(true);
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.fetchContactInfo}?erp_id=${erp}`
      );

      if (result?.data?.status_code === 200) {
        setErpData(result?.data?.data);

        message.success(result?.data?.message);
      } else {
        setErpData(null);
      }
    } catch (error) {
      setErpData(null);

      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setErpVerifying(false);
    }
  };

  const assignSibling = async () => {
    let filteredData = parentData?.filter((e) => e?.id !== selectedParent?.id);
    setAssigning(true);
    let formData = {
      children_to_map: erpData?.role_details?.erp_user_id.toString(),
      primary_parent: selectedParent?.id.toString(),
      parents_to_remove: parentData
        ?.filter((e) => e?.id !== selectedParent?.id)
        ?.map((item) => item?.id)
        .toString(),
    };
    try {
      const result = await axiosInstance.post(
        `${endpoints.userManagement.addChildToParent}`,
        formData
      );

      if (result?.data?.status_code === 200) {
        closeAssignSiblingModal();
        setErpData(null);
        searchParent(parentContactCode, searchRef?.current?.getFieldsValue()?.contact);
        setParentRowKeys([]);
        message.success(result?.data?.message);
      } else {
        message.error(result?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setAssigning(false);
    }
  };

  const updateParent = async (params = {}) => {
    if (params?.type === 'update') {
      if (params?.contact?.length !== 10) {
        message.error('Please enter valid contact number');
        return;
      }
      setUpdatingContact(true);
    }
    let contactParams = `${params?.code?.toString()}-${params?.contact?.toString()}`;
    let formData = {};
    if (params?.type === 'update') {
      formData.contact = contactParams;
    }
    if (params?.type === 'delete') {
      formData.child_to_remove = params?.child_to_remove?.toString();
    }
    try {
      const result = await axiosInstance.put(
        `${endpoints.userManagement.updateParent}/${params?.id}/`,
        formData
      );
      if (result?.data?.status_code === 200) {
        if (params?.type === 'update') {
          closeContactModal();
          contactFormRef.current.resetFields();
        }
        setParentRowKeys([]);
        searchParent(parentContactCode, searchRef?.current?.getFieldsValue()?.contact);
        message.success(result?.data?.message);
      } else {
        message.error(result?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      if (params?.type === 'update') {
        setUpdatingContact(false);
      }
    }
  };

  const expandedParentRender = (record) => (
    <>
      {Array.isArray(record?.sibling) &&
        record?.sibling.length > 0 &&
        record?.sibling.map((item, index) => (
          <div className='th-bg-white th-br-10 py-1 shadow-md  mb-3' key={index}>
            <div className='row align-items-center' key={index}>
              <div className='col-md-10'>
                <div className='row'>
                  <div className='col-md-4'>Name: {item.name}</div>
                  <div className='col-md-4'>ERP ID: {item.erp_id}</div>
                  <div className='col-md-4'>Branch: {item.branch_name}</div>
                  <div className='col-md-4'>Grade: {item.grade_name}</div>
                  <div className='col-md-4'>Section: {item.section_name}</div>
                </div>
              </div>
              <div className='col-md-2 text-center'>
                <Popconfirm
                  title='Are you Sure, Assign this student in other Parent before delete?'
                  onConfirm={(e) =>
                    updateParent({
                      child_to_remove: item?.id,
                      id: parentRowKeys?.[0],
                      type: 'delete',
                    })
                  }
                >
                  <Tag
                    icon={<DeleteOutlined />}
                    color='error'
                    style={{ cursor: 'pointer' }}
                  >
                    Delete
                  </Tag>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}
    </>
  );

  const countryCodeOptions = countryList?.map((each) => (
    <Select.Option key={each?.country} value={each?.callingCode}>
      {/* {each?.country} ( */}
      {each?.callingCode}
    </Select.Option>
  ));

  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                href='/user-management/view-users'
                className='th-black-1 th-16 th-grey'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Sibling Mapping
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-3 shadow-sm'>
              <Form
                id='filterForm'
                className='mt-3'
                layout={'vertical'}
                ref={searchRef}
                style={{ width: '100%' }}
              >
                <Row>
                  <Col md={8} className=''>
                    <Space align='start'>
                      <Form.Item name={'contact_code'} label='Code'>
                        <Select
                          showSearch
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          defaultValue={'+91'}
                          onChange={(e) => {
                            setParentContactCode(e);
                            searchParent(
                              e,
                              searchRef?.current?.getFieldsValue()?.contact
                            );
                          }}
                        >
                          {countryCodeOptions}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        rules={[
                          {
                            required: false,
                            pattern: /^[0-9]{10}$/,
                            message: `Contact Number is invalid!`,
                          },
                        ]}
                        name={'contact'}
                        label={'Contact Number'}
                      >
                        <Input
                          className='w-100'
                          placeholder='Contact'
                          onChange={(e) => {
                            searchParent(parentContactCode, e.target.value);
                          }}
                          maxLength={10}
                          minLength={10}
                        />
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              </Form>
              <Table
                expandable={{
                  expandedRowKeys: parentRowKeys,
                  onExpand: onParentExpand,
                  expandedRowRender: expandedParentRender,
                }}
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={ParentColumns}
                dataSource={parentData}
                rowKey={(record) => record?.id}
                pagination={false}
                scroll={{ y: '40vh' }}
              />
            </div>
          </div>
        </div>

        <Modal
          visible={isAssignSiblingModalOpen}
          centered
          title='Assign Sibling'
          onCancel={closeAssignSiblingModal}
          footer={false}
          bodyStyle={{ paddingBottom: '20px !important' }}
          className='th-modal'
        >
          <Form ref={siblingFormRef}>
            <div className='row justify-content-center'>
              <div className='col-8 text-center'>
                <Form.Item name='erp_id'>
                  <Input placeholder='Enter ERP Id' disabled={erpData} />
                </Form.Item>
              </div>
              {!erpData && (
                <div className='col-4'>
                  <Button
                    className='th-br-4'
                    type='primary'
                    onClick={() =>
                      fetchERPDetails(siblingFormRef?.current?.getFieldValue()?.erp_id)
                    }
                    disabled={erpVerifying}
                  >
                    {erpVerifying ? (
                      <>
                        <Spin /> verifying{' '}
                      </>
                    ) : (
                      'Verify ERP'
                    )}
                  </Button>
                </div>
              )}
              {erpData && (
                <>
                  <div className='row '>
                    <div className='col-md-6'>
                      <span>Name : </span>
                      <span>
                        {erpData?.first_name} {erpData?.last_name}
                      </span>
                    </div>
                    <div className='col-md-6'>
                      <span>Branch : </span>
                      <span>{erpData?.role_details?.branch?.[0]?.branch_name}</span>
                    </div>
                    <div className='col-md-6'>
                      <span>Grade : </span>
                      <span>{erpData?.role_details?.grades?.[0]?.grade__grade_name}</span>
                    </div>
                    <div className='col-md-6'>
                      <span>Section : </span>
                      <span>
                        {erpData?.role_details?.section?.[0]?.section__section_name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button
                      style={{ width: 'fit-content' }}
                      className='th-br-4 mt-3 px-3'
                      type='primary'
                      disabled={assigning}
                      onClick={assignSibling}
                    >
                      {assigning ? (
                        <>
                          <Spin /> Assigning
                        </>
                      ) : (
                        'Assign'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Form>
        </Modal>

        <Modal
          visible={isContactModalOpen}
          centered
          title='Update Contact'
          onCancel={closeContactModal}
          footer={false}
          bodyStyle={{ paddingBottom: '20px !important' }}
          className='th-modal'
        >
          <Form
            id='contactForm'
            className='mt-3'
            layout={'vertical'}
            ref={contactFormRef}
            style={{ width: '100%' }}
          >
            <Row gutter={[8, 8]} className='justify-content-center'>
              <Col md={6} className=''>
                <Form.Item name={'contact_code'} label='Code'>
                  <Select
                    showSearch
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    defaultValue={'+91'}
                    onChange={(e) => {
                      setParentContactCode(e);
                    }}
                  >
                    {countryCodeOptions}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={18} className=''>
                <Form.Item
                  rules={[
                    {
                      required: false,
                      pattern: /^[0-9]{10}$/,
                      message: `Contact Number is invalid!`,
                    },
                  ]}
                  name={'contact'}
                  label={'Contact Number'}
                >
                  <Input
                    className='w-100'
                    placeholder='Contact'
                    maxLength={10}
                    minLength={10}
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Button
                  className='w-100 th-br-4'
                  type='primary'
                  disabled={updatingContact}
                  onClick={() =>
                    updateParent({
                      code: parentContactCode,
                      contact: contactFormRef?.current?.getFieldValue()?.contact,
                      id: selectedContactData?.id,
                      type: 'update',
                    })
                  }
                >
                  {updatingContact ? (
                    <>
                      <Spin /> Updating
                    </>
                  ) : (
                    'Update'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout>
    </React.Fragment>
  );
};

export default SiblingMapping;
