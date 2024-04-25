import React, { useState, useRef , useEffect} from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs , message } from 'antd';
import CentralizedHomework from './index';
import HwUpload from './hw_upload/hwUpload';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Loader from '../../components/loader/loader';

const { TabPane } = Tabs;

const CenralizedHomeworkRoute = () => {
  const history = useHistory()
  const [showTab, setShowTab] = useState(history?.location?.state?.key || 1);
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const [isAuditor, setIsAuditor] = useState();
  const [loading, setLoading] = useState(true);

  const onChange = (key) => {
    setShowTab(key);
  };

  useEffect(() => {
    checkEvaluator();
  }, []);

  const checkEvaluator = async (params = {}) => {
    setLoading(true);
    await axiosInstance
      .get(`${endpoints.centralizedHomework.checkEvaluator}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setIsAuditor(!res?.data?.result?.is_evaluator);
          if(res?.data?.result?.is_evaluator == true){
            history.push('/homework/centralized-reports')
          } else {
            history.push('/homework/centralized-home')
          }
        } else {
          message.error(res?.data?.message);
        }
        console.log({ res });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
         {loading ? <Loader /> : null}
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default CenralizedHomeworkRoute;
