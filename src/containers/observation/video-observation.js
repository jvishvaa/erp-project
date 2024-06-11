import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import Layout from 'containers/Layout';
import React, { createRef, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  CopyOutlined,
  DownOutlined,
  EditOutlined,
  InfoCircleTwoTone,
  SyncOutlined,
} from '@ant-design/icons';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DeleteOutlineOutlined } from '@material-ui/icons';

const { Option } = Select;

const VideoObservation = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [branchList, setBranchList] = useState([]);
  const [userLevelList, setUserLevelList] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const [load, setLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const [branch, setBranch] = useState(null);
  const [userName, setUserName] = useState(null);
  const [acadSession, setAcadSession] = useState(selectedBranch?.id);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const formRef = createRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [allFiltersSelected, setAllFiltersSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalBranch, setModalBranch] = useState(null);
  const [modalUserLevel, setModalUserLevel] = useState(null);
  const [modalUserName, setModalUserName] = useState(null);
  const [modalAcadSess, setMmodalAcadSess] = useState(null);
  const [modalUserNameOptions, setModalUserNameOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const [refferListPageData, setRefferListPageData] = useState({
    currentPage: 1,
    pageSize: 15,
    totalCount: null,
    totalPage: null,
  });
  const handleCancel = () => {
    setIsModalOpen(false);
    handleClearModal();
  };
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allRowIds = tableData
        .filter((record) => !record.evaluated)
        .map((record) => record.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };
  const columns = [
    {
      title: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {allFiltersSelected && tableData.some((ele) => !ele.evaluated) && (
            <Checkbox onChange={handleSelectAllChange} checked={selectAll} />
          )}
          <span style={{ textAlign: 'center' }} className='th-white th-fw-700'>
            Sl No.
          </span>
        </div>
      ),
      dataIndex: 'slNo',
      key: 'slNo',
      render: (text, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {allFiltersSelected && !record?.evaluated && (
            <Checkbox
              onChange={(e) => handleCheckboxChange(e, record)}
              checked={selectedRows.includes(record.id)}
            />
          )}
          <span>
            {(refferListPageData.currentPage - 1) * refferListPageData.pageSize +
              index +
              1}
          </span>
        </div>
      ),
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Date</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Observee</span>,
      dataIndex: 'name',
      key: 'observee',
      render: (text, record) => (
        <div>
          <span>{record.name?.user_name}</span>
          <br />
          <span>({record.name?.user_role})</span>
        </div>
      ),
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Observer</span>,
      key: 'observer',
      render: (text, record) => (
        <div>
          <span>
            {record.observer?.first_name} {record.observer?.last_name}
          </span>
          <br />
          <span>({record.name?.obs_role})</span>
        </div>
      ),
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <span style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {!record?.evaluated && (
            <Tooltip title='Edit' placement='top'>
              <EditOutlined
                style={{
                  fontSize: 20,
                  margin: 10,
                  cursor: 'pointer',
                  color: '#1B4CCB',
                }}
                onClick={() => {
                  history.push({
                    pathname: '/add-video-observation',
                    state: {
                      record,
                    },
                  });
                }}
              />
            </Tooltip>
          )}
          <Tooltip title='Copy' placement='top'>
            <CopyOutlined
              style={{
                fontSize: 20,
                margin: 10,
                cursor: 'pointer',
                color: '#1B4CCB',
              }}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          {!record?.evaluated && (
            <Popconfirm
              title='Sure to Delete ?'
              open={open}
              onConfirm={() => {
                handleDelete(record?.id);
              }}
              onCancel={() => setOpen(false)}
              getPopupContainer={(trigger) => trigger.parentNode}
              overlayClassName='custom-popconfirm'
            >
              <Tooltip title='Delete' placement='top'>
                <DeleteOutlineOutlined
                  style={{
                    fontSize: 20,
                    margin: 10,
                    cursor: 'pointer',
                    color: '#FF0000',
                  }}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </span>
      ),
      align: 'center',
    },
  ];

  const getBranches = () => {
    setLoad(true);
    axiosInstance
      .get(`erp_user/branch/?session_year=${selectedAcademicYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoad(false);
          setBranchList(result?.data?.data?.results);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };
  const fetchUserLevel = () => {
    setLoad(true);
    axios
      .get(`${endpointsV2.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setLoad(false);
          setUserLevelList(result?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
      });
  };
  const fetchUserName = (branch, userLevel) => {
    setLoad(true);
    axiosInstance
      .get(
        `${endpoints?.signature?.getErpList}?session_year=${selectedAcademicYear?.id}&branch_id=${branch}&user_level=${userLevel}`
      )
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setLoad(false);
          setUserNameList(result?.data?.data);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };
  const fetchModalUserNameOptions = (branch, userLevel) => {
    setLoad(true);
    axiosInstance
      .get(
        `${endpoints?.signature?.getErpList}?session_year=${selectedAcademicYear?.id}&branch_id=${branch}&user_level=${userLevel}`
      )
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setLoad(false);
          setModalUserNameOptions(result?.data?.data);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const fetchTableData = () => {
    const params = {
      acad_sess: acadSession,
      role: userLevel,
      name: userName,
    };

    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value != undefined && value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    setLoad(true);
    axiosInstance
      .get(
        `${endpointsV2?.assignVideoObservation?.bulkVideoUpdate}?page=${refferListPageData.currentPage}`,
        {
          params: filteredParams,
        }
      )
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setRefferListPageData({
            ...refferListPageData,
            totalCount: result?.data?.result?.count,
            totalPage: Math.ceil(
              result?.data?.result?.count / refferListPageData.pageSize
            ),
          });
          setLoad(false);
          setTableData(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const copyReport = () => {
    if (inputRef.current) {
      inputRef.current.value = 'hello';
      inputRef.current.select();

      try {
        document.execCommand('copy');
        message.success('success', 'Report copied!');
      } catch (err) {
        console.error('Unable to copy text: ', err);
        message.error('error', `Unable to copy text, ${err}`);
      }
    }
  };

  const BranchListOptions = branchList?.map((each) => (
    <Select.Option
      key={each?.branch?.id}
      value={JSON.stringify({ value: each?.branch?.id, acad_session: each?.id })}
      acad_session={each?.id}
    >
      {each?.branch?.branch_name}
    </Select.Option>
  ));

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const userNameListOption = userNameList?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.name}
    </Select.Option>
  ));

  const modalUserNameListOption = modalUserNameOptions?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.name}
    </Select.Option>
  ));

  const handleDelete = (id) => {
    const recordId = id;
    const baseUrl = endpointsV2?.assignVideoObservation?.videoReview.replace(/\/$/, '');
    const url = `${baseUrl.split('/video-review')[0]}/${recordId}/video-review/`;
    axiosInstance
      .delete(url)
      .then((res) => {
        fetchTableData();
        message.success('Deleted Successfully');
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter((rowId) => rowId !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBranch = (e) => {
    if (e) {
      const value = JSON.parse(e);
      setBranch(value?.value);
      setAcadSession(value?.acad_session);
      setTableData([]);
    } else {
      setBranch(null);
      setUserNameList([]);
      setUserName(null);
      formRef.current.setFieldsValue({
        user_name: null,
      });
      setTableData([]);
    }
  };

  const handleUserLevel = (e) => {
    if (e && e?.length != 0) {
      setUserLevel(e);
      setTableData([]);
    } else {
      setUserLevel(null);
      setUserNameList([]);
      setUserName(null);
      formRef.current.setFieldsValue({
        user_name: null,
      });
      setTableData([]);
    }
  };

  const handleUserName = (e) => {
    setUserName(e || null);
  };

  const handleModalBranchChange = (val) => {
    if (val) {
      const value = JSON.parse(val);
      setModalBranch(value?.value);
      setMmodalAcadSess(value?.acad_session);
    }
    if (val && modalUserLevel) {
      const value = JSON.parse(val);
      fetchModalUserNameOptions(value?.value, modalUserLevel);
    }
  };

  const handleModalUserLevelChange = (value) => {
    if (value) {
      setModalUserLevel(value);
      setModalUserName(null);
    } else {
      setModalUserName(null);
      setModalUserNameOptions([]);
    }
    if (value && modalBranch) {
      fetchModalUserNameOptions(modalBranch, value);
    }
  };

  const handleModalUserNameChange = (e) => {
    if (e) {
      setModalUserName(e || null);
    }
  };

  const handleCheckboxChange = (e, record) => {
    const newSelectedRows = e.target.checked
      ? [...selectedRows, record.id]
      : selectedRows.filter((id) => id !== record.id);
    setSelectedRows(newSelectedRows);

    if (!e.target.checked) {
      setSelectAll(false);
    } else if (
      newSelectedRows.length === tableData.filter((record) => !record.evaluated).length
    ) {
      setSelectAll(true);
    }
  };

  const handleReassignVideo = () => {
    setIsModalOpen(true);
  };

  const handleFilter = () => {
    setSelectAll(false);
    if (branch == null && userLevel == null && userName == null) {
      return message.error('Please Select The Filters');
    } else {
      fetchTableData();
      setRefferListPageData({
        ...refferListPageData,
        currentPage: 1,
      });
      resetCheckboxState();
    }
    if (branch && userLevel && userName) {
      setAllFiltersSelected(branch && userLevel && userName);
    } else {
      setAllFiltersSelected(false);
    }
  };

  const handleClearModal = () => {
    setModalBranch(null);
    setModalUserLevel(null);
    setModalUserName(null);
    setMmodalAcadSess(null);
    setModalUserNameOptions([]);
    modalRef.current.setFieldsValue({
      modal_branch: null,
      modal_role: null,
      modal_user_name: null,
    });
  };

  const resetCheckboxState = () => {
    setSelectedRows([]);
  };

  const handleCopy = (record) => {
    const parsedDate = new Date(record?.created_at);

    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const copiedText = `Date - ${formattedDate}\n\n${record?.name?.user_name} / ${record?.name?.user_role}\n\nVideo Link: ${record?.video_link}\n\nObserver Name: ${record?.observer?.first_name} ${record?.observer?.last_name} (${record?.observer?.role?.role_name})`;

    navigator.clipboard
      .writeText(copiedText)
      .then(() => {
        message.success('Text copied to clipboard:');
      })
      .catch((error) => {
        message.error('Error copying text:', error);
      });
  };

  const handelDeleteModal = () => {
    const formData = new FormData();
    formData.append('bulk_delete', 'bulk_delete');
    formData.append('ids', selectedRows);
    setLoad(true);
    axiosInstance
      .delete(endpointsV2?.assignVideoObservation?.bulkVideoUpdate, { data: formData })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setLoad(false);
          message.success(`${selectedRows?.length} rows successfully delete`);
          fetchTableData();
          setIsModalOpen(false);
          setSelectAll(false);
          handleClearModal();
          resetCheckboxState();
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        setSelectAll(false);
        setIsModalOpen(false);
      });
  };

  const handleUpdateModal = () => {
    if (modalUserName && modalAcadSess) {
      const formData = new FormData();
      formData.append('bulk_update', 'bulk_update');
      formData.append('ids', selectedRows);
      formData.append('obs_acad_sess', modalAcadSess);
      formData.append('assigned_obs', modalUserName);
      if (selectedRows?.length == tableData?.length) {
        setRefferListPageData({
          ...refferListPageData,
          currentPage: refferListPageData?.currentPage - 1,
        });
      }
      setLoad(true);
      axiosInstance
        .patch(endpointsV2?.assignVideoObservation?.bulkVideoUpdate, formData)
        .then((res) => {
          if (res?.data?.status_code == 200) {
            setLoad(false);
            message.success(`${selectedRows?.length} rows successfully updated`);
            fetchTableData();
            setIsModalOpen(false);
            setSelectAll(false);
            handleClearModal();
            resetCheckboxState();
          }
        })
        .catch((err) => {
          setLoad(false);
          console.log(err);
          setSelectAll(false);
          setIsModalOpen(false);
        });
    } else {
      message.error('Fields Cannot Be Empty');
    }
  };

  useEffect(() => {
    getBranches();
    fetchUserLevel();
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [refferListPageData.currentPage, selectedBranch]);
  useEffect(() => {
    if (branch && userLevel) {
      fetchUserName(branch, userLevel);
    }
  }, [branch, userLevel]);
  return (
    <>
      <Layout>
        <div className='row  px-2'>
          <div className='row pt-3 pb-3'>
            <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                  Assign Video Observation
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='th-bg-white th-br-5 py-3 shadow-sm'>
                <div>
                  <Form
                    ref={formRef}
                    className='d-flex align-items-center flex-wrap'
                    direction='row'
                  >
                    <div className='col-md-2'>
                      <span className='th-grey th-14'>Branch*</span>
                      <Form.Item name='branch'>
                        <Select
                          allowClear
                          placeholder='Select Branch'
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          className='w-100 text-left th-black-1 th-bg-white th-br-4'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          onChange={(e) => handleBranch(e)}
                        >
                          {BranchListOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2'>
                      <span className='th-grey th-14'>User Level*</span>
                      <Form.Item name='role'>
                        <Select
                          allowClear
                          placeholder='Select User Level'
                          suffixIcon={<DownOutlined className='th-grey' />}
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                ?.toLowerCase()
                                ?.indexOf(input?.toLowerCase()) >= 0
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
                      <span className='th-grey th-14'>Name</span>
                      <Form.Item name='user_name'>
                        <Select
                          allowClear
                          placeholder='Select User Name'
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options?.children
                                ?.toLowerCase()
                                ?.indexOf(input?.toLowerCase()) >= 0
                            );
                          }}
                          className='w-100 text-left th-black-1 th-bg-white th-br-4'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          onChange={(e) => handleUserName(e)}
                        >
                          {userNameListOption}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 mt-2'>
                      <Button
                        type='primary'
                        className='Buttons'
                        onClick={() => handleFilter()}
                        class='mt-3'
                      >
                        Filter
                      </Button>
                    </div>
                    <div className='col-md-2 mt-2'>
                      <Button
                        type='primary'
                        className='Buttons'
                        onClick={() => history.push('/add-video-observation')}
                        class='mt-3'
                      >
                        Add Video Observation
                      </Button>
                    </div>
                    {selectedRows.length > 0 && (
                      <div className='col-md-2 mt-2'>
                        <Button
                          type='secondary'
                          className='Buttons'
                          onClick={() => handleReassignVideo()}
                          class='mt-3'
                        >
                          Reassign
                        </Button>
                      </div>
                    )}
                  </Form>
                  <div className='table'>
                    <span className='border p-1' style={{ borderColor: '#d9d9d9' }}>
                      <InfoCircleTwoTone className='pr-2' />
                      <i className='th-grey'>
                        Please Select Branch And User Level For User Name
                      </i>
                    </span>
                    <Table
                      dataSource={tableData}
                      columns={columns}
                      className='text-center mt-2'
                      pagination={false}
                      scroll={{ y: '80vh' }}
                    />
                  </div>
                  {tableData?.length > 0 && (
                    <div className='text-center mt-2'>
                      <Pagination
                        current={refferListPageData.currentPage}
                        total={refferListPageData.totalCount}
                        pageSize={refferListPageData.pageSize}
                        onChange={(value) => {
                          setRefferListPageData({
                            ...refferListPageData,
                            currentPage: value,
                          });
                          setSelectedRows([]);
                          setSelectAll(false);
                        }}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} items`
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {load && <Loader />}
          <Modal
            width={'600px'}
            title='Bulk Delete Or Edit'
            visible={isModalOpen}
            onCancel={handleCancel}
            footer={[
              <Popconfirm
                title='Are you Sure ?'
                onConfirm={() => handelDeleteModal()}
                okText='Yes'
                cancelText='No'
                getPopupContainer={(trigger) => trigger.parentNode}
                overlayClassName='custom-popconfirm'
              >
                <Button
                  key='delete'
                  type='danger'
                  danger
                  disabled={load}
                  className='th-br-6'
                >
                  Delete
                </Button>
              </Popconfirm>,
              <Button
                key='update'
                type='primary'
                onClick={() => handleUpdateModal()}
                icon={load ? <SyncOutlined spin /> : <EditOutlined />}
                disabled={load}
                className='th-br-6'
              >
                Assign observer
              </Button>,
            ]}
          >
            <Form
              className='d-flex align-items-center flex-wrap'
              ref={modalRef}
              direction='row'
            >
              <div className='col-md-4'>
                <span className='th-grey th-14'>Branch*</span>
                <Form.Item name='modal_branch'>
                  <Select
                    allowClear
                    placeholder='Select Branch'
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >=
                        0
                      );
                    }}
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onChange={(e) => handleModalBranchChange(e)}
                  >
                    {BranchListOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4'>
                <span className='th-grey th-14'>Level*</span>
                <Form.Item name='modal_role'>
                  <Select
                    allowClear
                    placeholder='Select User Level'
                    suffixIcon={<DownOutlined className='th-grey' />}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >=
                        0
                      );
                    }}
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                    onChange={(e) => handleModalUserLevelChange(e)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {userLevelListOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4'>
                <span className='th-grey th-14'>Name</span>
                <Form.Item name='modal_user_name'>
                  <Select
                    allowClear
                    placeholder='Select User Name'
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >=
                        0
                      );
                    }}
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onChange={(e) => handleModalUserNameChange(e)}
                  >
                    {modalUserNameListOption}
                  </Select>
                </Form.Item>
              </div>
            </Form>
            <div>
              <p className='th-grey text-right th-width-95'>
                {selectedRows?.length} items selected.
              </p>
            </div>
          </Modal>
        </div>
      </Layout>
    </>
  );
};

export default VideoObservation;
