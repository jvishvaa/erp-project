import axios from '../../../config/axios';
import qs from 'qs';
import endpoints from '../../../config/endpoints';

export const fetchVolumes = async () => {
  try {
    const response = await axios.get('/lesson_plan/list-volume/');
    return response.data.result.results;
  } catch (e) {
    throw new Error();
  }
};

export const fetchAcademicYears = async (moduleId) => {
  try {
    const response = await axios.get(
      `${endpoints.userManagement.academicYear}?module_id=${moduleId}`
    );
    return response.data.data;
  } catch (e) {
    return [];
  }
};

export const fetchBranches = async (acadId, moduleId) => {
  try {
    const response = await axios.get(
      `${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`
    );
    return response.data?.data?.results;
  } catch (e) {
    return [];
  }
};

export const fetchGrades = async (acadId, branchId, moduleId) => {
  try {
    const response = await axios.get(
      `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchId}&module_id=${moduleId}`
    );
    return response.data?.data;
  } catch (e) {
    return [];
  }
};

export const fetchSubjects = async (acadSessionId, mappingId) => {
  try {
    const response = await axios.get(
      `${endpoints.assessmentErp.subjectList}?session_year=${acadSessionId}&grade=${mappingId}`
    );
    return response.data?.result;
  } catch (e) {
    return [];
  }
};

// export const fetchSubjects = async (mappingId,branchId) => {
//   try {
//     const response = await axios.get(
//       `${endpoints.assessmentApis.gradesList}?gs_id=${mappingId}&branch=${branchId}`
//     );
//     return response.data?.result?.results;
//   } catch (e) {
//     return [];
//   }
// };

export const fetchChapters = async (gradeSubjectMappingId, volume, academicYear) => {
  try {
    const response = await axios.get(
      `/lesson_plan/chapter/?grade_subject_mapping=${gradeSubjectMappingId}&volume=${volume}&academic_year=${academicYear}`
    );
    return response.data.result;
  } catch (e) {
    return [];
  }
};
