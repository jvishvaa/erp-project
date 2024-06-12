import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  message,
} from 'antd';
import Layout from 'containers/Layout';
import React, { createRef, useEffect, useState } from 'react';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import endpointsV2 from 'v2/config/endpoints';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DeleteOutlineOutlined } from '@material-ui/icons';

const { Option } = Select;

const AddVideoObservation = () => {
  const history = useHistory();
  const [branchList, setBranchList] = useState([]);
  const [userLevelList, setUserLevelList] = useState([]);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const formRef = createRef();
  const editFormRef = new Map();
  const [formRefs, setFormRefs] = useState([]);
  const [branch, setBranch] = useState(null);
  const [editObservedBranch, setEditObservedBranch] = useState(null);
  const [formFields, setFormFields] = useState([
    {
      id: 1,
      branch: history?.location?.state?.record?.obs_acad_sess
        ? history?.location?.state?.record?.obs_acad_sess
        : null,
      role: history?.location?.state?.record?.obs_level
        ? history?.location?.state?.record?.obs_level
        : null,
      user_name: history?.location?.state?.record?.assigned_obs
        ? history?.location?.state?.record?.assigned_obs
        : null,
      userNameList: [],
    },
  ]);

  const [forms, setForms] = useState([
    {
      id: 1,
      videoLink: history?.location?.state?.record?.video_link || null,
      branch: history?.location?.state?.record?.acad_sess || null,
      role: history?.location?.state?.record?.user_level || null,
      name: history?.location?.state?.record?.erp_user || null,
      usernameListOptions: [],
    },
  ]);
  const [error, setError] = useState(null);

  forms.forEach(form => {
    if (!editFormRef.has(form.id)) {
      editFormRef.set(form.id, createRef());
    }
  });

  const handleAddForm = () => {
    if (forms.length >= 25) {
      setError('You cannot add more than 25 observers.');
      message.error('You cannot add more than 25 observers.');
      return;
    }
    setForms([
      ...forms,
      {
        id: forms.length+1,
        videoLink: null,
        branch: null,
        role: null,
        name: null,
        usernameListOptions: [],
      },
    ]);
    setError(null);
  };

  const handleRemoveForm = (id) => {
    if (forms?.length === 1) {
      return;
    }
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleInputChange = (id, field, value, prefill) => {
    if (id) {
      setForms((prevForms) =>
        prevForms.map((form) => {
          if (form.id === id) {
            let updatedForm = { ...form, [field]: value };
            if (field === 'branch') {
              if (value) {
                const parsedValue = JSON.parse(value);
                if (!prefill) {
                  updatedForm = {
                    ...updatedForm,
                    branch: parsedValue.branch_id,
                    acad_session: parsedValue.acad_session,
                  };
                }
              } else {
                updatedForm = {
                  ...updatedForm,
                  branch: null,
                  acad_session: null,
                };
              }
            }
            if (field === 'branch' || field === 'role') {
              editFormRef.get(id).current.setFieldsValue({
                [`edit_name_${id}`]: null,
              });
              updatedForm.name = null;
              updatedForm.usernameListOptions = [];
              if (updatedForm.branch && updatedForm.role) {
                handleBranchOrRoleChange(id, field, updatedForm.branch, updatedForm.role);
              }
            }
  
            if (!updatedForm.branch && !updatedForm.role) {
              editFormRef.get(id).current.setFieldsValue({
                [`edit_name_${id}`]: null,
              });
              updatedForm.name = null;
              updatedForm.usernameListOptions = [];
            }
  
            return updatedForm;
          }
          return form;
        })
      );
    } else {
      if (field == 'branch' || field == 'role') {
        const fields = [...forms];
        fields[id - 1].usernameListOptions = [];
        fields[id - 1].name = null;
        editFormRef.current.setFieldsValue({
          [`edit_name_${fields[id - 1].id}`]: null,
        });
        setForms(fields);
      }
    }
  };
  const updateUsernameListOptions = (id, newOptions) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, usernameListOptions: newOptions } : form
      )
    );
  };

  const handleBranchOrRoleChange = (id, field, branch, role) => {
    const form = forms.find((form) => form.id === id);
    if (branch && role) {
      fetchEditUserName(branch, role)
        .then((newOptions) => {
          updateUsernameListOptions(id, newOptions);
        })
        .catch((error) => {
          console.error('Error fetching user names:', error);
          updateUsernameListOptions(id, []);
        });
    } else {
      updateUsernameListOptions(id, []);
    }
  };

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    getBranches();
    fetchUserLevel();
  }, []);

  const addFormField = () => {
    if (formFields.length < 3) {
      const newFormField = {
        id: Date.now(),
        branch: null,
        role: null,
        user_name: null,
        userNameList: [],
      };
      setFormFields([...formFields, newFormField]);
    } else {
      message.error('You Cannot Add More Than 3 Observers');
    }
  };

  const removeFormField = (index) => {
    const fields = [...formFields];
    fields.splice(index, 1);
    setFormFields(fields);
  };

  const handleFieldChange = (value, index, field, prefill) => {
    if (value) {
      const parsedValue = JSON?.parse(value);
      const fields = [...formFields];
      if (field === 'branch') {
        if (prefill) {
          fields[index]['branch'] = value;
        } else {
          fields[index]['branch'] = parsedValue.branch_id;
          fields[index]['acad_session'] = parsedValue.acad_session;
        }
        fields[index].userNameList = [];
        fields[index].user_name = null;
        formRef.current.setFieldsValue({
          [`user_name_${fields[index].id}`]: null,
        });
        setFormFields(fields);
      } else if (field === 'role' || field == 'branch') {
        fields[index]['role'] = value;

        fields[index].userNameList = [];
        fields[index].user_name = null;
        setFormFields(fields);
        formRef.current.setFieldsValue({
          [`user_name_${fields[index].id}`]: null,
        });
      } else {
        fields[index][field] = value;
      }

      setFormFields(fields);
    } else {
      if (field == 'branch' || field == 'role') {
        const fields = [...formFields];
        fields[index].userNameList = [];
        fields[index].user_name = null;
        formRef.current.setFieldsValue({
          [`user_name_${fields[index].id}`]: null,
        });
        if (field == 'branch') {
          fields[index].branch = null;
          fields[index].acad_session = null;
        }
        if (field == 'role') {
          fields[index].role = null;
        }
        setFormFields(fields);
      }
    }
    if (field == 'branch' || field == 'role') {
      const fields = [...formFields];
      if (fields[index].branch && fields[index].role) {
        fetchUserName(fields[index].branch, fields[index].role, index);
      }
    }
  };

  const setEditData = (data) => {
    const acadSessId = history?.location?.state?.record?.obs_acad_sess;
    const editUserAcadSessId = history?.location?.state?.record?.acad_sess;
    const branchObj = data?.find((each) => each.id === acadSessId);
    const editUserBranchObj = data?.find((each) => each.id === editUserAcadSessId);
    setBranch(branchObj?.branch?.id);
    setEditObservedBranch(editUserBranchObj?.branch?.id);
  };

  const getBranches = () => {
    setLoad(true);
    axiosInstance
      .get(`erp_user/branch/?session_year=${selectedAcademicYear?.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoad(false);
          setBranchList(result?.data?.data?.results);
          if (history?.location?.state?.record?.acad_sess) {
            setEditData(result?.data?.data?.results);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
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
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setLoad(false);
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const fetchUserName = (branch, userLevel, index) => {
    let params = {};
    if (selectedAcademicYear?.id) {
      params.session_year = selectedAcademicYear?.id;
    }
    if (!history?.location?.state?.record && branch) {
      params.branch_id = branch;
    }
    if (userLevel) {
      params.user_level = userLevel;
    }
    if (history?.location?.state?.record) {
      params.acad_sess = branch;
    }
    setLoad(true);
    axiosInstance
      .get(`/erp_user/branch-list/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setLoad(false);
          const fields = [...formFields];
          fields[index].userNameList = res?.data?.data;
          setFormFields(fields);
        }
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  };

  const fetchEditUserName = async (acad_sess, user_level) => {
    let params = {};
    if (selectedAcademicYear?.id) {
      params.session_year = selectedAcademicYear?.id;
    }
    if (user_level) {
      params.user_level = user_level;
    }
    if (acad_sess) {
      if (history?.location?.state?.record) {
        params.acad_sess = acad_sess;
      } else {
        params.branch_id = acad_sess;
      }
    }

    return axiosInstance.get(`/erp_user/branch-list/`, { params: params }).then((res) => {
      if (res?.data?.status_code === 200) {
        return res?.data?.data;
      } else {
        throw new Error('Failed to fetch user names');
      }
    });
  };

  const BranchListOptions = branchList?.map((each) => (
    <Select.Option
      key={each?.id}
      value={JSON.stringify({ branch_id: each?.branch?.id, acad_session: each?.id })}
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

  const editBranchListOption = branchList?.map((each) => (
    <Select.Option key={each?.id} value={each?.branch?.id} acad_sess={each?.id}>
      {each?.branch?.branch_name}
    </Select.Option>
  ));

  const handleEditSubmit = () => {
    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];
      if (!field.branch) {
        message.error(`Observer ${i + 1}: Branch is required.`);
        return;
      }
      if (!field.role) {
        message.error(`Observer ${i + 1}: Level is required.`);
        return;
      }
      if (!field.user_name || field.user_name.length === 0) {
        message.error(`Observer ${i + 1}: User Name is required.`);
        return;
      }
    }

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.videoLink || form.videoLink?.trim()?.length === 0) {
        message.error(`Observed ${i + 1}: Video Link is required.`);
        return;
      }
      if (!form.branch) {
        message.error(`Form ${i + 1}: Branch is required.`);
        return;
      }
      if (!form.role) {
        message.error(`Form ${i + 1}: Level is required.`);
        return;
      }
      if (!form.name) {
        message.error(`Form ${i + 1}: Name is required.`);
        return;
      }
    }
    const formData = new FormData();
    formData.append('acad_sess', forms[0]?.branch);
    formData.append('assigned_obs', formFields[0]?.user_name);
    formData.append('erp_user', forms[0]?.name);
    formData.append('obs_acad_sess', formFields[0]?.branch);
    formData.append('user_level', forms[0]?.role);
    formData.append('video_link', forms[0]?.videoLink);
    const recordId = history?.location?.state?.record?.id;
    const baseUrl = endpointsV2?.assignVideoObservation?.videoReview.replace(/\/$/, '');
    const url = `${baseUrl.split('/video-review')[0]}/${recordId}/video-review/`;
    setLoad(true);
    axiosInstance
      .patch(url, formData)
      .then((res) => {
        if (res?.data) {
          setLoad(false);
          message.success('Video Observation Successfully Updated');
          history.push('/assign-video-observation');
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };

  const handleSubmitForm = () => {
    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];
      if (!field.branch) {
        message.error(`Observer ${i + 1}: Branch is required.`);
        return;
      }
      if (!field.role) {
        message.error(`Observer ${i + 1}: Level is required.`);
        return;
      }
      if (!field.user_name || field.user_name.length === 0) {
        message.error(`Observer ${i + 1}: User Name is required.`);
        return;
      }
    }

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.branch) {
        message.error(`Observed ${i + 1}: Branch is required.`);
        return;
      }
      if (!form.role) {
        message.error(`Observed ${i + 1}: Level is required.`);
        return;
      }
      if (!form.name) {
        message.error(`Observed ${i + 1}: Name is required.`);
        return;
      }
      if (!form.videoLink || form.videoLink?.trim()?.length === 0) {
        message.error(`Observed ${i + 1}: Video Link is required.`);
        return;
      }
    }
    const formData = new FormData();
    formData.append('new_flow', 'new_flow');
    const observedData = forms.map((field, index) => ({
      user_level: field?.role,
      acad_sess: field?.acad_session,
      erp_user: field?.name,
      video_link: forms[index]?.videoLink,
    }));
    formData.append('data', JSON.stringify(observedData));
    const observerData = formFields.map((field) => ({
      obs_acad_sess: field?.acad_session,
      assigned_obs: field?.user_name,
    }));
    formData.append('observer_data', JSON.stringify(observerData));
    setLoad(true);
    axiosInstance
      .post(`${endpointsV2?.assignVideoObservation?.videoReview}`, formData)
      .then((res) => {
        if (res) {
          setLoad(false);
          message.success('Video Observation Successfully Created');
          history.push('/assign-video-observation');
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };
  useEffect(() => {
    if (history?.location?.state) {
      formRef.current.setFieldsValue({
        role_1: history?.location?.state?.record?.obs_level,
        user_name_1: `${history?.location?.state?.record?.observer?.first_name} ${history?.location?.state?.record?.observer?.last_name}`,
      });
      editFormRef.current.setFieldsValue({
        edit_video_1: history?.location?.state?.record?.video_link,
        edit_role_1: history?.location?.state?.record?.user_level,
        edit_name_1: history?.location?.state?.record?.erp_user,
      });
      fetchEditUserName(
        history?.location?.state?.record?.acad_sess,
        history?.location?.state?.record?.user_level
      )
        .then((newOptions) => {
          updateUsernameListOptions(1, newOptions);
        })
        .catch((error) => {
          console.error('Error fetching user names:', error);
          updateUsernameListOptions(1, []);
        });
      fetchUserName(
        history?.location?.state?.record?.obs_acad_sess,
        history?.location?.state?.record?.obs_level,
        0
      );
    }
    if (branch) {
      formRef.current.setFieldsValue({
        branch_1: branch,
      });
    }
    if (editObservedBranch) {
      editFormRef.current.setFieldsValue({
        [`edit_branch_1`]: editObservedBranch,
      });
    }
  }, [history?.location?.state, branch, editObservedBranch]);

  // For Scrollable behaviour of the observed employee field

  useEffect(() => {
    if (formRefs.length > 0) {
      const lastFormRef = formRefs[formRefs.length - 1];
      if (lastFormRef) {
        lastFormRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [formRefs]);

  const addFormRef = (ref) => {
    if (ref && !formRefs.includes(ref)) {
      setFormRefs((prevRefs) => [...prevRefs, ref]);
    }
  };

  return (
    <div className='row px-2'>
      <Layout>
        <div className='row pb-3'>
          <div className='col-md-12 th-bg-grey'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-black-1 th-16 th-grey cursor-pointer'
                onClick={() => history.push('/assign-video-observation')}
              >
                Assign Video Observation
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Add Video Observation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='col-12 pb-3'>
          <div className='row justify-content-between'>
            <div className='col-6 pl-0'>
              <div
                className='p-3 th-bg-white th-br-12'
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
              >
                <div
                  className='d-flex flex-column justify-content-between '
                  style={{ height: '100%' }}
                >
                  <div
                    className='d-flex flex-column justify-content-start'
                    style={{ gap: 20 }}
                  >
                    <div className='th-fw-600 text-center'>OBSERVER</div>
                    <Form ref={formRef}>
                      {formFields.map((field, index) => (
                        <Card
                          className={`th-br-12 th-bg-grey mb-3`}
                          bodyStyle={{ padding: '8px' }}
                        >
                          <div class='row align-items-center justify-content-between mb-2'>
                            <div class='th-fw-600 mx-3'>Observer {index + 1}</div>
                            {formFields?.length > 1 && (
                              <Popconfirm
                                title='Sure to delete?'
                                open={open}
                                onConfirm={() => removeFormField(index)}
                                onCancel={() => setOpen(false)}
                                overlayClassName='custom-popconfirm'
                              >
                                <DeleteOutlineOutlined className='text-danger th-22 th-pointer mx-3' />
                              </Popconfirm>
                            )}
                          </div>
                          <div className='row'>
                            <div className='col-md-4 col-sm-6 col-12'>
                              <Form.Item
                                name={`branch_${field.id}`}
                                rules={[
                                  { required: true, message: 'Please select a branch!' },
                                ]}
                              >
                                <Select
                                  allowClear
                                  placeholder='Select branch*'
                                  showSearch
                                  optionFilterProp='children'
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                  onChange={(value, option) => {
                                    if (history?.location?.state?.record) {
                                      handleFieldChange(
                                        option?.acad_sess,
                                        index,
                                        'branch',
                                        'prefill'
                                      );
                                    } else {
                                      handleFieldChange(value, index, 'branch');
                                    }
                                  }}
                                >
                                  {history?.location?.state?.record
                                    ? editBranchListOption
                                    : BranchListOptions}
                                </Select>
                              </Form.Item>
                            </div>
                            <div className='col-md-4 col-sm-6 col-12'>
                              <Form.Item
                                name={`role_${field.id}`}
                                rules={[
                                  { required: true, message: 'Please select a level!' },
                                ]}
                              >
                                <Select
                                  allowClear
                                  placeholder='Select user level*'
                                  showSearch
                                  optionFilterProp='children'
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                  onChange={(value) =>
                                    handleFieldChange(value, index, 'role')
                                  }
                                >
                                  {userLevelListOptions}
                                </Select>
                              </Form.Item>
                            </div>
                            <div className='col-md-4 col-sm-6 col-12'>
                              <Form.Item
                                name={`user_name_${field.id}`}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please select a user name!',
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  placeholder='User name*'
                                  showSearch
                                  optionFilterProp='children'
                                  filterOption={(input, option) =>
                                    option?.children
                                      ?.toLowerCase()
                                      ?.indexOf(input?.toLowerCase()) >= 0
                                  }
                                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                  onChange={(value) =>
                                    handleFieldChange(value, index, 'user_name')
                                  }
                                >
                                  {field?.userNameList?.map((user) => (
                                    <Select.Option key={user?.id} value={user?.id}>
                                      {user?.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </div>
                          {/* </div> */}
                        </Card>
                      ))}
                    </Form>
                  </div>
                  {!history?.location?.state?.record && formFields.length < 3 ? (
                    <div className='d-flex flex-row-reverse w-90'>
                      <Button
                        className='th-br-6'
                        type='primary'
                        onClick={addFormField}
                        icon={<PlusOutlined />}
                      >
                        Add Observer
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className='col-6 pr-0'>
              <div
                className='p-3 th-bg-white th-br-12'
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
              >
                <div
                  className='d-flex flex-column justify-content-between '
                  style={{ height: '100%' }}
                >
                  <div
                    className='d-flex flex-column justify-content-start'
                    style={{ gap: 20 }}
                  >
                    <div className='th-fw-600 text-center'>OBSERVED EMPLOYEE</div>
                    <div
                      className='pb-3'
                      style={{ maxHeight: '60vh', overflowY: 'auto' }}
                    >
                      {forms.map((form, index) => (
                        <Form ref={editFormRef.get(form.id)} key={form.id}>
                          <Card
                            className={`th-br-12 th-bg-grey mb-3`}
                            bodyStyle={{ padding: '8px' }}
                            ref={addFormRef}
                          >
                            <div className='row align-items-center justify-content-between mb-2'>
                              <span className='th-fw-600 pl-3'>
                                Observed Employee {index + 1}
                              </span>
                              {forms.length > 1 && (
                                <Popconfirm
                                  title='Sure to delete ?'
                                  open={open}
                                  onConfirm={() => {
                                    handleRemoveForm(form?.id);
                                  }}
                                  onCancel={() => setOpen(false)}
                                  overlayClassName='custom-popconfirm'
                                >
                                  <DeleteOutlineOutlined className='text-danger th-22 th-pointer mr-3' />
                                </Popconfirm>
                              )}
                            </div>
                            <div className='row'>
                              <div className='col-md-4 col-sm-6 '>
                                <Form.Item
                                  name={`edit_branch_${form.id}`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select branch!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select branch*'
                                    showSearch
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                    value={form.branch}
                                    onChange={(value, option) => {
                                      if (history?.location?.state?.record) {
                                        handleInputChange(
                                          form.id,
                                          'branch',
                                          option?.acad_sess,
                                          'prefill'
                                        );
                                      } else {
                                        handleInputChange(form.id, 'branch', value);
                                      }
                                    }}
                                  >
                                    {history?.location?.state?.record
                                      ? editBranchListOption
                                      : BranchListOptions}
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className='col-md-4 col-sm-6 '>
                                <Form.Item
                                  name={`edit_role_${form.id}`}
                                  rules={[
                                    { required: true, message: 'Please select level!' },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select user level*'
                                    showSearch
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                                    value={form.role}
                                    onChange={(value) => {
                                      handleInputChange(form.id, 'role', value);
                                    }}
                                  >
                                    {userLevelListOptions}
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className='col-md-4 col-sm-6 '>
                                <Form.Item
                                  name={`edit_name_${form.id}`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select user name!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    placeholder='User name*'
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
                                    onChange={(value) => {
                                      handleInputChange(form.id, 'name', value);
                                    }}
                                  >
                                    {form?.usernameListOptions?.map((user) => (
                                      <Select.Option key={user?.id} value={user?.id}>
                                        {user?.name}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className='col-md-12 col-sm-6'>
                                <Form.Item
                                  name={`edit_video_${form.id}`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please Provide Video Link',
                                    },
                                  ]}
                                >
                                  <Input
                                    className='w-100'
                                    allowClear={true}
                                    placeholder='Video link*'
                                    value={form.videoLink}
                                    onChange={(e) => {
                                      handleInputChange(
                                        form.id,
                                        'videoLink',
                                        e.target.value
                                      );
                                    }}
                                    required={true}
                                    autoComplete='off'
                                    maxLength={200}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </Card>
                        </Form>
                      ))}
                    </div>
                  </div>
                  {!history?.location?.state?.record && forms?.length < 25 ? (
                    <div className='d-flex flex-row-reverse w-90'>
                      <Button
                        className='th-br-6'
                        onClick={handleAddForm}
                        icon={<PlusOutlined />}
                        type='primary'
                      >
                        Add Observed Employee
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center mb-4 mt-4'>
          <div className='d-flex flex-row-reverse th-width-85'>
            <Button
              type='primary'
              className='th-br-6'
              onClick={() => {
                if (history?.location?.state?.record) {
                  handleEditSubmit();
                } else {
                  handleSubmitForm();
                }
              }}
            >
              {history?.location?.state?.record ? 'Update' : 'Submit'}
            </Button>
          </div>
        </div>
        {load && <Loader />}
        {error && (
          <div className='text-danger mt-2 d-flex justify-content-center th-fw-600'>
            {error}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default AddVideoObservation;
