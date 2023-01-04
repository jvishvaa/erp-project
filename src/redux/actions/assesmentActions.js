/* eslint-disable no-nested-ternary */
import moment from 'moment';
// import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import axiosInstance from 'config/axios';

export const fetchAssesmentTypes = async () => {
  try {
    const response =
      // await axios.get(
      //   `${endpoints.baseURLCentral}/assessment/exam-type-list/`,
      //   {
      //     headers: { 'x-api-key': 'vikash@12345#1231' },
      //   }
      // );
      await axiosInstance.get(`${endpoints.assessmentErp.examTypeList}`);
    if (response.data) {
      return response?.data?.result;
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const fetchTopics = async () => {
  try {
    const response = await axios.get(`${endpoints.baseURLCentral}/assessment/topic/`);
    return response.data.result;
  } catch (e) {
    throw new Error();
  }
};

export const fetchAssesmentTests = async (
  fetchAll,
  type,
  acadSessionId,
  gradeId,
  subjectIds,
  testTypeId,
  statusId,
  date,
  page,
  pageSize,
  hasGroup,
  sectionMappingId,
  groupIds,
  sectionFlag,
  groupFlag
) => {
  try {
    let url = '';
    if (fetchAll) {
      if (type === 'all') {
        url = `${endpoints.assessmentErp.listAssessment}?all=1&is_delete=False`;
      } else if (type === 'physical-test') {
        url = `${endpoints.assessmentErp.listAssessment}?test_mode=2&is_delete=False`;
      } else if (type === 'online-pattern') {
        url = `${endpoints.assessmentErp.listAssessment}?test_mode=1&is_delete=False`;
      }else if(type === 'deleted'){
        url = `${endpoints.assessmentErp.listAssessment}?is_delete=True`;

      }
    } else {      
      url = `${ endpoints.assessmentErp.listAssessment
      }?academic_session=${acadSessionId}&grade=${gradeId}&subjects=${subjectIds}&page=${page}&page_size=${pageSize}
      &has_sub_group=${hasGroup ? true : false}`
      if(date){
        const startDate = moment(date[0]).format('YYYY-MM-DD');
        const endDate = moment(date[1]).format('YYYY-MM-DD');

        url += `&start_date=${startDate}&end_date=${endDate}`
      }
      if(testTypeId){
        url += `&test_type=${testTypeId}`
      }
      if(statusId){
        url +=  `&is_completed=${
          statusId === 1 ? 'False' : statusId === 2 ? 'True' : null}`
      }
      if(!hasGroup && sectionFlag){
        url += `&section_mappings=${sectionMappingId}`
      }
      if(hasGroup && groupFlag && groupIds){
        url += `&group=${groupIds?.value}`
      }
      if (type === 'physical-test') {
        url += `&test_mode=2&is_delete=False`

      } else if (type === 'online-pattern') {

        url += `&test_mode=1&is_delete=False`

      }else if(type === 'deleted'){
        url += '&is_delete=True'
      }else if(type === 'all'){
        url += '&is_delete=False'
      }
    }
    const response = await axiosInstance.get(url);
    if (response.data.status_code === 200) {
      return {
        totalPages: response.data.result.total_pages,
        results: response.data.result.results,
      };
    }
    throw new Error();
  } catch (e) {
    throw new Error();
  }
};

export const fetchAssesmentTestDetail = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${endpoints.assessmentErp.listAssessment}?test_id=${id}`
    );
    if (response.data.status_code === 200) {
      return { results: response.data.result };
    }
    throw new Error();
  } catch (e) {
    throw new Error();
  }
};

export const deleteAssessmentTest = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${endpoints.assessmentErp.deleteAssessmentTest}${id}/test/`
    );
    if (response.data.status_code === 200) {
      return response.data ;
    }
    // throw new Error();
  } 
  catch (e) {
     return e
  }
};
