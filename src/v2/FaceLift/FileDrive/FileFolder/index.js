import React, { useState, useEffect, useRef } from 'react';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import { message, Breadcrumb, Card } from 'antd';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FolderImage from 'v2/Assets/images/folder.png';

const FileFolder = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

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
    fetchFileCategory({
      branch_id: branchId,
      acad_session_id: selectedBranch?.id,
    });
  }, []);

  return (
    <Layout>
      <div className=''>
        <div className='row pt-3'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-grey th-16 th-pointer'>
                File Drive
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Folder List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12 mt-3'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row align-items-center mb-2'>
                <div className='col-md-12 th-18'>Folder List</div>
              </div>

              <div className='row mb-2'>
                {categoryData?.map((eachCategory) => {
                  return (
                    <div className='col-md-3 mb-3'>
                      <Card
                        className='th-file-upload-card text-center th-pointer'
                        style={{
                          borderRadius: '10px',
                        }}
                        onClick={() =>
                          history.push({
                            pathname: '/file-drive',
                            state: {
                              categoryId: eachCategory.id,
                              categoryName: eachCategory?.name,
                            },
                          })
                        }
                      >
                        <img height={'120px'} src={FolderImage} />
                        <div className='th-18'>{eachCategory?.name}</div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileFolder;
