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
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
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
        // erp_user: user.erp_user || '',
        // branch_code:user.branch_code || '',
        academic_year: user.academic_year && {
          id: user.academic_year.id,
          session_year: user.academic_year.session_year,
        },
        branch:
          user.mapping_bgs[0].branch &&
          user.mapping_bgs[0].branch.length > 0 &&
          user.mapping_bgs[0].branch.map((branch) => ({
            id: branch.branch_id,
            branch_name: branch.branch__branch_name,
            branch_code: branch.branch_code,
          }))[0],
        grade:
          user.mapping_bgs[0].grade &&
          user.mapping_bgs[0].grade.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          })),
        section:
          user.mapping_bgs[0].section &&
          user.mapping_bgs[0].section.map((section) => ({
            id: section.section_id,
            section_name: section.section__section_name,
          })),
        subjects: user.subjects.map((subject) => ({
          id: subject.id,
          subject_name: subject.subject_name,
        })),
        contact: user.contact || '',
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
        },
      };
      dispatch({ type: FETCH_USER_DETAIL_SUCCESS, data: transformedUser });

      console.log('user detail ', response);
    })
    .catch(() => {
      dispatch({ type: FETCH_USER_DETAIL_FAILURE });
    });
};

export const createUser = (params) => (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  // console.log(
  //   'before stringifying ',
  //   params,
  //   'after stringifying ',
  //   qs.stringify(params)
  // );
  return axios
    .post('/erp_user/add_user/', params)
    .then(() => {
      dispatch({ type: CREATE_USER_SUCCESS });
    })
    .catch((error) => {
      console.log(error);
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
      console.log(error);
      dispatch({ type: EDIT_USER_FAILURE });
      throw error;
    });
};

export const fetchBranchesForCreateUser = (acadId) => {
  return axios
    .get(`/erp_user/list-all-branch/session_year=${acadId}`)
    .then((response) => {
      if (response.data.status_code === 200) return response?.data?.data;
      else console.log('','xyzxyz');
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchAcademicYears = () => {
  return axios
    .get('/erp_user/list-academic_year/')
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
