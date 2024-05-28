import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import SchoolWallConfigOn from './SchollWallConfigOn';
import BlogWall from 'containers/newBlog/BlogWall';
import axios from 'v2/config/axios';

const SchoolWall = () => {
  const [loading, setLoading] = useState(true);
  const [showNewSchollWall, setShowNewSchollWall] = useState(true);

  const fetchSchollWallConfig = (params = {}) => {
    setLoading(true);
    axios
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result[0] === 'True') {
            setShowNewSchollWall(true);
          }
        } else {
          setShowNewSchollWall(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchSchollWallConfig({ config_key: 'social_media_feed_enabled' });
  }, []);

  return (
    <Layout>
      <Spin spinning={loading} style={{ padding: 80 }} size='medium'>
        {loading ? null : showNewSchollWall ? <SchoolWallConfigOn /> : <BlogWall />}
      </Spin>
    </Layout>
  );
};

export default SchoolWall;
