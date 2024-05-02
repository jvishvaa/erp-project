import './Faq.scss';
import {
  DeleteOutlined,
  FileExcelTwoTone,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState, createRef } from 'react';
import {
  Breadcrumb,
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Upload,
  message,
} from 'antd';
import uploadIcon from 'v2/Assets/dashboardIcons/announcementListIcons/uploadIcon.svg';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import Layout from 'containers/Layout';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import TextArea from 'antd/lib/input/TextArea';
// import CustomeBreadCrumbs from '../CustomeBreadcrumb/CustomeBreadCrumbs';
import { useHistory } from 'react-router-dom';
const { Panel } = Collapse;
const { Option } = Select;

const device = [
  { id: 1, name: 'qbox' },
  { id: 2, name: 'mb_droid' },
  { id: 3, name: 'mb_ios' },
  { id: 4, name: 'vendor' },
  { id: 5, name: 'mb_web' },
];

const CollapseableComponent = ({ module, items }) => {
  const [userLevelList, setUserLevelList] = useState([]);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [childModules, setChildModules] = useState([]);
  const [selectedPdfFile, setSelectedPdfFile] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState('');

  const [moduleId, setModuleId] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [subModule, setSubModule] = useState(null);
  const [devices, setDevices] = useState([]);

  const [data, setData] = useState([]);

  const [btn, setBtn] = useState(false);

  const formRef = createRef();

  const history = useHistory();

  let navigationData = JSON.parse(localStorage.getItem('navigationData'));

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [uploadStart, setUploadStart] = useState(false);
  const [percentValue, setPercentValue] = useState(10);

  const fetchUserLevel = () => {
    axios
      .get(`${endpoints.userManagement.userLevelList}`, {
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

  const handleChangeModule = (value) => {
    if (value) {
      fetchChildModules(value);
      setModuleId(value);
    }
    else{
      setModuleId(null)
    }
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
    axios
      .get(`${endpoints.FrequentlyAskedQuestions.FaqApi}?parent_id=${id}`, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      })
      .then((res) => {
        if (res?.data) {
          setChildModules(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const childModuleOptions = childModules?.map((each) => (
    <Option key={each?.id} value={each.id}>
      {each?.module_name}
    </Option>
  ));

  // To Upload Video and Video Modal Functions

  const MAX_FILE_SIZE_MB = 50;
  const allowedFiles = ['.mp3', '.mp4', '.mpeg'];
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    multiple: false,
    onRemove: () => {
      setSelectedVideoFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedVideoFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (allowedFiles.includes(type)) {
        setSelectedVideoFile(...file);
      } else {
        message.error('Only [.mp3, .mp4, .mpeg] files are allowed!');
      }

      return false;
    },
    beforeUpload: (file) => {
      const type = '.' + file.name.split('.')[file.name.split('.').length - 1];
      const isAllowedType = allowedFiles.includes(type);
      const isSizeValid = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;

      if (!isAllowedType) {
        message.error('Only [.mp3, .mp4, .mpeg] files are allowed!');
      } else if (!isSizeValid) {
        message.error(`File size must be less than ${MAX_FILE_SIZE_MB} MB!`);
      } else {
        setSelectedVideoFile(file);
      }

      return false;
    },

    selectedVideoFile,
  };

  // To Upload P.D.F and P.D.F. Modal Fucntions

  const MAX_PDFFILE_SIZE_MB = 50;
  const allowedPdfFiles = ['.pdf'];
  const draggerPdfProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedPdfFiles.join(),
    multiple: false,
    onRemove: () => {
      setSelectedPdfFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedPdfFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (allowedPdfFiles.includes(type)) {
        setSelectedPdfFile(...file);
      } else {
        message.error('Only [.pdf] files are allowed!');
      }

      return false;
    },
    beforeUpload: (file) => {
      const type = '.' + file.name.split('.')[file.name.split('.').length - 1];
      const isAllowedType = allowedPdfFiles.includes(type);
      const isSizeValid = file.size / 1024 / 1024 <= MAX_PDFFILE_SIZE_MB;

      if (!isAllowedType) {
        message.error('Only [.pdf] files are allowed!');
      } else if (!isSizeValid) {
        message.error(`File size must be less than ${MAX_PDFFILE_SIZE_MB} MB!`);
      } else {
        setSelectedPdfFile(file);
      }

      return false;
    },

    selectedPdfFile,
  };

  const handleAdd = () => {
    const newData = [...questions, { question: '', answer: '' }];
    setQuestions(newData);
  };

  const handleDelete = (index) => {
    const newData = [...questions];
    newData.splice(index, 1);
    setQuestions(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = [...questions];
    newData[index][field] = value;
    setQuestions(newData);
  };

  const handleSubmit = () => {
    if(moduleId==null){
      return message.error('Please Select Module');
    }
    if (subModule == null) {
      return message.error('Please Select Sub Module');
    }
    if (userLevel == null) {
      return message.error('Please Select User Level');
    }
    if (devices?.length == 0) {
      return message.error('Please Select Device');
    }
    const questionsJSON = JSON.stringify(questions);
    const formData = new FormData();
    formData.append('module_id', subModule);
    formData.append('user_level', userLevel);
    formData.append('device', devices);
    formData.append('questions', questionsJSON);
    formData.append('pdf', selectedPdfFile);
    formData.append('video', selectedVideoFile);

    setUploadStart(true);
      setBtn(true);
      axios
        .post(`${endpoints.FrequentlyAskedQuestions.FaqApi}`, formData, {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status_code == 201) {
            message.success(res?.data?.message);
            setBtn(false);
            setUploadStart(false);
            history.push({
              pathname: '/frequentlyAskedQuestions',
              state: {
                moduleId: moduleId,
                userLevel: userLevel,
                subModule: subModule,
                devices: devices,
              },
            });
          }
          else{
            if(res?.data?.status_code==409){
              message.error(res?.data?.developer_msg);
              setUploadStart(false)
            }
          }
        })
        .catch((error) => {
          setBtn(false);
          message.error(error);
          setUploadStart(false);
        });
  };

  const handleSubModule = (e) => {
    if (e) {
      setSubModule(e);
    }
    else{
      setSubModule(null)
    }
  };

  const handleUserLevel = (e) => {
    if (e) {
      setUserLevel(e);
    }
    else{
      setUserLevel(null)
    }
  };

  const handleDevice = (e) => {
    if (e) {
      setDevices(e);
    }
    else{
      setDevices([])
    }
  };

  useEffect(() => {
    fetchUserLevel();
  }, []);

  useEffect(() => {
    if (subModule || userLevel || devices) {
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
    }
  }, [subModule, userLevel, devices]);

  const fetchData = ({ params }) => {
    axios
      .get(`${endpoints.FrequentlyAskedQuestions.FaqApi}`, {
        params,
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      })
      .then((res) => {
        if (res?.data) {
          const userLevelLookup = {};
          userLevelList.forEach((item) => {
            userLevelLookup[item?.id] = item.level_name;
          });
          const newData = res?.data?.data?.map((item) => {
            const newUserLevel = item?.user_level?.map((id) => userLevelLookup[id]);
            return { ...item, user_level: newUserLevel };
          });
          setData(newData);
          if (subModule != null && userLevel != null) {
            if (
              (newData?.some((item) => item.pdf_file) ||
                newData?.some((item) => item.video_file))
            ) {
              message.error(
                'File already exists. Please delete it to upload a new file.'
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  let idInterval = null;
  useEffect(() => {
    if (uploadStart == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [uploadStart]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };

  return (
    <>
      <Layout>
        {/* <CustomeBreadCrumbs
          details={[
            { name: "FAQ's And Help" },
            { name: 'View FAQ', path: '/frequentlyAskedQuestions' },
            { name: 'Add FAQ' },
          ]}
        /> */}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontWeight: 'bold', fontSize: '30px', paddingTop: '8px' }}>
            Add Frequently Asked Questions
          </p>
        </div>

        <div>
          <Form ref={formRef} style={{ width: '100%', display: 'flex' }} direction='row'>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Select Module*</span>
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
                >
                  {moduleOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Select Sub Module*</span>
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
                >
                  {childModuleOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Select User Level*</span>
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
                  onChange={(e) => handleDevice(e)}
                >
                  {deviceOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2'>
              <span className='th-grey th-14'>Upload P.D.F*</span>
              <div style={{ width: '60%' }}>
                {data.some((item) => item.pdf_file) ? (
                  <p>P.D.F exists</p>
                ) : (
                  <>
                    <Upload {...draggerPdfProps}>
                      <Button icon={<UploadOutlined />} style={{ width: '150%' }}>
                        Select File
                      </Button>
                    </Upload>

                    <div
                      style={{
                        marginTop: '2px',
                      }}
                    >
                      {selectedPdfFile ? (
                        <span
                          style={{
                            color: 'blue',
                            width: '170%',
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <FileExcelTwoTone />
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {selectedPdfFile?.name}
                          </span>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='col-md-2'>
              <span className='th-grey th-14'>Upload Video*</span>
              <div style={{ width: '60%' }}>
                {data.some((item) => item.video_file) ? (
                  <p>Video exists</p>
                ) : (
                  <>
                    <Upload {...draggerProps}>
                      <Button icon={<UploadOutlined />} style={{ width: '150%' }}>
                        Select File
                      </Button>
                    </Upload>

                    <div
                      style={{
                        marginTop: '2px',
                      }}
                    >
                      {selectedVideoFile ? (
                        <span
                          style={{
                            color: 'blue',
                            width: '170%',
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <FileExcelTwoTone />
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {selectedVideoFile?.name}
                          </span>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Form>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', marginTop: '25px' }}>
          {questions.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: '16px',
                border: '1px solid #ddd',
                padding: '16px',
                borderRadius: '4px',
                width: '98%',
              }}
            >
              <Form layout='inline' style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item label='Question' style={{ flex: 1 }}>
                  <Input
                    value={item.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                    style={{ width: '100%', marginRight: '8px' }}
                  />
                </Form.Item>
                <Form.Item label='Answer' style={{ flex: 1 }}>
                  <TextArea
                    value={item.answer}
                    onChange={(e) => handleChange(index, 'answer', e.target.value)}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{ width: '100%', marginRight: '8px' }}
                  />
                </Form.Item>
                {index !== 0 && (
                  <Button
                    type='danger'
                    onClick={() => handleDelete(index)}
                    icon={<DeleteOutlined />}
                  />
                )}
              </Form>
            </div>
          ))}
          <Space>
            <Button
              onClick={handleAdd}
              icon={<PlusOutlined />}
              style={{ backgroundColor: 'orange', color: 'white' }}
            >
              Add Question
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Submit
            </Button>
          </Space>
        </div>

        <Modal
          maskClosable={false}
          closable={false}
          footer={null}
          visible={uploadStart}
          width={1000}
          centered
        >
          <Progress
            strokeColor={{
              from: '#108ee9',
              to: '#87d068',
            }}
            percent={percentValue}
            status='active'
            className='p-4'
          />
        </Modal>
      </Layout>
    </>
  );
};

export default CollapseableComponent;