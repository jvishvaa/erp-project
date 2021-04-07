/* eslint-disable no-nested-ternary */
import moment from 'moment';
import axios from '../../config/axios';

export const fetchAssesmentTypes = async () => {
  try {
    const response = await axios.get(`/assessment/exam-type-list/`);
    return response.data.result;
  } catch (e) {
    throw new Error(e);
  }
};

export const fetchTopics = async () => {
  try {
    const response = await axios.get(`/assessment/topic/`);
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
    console.log('entered');

    let url = '';
    if (fetchAll) {
      if (type === 'all') {
        url = `/assessment/tests/?all=1`;
      } else if (type === 'physical-test') {
        url = `/assessment/tests/?test_mode=2`;
      } else if (type === 'online-pattern') {
        url = `/assessment/tests/?test_mode=1`;
      }
    } else {
      const startDate = moment(date[0]).format('YYYY-MM-DD');
      const endDate = moment(date[1]).format('YYYY-MM-DD');
      if (type === 'all') {
        url = `/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&page=${page}&page_size=${pageSize}`;
      } else if (type === 'physical-test') {
        url = `/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&test_mode=2&page=${page}&page_size=${pageSize}`;
      } else if (type === 'online-pattern') {
        url = `/assessment/tests/?grade=${gradeId}&subject=${subjectIds}&test_type=${testTypeId}&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null
        }&start_date=${startDate}&end_date=${endDate}&test_mode=1&page=${page}&page_size=${pageSize}`;
      }
    }
    console.log('api called with ', url);
    const response = await axios.get(url);
    if (response.data.status_code === 200) {
      return { totalPages: response.data.total_pages, results: response.data.result };
    }
    throw new Error();
  } catch (e) {
    console.log('error in api', e);
    throw new Error();
  }
};

export const fetchAssesmentTestDetail = async (id) => {
  console.log('fetch test details');
  try {
    const response = await axios.get(`/assessment/tests/?test_id_in=${id}`);
    if (response.data.status_code === 200) {
      return { results: response.data.result[0] };
    }
    throw new Error();
  } catch (e) {
    throw new Error();
  }
};
