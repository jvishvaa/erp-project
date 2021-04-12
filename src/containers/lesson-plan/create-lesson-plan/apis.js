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
    const response = await axios.get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`);
    return response.data.data;
  } catch (e) {
    return [];
  }
};

export const fetchBranches = async (acadId,moduleId) => {
  try {
    const response = await axios.get(`${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`);
    return response.data?.data?.results;
  } catch (e) {
    return [];
  }
};

export const fetchGrades = async (branchId) => {
  try {
    const response = await axios.get(
      `${endpoints.assessmentApis.gradesList}?branch=${branchId}`
    );
    return response.data?.result?.results;
  } catch (e) {
    return [];
  }
};

export const fetchSubjects = async (mappingId,branchId) => {
  try {
    const response = await axios.get(
      `${endpoints.assessmentApis.gradesList}?gs_id=${mappingId}&branch=${branchId}`
    );
    return response.data?.result?.results;
  } catch (e) {
    return [];
  }
};

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

export const uploadLessonPlanFile = async (reqData) => {
  try {
    console.log('success in Api');
    const response = await axios.post(`/lesson_plan/files/`, reqData);

    return response.data.result;
  } catch (e) {
    console.log('error in Api');
    throw new Error();
  }
};

export const deleteLessonPlanFile = async (reqData) => {
  try {
    const response = await axios.delete(`/lesson_plan/delete-files/`, reqData);

    return response.data.data;
  } catch (e) {
    throw new Error();
  }
};

export const createLessonPlan = async (reqObj) => {
  try {
    const response = await axios.post('/lesson_plan/lesson/', reqObj);

    return response.data;
  } catch (e) {
    throw new Error();
  }
};

export const createLessonOverview = async (reqObj) => {
  try {
    const response = await axios.post('/lesson_plan/create-lesson-overview/', reqObj);

    return response.data;
  } catch (e) {
    throw new Error();
  }
};

export const getAttachments = async (chapter, period) => {
  try {
    const response = await axios.get(
      `/lesson_plan/lesson/?chapter=${chapter}&period=${period}`
    );

    return response.data.result;
  } catch (e) {
    throw new Error();
  }
};
