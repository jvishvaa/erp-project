import React, { useState, useEffect, useRef } from 'react';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import {
  message,
  Skeleton,
  Breadcrumb,
  Button,
  Drawer,
  Card,
  Upload,
  Select,
  Form,
  Input,
  Radio,
  Empty,
} from 'antd';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import FileCard from '../FileDrive/FileCard';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const FileDrive = () => {
  const formRef = useRef();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [fileCategory, setFileCategory] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState('False');
  const [editId, setEditId] = useState(null);
  const [editedFile, setEditedFile] = useState(null);
  const [duplicateType, setDuplicateType] = useState(1);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const branchId = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
  );
  const categoryId = history.location.state?.categoryId;

  const fetchFileList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.fileDrive.fileList}`, { params: { ...params } })
      .then((response) => {
        if (response?.data) {
          setFileList(response?.data?.data?.results);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('error', error?.message);
      });
  };

  const verifyFile = (params = {}) => {
    axios
      .get(`${endpoints.fileDrive.verifyFile}/`, { params: { ...params } })
      .then((response) => {
        setIsDuplicate(response.data.result);
      })
      .catch((error) => {
        setIsDuplicate('False');
      });
  };

  const fetchFileCategory = (params = {}) => {
    axios
      .get(`${endpoints.fileDrive.fileCategory}/`, { params: { ...params } })
      .then((response) => {
        if (response?.data) {
          setFileCategory(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
  };
  useEffect(() => {
    fetchFileList({ category: categoryId, branch_id: branchId });
    fetchFileCategory({ is_delete: false });
  }, []);

  const onOpenDrawer = () => {
    setShowDrawer(true);
  };
  const onCloseDrawer = () => {
    setShowDrawer(false);
    setIsDuplicate(false);
    setEditId(null);
    formRef.current.resetFields();
  };

  const handleFile = (e) => {
    setUploadFile(e.target.files[0]);
    verifyFile({
      branch_id: branchId,
      acad_session_id: selectedBranch?.id,
      file_name: e.target.files[0]?.name.split('.')[0],
    });
  };

  const handleSubmit = () => {
    if (editId) {
      const valuess = new FormData();
      const updateValues = formRef.current.getFieldsValue();
      valuess.append('file_name', updateValues.file_name);
      valuess.append('category', updateValues?.category);
      axios
        .put(`${endpoints.fileDrive.editFileList}/${editId}`, valuess)
        .then((result) => {
          onCloseDrawer();
          fetchFileList({ category: categoryId, branch_id: branchId });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (uploadFile) {
        const valuess = new FormData();
        valuess.append('file_name', uploadFile?.name.split('.')[0]);
        valuess.append('file_size', uploadFile.size);
        valuess.append('file_type', uploadFile?.name?.split('.')[1]);
        valuess.append('branch', branchId);
        valuess.append('acad_session', selectedBranch?.id);
        valuess.append(
          'added_by',
          JSON.parse(localStorage.getItem('userDetails'))?.user_id
        );
        valuess.append('file', uploadFile, uploadFile.name);
        valuess.append('category', categoryId);

        if (duplicateType === 2) {
          valuess.append('duplicate', true);
        }

        axios
          .post(`${endpoints.fileDrive.fileList}`, valuess)
          .then((result) => {
            onCloseDrawer();

            fetchFileList({ category: categoryId, branch_id: branchId });
            message.success('File Uploaded Successfully!');
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        message.error('Please select all required fields!');
      }
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${endpoints.fileDrive.editFileList}/${id}`)
      .then((res) => {
        fetchFileList({ category: categoryId, branch_id: branchId });
        message.success('File Deleted Successfully!');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowDrawer(true);
    axios.get(`${endpoints.fileDrive.editFileList}/${id}`).then((res) => {
      formRef.current.setFieldsValue({
        category: res.data.result.category?.id,
        file_name: res.data?.result.file_name,
      });
      setEditedFile(res.data.result);
    });
  };

  console.log(uploadFile, fileCategory, selectedCategory, isDuplicate, 'upload fileee');

  const categoryOptions = fileCategory?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.name}
      </Option>
    );
  });

  return (
    <Layout>
      <div className=''>
        <div className='row pt-3'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-16 th-pointer'
                onClick={() => history.push('/file-category')}
              >
                File Category
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>File Drive</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12 mt-3'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row align-items-center mb-2'>
                <div className='col-md-10 th-18'>Files List</div>
                <div className='col-md-2'>
                  <Button
                    className={`d-inline th-button-active th-width-100 th-br-6 mt-2 text-truncate th-pointer`}
                    onClick={() => onOpenDrawer()}
                  >
                    Upload File
                  </Button>
                </div>
              </div>
              <div className='row'>
                {!loading ? (
                  fileList?.length > 0 ? (
                    fileList?.map((eachFile) => {
                      return (
                        <div className='col-md-3 mb-3'>
                          <FileCard
                            eachFile={eachFile}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className='py-5 text-center w-100'>
                      <Empty />
                    </div>
                  )
                ) : (
                  Array(12)
                    .fill(0)
                    ?.map((eachItem) => {
                      return (
                        <div className='col-md-3 mb-3'>
                          <Card className='th-br-10 th-file-upload-card'>
                            <Skeleton.Image
                              loading={loading}
                              className='th-br-10 mb-2'
                              style={{ width: '240px', height: '150px' }}
                            />
                            <Skeleton loading={loading} active></Skeleton>
                          </Card>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title={editId ? 'Edit File' : 'Add File'}
        placement='right'
        onClose={onCloseDrawer}
        visible={showDrawer}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCloseDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              form='fileUploadForm'
              type='primary'
              htmlType='submit'
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </Button>
          </div>
        }
      >
        <Form id='filterForm' ref={formRef} layout={'vertical'}>
          {/* {editId ? ( */}
          <Form.Item
            name='category'
            label='Select Category'
            rules={[{ required: true, message: 'Please Select Category' }]}
          >
            <Select
              allowClear={true}
              className='th-grey th-bg-grey th-br-4 w-100 text-left'
              placement='bottomRight'
              showArrow={true}
              dropdownMatchSelectWidth={false}
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              placeholder='Select Category'
              onChange={(e) => {
                setSelectedCategory(e);
              }}
            >
              {categoryOptions}
            </Select>
          </Form.Item>
          {/* ) : null} */}
          {editId ? (
            <Form.Item name='file_name' label='Enter File Name'>
              <Input className='w-100' placeholder='Enter File Name' />
            </Form.Item>
          ) : null}

          {!editId ? (
            <Form.Item
              name='file'
              label='Upload File'
              rules={[{ required: true, message: 'Please Select File' }]}
            >
              <input
                className='mt-3'
                type='file'
                id='file'
                onChange={(e) => handleFile(e)}
              />
            </Form.Item>
          ) : null}
        </Form>
        {editId ? (
          <div>
            <FileCard
              isEdited={true}
              eachFile={editedFile}
              version={'Current Version'}
              isCurrent={true}
            />
            {editedFile?.version?.map((eachEditedFile, index) => {
              return (
                <FileCard
                  isEdited={true}
                  eachFile={eachEditedFile}
                  version={'Version ' + (index + 1)}
                />
              );
            })}
          </div>
        ) : null}

        {isDuplicate === 'True' && uploadFile && !editId ? (
          <div>
            {uploadFile?.name} already exists in this location. Do you want to update the
            existing file with a new version or keep both files? Replacing the file won't
            change sharing settings.
            <div className='mt-2'>
              <Radio.Group
                onChange={(e) => {
                  setDuplicateType(e.target.value);
                }}
                value={duplicateType}
              >
                <Radio value={1}>Update existing file</Radio>
                <Radio value={2}>Keep both files</Radio>
              </Radio.Group>
            </div>
          </div>
        ) : null}
      </Drawer>
    </Layout>
  );
};

export default FileDrive;
