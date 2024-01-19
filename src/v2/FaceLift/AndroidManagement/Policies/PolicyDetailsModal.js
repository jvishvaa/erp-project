import React, { useState } from 'react';
import {
  Modal,
  Input,
  Switch,
  Radio,
  Tabs,
  Button,
  Drawer,
  Space,
  Table,
  Select,
} from 'antd';
import { useEffect } from 'react';
import { PlusCircleFilled, EditTwoTone } from '@ant-design/icons';

const PolicyDetailsModal = ({
  showPolicyModal,
  handleClosePolicyModal,
  currentPolicyDetails,
  createPolicyLoading,
  handleCreatePolicy,
  handleShowPolicyModal,
}) => {
  const [policyDetails, setPolicyDetails] = useState({});
  const [activeTab, setActiveTab] = useState('1');
  const [showAppDrawer, setShowAppDrawer] = useState(false);
  const [currentAppDetails, setCurrentAppDetails] = useState({});
  const [editApp, setEditApp] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCloseAppDrawer = () => {
    setShowAppDrawer(false);
    handleShowPolicyModal();
    setActiveTab('6');
    setEditApp(false);
    setCurrentAppDetails({});
  };

  useEffect(() => {
    setPolicyDetails({ ...currentPolicyDetails });
  }, [showPolicyModal]);

  console.log({ policyDetails });
  const VolumeSettings = () => {
    return (
      <div className='row'>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Adjust Volume Disabled</span>
            <Switch
              checked={policyDetails?.adjustVolumeDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, adjustVolumeDisabled: e });
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const CameraSettings = () => {
    return (
      <div className='row'>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Camera Access</span>
            <Radio.Group
              onChange={(e) => {
                setPolicyDetails({
                  ...policyDetails,
                  cameraAccess: e.target.value,
                });
              }}
              value={policyDetails?.cameraAccess}
            >
              <Radio value={'CAMERA_ACCESS_ENFORCED'}>ACCESS ENFORCED</Radio>
              <Radio value={'CAMERA_ACCESS_DISABLED'}>ACCESS DISABLED</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Screen Capture Disabled</span>
            <Switch
              checked={policyDetails?.screenCaptureDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, screenCaptureDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Microphone Access</span>
            <Radio.Group
              onChange={(e) => {
                setPolicyDetails({
                  ...policyDetails,
                  microphoneAccess: e.target.value,
                });
              }}
              value={policyDetails?.microphoneAccess}
            >
              <Radio value={'MICROPHONE_ACCESS_ENFORCED'}>ACCESS ENFORCED</Radio>
              <Radio value={'MICROPHONE_ACCESS_DISABLED'}>ACCESS DISABLED</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
    );
  };
  const OverviewSettings = () => {
    return (
      <div className='row'>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Factory Reset Disabled</span>
            <Switch
              checked={policyDetails?.factoryResetDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, factoryResetDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Developers Options</span>
            <Radio.Group
              onChange={(e) => {
                setPolicyDetails({
                  ...policyDetails,
                  advancedSecurityOverrides: { developerSettings: e.target.value },
                });
              }}
              value={policyDetails?.advancedSecurityOverrides?.developerSettings}
            >
              <Radio value={'DEVELOPER_SETTINGS_UNSPECIFIED'}>Unspecified</Radio>
              <Radio value={'DEVELOPER_SETTINGS_DISABLED'}>Disabled</Radio>
              <Radio value={'DEVELOPER_SETTINGS_ALLOWED'}>Allowed</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Location Mode</span>
            <Radio.Group
              // disabled
              onChange={(e) => {
                setPolicyDetails({
                  ...policyDetails,
                  locationMode: e.target.value,
                });
              }}
              value={policyDetails?.locationMode}
            >
              <Radio value={'LOCATION_ENFORCED'}>LOCATION ENFORCED</Radio>
              <Radio value={'LOCATION_DISABLED'}>LOCATION DISABLED</Radio>
              <Radio value={'LOCATION_USER_CHOICE'}>USER CHOICE</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Outgoing Calls Disabled</span>
            <Switch
              checked={policyDetails?.outgoingCallsDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, outgoingCallsDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Ensure Veify Apps Disabled</span>
            <Switch
              checked={policyDetails?.ensureVerifyAppsEnabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, ensureVerifyAppsEnabled: e });
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const NetworkSettings = () => {
    return (
      <div className='row'>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Wifi Configs Lockdown Enabled</span>
            <Switch
              checked={policyDetails?.wifiConfigsLockdownEnabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, wifiConfigsLockdownEnabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Bluetooth Config Disabled</span>
            <Switch
              checked={policyDetails?.bluetoothConfigDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, bluetoothConfigDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>VPN Config Disabled</span>
            <Switch
              checked={policyDetails?.vpnConfigDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, vpnConfigDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Wifi Config Disabled</span>
            <Switch
              checked={policyDetails?.wifiConfigDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, wifiConfigDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Data Roaming Disabled</span>
            <Switch
              checked={policyDetails?.dataRoamingDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, dataRoamingDisabled: e });
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const PermissionsSettings = () => {
    return (
      <div className='row'>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Install Apps Disabled</span>
            <Switch
              checked={policyDetails?.installAppsDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, installAppsDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Install Unknown Sources Allowed</span>
            <Switch
              checked={policyDetails?.installUnknownSourcesAllowed}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, installUnknownSourcesAllowed: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Mount Physical Media Disabled</span>
            <Switch
              checked={policyDetails?.mountPhysicalMediaDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, mountPhysicalMediaDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Modify Accounts Disabled</span>
            <Switch
              checked={policyDetails?.modifyAccountsDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, modifyAccountsDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Safe Boot Disabled</span>
            <Switch
              checked={policyDetails?.safeBootDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, safeBootDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>Uninstall Apps Disabled</span>
            <Switch
              checked={policyDetails?.uninstallAppsDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, uninstallAppsDisabled: e });
              }}
            />
          </div>
        </div>
        <div className='col-12 my-3'>
          <div className='d-flex justify-content-between'>
            <span>USB File Transfer Disabled</span>
            <Switch
              checked={policyDetails?.usbFileTransferDisabled}
              onChange={(e) => {
                setPolicyDetails({ ...policyDetails, usbFileTransferDisabled: e });
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const Applications = () => {
    const applicationColumns = [
      {
        title: <span className='th-white'>Package Name</span>,
        dataIndex: 'packageName',
        key: 'packageName',
        width: '50%',
      },
      {
        title: <span className='th-white'>Status</span>,
        dataIndex: 'status',
        key: 'status',
        render: (text, row, index) => {
          return (
            <Switch
              checked={!row?.disabled}
              checkedChildren='Enabled'
              unCheckedChildren='Disbaled'
              onChange={(e) => {
                let currentDetails = { ...policyDetails };
                currentDetails.applications[index]['disabled'] = !e;
                setPolicyDetails(currentDetails);
              }}
            />
          );
        },
      },
      {
        title: <span className='th-white'>Actions</span>,
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
        render: (text, row) => {
          return (
            <span
              className='th-pointer'
              onClick={() => {
                setEditApp(true);
                setShowAppDrawer(true);
                setCurrentAppDetails(row);
              }}
            >
              <EditTwoTone />
            </span>
          );
        },
      },
    ];
    return (
      <div className='row'>
        <div className='col-6 my-3'>
          <div className='d-flex justify-content-between'>
            <span className='th-fw-600'>Applications List</span>
          </div>
        </div>
        <div className='col-6 my-3 text-right'>
          <Button
            type='primary'
            className='th-br-8'
            icon={<PlusCircleFilled />}
            onClick={() => {
              setCurrentAppDetails({
                autoUpdateMode: 'AUTO_UPDATE_DEFAULT',
                disabled: false,
                installType: 'AVAILABLE',
                lockTaskAllowed: true,
                minimumVersionCode: '',
                permissionGrants: [
                  {
                    permission: 'android.permission_group.CAMERA',
                    policy: 'DENY',
                  },
                  {
                    permission: 'android.permission.RECORD_AUDIO',
                    policy: 'DENY',
                  },
                  {
                    permission: 'android.permission.READ_EXTERNAL_STORAGE',
                    policy: 'DENY',
                  },
                  {
                    permission: 'android.permission.WRITE_EXTERNAL_STORAGE',
                    policy: 'DENY',
                  },
                  {
                    permission: 'android.permission.ACCESS_FINE_LOCATION',
                    policy: 'DENY',
                  },
                ],
              });
              setShowAppDrawer(true);
            }}
          >
            Add Application
          </Button>
        </div>
        {policyDetails?.applications?.length > 0 ? (
          <div className='row'>
            <div className='col-12'>
              <Table
                columns={applicationColumns}
                dataSource={policyDetails?.applications}
                pagination={false}
                className='th-table'
                scroll={{ y: 400 }}
              />
            </div>
          </div>
        ) : (
          <div className='row'>
            <div className='col-12'>
              <span className='th-grey-2 th-fe-500 th-20'>No applications added</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal
        visible={showPolicyModal}
        title={'Update Policy Features'}
        className='th-upload-modal'
        onCancel={() => {
          handleClosePolicyModal();
        }}
        centered
        width={'60vw'}
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
        {Object.keys(policyDetails)?.length > 0 && (
          <div className='py-2 px-4'>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              className='th-policies-modal'
              animated
            >
              <Tabs.TabPane tab='Overview' key='1'>
                {OverviewSettings()}
              </Tabs.TabPane>
              <Tabs.TabPane tab='Volume' key='2'>
                {VolumeSettings()}
              </Tabs.TabPane>
              <Tabs.TabPane tab='Camera' key='3'>
                {CameraSettings()}
              </Tabs.TabPane>
              <Tabs.TabPane tab='Network' key='4'>
                {NetworkSettings()}
              </Tabs.TabPane>
              <Tabs.TabPane tab='Permissions' key='5'>
                {PermissionsSettings()}
              </Tabs.TabPane>
              <Tabs.TabPane tab='Applications' key='6'>
                {Applications()}
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
      <Drawer
        className='th-activity-drawer'
        zIndex={2200}
        title='Application Details'
        visible={showAppDrawer}
        width={'75vw'}
        onClose={() => handleCloseAppDrawer()}
        footer={[
          <Space>
            <Button
              className='th-br-8'
              type='default'
              onClick={() => handleCloseAppDrawer()}
            >
              {' '}
              Close
            </Button>
            <Button
              className='th-br-8'
              type='primary'
              loading={createPolicyLoading}
              onClick={() => {
                let currentApps = policyDetails?.applications?.slice();
                if (currentApps?.length > 0) {
                  if (editApp) {
                    const indexOfObject = currentApps.findIndex(
                      (item) => item.packageName === currentAppDetails.packageName
                    );
                    currentApps[indexOfObject] = currentAppDetails;
                  } else {
                    currentApps.push(currentAppDetails);
                  }
                } else {
                  currentApps = [currentAppDetails];
                }
                console.log({ currentApps, currentAppDetails });
                setPolicyDetails({
                  ...policyDetails,
                  applications: currentApps,
                });
                handleCloseAppDrawer();
              }}
            >
              {' '}
              Submit
            </Button>
          </Space>,
        ]}
      >
        <div className='row align-items-center'>
          <div className='col-6 my-3'>
            <div className='d-flex justify-content-between'>
              <span className='pr-2 th-fw-600'>Name</span>
              <Input
                value={currentAppDetails?.packageName}
                onChange={(e) => {
                  setCurrentAppDetails({
                    ...currentAppDetails,
                    packageName: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className='col-6 my-3'>
            <div className='d-flex justify-content-between'>
              <span className='th-fw-600'>Disabled</span>
              <Switch
                checked={currentAppDetails?.disabled}
                onChange={(e) => {
                  setCurrentAppDetails({ ...currentAppDetails, disabled: e });
                }}
              />
            </div>
          </div>
          <div className='col-6 my-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <span className='pr-2'>Minimum Version Code</span>
              <Input
                type='number'
                className='w-50'
                placeholder='Enter minimum version code'
                value={currentAppDetails?.minimumVersionCode}
                onChange={(e) => {
                  setCurrentAppDetails({
                    ...currentAppDetails,
                    minimumVersionCode: Number(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className='col-6 my-3'>
            <div className='d-flex justify-content-between'>
              <span className='th-fw-600'>Lock Task Allowed</span>
              <Switch
                checked={currentAppDetails?.lockTaskAllowed}
                onChange={(e) => {
                  setCurrentAppDetails({ ...currentAppDetails, lockTaskAllowed: e });
                }}
              />
            </div>
          </div>
          <div className='col-6 my-3 d-none'>
            <div className='d-flex justify-content-between'>
              <span className='th-fw-600'>Default Permission Policy</span>
              <Radio.Group
                onChange={(e) => {
                  setCurrentAppDetails({
                    ...currentAppDetails,
                    defaultPermissionPolicy: e.target.value,
                  });
                }}
                value={currentAppDetails?.defaultPermissionPolicy}
              >
                <Radio value={'PROMPT'}>PROMPT</Radio>
                <Radio value={'GRANT'}>GRANT</Radio>
                <Radio value={'DENY'}>DENY</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className='col-12 my-3'>
            <div className='d-flex justify-content-between'>
              <span className='th-fw-600'>Auto-Update Mode</span>
              <Radio.Group
                onChange={(e) => {
                  setCurrentAppDetails({
                    ...currentAppDetails,
                    autoUpdateMode: e.target.value,
                  });
                }}
                value={currentAppDetails?.autoUpdateMode}
              >
                <Radio value={'AUTO_UPDATE_DEFAULT'}>DEFAULT</Radio>
                <Radio value={'AUTO_UPDATE_POSTPONED'}>POSTPONED</Radio>
                <Radio value={'AUTO_UPDATE_HIGH_PRIORITY'}>HIGH PRIORITY</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className='col-12 my-3'>
            <div className='d-flex justify-content-between'>
              <span className='th-fw-600'>Install Type</span>
              <Radio.Group
                onChange={(e) => {
                  setCurrentAppDetails({
                    ...currentAppDetails,
                    installType: e.target.value,
                  });
                }}
                value={currentAppDetails?.installType}
              >
                <Radio value={'AVAILABLE'}>AVAILABLE</Radio>
                <Radio value={'BLOCKED'}>BLOCKED</Radio>
                <Radio value={'FORCE_INSTALLED'}>FORCE_INSTALLED</Radio>
                <Radio value={'PREINSTALLED'}>PREINSTALLED</Radio>
                <Radio value={'REQUIRED_FOR_SETUP'}>REQUIRED_FOR_SETUP</Radio>
                <Radio value={'KIOSK'}>KIOSK</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className='col-12 my-3'>PERMISSION GRANTS</div>
          {currentAppDetails?.permissionGrants?.map((el, index) => (
            <div className='col-12 my-2'>
              <div className='d-flex justify-content-between'>
                <span className='th-fw-600'>{el?.permission}</span>
                <Radio.Group
                  onChange={(e) => {
                    let updatedGrantList = currentAppDetails?.permissionGrants?.slice();
                    updatedGrantList[index]['policy'] = e.target.value;
                    console.log({ updatedGrantList });
                    setCurrentAppDetails({
                      ...currentAppDetails,
                      permissionGrants: updatedGrantList,
                    });
                  }}
                  value={el?.policy}
                >
                  <Radio value={'GRANT'}>GRANT</Radio>
                  <Radio value={'DENY'}>DENY</Radio>
                </Radio.Group>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default PolicyDetailsModal;
