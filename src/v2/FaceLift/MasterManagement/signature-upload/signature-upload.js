import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Modal, Select, Button, Upload, message } from 'antd';
import {
  DownOutlined,
  CloudUploadOutlined,
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
const { Option } = Select;

const UploadSignature = ({
  setLoading,
  handleCloseUploadModal, // for closing modal
  handleUpdateTableData, // for fecting signatures after upload or edit
  uploadFlag,
  editFlag,
  editData,
  userLevelList,
}) => {
  const formRef = useRef();
  const [selectedUserLevel, setSelectedUserLevel] = useState();
  const [erpList, setErpList] = useState([]);
  const [selectedErp, setSelectedErp] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const handleUserLevel = (e, value) => {
    if (value) {
      setSelectedUserLevel(value);
    } else {
      setSelectedUserLevel();
      setSelectedErp();
      formRef.current.resetFields(); // invokes when user clears user level dropdown
      // it also clears erp dropdown
    }
  };
  useEffect(() => {
    if (selectedUserLevel) {
      fetchErp();
    }
  }, [selectedUserLevel]);
  const fetchErp = () => {
    let reqApi = endpoints.signature.getErpList;
    console.log(reqApi, 'reqApi');
    reqApi += `?branch_id=${selectedBranch?.branch?.id}`;
    reqApi += `&user_level=${selectedUserLevel?.key}`;
    axiosInstance
      .get(reqApi)
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setErpList(result.data?.data);
        } else {
          message.error(result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message || error.response?.data?.msg);
      });
  };
  const handleErp = (e, value) => {
    if (value) {
      setSelectedErp(value);
    } else {
      setSelectedErp();
    }
  };
  const handleUpload = () => {
    if (!selectedUserLevel) {
      message.error('Please select user level');
      return;
    } else if (!selectedErp) {
      message.error('Please select Erp');
      return;
    } else if (!selectedFile) {
      message.error('Please upload signature');
      return;
    }
    handleCloseUploadModal();
    setLoading(true);
    const formData = new FormData();
    formData.append('branch_id', selectedBranch && selectedBranch?.branch.id);
    formData.append('erp_id', selectedErp && selectedErp?.key);
    if (selectedFile && typeof selectedFile === 'object') {
      formData.append('signature', selectedFile);
    }
    axiosInstance
      .post(endpoints.signature.createSignatureApi, formData)
      .then((result) => {
        if (result.data?.status_code == 200) {
          setLoading(false);
          handleUpdateTableData();
          message.success(result.data?.message || result.data?.msg);
        } else if (result.data?.status_code == 204) {
          setLoading(false);
          message.error('The signature already exists in our records');
        } else {
          setLoading(false);
          message.error(result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response?.data?.message || error.response?.data?.msg);
      });
  };
  const handleEdit = () => {
    if (!selectedFile) {
      message.error('Please upload signature'); // user was allowed only to edit signature
      return;
    }
    handleCloseUploadModal();
    setLoading(true);
    const formData = new FormData();
    formData.append('sign_id', editData && editData?.id);
    if (selectedFile && typeof selectedFile === 'object') {
      formData.append('signature', selectedFile);
    }
    axiosInstance
      .put(endpoints.signature.updateSignatureApi, formData)
      .then((result) => {
        if (result.data?.status_code > 199 && result.data?.status_code < 300) {
          setLoading(false);
          handleUpdateTableData();
          message.success(result.data?.message || result.data?.msg);
        } else {
          setLoading(false);
          message.error(result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response?.data?.message || error.response?.data?.msg);
      });
  };

  const allowedFiles = ['.jpg', '.jpeg', '.png'];
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    multiple: false,
    onRemove: () => {
      setSelectedFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      // console.log(type, allowedFiles);
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file);
      } else {
        message.error('Only .jpg, .jpeg, .png files are allowed!');
      }
      return false;
    },
    beforeUpload: (...file) => {
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      // console.log(type, allowedFiles);
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file[1]);
      } else {
        message.error('Only .jpg, .jpeg, .png files are allowed!');
      }
      return false;
    },
    selectedFile,
  };

  const userLevelOptions = userLevelList.map((each) => {
    return (
      <Option key={each?.id} value={each?.level_name}>
        {each?.level_name}
      </Option>
    );
  });
  const erpOptions = erpList.map((each) => {
    return (
      <Option key={each?.erp_id} value={each?.erp_id}>
        {each?.erp_id}
      </Option>
    );
  });

  // console.log(editData, 'editData');

  return (
    <>
      <Modal
        visible={uploadFlag}
        title={
          editFlag ? (
            <div>
              Editing Signature of <b>{editData?.author_id__name}</b>
            </div>
          ) : (
            'Upload Signature'
          )
        }
        onCancel={handleCloseUploadModal}
        width={700}
        footer={[
          <Button
            className='th-br-4'
            key='back'
            type='secondary'
            onClick={handleCloseUploadModal}
          >
            Cancel
          </Button>,
          <Button
            className='th-br-4'
            key='submit'
            type='primary'
            onClick={editFlag ? handleEdit : handleUpload}
          >
            {editFlag ? (
              <div>
                <SaveOutlined /> Save
              </div>
            ) : (
              <div>
                <UploadOutlined /> Upload
              </div>
            )}
          </Button>,
        ]}
      >
        <div className='row my-4'>
          <div className='col-md-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row'>
                <div className='col-md-6 col-6 px-2'>
                  <Form.Item name='user-level'>
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder={
                        editFlag
                          ? userLevelList[editData?.author__user__level__user_level - 1]?.level_name
                          : 'Select User Level'
                      }
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => handleUserLevel(e, value)} // only single select
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                      disabled={editFlag}
                    >
                      {userLevelOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-6 col-6 px-2'>
                  <Form.Item name='erp'>
                    <Select
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      placeholder={editFlag ? editData?.author_id__erp_id : 'Select Erp'}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => handleErp(e, value)}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                      disabled={editFlag}
                    >
                      {erpOptions}
                    </Select>
                  </Form.Item>
                </div>

                <div className='col-md-12 col-6 px-2 pt-3'>
                  <div className='row'>
                    <div>
                      <Upload {...draggerProps}>
                        <Button className='btn-block th-br-4' type='primary'>
                          <CloudUploadOutlined /> Browse
                        </Button>
                      </Upload>
                    </div>
                    <div className='pt-1'>
                      {selectedFile && (
                        <div className='row'>
                          <div className='px-1'>{selectedFile?.name}</div>
                          <div className='px-1'>
                            <DeleteOutlined
                              className='th-red th-pointer th-20'
                              onClick={() => setSelectedFile(null)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='th-grey th-14'> Accepted files: [ jpeg, jpg, png ] </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadSignature;
