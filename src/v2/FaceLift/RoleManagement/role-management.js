import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Input,
  Table,
  message,
  Pagination,
  Empty,
  Drawer,
  Row,
  Col,
  Spin,
  Checkbox,
  Card,
  Form,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  RedoOutlined,
  DesktopOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import Layout from 'containers/Layout';
import { useForm } from 'antd/lib/form/Form';

const RoleManagement = () => {
  const history = useHistory();
  const [formRef] = useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [roleSearch, setRoleSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [roleId, setRoleId] = useState();
  let parentModuleIds = [];
  let mobileParentModuleIds = [];
  let childModuleIds = [];
  let mobileModule = [];
  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };
  useEffect(() => {
    fetchRoleList();
  }, [currentPage]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFetchRoleList();
    }, 500);
    return () => clearTimeout(timeout);
  }, [roleSearch]);

  const handleFetchRoleList = () => {
    if (currentPage == 1) {
      fetchRoleList();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchRoleList = () => {
    setTableLoading(true);
    let params = {
      page: currentPage,
      page_size: pageSize,
    };
    if (roleSearch?.length > 0) {
      params = {
        ...params,
        role_name: roleSearch,
      };
    }
    axiosInstance
      .get(`${endpoints.roleManagement.roleList}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setRoleList(response?.data);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setTableLoading(false);
      });
  };
  const handleDeleteRole = (params = {}) => {
    setLoading(true);
    axiosInstance
      .post(`${endpoints.roleManagement.deleteRole}`, params)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Role deleted successdully');
          fetchRoleList();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRestoreRole = (params = {}) => {
    setLoading(true);
    axiosInstance
      .post(`${endpoints.roleManagement.restoreRole}`, params)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Role restored successfully');
          fetchRoleList();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchModuleList = ({ actionKey, roleId }) => {
    setDrawerLoading(true);
    let url;
    if (actionKey === 'create') {
      url = `${endpoints.moduleManagement.moduleList}?is_delete=False`;
    } else if (actionKey === 'edit') {
      url = `${endpoints.roleManagement.roleList}?role=${roleId}`;
    }
    axiosInstance
      .get(url)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setModuleList(response?.data?.result);
          formRef.setFieldsValue({
            role_name: response?.data?.role_name,
          });
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const handleCreateEditRole = () => {
    const role_name = formRef?.getFieldsValue()?.role_name;
    if (!role_name || role_name?.length === 0) {
      message.error('OOPS! You missed entering role name');
      return;
    }
    if (
      parentModuleIds?.length === 0 &&
      childModuleIds?.length === 0 &&
      mobileParentModuleIds?.length === 0 &&
      mobileModule?.length === 0
    ) {
      message.error('Please select at least one module');
      return;
    }
    setDrawerLoading(true);
    const selectedParentModules = moduleList.filter((module) =>
      parentModuleIds.includes(module.id)
    );
    const selectedMobileParentModule = moduleList.filter((module) =>
      mobileParentModuleIds.includes(module.id)
    );
    const selectedParentsChildModuleIds = selectedParentModules.flatMap((module) =>
      module.module_child.map((child) => child.module_child_id)
    );
    const selectedMobileChildModuleIds = selectedMobileParentModule.flatMap((module) =>
      module.module_child.map((child) => child.module_child_id)
    );
    let combinedModuleIds = [...selectedParentsChildModuleIds, ...childModuleIds];
    let combinedMobileModuleIds = [...selectedMobileChildModuleIds, ...mobileModule];
    let moduleIds = [...new Set(combinedModuleIds)];
    let mobileModuleIds = [...new Set(combinedMobileModuleIds)];
    let url;
    if (roleId) {
      url = `${endpoints.roleManagement.updateRole}`;
    } else {
      url = `${endpoints.roleManagement.createRole}`;
    }
    const createModulePayload = (moduleId, isMobile) => ({
      modules_id: moduleId,
      my_branch: true,
      my_grade: true,
      my_section: true,
      my_subject: true,
      custom_year: [],
      custom_grade: [],
      custom_section: [],
      custom_branch: [],
      custom_subject: [],
      is_mobile: isMobile,
    });
    let payloadModules = [];

    if (JSON.stringify(moduleIds.sort()) === JSON.stringify(mobileModuleIds.sort())) {
      moduleIds.forEach((moduleId) => {
        payloadModules.push(createModulePayload(moduleId, false));
        payloadModules.push(createModulePayload(moduleId, true));
      });
    } else {
      let commonIds = moduleIds.filter((id) => mobileModuleIds.includes(id));
      let uniqueModuleIds = moduleIds.filter((id) => !mobileModuleIds.includes(id));
      let uniqueMobileModuleIds = mobileModuleIds.filter((id) => !moduleIds.includes(id));
      commonIds.forEach((id) => {
        payloadModules.push(createModulePayload(id, false));
        payloadModules.push(createModulePayload(id, true));
      });
      uniqueModuleIds.forEach((id) => {
        payloadModules.push(createModulePayload(id, false));
      });
      uniqueMobileModuleIds.forEach((id) => {
        payloadModules.push(createModulePayload(id, true));
      });
    }

    const payload = {
      role_name: role_name,
      Module: payloadModules,
    };

    if (roleId) {
      payload.role_id = roleId;
    }
    axiosInstance
      .post(url, payload)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          if (response?.data?.message === 'Success') {
            if (roleId) {
              message.success('Hurray! Role updated successfully!');
            } else {
              message.success('Hurray! Role created successfully!');
            }
            closeModulesDrawer();
            if (roleId) {
              fetchRoleList();
            } else {
              if (roleSearch?.length > 0) {
                setRoleSearch('');
              } else {
                handleFetchRoleList();
              }
            }
          } else {
            message.error('OOPS! This role name is already present');
            return;
          }
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };
  const openModulesDrawer = ({ actionKey, roleId }) => {
    setOpenDrawer(true);
    fetchModuleList({
      actionKey: actionKey,
      roleId: roleId,
    });
    if (actionKey === 'edit') {
      setRoleId(roleId);
    }
  };
  const closeModulesDrawer = () => {
    setOpenDrawer(false);
    setRoleId();
    formRef.resetFields();
  };
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty
          description={
            <div>
              No data found. <br />
              Please try again.
            </div>
          }
        />
      </div>
    ),
  };

  const columns = [
    {
      title: <span className='th-white th-16 th-fw-700'>Sl No.</span>,
      align: 'center',
      render: (data, row, index) => (
        <span className='th-black-1 th-16'>
          {(currentPage - 1) * pageSize + index + 1}.
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Role ID</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.id}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Role Name</span>,
      align: 'left',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {' '}
          {extractContent(row?.role_name).length > 25 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={extractContent(row?.role_name)}
              overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
            >
              {extractContent(row?.role_name).substring(0, 25) + '...'}
            </Tooltip>
          ) : (
            extractContent(row?.role_name)
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created At</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : ' '}
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Created By</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 th-16'>{row?.created_by}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Action</span>,
      align: 'center',
      key: 'action',
      render: (data, row) => {
        return (
          <>
            {row?.is_delete ? (
              <Popconfirm
                title='Sure to restore?'
                onConfirm={() =>
                  handleRestoreRole({
                    role: row?.id,
                  })
                }
              >
                <RedoOutlined
                  title='Restore'
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#00A000',
                  }}
                />
              </Popconfirm>
            ) : (
              <>
                <EditOutlined
                  title='Update Role'
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#1B4CCB',
                  }}
                  onClick={() =>
                    openModulesDrawer({
                      actionKey: 'edit',
                      roleId: row?.id,
                    })
                  }
                />
                <Popconfirm
                  title='Sure to delete?'
                  onConfirm={() =>
                    handleDeleteRole({
                      role: row?.id,
                    })
                  }
                >
                  <DeleteOutlined
                    title='Delete'
                    style={{
                      fontSize: 20,
                      margin: 10,
                      cursor: 'pointer',
                      color: '#FF0000',
                    }}
                  />
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  const ChildModulesDivComponents = ({
    childModule,
    isParentModuleSelected,
    isMobileParentModuleSelected,
    subIndex,
  }) => {
    const [isChildModuleSelected, setIsChildModuleSelected] = useState(false);
    const [isMobileModuleSelected, setIsMobileModuleSelected] = useState(false);
    useEffect(() => {
      if (childModule?.checked) {
        childModuleIds.push(childModule?.module_child_id);
        setIsChildModuleSelected(true);
      }
    }, []);
    const handleChildModuleCheck = (childModId) => {
      if (!childModuleIds.includes(childModId)) {
        childModuleIds.push(childModId);
      } else {
        const index = childModuleIds.indexOf(childModId);
        if (index !== -1) {
          childModuleIds.splice(index, 1);
        }
      }
      setIsChildModuleSelected(!isChildModuleSelected);
    };
    useEffect(() => {
      if (isParentModuleSelected) {
        setIsChildModuleSelected(true);
      } else if (isChildModuleSelected) {
        setIsChildModuleSelected(false);
      }
    }, [isParentModuleSelected]);

    useEffect(() => {
      if (childModule?.is_mobile) {
        mobileModule.push(childModule?.module_child_id);
        setIsMobileModuleSelected(true);
      }
    }, []);
    const handleMobileModuleCheck = (childModId) => {
      if (!mobileModule.includes(childModId)) {
        mobileModule.push(childModId);
      } else {
        const index = mobileModule.indexOf(childModId);
        if (index !== -1) {
          mobileModule.splice(index, 1);
        }
      }
      setIsMobileModuleSelected(!isMobileModuleSelected);
    };
    useEffect(() => {
      if (isMobileParentModuleSelected) {
        setIsMobileModuleSelected(true);
      } else if (isMobileModuleSelected) {
        setIsMobileModuleSelected(false);
      }
    }, [isMobileParentModuleSelected]);

    const getDivClassName = (isMobileSelected, isWebSelected, subIndex) => {
      if (isMobileSelected) {
        return 'th-bg-blue-2';
      }
      if (isWebSelected) {
        return 'th-bg-blue-2';
      }
      return subIndex % 2 === 0 ? 'th-bg-grey' : 'th-bg-white';
    };
    return (
      <>
        <style>
          {`
          .ant-tooltip-placement-topLeft .ant-tooltip-arrow {
              left : 0px !important
            }
        `}
        </style>
        <div className='d-flex justify-content-between'>
          <div
            key={subIndex}
            className={`${getDivClassName(
              isMobileModuleSelected,
              isChildModuleSelected,
              subIndex
            )} d-flex justify-content-between th-width-80`}
          >
            <span className='th-black-1 th-14'>{childModule?.module_child_name}</span>
            {isParentModuleSelected ? null : (
              <Tooltip
                title='Web'
                getTooltipContainer={(trigger) => trigger.parentNode}
                overlayInnerStyle={{
                  fontSize: '12px',
                  width: '36px',
                  padding: '2px 4px',
                  height: '20px',
                  minHeight: '10px',
                }}
                placement='topLeft'
                overlayClassName='.ant-tooltip-placement-topLeft'
              >
                <Checkbox
                  checked={isChildModuleSelected}
                  onClick={() => handleChildModuleCheck(childModule?.module_child_id)}
                  className='cursor-pointer'
                />
              </Tooltip>
            )}
          </div>
          <div
            className={`${
              isMobileModuleSelected ? 'th-bg-blue-2' : ''
            } d-flex justify-content-end th-width-20`}
          >
            {isMobileParentModuleSelected ? null : (
              <Tooltip
                title='Mobile'
                getTooltipContainer={(trigger) => trigger.parentNode}
                overlayInnerStyle={{
                  fontSize: '12px',
                  width: '51px',
                  padding: '3px 4px',
                  height: '23px',
                  minHeight: '20px',
                }}
                placement='topLeft'
              >
                <Checkbox
                  checked={isMobileModuleSelected}
                  onClick={() => handleMobileModuleCheck(childModule?.module_child_id)}
                  className='cursor-pointer'
                />
              </Tooltip>
            )}
          </div>
        </div>
      </>
    );
  };
  const ParentModuleCardComponent = ({ parentModule, index }) => {
    const [isParentModuleSelected, setIsParentModuleSelected] = useState(false);
    const [isMobileParentModuleSelected, setIsMobileParentModuleSelected] =
      useState(false);
    const handleParentModuleCheck = (parentModId) => {
      if (!parentModuleIds.includes(parentModId)) {
        parentModuleIds.push(parentModId);
        setIsParentModuleSelected(true);
        parentModule.module_child.forEach((childModule) => {
          if (!childModuleIds.includes(childModule.module_child_id)) {
            childModuleIds.push(childModule.module_child_id);
          }
        });
      } else {
        const index = parentModuleIds.indexOf(parentModId);
        if (index !== -1) {
          parentModuleIds.splice(index, 1);
        }
        setIsParentModuleSelected(false);
        parentModule.module_child.forEach((childModule) => {
          const childIndex = childModuleIds.indexOf(childModule.module_child_id);
          if (childIndex !== -1) {
            childModuleIds.splice(childIndex, 1);
          }
        });
      }
    };
    const handleMobileParentModuleCheck = (parentModId) => {
      if (!mobileParentModuleIds.includes(parentModId)) {
        mobileParentModuleIds.push(parentModId);
        setIsMobileParentModuleSelected(true);
        parentModule.module_child.forEach((childModule) => {
          if (!mobileModule.includes(childModule.module_child_id)) {
            mobileModule.push(childModule.module_child_id);
          }
        });
      } else {
        const index = mobileParentModuleIds.indexOf(parentModId);
        if (index !== -1) {
          mobileParentModuleIds.splice(index, 1);
        }
        setIsMobileParentModuleSelected(false);
        parentModule.module_child.forEach((childModule) => {
          const childIndex = mobileModule.indexOf(childModule.module_child_id);
          if (childIndex !== -1) {
            mobileModule.splice(childIndex, 1);
          }
        });
      }
    };

    const moduleChildMap = new Map();

    parentModule.module_child.forEach((childModule) => {
      const existingModule = moduleChildMap.get(childModule.module_child_id);

      if (existingModule) {
        if (!existingModule.is_mobile && childModule.is_mobile) {
          moduleChildMap.set(childModule.module_child_id, childModule);
        }
      } else {
        moduleChildMap.set(childModule.module_child_id, childModule);
      }
    });
    const uniqueChildModules = Array.from(moduleChildMap.values()).map((childModule) => {
      const isOnlyOneModule =
        parentModule.module_child.filter(
          (module) => module.module_child_id === childModule.module_child_id
        ).length === 1;

      if (isOnlyOneModule && childModule.is_mobile) {
        return { ...childModule, checked: false };
      }

      return childModule;
    });
    return (
      <>
        <Card
          key={index}
          size='small'
          headStyle={{ background: '#1b4ccb', borderRadius: '10px 10px 0 0' }}
          title={
            <div className='d-flex justify-content-between'>
              <div className='d-flex justify-content-between align-items-center th-width-80 flex-wrap'>
                <span className='th-white th-16 th-fw-700'>
                  {parentModule?.module_parent}
                </span>
                <Tooltip
                  title='Web'
                  getTooltipContainer={(trigger) => trigger.parentNode}
                  overlayInnerStyle={{
                    fontSize: '13px',
                    width: '36px',
                    padding: '5px 4px',
                  }}
                >
                  <div className='d-flex justify-content-center align-items-center flex-wrap gap-3'>
                    <DesktopOutlined className='th-white th-14' />
                    <Checkbox
                      checked={isParentModuleSelected}
                      onClick={() => handleParentModuleCheck(parentModule?.id)}
                      className='cursor-pointer mx-1'
                    />
                  </div>
                </Tooltip>
              </div>
              <div className='d-flex justify-content-end flex-wrap th-width-20'>
                <Tooltip
                  title='Mobile'
                  getTooltipContainer={(trigger) => trigger.parentNode}
                  overlayInnerStyle={{
                    fontSize: '13px',
                    width: '50px',
                    padding: '5px 4px',
                  }}
                >
                  <div className='d-flex justify-content-center align-items-center flex-wrap'>
                    <MobileOutlined className='th-white th-14' />
                    <Checkbox
                      checked={isMobileParentModuleSelected}
                      onClick={() => handleMobileParentModuleCheck(parentModule?.id)}
                      className='cursor-pointer mx-1'
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          }
          className={`${
            isParentModuleSelected ? 'th-bg-blue-2' : 'bg-light'
          } th-br-10 mb-4 shadow`}
          bodyStyle={{
            maxHeight: '200px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {uniqueChildModules?.map((childModule, subIndex) => (
            <ChildModulesDivComponents
              childModule={childModule}
              isParentModuleSelected={isParentModuleSelected}
              isMobileParentModuleSelected={isMobileParentModuleSelected}
              subIndex={subIndex}
            />
          ))}
        </Card>
      </>
    );
  };
  return (
    <>
      <Layout>
        <div className='row py-3'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-grey th-16'>Role Management</Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>View Role</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                  <Input
                    placeholder='Search Role'
                    suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    onChange={(e) => setRoleSearch(e.target.value)}
                    value={roleSearch}
                    allowClear
                  />
                </div>
                <div className='row col-lg-8 col-md-6 col-sm-6 col-12 justify-content-end'>
                  <div className='col-lg-3 col-md-3 col-sm-3 col-12 mt-2'>
                    <Button
                      type='primary'
                      onClick={() => history.push('/module-management')}
                      className='btn-block th-br-4'
                    >
                      Manage Modules
                    </Button>
                  </div>
                  <div className='col-lg-2 col-md-3 col-sm-3 col-12 mt-2'>
                    <Button
                      type='primary'
                      icon={<PlusCircleOutlined />}
                      onClick={() =>
                        openModulesDrawer({
                          actionKey: 'create',
                        })
                      }
                      className='btn-block th-br-4'
                    >
                      Add Role
                    </Button>
                  </div>
                </div>
              </div>
              <div className='mt-2'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading || tableLoading}
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={roleList?.result}
                    pagination={false}
                    locale={noDataLocale}
                    scroll={{
                      x: window.innerWidth > 400 ? '100%' : 'max-content',
                    }}
                  />
                </div>
                <div className='d-flex justify-content-center py-2'>
                  <Pagination
                    current={currentPage}
                    pageSize={15}
                    showSizeChanger={false}
                    onChange={(page) => {
                      setCurrentPage(page);
                    }}
                    total={roleList?.count}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          title={
            roleId
              ? 'Updating the Role'
              : 'Creating a Role - Enter Role Name and Select Modules to Access'
          }
          visible={openDrawer}
          onClose={closeModulesDrawer}
          footer={[
            <Row justify='space-around'>
              <Col>
                <Button type='default' onClick={closeModulesDrawer}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  icon={
                    drawerLoading ? (
                      <SyncOutlined spin />
                    ) : roleId ? (
                      <EditOutlined />
                    ) : (
                      <PlusCircleOutlined />
                    )
                  }
                  className='btn-block th-br-4'
                  onClick={() => handleCreateEditRole()}
                >
                  {roleId ? 'Update Role' : 'Add Role'}
                </Button>
              </Col>
            </Row>,
          ]}
          width='90%'
        >
          <>
            {drawerLoading ? (
              <div className='d-flex justify-content-center align-items-center'>
                <Spin tip='Hold on! Great things take time!' size='large' />
              </div>
            ) : (
              <>
                {moduleList.length == 0 && (
                  <div className='d-flex justify-content-center mt-5 th-grey'>
                    <Empty description={'OOPS! No Modules Found. Please Try Again'} />
                  </div>
                )}

                {moduleList?.length > 0 && (
                  <>
                    <div className='col-lg-3 col-md-6 col-sm-12 col-12 mb-4'>
                      <Form form={formRef}>
                        <Form.Item
                          name='role_name'
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Role Name',
                            },
                          ]}
                        >
                          <Input
                            placeholder='Enter Role Name'
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            allowClear
                            maxLength={100}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                    <div className='row'>
                      {moduleList.map((parentModule, index) => (
                        <>
                          {parentModule?.module_child?.length > 0 && (
                            <div
                              className='col-lg-3 col-md-6 col-sm-12 col-12'
                              key={index}
                            >
                              <ParentModuleCardComponent
                                parentModule={parentModule}
                                index={index}
                              />
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        </Drawer>
      </Layout>
    </>
  );
};

export default RoleManagement;
