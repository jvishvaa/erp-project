/* eslint-disable no-nested-ternary */
import moment from 'moment';
// import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';

export const fetchAssesmentTypes = async () => {
  try {
    const response = await axios.get(
      `${endpoints.baseURLCentral}/assessment/exam-type-list/`,
      {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      }
    );
    return response.data.result;
  } catch (e) {
    throw new Error(e);
  }
};

export const fetchTopics = async () => {
  try {
    const response = await axios.get(`${endpoints.baseURLCentral}/assessment/topic/`, {
      headers: { 'x-api-key': 'vikash@12345#1231' },
    });
    return response.data.result;
  } catch (e) {
    throw new Error();
  }
};

export const fetchAssesmentTests = async (
  fetchAll,
  type,
  gradeId,
  subjectIds,
  testTypeId,
  statusId,
  date,
  page,
  pageSize
) => {
  try {
    let url = '';
    if (fetchAll) {
      if (type === 'all') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?all=1`;
      } else if (type === 'physical-test') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?test_mode=2`;
      } else if (type === 'online-pattern') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?test_mode=1`;
      }
    } else {
      const startDate = moment(date[0]).format('YYYY-MM-DD');
      const endDate = moment(date[1]).format('YYYY-MM-DD');
      if (type === 'all') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&page=${page}&page_size=${pageSize}`;
      } else if (type === 'physical-test') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&test_mode=2&page=${page}&page_size=${pageSize}`;
      } else if (type === 'online-pattern') {
        url = `${endpoints.baseURLCentral}/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&test_mode=1&page=${page}&page_size=${pageSize}`;
      }
    }
    const response = await axios.get(url, {
      headers: { 'x-api-key': 'vikash@12345#1231' },
    });
    if (response.data.status_code === 200) {
      return { totalPages: response.data.total_pages, results: response.data.result };
    }
    throw new Error();
  } catch (e) {
    throw new Error();
  }
};

export const fetchAssesmentTestDetail = async (id) => {
  try {
    const response = await axios.get(
      `${endpoints.baseURLCentral}/assessment/tests/?test_id_in=${id}`,
      {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      }
    );
    if (response.data.status_code === 200) {
      return { results: response.data.result[0] };
    }
    throw new Error();
  } catch (e) {
    throw new Error();
  }
};
