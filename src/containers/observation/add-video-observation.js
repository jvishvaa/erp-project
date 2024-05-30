import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from 'antd';
import Layout from 'containers/Layout';
import React, { createRef, useEffect, useState } from 'react';
import { AccessKey } from '../../v2/cvboxAccesskey';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import endpoints from 'config/endpoints';
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
  const editFormRef = createRef();

  const [branch, setBranch] = useState(null);
  const [userName, setUserName] = useState(
    history?.location?.state?.record?.assigned_obs
      ? history?.location?.state?.record?.assigned_obs
      : null
  );
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

  const handleAddForm = () => {
    if (forms.length >= 25) {
      setError('You cannot add more than 25 observers.');
      message.error('You cannot add more than 25 observers.');
      return;
    }
    setForms([
      ...forms,
      {
        id: forms.length + 1,
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
    if (id === 1) {
      return;
    }
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleInputChange = (id, field, value, prefill) => {
    if (value) {
      setForms((prevForms) =>
        prevForms.map((form) => {
          if (form.id === id) {
            let updatedForm = { ...form, [field]: value };
            if (field === 'branch') {
              const parsedValue = JSON.parse(value);
              if (!prefill) {
                updatedForm = {
                  ...updatedForm,
                  branch: parsedValue.branch_id,
                  acad_session: parsedValue.acad_session,
                };
              }
            }
            if (field === 'branch' || field === 'role') {
              editFormRef.current.setFieldsValue({
                [`edit_name_${id}`]: null,
              });
              updatedForm.name = null;
              updatedForm.usernameListOptions = [];
              handleBranchOrRoleChange(id, field, value);
            }

            if (!updatedForm.branch && !updatedForm.role) {
              editFormRef.current.setFieldsValue({
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

  const handleBranchOrRoleChange = (id, field, value) => {
    const form = forms.find((form) => form.id === id);

    const newBranch = field === 'branch' ? JSON.parse(value).branch_id : form.branch;
    const newRole = field === 'role' ? value : form.role;
    if (newBranch || newRole) {
      fetchEditUserName(newBranch, newRole)
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
      setFormFields([
        ...formFields,
        {
          id: formFields.length + 1,
          branch: null,
          role: null,
          user_name: null,
          userNameList: [],
        },
      ]);
    } else {
      message.error('You Cannot Add More Than 3 Observers');
    }
  };

  const removeFormField = (index) => {
    const fields = [...formFields];
    fields.splice(index, 1);
    setFormFields(fields);
  };

  console.log(formFields, 'hello');

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
      } else if (field === 'role') {
        fields[index]['role'] = value;

        fields[index].userNameList = [];
        fields[index].user_name = null;
        setFormFields(fields);
        formRef.current.setFieldsValue({
          [`user_name_${fields[index].id}`]: null,
        });

        fetchUserName(fields[index].branch, value, index);
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
        setFormFields(fields);
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
        message.error(`Observer ${i + 1}: Role is required.`);
        return;
      }
      if (!field.user_name || field.user_name.length === 0) {
        message.error(`Observer ${i + 1}: User Name is required.`);
        return;
      }
    }

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.videoLink) {
        message.error(`Form ${i + 1}: Video Link is required.`);
        return;
      }
      if (!form.branch) {
        message.error(`Form ${i + 1}: Branch is required.`);
        return;
      }
      if (!form.role) {
        message.error(`Form ${i + 1}: Role is required.`);
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
        message.error(`Observer ${i + 1}: Role is required.`);
        return;
      }
      if (!field.user_name || field.user_name.length === 0) {
        message.error(`Observer ${i + 1}: User Name is required.`);
        return;
      }
    }

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.videoLink) {
        message.error(`Form ${i + 1}: Video Link is required.`);
        return;
      }
      if (!form.branch) {
        message.error(`Form ${i + 1}: Branch is required.`);
        return;
      }
      if (!form.role) {
        message.error(`Form ${i + 1}: Role is required.`);
        return;
      }
      if (!form.name) {
        message.error(`Form ${i + 1}: Name is required.`);
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
  return (
    <div>
      <Layout>
        <div className='row pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
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

        <div className='d-flex justify-content-center px-3' style={{ gap: '20px' }}>
          <div
            className='row th-br-15 th-bg-white py-3 align-items-between'
            style={{ maxHeight: '79vh' }}
          >
            <div className='col-md-12'>
              <div className='d-flex flex-column'>
              <div className='th-fw-600 text-center'>OBSERVER</div>
              <Form ref={formRef}>
                {formFields.map((field, index) => (
                  <Card className='mb-3 th-br-12' bodyStyle={{ padding: '16px' }}>
                    {/* <div
                    key={field.id}
                    className='th-bg-white th-br-5 py-3 shadow-sm th-hl-30'
                  > */}
                    <div class='d-flex justify-content-between'>
                      <p class='th-fw-600 mx-3'>Observer {index + 1}</p>
                      {index > 0 && (
                        <Popconfirm
                          title='Delete?'
                          open={open}
                          onConfirm={() => removeFormField(index)}
                          onCancel={() => setOpen(false)}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          overlayClassName='custom-popconfirm'
                        >
                          <Tooltip title='Delete' placement='top'>
                            <DeleteOutlineOutlined
                              className='text-danger th-fw-22 cursor-pointer mx-3'
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
                    </div>
                    <div className='row'>
                      <div className='col-md-4 col-sm-6 col-12'>
                        <span className='th-grey th-14'>Branch*</span>
                        <Form.Item
                          name={`branch_${field.id}`}
                          rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                          <Select
                            allowClear
                            placeholder='Select Branch'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            className='w-100 text-left th-black-1 th-bg-white th-br-4'
                            getPopupContainer={(trigger) => trigger.parentNode}
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
                        <span className='th-grey th-14'>Role*</span>
                        <Form.Item
                          name={`role_${field.id}`}
                          rules={[{ required: true, message: 'Please select a role!' }]}
                        >
                          <Select
                            allowClear
                            placeholder='Select User Role'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            className='w-100 text-left th-black-1 th-bg-white th-br-4'
                            getPopupContainer={(trigger) => trigger.parentNode}
                            onChange={(value) => handleFieldChange(value, index, 'role')}
                          >
                            {userLevelListOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='col-md-4 col-sm-6 col-12'>
                        <span className='th-grey th-14'>User Name</span>
                        <Form.Item
                          name={`user_name_${field.id}`}
                          rules={[
                            { required: true, message: 'Please select a user name!' },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder='Select User Name'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                              option?.children
                                ?.toLowerCase()
                                ?.indexOf(input?.toLowerCase()) >= 0
                            }
                            className='w-100 text-left th-black-1 th-bg-white th-br-4'
                            getPopupContainer={(trigger) => trigger.parentNode}
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
            </div>
            {!history?.location?.state?.record && formFields.length < 3 ? (
              <div className='col-md-12 text-center'>
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
          <div
            className='row th-br-15 tp-2'
            style={{
              maxHeight: '79vh',
              overflow: 'auto',
              height: 'fit-content',
            }}
          >
            <div className='th-bg-white col-md-12'>
              <p className='th-fw-600 text-center mt-2'>OBSERVED EMPLOYEE</p>
              {forms.map((form, index) => (
                <Form ref={editFormRef} key={form.id}>
                  <div className='th-bg-white th-br-5 py-3 shadow-sm mb-4'>
                    <div className='d-flex justify-content-center'>
                      <div className='d-flex justify-content-between th-width-98'>
                        <p className='th-fw-600 mx-2'>Observed Employee {index + 1}</p>
                        {forms.length > 1 && index > 0 && (
                          <Tooltip title='Delete' placement='top'>
                            <Popconfirm
                              title='Delete?'
                              open={open}
                              onConfirm={() => {
                                handleRemoveForm(form?.id);
                              }}
                              onCancel={() => setOpen(false)}
                              getPopupContainer={(trigger) => trigger.parentNode}
                              overlayClassName='custom-popconfirm'
                            >
                              <DeleteOutlineOutlined
                                className='text-danger fs-5 cursor-pointer mx-2'
                                style={{
                                  fontSize: 20,
                                  margin: 10,
                                  cursor: 'pointer',
                                  color: '#FF0000',
                                }}
                              />
                            </Popconfirm>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12 col-sm-6 col-12'>
                        <span className='th-grey th-14'>Video Link*</span>
                        <Form.Item
                          name={`edit_video_${form.id}`}
                          rules={[
                            { required: true, message: 'Please Provide Video Link' },
                          ]}
                        >
                          <Input
                            className='w-100'
                            allowClear={true}
                            placeholder='Video Link'
                            value={form.videoLink}
                            onChange={(e) =>
                              handleInputChange(form.id, 'videoLink', e.target.value)
                            }
                            required={true}
                            autoComplete='off'
                            maxLength={200}
                          />
                        </Form.Item>
                      </div>
                      <div className='col-md-4 col-sm-6 col-12'>
                        <span className='th-grey th-14'>Branch*</span>
                        <Form.Item
                          name={`edit_branch_${form.id}`}
                          rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                          <Select
                            allowClear
                            placeholder='Select Branch'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                              option.children.toLowerCase().includes(input.toLowerCase())
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
                      <div className='col-md-4 col-sm-6 col-12'>
                        <span className='th-grey th-14'>Role*</span>
                        <Form.Item
                          name={`edit_role_${form.id}`}
                          rules={[{ required: true, message: 'Please select a Role!' }]}
                        >
                          <Select
                            allowClear
                            placeholder='Select User Role'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                              option.children.toLowerCase().includes(input.toLowerCase())
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
                      <div className='col-md-4 col-sm-6 col-12'>
                        <span className='th-grey th-14'>Name*</span>
                        <Form.Item
                          name={`edit_name_${form.id}`}
                          rules={[{ required: true, message: 'Please select a Name!' }]}
                        >
                          <Select
                            allowClear
                            placeholder='Select User Name'
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
                            getPopupContainer={(trigger) => trigger.parentNode}
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
                    </div>
                  </div>
                </Form>
              ))}
              {!history?.location?.state?.record && forms?.length < 25 ? (
                <Button
                  className='mx-auto d-block mb-2'
                  onClick={handleAddForm}
                  icon={<PlusOutlined />}
                  type='secondary'
                >
                  Add Observed Employee
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className='d-flex justify-content-center mb-4 mt-4'>
          {history?.location?.state?.record ? (
            <Button type='primary' onClick={() => handleEditSubmit()}>
              Submit
            </Button>
          ) : (
            <div className='d-flex justify-content-center w-100 mb-4 mt-3'>
              <Button type='primary' onClick={handleSubmitForm}>
                Submit
              </Button>
            </div>
          )}
        </div>
        {load && <Loader />}
        {error && (
          <div className='text-danger mt-4 mb-4 d-flex justify-content-center th-fw-600'>
            {error}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default AddVideoObservation;
