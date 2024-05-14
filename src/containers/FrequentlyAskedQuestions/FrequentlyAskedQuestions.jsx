import ChangeFaq from './ChangeFaq';
import './Faq.scss';
import {
  CloseOutlined,
  EditOutlined,
  EyeFilled,
  InfoCircleOutlined,
  InfoCircleTwoTone,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import Loader from 'components/loader/loader';
import React, { createRef, useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Collapse,
  Drawer,
  Form,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import { useHistory } from 'react-router-dom';
import CollapseableComponent from './AddFaq';
import Layout from 'containers/Layout';
import endpointsV2 from 'v2/config/endpoints';
import endpoints from 'config/endpoints';
import axios from 'axios';
// import CustomeBreadCrumbs from '../CustomeBreadcrumb/CustomeBreadCrumbs';
import OnlineSub from 'assets/images/online.png';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import axiosInstance from 'config/axios';
import { DeleteOutlineOutlined } from '@material-ui/icons';
import { getFileIcon } from 'v2/getFileIcon';

const { Panel } = Collapse;
const { Option } = Select;

const device = [
  { id: 1, name: 'Website' },
  { id: 2, name: 'Android' },
  { id: 3, name: 'IOS' },
  { id: 5, name: 'Mobile Web' },
];

const FrequentlyAskedQuestions = () => {
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userLevelList, setUserLevelList] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [moduleData, setModuleData] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [childModules, setChildModules] = useState([]);
  const [open, setOpen] = useState(false);

  const [moduleValue, setModuleValue] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [subModule, setSubModule] = useState(null);
  const [devices, setDevices] = useState(null);

  const [VideoPrevModal, setVideoPrevModal] = useState(false);
  const [VideoPrev, setVideoPrev] = useState('');

  const [load, setLoad] = useState(false);

  const [edit, setEdit] = useState(false);

  const formRef = createRef();

  const history = useHistory();

  let navigationData = JSON.parse(localStorage.getItem('navigationData'));

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  useEffect(() => {
    fetchUserLevel();
  }, []);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCancelPopconfirm = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700'>Sl No.</span>,
      dataIndex: 'slNo',
      key: 'slNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: <span className='th-white th-fw-700'>Sub Modules</span>,
      dataIndex: 'module_id',
      key: 'module_id',
      render: (module_id, record) => {
        const moduleInfo = navigationData.find((item) =>
          item.child_module.some((module) => module.child_id === module_id)
        );
        if (moduleInfo) {
          const module = moduleInfo.child_module.find(
            (module) => module.child_id === module_id
          );
          return module ? module.child_name : '';
        } else {
          return '';
        }
      },
    },
    {
      title: <span className='th-white th-fw-700'>User Level</span>,
      dataIndex: 'user_level',
      key: 'user_level',
      render: (userLevel) => {
        if (Array.isArray(userLevel) && userLevel.length > 0) {
          const userLevelLookup = {};
          userLevelList.forEach((item) => {
            userLevelLookup[item.id] = item.level_name;
          });

          const userLevelNames = userLevel.map((id) => userLevelLookup[id]);
          return userLevelNames.join(', ');
        } else {
          return '';
        }
      },
    },
    {
      title: <span className='th-white th-fw-700'>Video Preview</span>,
      key: 'video',
      render: (data) =>
        data?.video_file?.length > 0 ? (
          <div
            className='th-13 px-2 th-br-5'
            style={{
              border: '1px solid #d1d1d1',
              width: '80px',
              backgroundColor: '#1B4CCB',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => {
              const fileName = data?.video_file;
              const fileSrc = `${endpoints.assessment.erpBucket}/${fileName}`;
              handleVideoPrev(fileSrc);
            }}
          >
            <PlayCircleOutlined
              style={{ height: '15px', width: '15px', marginRight: '5px' }}
            />
            View
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <InfoCircleOutlined style={{ marginTop: '3px' }} /> <p>No Video</p>
          </div>
        ),
    },
    {
      title: <span className='th-white th-fw-700'>PDF Preview</span>,
      key: 'pdf',
      render: (data) =>
        data?.pdf_file?.length > 0 ? (
          <div
            className='th-13 px-2 th-br-5'
            style={{
              border: '1px solid #d1d1d1',
              width: '80px',
              backgroundColor: '#1B4CCB',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => {
              const fileName = data?.pdf_file;
              let extension = fileName?.split('.')[fileName?.split('.')?.length - 1]
              openPreview({
                currentAttachmentIndex: 0,
                attachmentsArray: [
                  {
                    src: `${endpoints.assessment.erpBucket}/${fileName}`,

                    name: fileName,
                    extension: '.' + extension,
                  },
                ],
              });
            }}
          >
            <EyeFilled style={{ height: '15px', width: '15px', marginRight: '5px' }} />
            View
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <InfoCircleOutlined style={{ marginTop: '3px' }} />
            <p>No PDF</p>
          </div>
        ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <span style={{ display: 'flex', gap: '15px' }}>
          <Tooltip title='Edit' placement='top'>
            <EditOutlined
              style={{ color: 'blue', fontSize: '22px' }}
              onClick={() => {
                showDrawer(record);
                setEdit(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title='Delete This ?'
            open={open}
            onConfirm={() => {
              deleteFaq(record?.user_level, record?.module_id);
            }}
            onCancel={handleCancel}
          >
            <DeleteOutlineOutlined
              style={{ color: 'red', fontSize: '22px', cursor: 'pointer' }}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];
  const handleSave = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showDrawer = (each, tab) => {
    if (each) {
      setModuleData(each);
    }
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setModuleData(null);
    setOpenDrawer(false);
    setEdit(false);
  };
  const handleChangeModule = (value) => {
    if (value) {
      fetchChildModules(value);
      setModuleValue(value);
    } else {
      setModuleValue(null);
      setSubModule(null);
      formRef.current.setFieldsValue({
        module: null,
        child_module: null,
      });
      setChildModules([]);
    }
  };

  const handleSubModule = (e) => {
    if (e) {
      setSubModule(e);
    } else {
      setSubModule(null);
    }
  };

  const handleUserLevel = (e) => {
    if (e) {
      setUserLevel(e);
    } else {
      setUserLevel(null);
    }
  };

  const handleDevice = (e) => {
    if (e) {
      setDevices(e);
    } else {
      setDevices(null);
    }
  };

  const handleVideoPrev = (data) => {
    setVideoPrev(data);
    setVideoPrevModal(true);
  };

  const fetchUserLevel = () => {
    axios
      .get(`${endpointsV2.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const moduleOptions = navigationData?.map((each) => (
    <Option key={each?.id} value={each.id}>
      {each?.parent_modules}
    </Option>
  ));

  const deviceOptions = device?.map((each) => (
    <Option key={each?.id} value={each.id}>
      {each?.name}
    </Option>
  ));

  const fetchChildModules = (id) => {
    const params = {
      parent_id: id,
    };
    axiosInstance
      .get(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}?parent_id=${id}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data) {
          setChildModules(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log('Error fetching Module data:', error);
      });
  };

  const fetchData = ({ params }) => {
    setLoad(true);
    axiosInstance
      .get(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data) {
          setTableData(res?.data?.data);
          setLoad(false);
        }
      })
      .catch((error) => {
        console.log('Error fetching Module data:', error);
        if (error) {
          setTableData([]);
        }
        setLoad(false);
      });
  };

  useEffect(() => {
    const params = {};

    if (userLevel && userLevel.length > 0) {
      params.user_level = userLevel.join(',');
    }

    if (subModule) {
      params.child_id = subModule;
    }

    if (devices && devices.length > 0) {
      params.device = devices.join(',');
    }

    fetchData({ params });
  }, [userLevel, subModule, devices, moduleValue]);

  const deleteFaq = (faq_user_level, module_id) => {
    setLoad(true);
    const params = {};
    if (userLevel && userLevel.length > 0) {
      params.user_level = userLevel.join(',');
    }

    if (subModule) {
      params.child_id = subModule;
    }

    if (devices && devices.length > 0) {
      params.device = devices.join(',');
    }
    const formData = new FormData();
    formData.append('user_level', faq_user_level);
    formData.append('module_id', module_id);
    formData.append('file_type', 'media');
    axiosInstance
      .delete(`${endpointsV2.FrequentlyAskedQuestions.FaqApi}`, {
        data: formData,
      })
      .then((res) => {
        if (res?.data) {
          message.success(`FAQ Deleted Successfully`);
          setLoad(false);
          fetchData({ params });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  const childModuleOptions = childModules?.map((each) => (
    <Option key={each?.id} value={each.id}>
      {each?.module_name}
    </Option>
  ));

  useEffect(() => {
    let preFillCondition =
      history?.location?.state?.moduleId &&
      history?.location?.state?.subModule &&
      history?.location?.state?.userLevel &&
      history?.location?.state?.devices;

    if (preFillCondition) {
      formRef.current.setFieldsValue({
        module: history?.location?.state?.moduleId,
        child_module: history?.location?.state?.subModule,
        user_level: history?.location?.state?.userLevel,
        device: history?.location?.state?.devices,
      });
      setModuleValue(history?.location?.state?.moduleId);
      setSubModule(history?.location?.state?.subModule);
      setUserLevel(history?.location?.state?.userLevel);
      setDevices(history?.location?.state?.devices);
      const params = {};
      params.user_level = history?.location?.state?.userLevel.join(',');
      params.child_id = history?.location?.state?.subModule;
      params.device = history?.location?.state?.devices.join(',');
      fetchChildModules(history?.location?.state?.moduleId);
      fetchData({ params });
    }
  }, [
    history?.location?.state?.moduleId,
    history?.location?.state?.subModule,
    history?.location?.state?.userLevel,
    history?.location?.state?.devices,
  ]);

  return (
    <div>
      <Layout>
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>FAQ</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div>
          <Form
            ref={formRef}
            style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}
            direction='row'
          >
            <div className='col-md-2'>
              <span className='th-grey th-14'>Modules*</span>
              <Form.Item name='module'>
                <Select
                  allowClear
                  placeholder='Select Module'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  onChange={(value) => handleChangeModule(value)}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {moduleOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Sub Modules</span>
              <Form.Item name='child_module'>
                <Select
                  allowClear
                  placeholder='Select Sub Module'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  onChange={(e) => handleSubModule(e)}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {childModuleOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>User Level</span>
              <Form.Item name='user_level'>
                <Select
                  allowClear
                  placeholder='Select User Level'
                  showSearch
                  optionFilterProp='children'
                  mode='multiple'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  onChange={(e) => handleUserLevel(e)}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {userLevelListOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Device</span>
              <Form.Item name='device'>
                <Select
                  allowClear
                  placeholder='Select Device'
                  showSearch
                  optionFilterProp='children'
                  mode='multiple'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  onChange={(value) => handleDevice(value)}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {deviceOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='addFaq col-md-2'>
              <Button
                type='primary'
                className='Buttons'
                onClick={() => history.push('/add-faq')}
                style={{ marginTop: '10px' }}
              >
                Add FAQ
              </Button>
            </div>
          </Form>
        </div>

        <div className='table'>
          <span style={{ border: '1px solid #d9d9d9', padding: '5px' }}>
            <InfoCircleTwoTone className='pr-2' />
            <i className='th-grey'>Please Select Module For Viewing Sub Modules</i>
          </span>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            style={{ textAlign: 'center', marginTop: '10px' }}
          />
        </div>

        {load && <Loader />}

        <Drawer
          placement='right'
          width={600}
          title={
            <div style={{ textAlign: 'center' }}>
              <span style={{ float: 'center' }}>
                Edit or Delete Frequently Asked Questions
              </span>
              <CloseOutlined style={{ float: 'right' }} onClick={onCloseDrawer} />
            </div>
          }
          onClose={onCloseDrawer}
          visible={openDrawer}
          closable={null}
        >
          <ChangeFaq
            moduleData={moduleData}
            openDrawer={openDrawer}
            userLevelList={userLevelList}
            fetchData={fetchData}
            userLevel={userLevel}
            subModule={subModule}
            devices={devices}
            setOpenDrawer={setOpenDrawer}
            edit={edit}
          />
        </Drawer>

        <Modal
          visible={VideoPrevModal}
          footer={false}
          className='th-modal'
          onCancel={() => {
            setVideoPrev(null);
            setVideoPrevModal(false);
          }}
          width={'60%'}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <video
              src={VideoPrev}
              controls
              preload='auto'
              alt={VideoPrev}
              style={{
                maxHeight: '400px',
                width: '96%',
                objectFit: 'fill',
              }}
            />
          </div>
        </Modal>
      </Layout>
    </div>
  );
};

export default FrequentlyAskedQuestions;
