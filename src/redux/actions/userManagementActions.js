import axios from '../../config/axios';

export const userManagementActions = {
  CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
  FETCH_USER_DETAIL_REQUEST: 'FETCH_USER_DETAIL_REQUEST',
  FETCH_USER_DETAIL_SUCCESS: 'FETCH_USER_DETAIL_SUCCESS',
  FETCH_USER_DETAIL_FAILURE: 'FETCH_USER_DETAIL_FAILURE',
  EDIT_USER_REQUEST: 'EDIT_USER_REQUEST',
  EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
  EDIT_USER_FAILURE: 'EDIT_USER_FAILURE',
};

const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_DETAIL_REQUEST,
  FETCH_USER_DETAIL_SUCCESS,
  FETCH_USER_DETAIL_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
} = userManagementActions;

export const fetchUsers = () => (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  return axios
    .get(`/communication/erp-user-info/?page=1&role=1`)
    .then((response) => {
      const transformedData = response.data.results.map((obj) => {
        const { user } = obj;
        const parent = obj.parent_details;
        let data = JSON.parse(JSON.stringify(obj));
        delete data.user;
        delete data.parent_details;
        data = { ...data, ...user, ...parent };
        return data;
      });
      dispatch({
        type: FETCH_USERS_SUCCESS,
        data: transformedData,
        current_page: response.data.current_page,
        total_pages: response.data.total_pages,
        count: response.data.count,
      });
    })
    .catch((error) => {
      dispatch({ type: FETCH_USERS_FAILURE });
    });
};

export const fetchUser = (id) => (dispatch) => {
  dispatch({ type: FETCH_USER_DETAIL_REQUEST });
  return axios
    .get(`/erp_user/user-data/?erp_user_id=${id}`)
    .then((response) => {
      const user = response.data.result;
      let gender;
      switch (user.gender) {
        case 'male':
          gender = 1;
          break;
        case 'female':
          gender = 2;
          break;
        case 'other':
          gender = 3;
          break;
        default:
          gender = 1;
          break;
      }

      const transformedUser = {
        id: user.id || '',
        erp_id: user.erp_id || '',
        first_name: user.user.first_name || '',
        middle_name: user.user_middle_name || '',
        last_name: user.user.last_name || '',
        email: user.user.email || '',
        username: user.user.username || '',
        user_level: user?.user?.user_level || '', 
        mapping_bgs:
          user?.mapping_bgs.map(mapping => ({ ...mapping, is_delete: false })) || [],

        academic_year: user?.mapping_bgs?.map(({ session_year: sessionYear = [] }) =>
          sessionYear.map(
            ({
              session_year = '',
              session_year_id = '',
              is_current_session = false,
            }) => ({
              id: session_year_id,
              session_year: session_year,
              is_default: is_current_session,
            })
          )
        ),
        branch: user?.mapping_bgs?.map(({ branch: branches = [] }) =>
          branches.map(({ branch_id = '', branch__branch_name = '' }) => ({
            id: branch_id,
            branch_name: branch__branch_name,
          }))
        ),
        grade: user?.mapping_bgs?.map(({ grade: grades = [] }) =>
          grades.map(
            ({
              id = '',
              grade_id = '',
              acad_session__branch_id = '',
              grade__grade_name = '',
            }) =>
              ({
                id: grade_id,
                branch_id: acad_session__branch_id,
                grade_name: grade__grade_name,
                item_id: id,
              } || [])
          )
        ),

        section: user?.mapping_bgs?.map(({ section: Sections = [] }) =>
          Sections.map(
            ({
              id = '',
              section_id = '',
              grade_id = '',
              acad_session__branch_id = '',
              section__section_name = '',
              section_mapping_id=''
            }) =>
              ({
                id: section_id,
                grade_id: grade_id, 
                branch_id: acad_session__branch_id, 
                section_name: section__section_name,
                item_id: section_mapping_id,
              } || [])
          )
        ),
        subjects: user?.mapping_bgs?.map(({ subjects = [] }) =>
          subjects.map(
            ({ id = '', subject_name = '', subject_mapping_id = '' }) =>
              ({
                id: id,
                item_id: subject_mapping_id,
                subject_name: subject_name,
              } || [])
          )
        ),
        contact: user?.contact || '',
        date_of_birth: user.date_of_birth,
        gender,
        profile: user.profile || '',
        address: user.address || '',
        parent: {
          id: user.parent_details.id,
          father_first_name: user.parent_details.father_first_name || '',
          father_last_name: user.parent_details.father_last_name || '',
          mother_first_name: user.parent_details.mother_first_name || '',
          mother_last_name: user.parent_details.mother_last_name || '',
          mother_middle_name: user.parent_details.mother_middle_name || '',
          father_middle_name: user.parent_details.father_middle_name || '',
          father_email: user.parent_details.father_email || '',
          mother_email: user.parent_details.mother_email || '',
          father_mobile: user.parent_details.father_mobile || '',
          mother_mobile: user.parent_details.mother_mobile || '',
          mother_photo: user.parent_details.mother_photo || '',
          father_photo: user.parent_details.father_photo || '',
          address: user.parent_details.address,
          guardian_first_name: user.parent_details.guardian_first_name || '',
          guardian_middle_name: user.parent_details.guardian_middle_name || '',
          guardian_last_name: user.parent_details.guardian_last_name || '',
          guardian_email: user.parent_details.guardian_email || '',
          guardian_mobile: user.parent_details.guardian_mobile || '',
          guardian_photo: user.parent_details.guardian_photo || '',
        },
      };
      dispatch({ type: FETCH_USER_DETAIL_SUCCESS, data: transformedUser });
    })

    .catch((e) => {
      dispatch({ type: FETCH_USER_DETAIL_FAILURE });
    });
};

export const createUser = (params) => (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });

  return axios
    .post('/erp_user/add_user/', params)
    .then(() => {
      dispatch({ type: CREATE_USER_SUCCESS });
    })
    .catch((error) => {
      dispatch({ type: CREATE_USER_FAILURE });
      throw error;
    });
};

export const editUser = (params) => (dispatch) => {
  dispatch({ type: EDIT_USER_REQUEST });
  return axios
    .put('/erp_user/update-user/', params)
    .then(() => {
      dispatch({ type: EDIT_USER_SUCCESS });
    })
    .catch((error) => {
      dispatch({ type: EDIT_USER_FAILURE });
      throw error;
    });
};

export const fetchBranchesForCreateUser = (acadId, moduleId) => {

  return axios
    .get(`/erp_user/branch/?session_year=${acadId}&module_id=${moduleId}`)
    .then((response) => {
      if (response.data.status_code === 200){
        return response?.data?.data?.results.map((obj) => {
          let tempArr = obj?.branch
          tempArr['acadId']=obj?.id
          return tempArr;
         });
      }
      else {
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchAcademicYears = (moduleId) => {
  let url = '/erp_user/list-academic_year/';
  if (moduleId) url += `?module_id=${moduleId}`;
  return axios
    .get(url)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {});
};

export const fetchSubjects = () => {
  return axios
    .get('/erp_user/subject/')
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {});
};

export const fetchMappedSections = (moduleId, grades) => {
  const gradeMappingIds =
    grades && grades.length > 0 ? grades.map((grade) => grade?.id).join(',') : '';
  return axios
    .get(
      `/erp_user/mapped-sections-list/?module_id=${moduleId}&grade_mapped_list=${gradeMappingIds}`
    )
    .then((response) => {
      if (response.data.status_code === 200) {
        return response.data?.result || [];
      }
      return [];
    })
    .catch(() => {});
};

export const fetchMappedSubjects = (moduleId, sections) => {
  const sectionMappingIds =
    sections && sections.length > 0
      ? sections.map((section) => section?.id).join(',')
      : '';
  return axios
    .get(
      `/erp_user/mapped-subjects-list/?module_id=${moduleId}&section_mapping=${sectionMappingIds}`
    )
    .then((response) => {
      if (response.data.status_code === 200) {
        return response.data.result;
      }
      return [];
    })
    .catch(() => {});
};
