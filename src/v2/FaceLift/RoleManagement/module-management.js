import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  message,
  Spin,
  Checkbox,
  Card,
  Popconfirm,
  Tabs,
  Button,
} from 'antd';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import Layout from 'containers/Layout';

const ModuleManagement = () => {
  const history = useHistory();
  const { TabPane } = Tabs;
  const [loading, setLoading] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [tabValue, setTabValue] = useState('active');
  let parentModuleIds = [];
  let childModuleIds = [];
  useEffect(() => {
    fetchModuleList();
  }, [tabValue]);
  const fetchModuleList = () => {
    setLoading(true);
    let url;
    if (tabValue === 'active') {
      url = `${endpoints.moduleManagement.moduleList}?is_delete=False`;
    } else if (tabValue === 'inactive') {
      url = `${endpoints.moduleManagement.moduleList}?is_delete=True`;
    }
    axiosInstance
      .get(url)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setModuleList(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDeleteModules = () => {
    if (parentModuleIds?.length === 0 && childModuleIds?.length === 0) {
      message.error('Please select atleast one module');
      return;
    }
    let combinedModuleIds = [...parentModuleIds, ...childModuleIds];
    let moduleIds = [...new Set(combinedModuleIds)];
    setLoading(true);
    const data = {
      module_ids: moduleIds,
    };
    axiosInstance
      .put(`${endpoints.moduleManagement.deleteModules}`, data)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Modules(s) deactiavted successfully');
          fetchModuleList();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRestoreModules = () => {
    if (parentModuleIds?.length === 0 && childModuleIds?.length === 0) {
      message.error('Please select atleast one module');
      return;
    }
    let combinedModuleIds = [...parentModuleIds, ...childModuleIds];
    let moduleIds = [...new Set(combinedModuleIds)];
    setLoading(true);
    const data = {
      module_ids: moduleIds,
    };
    axiosInstance
      .put(`${endpoints.moduleManagement.restoreModules}`, data)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          message.success('Hurray! Modules(s) activated successfully');
          fetchModuleList();
        }
      })
      .catch((error) => {
        message.error('OOPS! Something went wrong. Please try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const ChildModulesDivComponents = ({
    childModule,
    isParentModuleSelected,
    subIndex,
  }) => {
    const [isChildModuleSelected, setIsChildModuleSelected] = useState(false);
    useEffect(() => {
      if (childModule?.checked) {
        childModuleIds.push(childModule?.module_child_id);
        setIsChildModuleSelected(true);
      }
    }, [childModule]);
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
    return (
      <>
        <div
          key={subIndex}
          className={`${
            !isParentModuleSelected && !isChildModuleSelected
              ? subIndex % 2 === 0
                ? 'th-bg-grey'
                : 'th-bg-white'
              : ''
          }${
            !isParentModuleSelected && isChildModuleSelected ? 'th-bg-blue-2' : ''
          } d-flex justify-content-between`}
        >
          <span className='th-black-1 th-14'>{childModule?.module_child_name}</span>
          {isParentModuleSelected ? null : (
            <Checkbox
              checked={isChildModuleSelected}
              onClick={() => handleChildModuleCheck(childModule?.module_child_id)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </>
    );
  };
  const ParentModuleCardComponent = ({ parentModule, index }) => {
    const [isParentModuleSelected, setIsParentModuleSelected] = useState(false);
    const handleParentModuleCheck = (parentModId) => {
      if (!parentModuleIds.includes(parentModId)) {
        parentModuleIds.push(parentModId);
      } else {
        const index = parentModuleIds.indexOf(parentModId);
        if (index !== -1) {
          parentModuleIds.splice(index, 1);
        }
      }
      setIsParentModuleSelected(!isParentModuleSelected);
    };
    return (
      <>
        <Card
          key={index}
          size='small'
          headStyle={{ background: '#1b4ccb', borderRadius: '10px 10px 0 0' }}
          title={
            <div className='d-flex justify-content-between'>
              <span className='th-white th-16 th-fw-700'>
                {parentModule?.module_parent}
              </span>
              <Checkbox
                checked={isParentModuleSelected}
                onClick={() => handleParentModuleCheck(parentModule?.id)}
                style={{ cursor: 'pointer' }}
              />
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
          {parentModule?.module_child.map((childModule, subIndex) => (
            <ChildModulesDivComponents
              childModule={childModule}
              isParentModuleSelected={isParentModuleSelected}
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
              <Breadcrumb.Item className='th-grey th-16'>
                Module Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>View Modules</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row justify-content-between'>
                <div className='col-lg-2 col-md-3 col-sm-3 col-12 mb-2'>
                  <Button
                    type='default'
                    className='btn-block th-br-20'
                    onClick={() => history.push('/role-management')}
                  >
                    Go Back
                  </Button>
                </div>
                <div className='col-lg-2 col-md-3 col-sm-3 col-12'>
                  <Popconfirm
                    title={
                      tabValue === 'active' ? 'Sure to delete ?' : 'Sure to restore ?'
                    }
                    onConfirm={
                      tabValue === 'active' ? handleDeleteModules : handleRestoreModules
                    }
                  >
                    <Button
                      type='primary'
                      icon={tabValue === 'active' ? <DeleteOutlined /> : <RedoOutlined />}
                      className='btn-block th-br-20'
                      style={{
                        backgroundColor: tabValue === 'active' ? '#FF0000' : 'green',
                      }}
                    >
                      {tabValue === 'active' ? 'Delete Modules' : 'Restore Modules'}
                    </Button>
                  </Popconfirm>
                </div>
              </div>
              <div className='th-bg-white th-tabs mt-2'>
                <Tabs
                  type='card'
                  onChange={(key) => setTabValue(key)}
                  activeKey={tabValue}
                >
                  <TabPane tab={<div>Active</div>} key='active'>
                    {loading ? (
                      <div className='d-flex justify-content-center align-items-center'>
                        <Spin tip='Hold on! Great things take time!' size='large' />
                      </div>
                    ) : (
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
                    )}
                  </TabPane>
                  <TabPane tab={<div>Inactive</div>} key='inactive'>
                    {loading ? (
                      <div className='d-flex justify-content-center align-items-center'>
                        <Spin tip='Hold on! Great things take time!' size='large' />
                      </div>
                    ) : (
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
                    )}
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ModuleManagement;
