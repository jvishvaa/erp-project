import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { Breadcrumb, Select, message } from 'antd';
import { useSelector } from 'react-redux';
import TimeTableNewView from './TimeTableNewView';
const { Option } = Select;

const TeacherTimeTable = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [gradeID, setGradeID] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [sectionID, setSectionID] = useState();
  const [sectionList, setSectionList] = useState([]);

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.sec_name}
      </Option>
    );
  });

  const fetchGradeData = (params = {}) => {
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeList(result?.data?.data);
        } else {
          setGradeList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setSectionList(result?.data?.data);
        } else {
          setSectionList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleGrade = (e, value) => {
    setGradeID();
    setSectionList([]);
    setSectionID();
    if (e) {
      setGradeID(e);
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: e,
      });
    }
  };
  const handleSection = (e) => {
    if (e) {
      setSectionID(e);
    } else {
      setSectionID();
    }
  };
  useEffect(() => {
    fetchGradeData({
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
    });
  }, []);
  return (
    <div>
      <React.Fragment>
        <Layout>
          <div className='row py-3 px-2'>
            <div className='col-md-9' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className='row px-3'>
            <div className='col-12 th-bg-white'>
              <div className='row'>
                <div className='col-md-3 py-2'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={handleGrade}
                    placeholder='Grade *'
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={gradeID}
                  >
                    {gradeOptions}
                  </Select>
                </div>
                <div className='col-md-3 py-2'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => handleSection(e)}
                    placeholder='Section *'
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={sectionID}
                  >
                    {sectionOptions}
                  </Select>
                </div>
              </div>

              <div className='mt-3 px-2'>
                <TimeTableNewView />
              </div>
            </div>
          </div>
        </Layout>
      </React.Fragment>
    </div>
  );
};

export default TeacherTimeTable;
