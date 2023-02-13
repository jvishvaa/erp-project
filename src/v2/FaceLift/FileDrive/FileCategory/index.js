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

const { TextArea } = Input;

const FileDrive = () => {
  const history = useHistory();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchFileCategory = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.fileDrive.fileCategory}/`, { params: { ...params } })
      .then((response) => {
        if (response?.data) {
          setCategoryData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('error', error?.message);
      });
  };

  useEffect(() => {
    fetchFileCategory({ is_delete: false });
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
    if (updateValues.name) {
      const valuess = new FormData();
      valuess.append('name', updateValues.name);
      valuess.append(
        'description',
        updateValues.description ? updateValues.description : ''
      );

      if (editId) {
        axios
          .put(`${endpoints.fileDrive.fileCategory}/${editId}`, valuess)
          .then((result) => {
            onCloseDrawer();

            fetchFileCategory();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post(`${endpoints.fileDrive.fileCategory}/`, valuess)
          .then((result) => {
            onCloseDrawer();

            fetchFileCategory();
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
        name: res.data.result.name,
        description: res.data?.result.description,
      });
    });
  };

  const onDelete = (id) => {
    axios
      .delete(`${endpoints.fileDrive.fileCategory}/${id}`)
      .then((result) => {
        if (result.status === 204) {
          message.success('Successfully Deleted');
          fetchFileCategory();
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
      title: <span className='th-white th-fw-700 '>S. No.</span>,

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
                  state: { categoryId: data.id },
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
              <Breadcrumb.Item className='th-black-1 th-16'>File Drive</Breadcrumb.Item>
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
                    pagination={false}
                    // scroll={{ y: '400px' }}
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
            <Form.Item name='description' label='Enter Description'>
              <TextArea placeholder='Enter Description' rows={4} />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default FileDrive;
