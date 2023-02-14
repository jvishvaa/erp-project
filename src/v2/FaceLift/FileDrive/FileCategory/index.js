import React, { useState, useEffect, useRef } from 'react';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import {
  message,
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Table,
  Input,
  Tag,
  Popconfirm,
  Space,
} from 'antd';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import { EditOutlined, CloseCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const FileCategory = () => {
  const history = useHistory();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const branchId = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
  );

  const fetchFileCategory = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.fileDrive.fileCategory}/`, { params: { ...params } })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setCategoryData(response?.data?.data?.results);
          setTotalCount(response.data?.data?.count);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('error', error?.message);
      });
  };

  useEffect(() => {
    fetchFileCategory({
      branch_id: branchId,
      acad_session_id: selectedBranch?.id,
      page_size: 20,
      page: currentPage,
    });
  }, []);

  const onOpenDrawer = () => {
    setShowDrawer(true);
  };

  const onCloseDrawer = () => {
    setShowDrawer(false);
    formRef.current.resetFields();
  };

  const handleSubmit = () => {
    const updateValues = formRef.current.getFieldsValue();

    if (updateValues.name?.length > 100) {
      message.error('Name length should not exceed 100 character');
      return;
    }
    if (updateValues.description?.length > 300) {
      message.error('Description length should not exceed 300 character');
      return;
    }
    if (updateValues.name) {
      const valuess = new FormData();
      valuess.append('name', updateValues.name);
      valuess.append(
        'description',
        updateValues.description ? updateValues.description : ''
      );

      valuess.append('branch', branchId);
      valuess.append('acad_session', selectedBranch?.id);

      if (editId) {
        axios
          .put(`${endpoints.fileDrive.fileCategory}/${editId}`, valuess)
          .then((result) => {
            onCloseDrawer();

            fetchFileCategory({
              branch_id: branchId,
              acad_session_id: selectedBranch?.id,
              page_size: 20,
              page: currentPage,
            });
            message.success('Category updated successfully');
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post(`${endpoints.fileDrive.fileCategory}/`, valuess)
          .then((result) => {
            onCloseDrawer();

            fetchFileCategory({
              branch_id: branchId,
              acad_session_id: selectedBranch?.id,
              page_size: 20,
              page: currentPage,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      message.error('Enter All Required fields');
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowDrawer(true);
    axios.get(`${endpoints.fileDrive.fileCategory}/${id}`).then((res) => {
      formRef.current.setFieldsValue({
        name: res.data.data?.name,
        description: res.data?.data?.description,
      });
    });
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.fileDrive.fileCategory}/${id}`)
      .then((result) => {
        if (result.status === 204) {
          message.success('Successfully Deleted');
          fetchFileCategory({
            branch_id: branchId,
            acad_session_id: selectedBranch?.id,
            page_size: 20,
            page: currentPage,
          });
        } else {
          message.error('Something went wrong');
        }
      })
      .catch(() => {
        message.error('Something went wrong');
      });
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Sl. No.</span>,

      align: 'center',
      render: (value, item, index) => (
        <span className='th-black-1 th-16'>{index + 1}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Category Name</span>,
      dataIndex: 'name',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Description</span>,
      key: 'description',
      render: (data) => <span className='th-black-1 th-14'>{data?.description}</span>,
    },

    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={<EditOutlined />}
              className='th-br-6 th-bg-primary th-white'
              style={{ cursor: 'pointer' }}
              onClick={() => handleEdit(data.id)}
            >
              Edit
            </Tag>
            <Popconfirm title='Sure to delete?' onConfirm={(e) => onDelete(data.id)}>
              <Tag
                icon={<CloseCircleOutlined />}
                color='error'
                style={{ cursor: 'pointer' }}
              >
                Delete
              </Tag>
            </Popconfirm>

            <Tag
              icon={<FolderOpenOutlined />}
              className='th-br-6 th-bg-primary th-white'
              style={{ cursor: 'pointer' }}
              onClick={() =>
                history.push({
                  pathname: '/file-drive',
                  state: { categoryId: data.id, categoryName: data?.name },
                })
              }
            >
              View Drive
            </Tag>
          </Space>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className=''>
        <div className='row pt-3'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-grey th-16 th-pointer'>
                File Drive
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                File Category
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12 mt-3'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row align-items-center mb-2'>
                <div className='col-md-10 th-18'>Files Category List</div>
                <div className='col-md-2'>
                  <Button
                    className={`d-inline th-button-active th-width-100 th-br-6 mt-2 text-truncate th-pointer`}
                    onClick={() => onOpenDrawer()}
                  >
                    Add Category
                  </Button>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading}
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={categoryData}
                    pagination={{
                      total: totalCount,
                      pageSize: 20,
                      current: currentPage,

                      onChange: (current) => {
                        setCurrentPage(current);
                        fetchFileCategory({
                          branch_id: branchId,
                          acad_session_id: selectedBranch?.id,
                          page_size: 20,
                          page: current,
                        });
                      },
                    }}
                    scroll={{ x: window.innerWidth > 600 ? '100%' : 'max-content' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title='Add File Category'
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
              form='fileCategoryForm'
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
          <div className='col-md-12'>
            <Form.Item
              name='name'
              label='Category Name'
              rules={[{ required: true, message: 'Please enter Category Name' }]}
            >
              <Input className='w-100' placeholder='Enter Category Name' />
            </Form.Item>
          </div>

          <div className='col-md-12'>
            <Form.Item name='description' label='Enter Description (Max 300 characters)'>
              <TextArea placeholder='Enter Description' rows={4} />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default FileCategory;
