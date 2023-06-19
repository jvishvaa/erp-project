import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosInstance from 'v2/config/axios';
import CreateUser from '../CreateUser';
import V1CreateUser from '../../../../../containers/user-management/create-user';
import V1EditUser from '../../../../../containers/user-management/edit-user';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import CreateUserTab from '../CreateUserTab';
const CreateUserConfig = ({ match, history }) => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch
  );
  useEffect(() => {
    fetchUserConfig({
      config_key: 'create-user',
    });
  }, []);
  const fetchUserConfig = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((response) => {
        if (response.data.status_code === 200) {
          setConfig(response.data?.result);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa'
      ? true
      : false;
  console.log(selectedBranch?.id?.toString(), 'selectedBranch');
  return (
    <React.Fragment>
      {loading ? (
        <Layout>
          <div
            className='w-100'
            style={{
              display: 'grid',
              placeItems: 'center',
              height: '100vh',
            }}
          >
            <Spin tip='Loading..' size='large' className='th-primary' />
          </div>
        </Layout>
      ) : config?.includes(selectedBranch?.id?.toString()) && isOrchids ? (
        window.location.pathname.includes('edit') ? (
          <Layout>
            <CreateUser />
          </Layout>
        ) : (
          <CreateUserTab />
        )
      ) : (
        <div className='user-management-container'>
          {window.location.pathname.includes('edit') ? (
            <V1EditUser match={match} history={history} />
          ) : (
            <V1CreateUser match={match} history={history} />
          )}
        </div>
      )}
    </React.Fragment>
  );
};
// config?.includes(selectedBranch?.id?.toString()) &&
export default CreateUserConfig;
