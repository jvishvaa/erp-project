import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';

function createParams(params) {
  return `?${Object.entries(params)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
}

export const getBranch = async (module_id, session_year) => {
  if (!module_id || !session_year) return;
  const params = createParams({ module_id, session_year });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.academics.branches}${params}`
    );
    return data?.data?.results || [];
  } catch (e) {
    return [];
  }
};

export const getGrade = async (module_id, session_year, branch_id) => {
  if (!module_id || !session_year || !branch_id) return;
  const params = createParams({ module_id, session_year, branch_id });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.academics.grades}${params}`
    );
    return data?.data || [];
  } catch (e) {
    return [];
  }
};

export const getSubject = async (module_id, session_year, branch, grade) => {
  if (!module_id || !session_year || !branch || !grade) return;
  const params = createParams({ module_id, session_year, branch, grade });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.mappingStudentGrade.subjects}${params}`
    );
    return data?.result || [];
  } catch (e) {
    return [];
  }
};

export const getPersonalityTraits = async () => {
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.reportCard.personalityTraits}`
    );
    return data?.data || [];
  } catch (e) {
    return [];
  }
};

export const getSection = async (module_id, session_year, branch_id, grade_id) => {
  if (!module_id || !session_year || !branch_id || !grade_id) return;
  const params = createParams({ module_id, session_year, branch_id, grade_id });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.academics.sections}${params}`
    );
    return data?.data || [];
  } catch (e) {
    return [];
  }
};

export const getCategory = async () => {
  try {
    const { data = {} } = await axiosInstance.get(`${endpoints.reportCard.listCategory}`);
    return data;
  } catch (e) {
    return [];
  }
};

export const getAssessmentType = async () => {
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.assessmentErp.examTypeList}`
    );
    return data?.result || [];
  } catch (e) {
    return [];
  }
};

export const getAssessment = async (academic_session, grade, subjects, test_type) => {
  // if (!academic_session && !grade && !subjects && !test_type) return;
  const params = createParams({
    academic_session: 1,
    grade: 2,
    subjects: 6,
    test_type: 1,
    is_completed: true,
    page: 1,
    page_size: 0,
  });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.assessmentErp.listAssessment}${params}`
    );
    return data?.result?.results || [];
  } catch (e) {
    return [];
  }
};

export const createAssessmentMarkMapping = async (payload) => {
  try {
    const { data = {} } = await axiosInstance.post(
      endpoints.reportCard.createAssessmentMarkMapping,
      payload
    );
    return data;
  } catch (e) {
    return [];
  }
};

export const createCategoryAssessmentMapping = async (payload) => {
  try {
    const { data = {} } = await axiosInstance.post(
      endpoints.reportCard.categoryAssessmentMapping,
      payload
    );
    return data;
  } catch (e) {
    return [];
  }
};

export const marksUpload = async (payload) => {
  try {
    const { data = {} } = await axiosInstance.post(
      endpoints.reportCard.marksUpload,
      payload
    );
    return data || {};
  } catch (error) {
    const { response = {} } = error || {};
    const { data = {} } = response || {};
    return data;
  }
};

export const getReportCardPipeline = async (page, page_size) => {
  if (!page || !page_size) return;
  const params = createParams({ page, page_size });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.reportCard.getReportCardPipelineList}${params}`
    );
    return data || [];
  } catch (e) {
    return [];
  }
};

export const getReportCardStatus = async (page, page_size) => {
  if (!page || !page_size) return;
  const params = createParams({ page, page_size });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.reportCard.getReportCardStatusList}${params}`
    );
    return data || [];
  } catch (e) {
    return [];
  }
};

export const updateReportCardStatus = async (payload) => {
  try {
    const { data = {} } = await axiosInstance.put(
      endpoints.reportCard.updateReportCardStatus,
      payload
    );
    return data || [];
  } catch (e) {
    return [];
  }
};
