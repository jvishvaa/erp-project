import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Spin,
  Steps,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import './index.css';
import FamilyInformation from './FamilyInformation';
import SchoolInformation from './SchoolInformation';
import StudentInformation from './StudentInformationForm';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import endpointsV1 from 'config/endpoints';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
import moment from 'moment/moment';
import { useHistory, useParams } from 'react-router-dom';
import AcademicYearList from './AcademicYearList';
import ChangePasswordPopup from './../../../ChangePassword/changePasswordModal';
const { Step } = Steps;
const CreateUser = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignation] = useState([]);
  // const [moduleId, setModuleId] = useState('');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSubjectsId, setSelectedSubjectsId] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedAcadId, setSelectedAcadId] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [schoolFormValues, setSchoolFormValues] = useState(null);
  const [studentFormValues, setStudentFormValues] = useState(null);
  const [familyFormValues, setFamilyFormValues] = useState(null);
  const [singleParent, setSingleParent] = useState(false);
  const [guardian, setGuardian] = useState('father');
  const [branchCode, setBranchCode] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [multipleAcademicYear, setMultipleAcademicYear] = useState([]);
  const [sectionMappingId, setSectionMappingId] = useState([]);
  const [userLevel, setUserLevel] = useState(null);
  const [parent, setParent] = useState(null);
  const [fatherPrimary, setFatherPrimary] = useState(false);
  const [motherPrimary, setMotherPrimary] = useState(false);
  const [guardianPrimary, setGuardianPrimary] = useState(false);
  const [fatherPrimaryEmail, setFatherPrimaryEmail] = useState(false);
  const [motherPrimaryEmail, setMotherPrimaryEmail] = useState(false);
  const [guardianPrimaryEmail, setGuardianPrimaryEmail] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roleConfig, setRoleConfig] = useState([]);
  const [roleBasedUiConfig, setRoleBasedUiConfig] = useState(null);
  const [userLevelForEdit, setUserLevelForEdit] = useState(null);
  const [rolesList, setRolesList] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [maxSubjectSelection, setMaxSubjectSelection] = useState(null);
  const [editSessionYear, setEditSessionYear] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [endProgress, setEndProgress] = useState(false);
  const [siblings, setSiblings] = useState([
    {
      id: Math.random(),
      name: '',
      gender: '',
      age: 0,
      grade_name: '',
      school_name: '',
      is_delete: false,
      is_edit: false,
    },
  ]);
  const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
  const [isPasswordCanceled, setIsPasswordCanceled] = useState(false);
  const [strengthProgress, setStrengthProgress] = useState('');
  const history = useHistory();
  const params = useParams();
  const passwordFormRef = useRef();

  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  useEffect(() => {
    let NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    // let module = '';
    // if (NavData && NavData.length) {
    //   NavData.forEach((item) => {
    //     if (
    //       item.parent_modules === 'User Management' &&
    //       item.child_module &&
    //       item.child_module.length > 0
    //     ) {
    //       item.child_module.forEach((item) => {
    //         if (item.child_name === 'Create User') {
    //           setModuleId(item.child_id);
    //           module = item.child_id;
    //         }
    //       });
    //     }
    //   });
    // }

    fetchRoleConfig({
      config_key: 'subject_limit',
    });
    getRoleApi();
    if (!params?.id) {
      fetchBranches({
        // module_id: module,
        session_year: selectedYear?.id,
      });
    }
  }, []);
  useEffect(() => {
    fetchRoleBasedUiConfig({ config_key: 'usrmgmt_admin_access' });
    getRoles();
    console.log(params, 'params');
    // if (moduleId) {
    if (params?.id) {
      setEditId(params?.id);
      // fetchUserData({
      //   erp_user_id: params?.id,
      // });
      // fetchUserLevel(params?.id);
    }
    // }
  }, []);
  useEffect(() => {
    // if (userLevelForEdit && params?.id && roleBasedUiConfig) {
    // if (userLevelForEdit && params?.id) {
    //   if (roleBasedUiConfig?.includes(userLevelForEdit?.toString())) {
    //     fetchUserDataOwner(params?.id);
    //   } else {
    //     fetchUserData({
    //       erp_user_id: params?.id,
    //     });
    //   }
    // }
    if (params?.id) {
      fetchUserData({
        erp_user_id: params?.id,
      });
    }
  }, [params]);

  const getRoles = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpointsV1.communication.roles}`)
      .then((response) => {
        if (response.data.status_code === 200) {
          setRolesList(response.data.result);
          console.log(response.data.result, 'response');
        } else {
          message.error('Something went wrong!');
        }
        // setUserLevelForEdit(response?.data?.level);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUserDataOwner = (userId) => {
    setLoading(true);
    axiosInstance
      .get(`${endpointsV1.userManagement.staffUser}${userId}`)
      .then((response) => {
        let data = response.data.result;
        let converted = Object.keys(data.mapping_bgs)?.map((key) => {
          return {
            branch: data.mapping_bgs[key].branches?.map((item) => {
              let branch_obj = { ...item, branch__branch_name: item.branch_name };
              delete branch_obj.branch_name;
              return branch_obj;
            }),
            grade: data.mapping_bgs[key].grades?.map((item) => {
              let grade_obj = { ...item, grade__grade_name: item.grade_name };
              delete grade_obj.grade_name;
              return grade_obj;
            }),
            session_year: [data.mapping_bgs[key].session_year_data],
            subjects: data.mapping_bgs[key].subjects?.map((item) => {
              let subject_obj = { ...item, id: item.subject_id };
              return subject_obj;
            }),
          };
        });
        data = { ...data, mapping_bgs: converted };
        modifyUserData(data);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUserLevel = (userId) => {
    if (userId) {
      axiosInstance
        .get(`${endpointsV1.userManagement.getUserLevel}${userId}`)
        .then((response) => {
          console.log(response);
          setUserLevelForEdit(response?.data?.level);
        })
        .catch((error) => {
          message.error(error?.response?.data?.message ?? 'Something went wrong!');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const fetchRoleConfig = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((response) => {
        if (response.data.status_code === 200) {
          setRoleConfig(
            response.data?.result?.length > 1 ? JSON.parse(response.data?.result[1]) : []
          );
          setMaxSubjectSelection(Number(response.data?.result[0]) ?? null);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchRoleBasedUiConfig = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((response) => {
        if (response.data.status_code === 200) {
          console.log(response.data.result);
          setRoleBasedUiConfig(response.data?.result);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchUserData = (parameters = {}) => {
    setLoading(true);
    axiosInstance
      .get(`/erp_user/user-data/`, { params: { ...parameters } })
      .then((response) => {
        modifyUserData(response.data.result);
        // const user = response.data.result;
        // let multipleYears = user?.mapping_bgs?.slice(0, -1) ?? [];
        // let modifiedMultipleYears = [];
        // for (let i = 0; i < multipleYears?.length; i++) {
        //   let obj = {
        //     id: Math.random(),
        //     academic_year: multipleYears[i]?.session_year?.flatMap(
        //       (e) => e.session_year_id
        //     )[0],
        //     branch: multipleYears[i]?.branch?.flatMap((e) => e.branch_id),
        //     grade: multipleYears[i]?.grade?.flatMap((e) => e.grade__grade_name),
        //     editGrade: multipleYears[i]?.grade?.flatMap((e) => e.grade_id),
        //     section: multipleYears[i]?.section?.flatMap((e) => e.section_mapping_id),
        //     editSection: multipleYears[i]?.section?.flatMap((e) => e.section_id),
        //     subjects: multipleYears[i]?.subjects?.flatMap((e) => e.subject_mapping_id),
        //     subjectsId: multipleYears[i]?.subjects?.flatMap((e) => e.id),
        //     isEdit: true,
        //   };
        //   modifiedMultipleYears.push(obj);
        // }
        // setMultipleAcademicYear([...modifiedMultipleYears]);
        // let gender;
        // switch (user.gender) {
        //   case 'male':
        //     gender = 1;
        //     break;
        //   case 'female':
        //     gender = 2;
        //     break;
        //   case 'other':
        //     gender = 3;
        //     break;
        //   default:
        //     gender = 1;
        //     break;
        // }

        // setUserLevel(user?.user_level);
        // let parentSelected = [];
        // if (user?.user_level !== 13) {
        //   let parentDetails = user?.parent_details;
        //   if (parentDetails?.father_first_name && !parentDetails?.guardian_first_name) {
        //     setParent(['parent']);
        //     parentSelected = ['parent'];
        //   } else if (
        //     !parentDetails?.father_first_name &&
        //     parentDetails?.guardian_first_name
        //   ) {
        //     setParent(['guardian']);
        //     parentSelected = ['guardian'];
        //   } else if (
        //     parentDetails?.father_first_name &&
        //     parentDetails?.guardian_first_name
        //   ) {
        //     setParent(['guardian', 'parent']);
        //     parentSelected = ['guardian', 'parent'];
        //   } else {
        //     setParent([]);
        //   }
        // }

        // let transformedUser = {
        //   id: user?.id || '',
        //   erp_id: user?.erp_id || '',
        //   first_name: user?.user?.first_name || '',
        //   middle_name: user?.user_middle_name || '',
        //   last_name: user?.user?.last_name || '',
        //   email: user?.user?.email || '',
        //   username: user?.user?.username || '',
        //   user_level: user?.user?.user_level_int || '',
        //   birth_place: user?.birth_place,
        //   medical_info: user?.medical_info,
        //   special_needs: user?.special_needs,
        //   single_parent: user?.single_parent,
        //   old_school_name: user?.old_school_name,
        //   mapping_bgs:
        //     user?.mapping_bgs?.map((mapping) => ({ ...mapping, is_delete: false })) || [],

        //   academic_year: user?.mapping_bgs?.map(({ session_year: sessionYear = [] }) =>
        //     sessionYear.map(
        //       ({
        //         session_year = '',
        //         session_year_id = '',
        //         is_current_session = false,
        //       }) => ({
        //         id: session_year_id,
        //         session_year: session_year,
        //         is_default: is_current_session,
        //       })
        //     )
        //   ),
        //   branch: user?.mapping_bgs?.map(({ branch: branches = [] }) =>
        //     branches.map(({ branch_id = '', branch__branch_name = '' }) => ({
        //       id: branch_id,
        //       branch_name: branch__branch_name,
        //     }))
        //   ),
        //   grade: user?.mapping_bgs?.map(({ grade: grades = [] }) =>
        //     grades.map(
        //       ({
        //         id = '',
        //         grade_id = '',
        //         acad_session__branch_id = '',
        //         grade__grade_name = '',
        //       }) =>
        //         ({
        //           id: grade_id,
        //           branch_id: acad_session__branch_id,
        //           grade_name: grade__grade_name,
        //           item_id: id,
        //         } || [])
        //     )
        //   ),

        //   section: user?.mapping_bgs?.map(({ section: Sections = [] }) =>
        //     Sections.map(
        //       ({
        //         id = '',
        //         section_id = '',
        //         grade_id = '',
        //         acad_session__branch_id = '',
        //         section__section_name = '',
        //         section_mapping_id = '',
        //       }) =>
        //         ({
        //           id: section_id,
        //           grade_id: grade_id,
        //           branch_id: acad_session__branch_id,
        //           section_name: section__section_name,
        //           item_id: section_mapping_id,
        //         } || [])
        //     )
        //   ),
        //   subjects: user?.mapping_bgs?.map(({ subjects = [] }) =>
        //     subjects.map(
        //       ({ id = '', subject_name = '', subject_mapping_id = '' }) =>
        //         ({
        //           id: id,
        //           item_id: subject_mapping_id,
        //           subject_name: subject_name,
        //         } || [])
        //     )
        //   ),
        //   contact: user?.contact || '',
        //   date_of_birth: user?.date_of_birth,
        //   gender,
        //   profile: user?.profile || '',
        //   address: user?.address || '',
        //   parent: {
        //     id: user.parent_details?.id,
        //     father_first_name: user?.parent_details?.father_first_name || '',
        //     father_last_name: user?.parent_details?.father_last_name || '',
        //     mother_first_name: user?.parent_details?.mother_first_name || '',
        //     mother_last_name: user?.parent_details?.mother_last_name || '',
        //     mother_middle_name: user?.parent_details?.mother_middle_name || '',
        //     father_middle_name: user?.parent_details?.father_middle_name || '',
        //     father_email: user?.parent_details?.father_email || '',
        //     mother_email: user?.parent_details?.mother_email || '',
        //     father_mobile: user?.parent_details?.father_mobile?.split('-')[1] || '',
        //     father_mobile_code:
        //       user?.parent_details?.father_mobile?.split('-')[0] || '+91',
        //     mother_mobile: user?.parent_details?.mother_mobile?.split('-')[1] || '',
        //     mother_mobile_code:
        //       user?.parent_details?.mother_mobile?.split('-')[0] || '+91',
        //     mother_photo: user?.parent_details?.mother_photo || '',
        //     father_photo: user?.parent_details?.father_photo || '',
        //     father_qualification: user?.parent_details?.father_qualification || '',
        //     father_aadhaar: user?.parent_details?.father_aadhaar || '',
        //     father_age: user?.parent_details?.father_age || '',
        //     father_occupation: user?.parent_details?.father_occupation || '',
        //     mother_qualification: user?.parent_details?.mother_qualification || '',
        //     mother_aadhaar: user?.parent_details?.mother_aadhaar || '',
        //     mother_age: user?.parent_details?.mother_age || '',
        //     mother_occupation: user?.parent_details?.mother_occupation || '',
        //     guardian_qualification: user?.parent_details?.guardian_qualification || '',
        //     guardian_aadhaar: user?.parent_details?.guardian_aadhaar || '',
        //     guardian_age: user?.parent_details?.guardian_age || '',
        //     guardian_occupation: user?.parent_details?.guardian_occupation || '',
        //     address: user?.parent_details?.address,
        //     pin_code: user?.parent_details?.pin_code,
        //     email: user?.parent_details?.email,
        //     contact: user?.contact?.split('-')[1] || '',
        //     contact_code: user?.contact?.split('-')[0] || '',
        //     guardian_first_name: user?.parent_details?.guardian_first_name || '',
        //     guardian_middle_name: user?.parent_details?.guardian_middle_name || '',
        //     guardian_last_name: user?.parent_details?.guardian_last_name || '',
        //     guardian_email: user?.parent_details?.guardian_email || '',
        //     guardian_mobile: user?.parent_details?.guardian_mobile?.split('-')[1] || '',
        //     guardian_mobile_code:
        //       user?.parent_details?.guardian_mobile?.split('-')[0] || '+91',
        //     guardian_photo: user?.parent_details?.guardian_photo || '',
        //     single: parentSelected,
        //     aadhaar: user?.aadhaar,
        //   },
        //   user_level: user?.user_level,
        //   designation: user?.designation,
        //   siblings: user?.siblings,
        // };
        // setParentId(user.parent_details?.id);
        // if (
        //   user?.parent_details?.email === null ||
        //   user?.parent_details?.email === undefined ||
        //   user?.parent_details?.email === ''
        // ) {
        //   setFatherPrimaryEmail(false);
        //   setMotherPrimaryEmail(false);
        //   setGuardianPrimaryEmail(false);
        // } else if (user?.parent_details?.email === user?.parent_details?.father_email) {
        //   setFatherPrimaryEmail(true);
        //   setMotherPrimaryEmail(false);
        //   setGuardianPrimaryEmail(false);
        // } else if (user?.parent_details?.email === user?.parent_details?.mother_email) {
        //   setFatherPrimaryEmail(false);
        //   setMotherPrimaryEmail(true);
        //   setGuardianPrimaryEmail(false);
        // } else if (user?.parent_details?.email === user?.parent_details?.guardian_email) {
        //   setFatherPrimaryEmail(false);
        //   setMotherPrimaryEmail(false);
        //   setGuardianPrimaryEmail(true);
        // } else {
        //   setFatherPrimaryEmail(false);
        //   setMotherPrimaryEmail(false);
        //   setGuardianPrimaryEmail(false);
        // }
        // if (
        //   user?.contact === null ||
        //   user?.contact === undefined ||
        //   user?.contact === ''
        // ) {
        //   setFatherPrimaryEmail(false);
        //   setMotherPrimaryEmail(false);
        //   setGuardianPrimaryEmail(false);
        // } else if (user?.contact === user?.parent_details?.father_mobile) {
        //   setFatherPrimary(true);
        //   setMotherPrimary(false);
        //   setGuardianPrimary(false);
        // } else if (user?.contact === user?.parent_details?.mother_mobile) {
        //   setFatherPrimary(false);
        //   setMotherPrimary(true);
        //   setGuardianPrimary(false);
        // } else if (user?.contact === user?.parent_details?.guardian_mobile) {
        //   setFatherPrimary(false);
        //   setMotherPrimary(false);
        //   setGuardianPrimary(true);
        // } else {
        //   setFatherPrimary(false);
        //   setMotherPrimary(false);
        //   setGuardianPrimary(false);
        // }
        // setUserDetails(transformedUser);
        // var transformedSchoolDetails = transformedUser;
        // var gradeObj = transformedSchoolDetails?.grade?.pop();
        // var sectionObj = transformedSchoolDetails?.section?.pop();
        // var subjectObj = transformedSchoolDetails?.subjects?.pop();
        // var academicYearObj = transformedSchoolDetails?.academic_year?.pop();
        // var schoolDetails = {
        //   user_level: transformedSchoolDetails?.user_level,
        //   designation: transformedSchoolDetails?.designation?.id,
        //   academic_year: academicYearObj[0]?.session_year,
        //   branch: transformedUser?.branch?.pop()?.map((e) => e.id),
        //   grade: gradeObj?.map((e) => e.grade_name),
        //   section: sectionObj?.map((e) => e.section_name),
        //   subjects: subjectObj?.map((e) => e.item_id),
        // };
        // let editYear = academicYearObj[0]?.id;
        // setEditSessionYear(editYear);
        // setSectionMappingId(sectionObj?.map((e) => e?.item_id));
        // var studentInformation = {
        //   first_name: transformedUser?.first_name,
        //   middle_name: transformedUser?.middle_name,
        //   last_name: transformedUser?.last_name,
        //   gender: transformedUser?.gender,
        //   date_of_birth: moment(transformedUser?.date_of_birth),
        //   age: moment().diff(moment(transformedUser?.date_of_birth), 'years'),
        //   birth_place: transformedUser?.birth_place,
        //   medical_info: transformedUser?.medical_info,
        //   special_needs: transformedUser?.special_needs,
        //   single: transformedUser?.single_parent ? true : false,
        //   single_parent:
        //     transformedUser?.single_parent === 1
        //       ? 'mother'
        //       : transformedUser?.single_parent === 2
        //       ? 'father'
        //       : transformedUser?.single_parent === 3
        //       ? 'guardian'
        //       : null,
        //   profile_photo: transformedUser?.profile,
        //   old_school_name: transformedUser?.old_school_name,
        //   username: user?.user?.username,
        // };
        // setGuardian(studentInformation?.single_parent);
        // setSelectedSubjects(subjectObj?.map((e) => e?.item_id));
        // setSelectedSubjectsId(subjectObj?.map((e) => e?.id));
        // setSingleParent(transformedUser?.single_parent ? true : false);
        // fetchDesignation({ user_level: schoolDetails?.user_level });
        // fetchBranches({
        //   // module_id: moduleId,
        //   session_year: editYear,
        // });
        // fetchGrades(schoolDetails?.branch, null, editYear);
        // fetchSections(
        //   gradeObj?.map((e) => e.id),
        //   null,
        //   schoolDetails?.branch,
        //   editYear
        // );
        // fetchSubjects(
        //   sectionObj?.map((e) => e.id),
        //   schoolDetails?.branch,
        //   gradeObj?.map((e) => e.id),
        //   editYear
        // );
        // setSchoolFormValues(schoolDetails);
        // setStudentFormValues(studentInformation);
        // setFamilyFormValues(transformedUser?.parent);
        // let userSibling = transformedUser?.siblings ?? [];
        // for (let i = 0; i < userSibling?.length; i++) {
        //   userSibling[i].is_edit = true;
        // }
        // setSiblings(
        //   userSibling?.length > 0
        //     ? userSibling
        //     : [
        //         {
        //           id: Math.random(),
        //           name: '',
        //           gender: '',
        //           age: 0,
        //           grade_name: '',
        //           school_name: '',
        //           is_delete: false,
        //         },
        //       ]
        // );
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const modifyUserData = (response) => {
    console.log(response, 'modifyUserData');
    setLoading(true);
    const user = response;
    let multipleYears = user?.mapping_bgs?.slice(0, -1) ?? [];
    let modifiedMultipleYears = [];
    for (let i = 0; i < multipleYears?.length; i++) {
      let obj = {
        id: Math.random(),
        academic_year: multipleYears[i]?.session_year?.flatMap(
          (e) => e.session_year_id
        )[0],
        branch: multipleYears[i]?.branch?.flatMap((e) => e.branch_id),
        acadId: multipleYears[i]?.branch?.flatMap((e) => e.acad_id),
        grade: multipleYears[i]?.grade?.flatMap((e) => e.grade__grade_name),
        editGrade: multipleYears[i]?.grade?.flatMap((e) => e.grade_id),
        section: multipleYears[i]?.section?.flatMap((e) => e.section_mapping_id),
        editSection: multipleYears[i]?.section?.flatMap((e) => e.section_id),
        subjects: multipleYears[i]?.subjects?.flatMap((e) => e.subject_mapping_id),
        subjectsId: multipleYears[i]?.subjects?.flatMap((e) => e.id),
        ...(roleBasedUiConfig?.includes(userLevelForEdit?.toString())
          ? {
              academicYearObj: multipleYears[i]?.session_year?.map((each) => {
                return {
                  id: each?.session_year_id,
                  session_year: each?.session_year,
                  is_default: each?.is_current_session,
                };
              }),
              branchObj: multipleYears[i]?.branch?.map((each) => {
                return {
                  id: each?.branch_id,
                  branch_name: each?.branch__branch_name,
                  acadId: each?.acad_id,
                };
              }),
              gradeObj: multipleYears[i]?.grade?.map((each) => {
                return {
                  id: each?.grade_id,
                  // branch_id: acad_session__branch_id,
                  grade_name: each?.grade__grade_name,
                  item_id: each?.grade_id,
                };
              }),
              subjectsObj: multipleYears[i]?.subjects?.map((each) => {
                return {
                  id: each?.id,
                  item_id: each?.subject_id || each?.id,
                  subject_name: each?.subject_name,
                };
              }),
              isEdit: true,
            }
          : {}),
      };
      modifiedMultipleYears.push(obj);
    }
    setMultipleAcademicYear([...modifiedMultipleYears]);
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

    setUserLevel(user?.user_level);
    let parentSelected = [];
    if (user?.user_level !== 13) {
      let parentDetails = user?.parent_details;
      if (parentDetails?.father_first_name && !parentDetails?.guardian_first_name) {
        setParent(['parent']);
        parentSelected = ['parent'];
      } else if (
        !parentDetails?.father_first_name &&
        parentDetails?.guardian_first_name
      ) {
        setParent(['guardian']);
        parentSelected = ['guardian'];
      } else if (parentDetails?.father_first_name && parentDetails?.guardian_first_name) {
        setParent(['guardian', 'parent']);
        parentSelected = ['guardian', 'parent'];
      } else {
        setParent([]);
      }
    }

    let transformedUser = {
      id: user?.id || '',
      erp_id: user?.erp_id || '',
      first_name: user?.user?.first_name || '',
      middle_name: user?.user_middle_name || '',
      last_name: user?.user?.last_name || '',
      email: user?.user?.email || '',
      username: user?.user?.username || '',
      user_level: user?.user?.user_level_int || '',
      birth_place: user?.birth_place,
      medical_info: user?.medical_info,
      special_needs: user?.special_needs,
      single_parent: user?.single_parent,
      old_school_name: user?.old_school_name,
      mapping_bgs:
        user?.mapping_bgs?.map((mapping) => ({ ...mapping, is_delete: false })) || [],

      academic_year: user?.mapping_bgs?.map(({ session_year: sessionYear = [] }) =>
        sessionYear.map(
          ({ session_year = '', session_year_id = '', is_current_session = false }) => ({
            id: session_year_id,
            session_year: session_year,
            is_default: is_current_session,
          })
        )
      ),
      branch: user?.mapping_bgs?.map(({ branch: branches = [] }) =>
        branches.map(({ branch_id = '', branch__branch_name = '', acad_id = '' }) => ({
          id: branch_id,
          branch_name: branch__branch_name,
          acadId: acad_id,
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
            section_mapping_id = '',
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
              item_id: subject_mapping_id || id,
              subject_name: subject_name,
            } || [])
        )
      ),
      contact: user?.contact || '',
      date_of_birth: user?.date_of_birth,
      gender,
      profile: user?.profile || '',
      address: user?.address || '',
      pin_code: user?.pin_code || '',
      parent: {
        id: user.parent_details?.id,
        father_first_name: user?.parent_details?.father_first_name || '',
        father_last_name: user?.parent_details?.father_last_name || '',
        mother_first_name: user?.parent_details?.mother_first_name || '',
        mother_last_name: user?.parent_details?.mother_last_name || '',
        mother_middle_name: user?.parent_details?.mother_middle_name || '',
        father_middle_name: user?.parent_details?.father_middle_name || '',
        father_email: user?.parent_details?.father_email || '',
        mother_email: user?.parent_details?.mother_email || '',
        father_mobile: user?.parent_details?.father_mobile?.split('-')[1] || '',
        father_mobile_code: user?.parent_details?.father_mobile?.split('-')[0] || '+91',
        mother_mobile: user?.parent_details?.mother_mobile?.split('-')[1] || '',
        mother_mobile_code: user?.parent_details?.mother_mobile?.split('-')[0] || '+91',
        mother_photo: user?.parent_details?.mother_photo || '',
        father_photo: user?.parent_details?.father_photo || '',
        father_qualification: user?.parent_details?.father_qualification || '',
        father_aadhaar: user?.parent_details?.father_aadhaar || '',
        father_age: user?.parent_details?.father_age || '',
        father_occupation: user?.parent_details?.father_occupation || '',
        mother_qualification: user?.parent_details?.mother_qualification || '',
        mother_aadhaar: user?.parent_details?.mother_aadhaar || '',
        mother_age: user?.parent_details?.mother_age || '',
        mother_occupation: user?.parent_details?.mother_occupation || '',
        guardian_qualification: user?.parent_details?.guardian_qualification || '',
        guardian_aadhaar: user?.parent_details?.guardian_aadhaar || '',
        guardian_age: user?.parent_details?.guardian_age || '',
        guardian_occupation: user?.parent_details?.guardian_occupation || '',
        address: user?.parent_details?.address || user?.address,
        pin_code: user?.parent_details?.pin_code || user?.pin_code,
        email: user?.parent_details?.email || user?.user?.email,
        contact: user?.contact?.split('-')[1] || '',
        contact_code: user?.contact?.split('-')[0] || '',
        guardian_first_name: user?.parent_details?.guardian_first_name || '',
        guardian_middle_name: user?.parent_details?.guardian_middle_name || '',
        guardian_last_name: user?.parent_details?.guardian_last_name || '',
        guardian_email: user?.parent_details?.guardian_email || '',
        guardian_mobile: user?.parent_details?.guardian_mobile?.split('-')[1] || '',
        guardian_mobile_code:
          user?.parent_details?.guardian_mobile?.split('-')[0] || '+91',
        guardian_photo: user?.parent_details?.guardian_photo || '',
        single: parentSelected,
        aadhaar: user?.aadhaar,
      },
      user_level: user?.user_level,
      role: user?.role,
      designation: user?.designation,
      siblings: user?.siblings,
    };
    setParentId(user.parent_details?.id);
    if (
      user?.parent_details?.email === null ||
      user?.parent_details?.email === undefined ||
      user?.parent_details?.email === ''
    ) {
      setFatherPrimaryEmail(false);
      setMotherPrimaryEmail(false);
      setGuardianPrimaryEmail(false);
    } else if (user?.parent_details?.email === user?.parent_details?.father_email) {
      setFatherPrimaryEmail(true);
      setMotherPrimaryEmail(false);
      setGuardianPrimaryEmail(false);
    } else if (user?.parent_details?.email === user?.parent_details?.mother_email) {
      setFatherPrimaryEmail(false);
      setMotherPrimaryEmail(true);
      setGuardianPrimaryEmail(false);
    } else if (user?.parent_details?.email === user?.parent_details?.guardian_email) {
      setFatherPrimaryEmail(false);
      setMotherPrimaryEmail(false);
      setGuardianPrimaryEmail(true);
    } else {
      setFatherPrimaryEmail(false);
      setMotherPrimaryEmail(false);
      setGuardianPrimaryEmail(false);
    }
    if (user?.contact === null || user?.contact === undefined || user?.contact === '') {
      setFatherPrimaryEmail(false);
      setMotherPrimaryEmail(false);
      setGuardianPrimaryEmail(false);
    } else if (user?.contact === user?.parent_details?.father_mobile) {
      setFatherPrimary(true);
      setMotherPrimary(false);
      setGuardianPrimary(false);
    } else if (user?.contact === user?.parent_details?.mother_mobile) {
      setFatherPrimary(false);
      setMotherPrimary(true);
      setGuardianPrimary(false);
    } else if (user?.contact === user?.parent_details?.guardian_mobile) {
      setFatherPrimary(false);
      setMotherPrimary(false);
      setGuardianPrimary(true);
    } else {
      setFatherPrimary(false);
      setMotherPrimary(false);
      setGuardianPrimary(false);
    }
    setUserDetails(transformedUser);
    let transformedSchoolDetails = transformedUser;
    var gradeObj = transformedSchoolDetails?.grade?.pop();
    var sectionObj = transformedSchoolDetails?.section?.pop();
    var subjectObj = transformedSchoolDetails?.subjects?.pop();
    var academicYearObj = transformedSchoolDetails?.academic_year?.pop();
    const poppedBranch = transformedUser?.branch?.pop();
    var schoolDetails = {
      user_level: transformedSchoolDetails?.user_level,
      designation: transformedSchoolDetails?.designation?.id,
      role: transformedSchoolDetails?.role?.id,
      academic_year: academicYearObj[0]?.session_year,
      branch: poppedBranch?.map((e) => e.id),
      branchAcadId: poppedBranch?.map((e) => e.acadId),
      grade: gradeObj?.map((e) => e.grade_name),
      section: sectionObj?.map((e) => e.section_name),
      subjects: subjectObj?.map((e) => e.item_id),
    };
    let editYear = academicYearObj[0]?.id;
    setEditSessionYear(editYear);
    setSectionMappingId(sectionObj?.map((e) => e?.item_id));
    var studentInformation = {
      first_name: transformedUser?.first_name,
      middle_name: transformedUser?.middle_name,
      last_name: transformedUser?.last_name,
      gender: transformedUser?.gender,
      date_of_birth: moment(transformedUser?.date_of_birth),
      age: moment().diff(moment(transformedUser?.date_of_birth), 'years'),
      birth_place: transformedUser?.birth_place,
      medical_info: transformedUser?.medical_info,
      special_needs: transformedUser?.special_needs,
      single: transformedUser?.single_parent ? true : false,
      single_parent:
        transformedUser?.single_parent === 1
          ? 'mother'
          : transformedUser?.single_parent === 2
          ? 'father'
          : transformedUser?.single_parent === 3
          ? 'guardian'
          : null,
      profile_photo: transformedUser?.profile,
      old_school_name: transformedUser?.old_school_name,
      username: user?.user?.username,
    };
    setGuardian(studentInformation?.single_parent);
    setSelectedSubjects(subjectObj?.map((e) => e?.item_id));
    setSelectedSubjectsId(subjectObj?.map((e) => e?.id));
    setSingleParent(transformedUser?.single_parent ? true : false);
    fetchDesignation({ user_level: schoolDetails?.user_level });
    fetchBranches({
      // module_id: moduleId,
      session_year: editYear,
    });
    if (roleBasedUiConfig?.includes(userLevelForEdit?.toString())) {
      fetchGrades(
        schoolDetails?.branch,
        null,
        editYear,
        schoolDetails?.branchAcadId,
        userLevelForEdit?.toString()
      );
      fetchSubjects(
        gradeObj?.map((e) => e.id),
        null,
        null,
        editYear,
        userLevelForEdit?.toString(),
        schoolDetails?.branchAcadId
      );
    } else {
      fetchGrades(schoolDetails?.branch, null, editYear);
      fetchSections(
        gradeObj?.map((e) => e.id),
        null,
        schoolDetails?.branch,
        editYear
      );
      fetchSubjects(
        sectionObj?.map((e) => e.id),
        schoolDetails?.branch,
        gradeObj?.map((e) => e.id),
        editYear
      );
    }
    setSchoolFormValues(schoolDetails);
    setStudentFormValues(studentInformation);
    setFamilyFormValues(transformedUser?.parent);
    let userSibling = transformedUser?.siblings ?? [];
    for (let i = 0; i < userSibling?.length; i++) {
      userSibling[i].is_edit = true;
    }
    setSiblings(
      userSibling?.length > 0
        ? userSibling
        : [
            {
              id: Math.random(),
              name: '',
              gender: '',
              age: 0,
              grade_name: '',
              school_name: '',
              is_delete: false,
            },
          ]
    );
    setLoading(false);
  };

  const getRoleApi = () => {
    axios
      .get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        setRoles([...res?.data?.result]);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message ?? 'Something went wrong!');
      });
  };

  const fetchDesignation = (params = {}) => {
    axios
      .get(`${endpoints.userManagement.userDesignation}`, {
        params: { ...params },
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        setDesignation(res?.data?.result);
      })
      .catch((err) => {
        message.error(err?.response?.data?.message ?? 'Something went wrong!');
      });
  };

  const fetchBranches = (params = {}) => {
    if (selectedYear) {
      axiosInstance
        .get(`${endpoints.academics.branches}`, { params: { ...params } })
        .then((response) => {
          if (response.data.status_code === 200) {
            var data = response?.data?.data?.results.map((obj) => {
              let tempArr = obj?.branch;
              tempArr['acadId'] = obj?.id;
              return tempArr;
            });
            const transformedData = data?.map((obj) => ({
              id: obj.id,
              branch_name: obj.branch_name,
              branch_code: obj.branch_code,
              acadId: obj.acadId,
            }));
            // if (transformedData?.length > 1) {
            //   transformedData.unshift({
            //     id: 'all',
            //     branch_name: 'Select All',
            //     branch_code: 'all',
            //   });
            // }
            setBranches([...transformedData]);
          } else {
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  const fetchGrades = (branches, branch_code, editYear, acadId, user_level) => {
    if (branches?.length > 0) {
      console.log(roleBasedUiConfig, schoolFormValues, 'schoolFormValues');
      setSelectedBranch(branches);
      setSelectedAcadId(acadId);
      if (roleBasedUiConfig?.includes(user_level)) {
        console.log(branches, 'branches selected');
        setLoading(true);
        axiosInstance
          .get(`${endpointsV1.userManagement.gradeList}`, {
            params: { acad_session: acadId.join(',') },
          })
          .then((response) => {
            if (response.data.status_code === 200) {
              const transformedData = response.data.result?.map((obj) => ({
                // item_id: grade?.id,
                id: obj?.grade_id,
                grade_name: obj?.grade__grade_name,
                // branch_id: grade?.acad_session__branch_id,
              }));
              setGrades([...transformedData]);
            }
          })
          .catch((error) => {
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }
      setBranchCode(branch_code);
      axiosInstance
        // .get(
        //   `${endpoints.academics.grades}?session_year=${
        //     params?.id ? editYear : selectedYear?.id
        //   }&branch_id=${branches?.toString()}&module_id=${moduleId}`
        // )
        .get(
          `${endpoints.academics.grades}?session_year=${
            params?.id ? editYear : selectedYear?.id
          }&branch_id=${branches?.toString()}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((grade) => ({
                  item_id: grade?.id,
                  id: grade?.grade_id,
                  grade_name: grade?.grade__grade_name,
                  branch_id: grade?.acad_session__branch_id,
                }))
              : [];
            if (transformedData?.length > 0) {
              //   transformedData.unshift({
              //     item_id: 'all',
              //     id: 'all',
              //     grade_name: 'Select All',
              //     branch_id: '',
              //   });
              // }
              setGrades([...transformedData]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setGrades([]);
    }
  };

  const fetchSections = (grades, grade_id, editBranch, editYear) => {
    if (grades?.length > 0) {
      setSelectedGrade(grades);
      axiosInstance
        // .get(
        //   `${endpoints.academics.sections}?session_year=${
        //     params?.id ? editYear : selectedYear?.id
        //   }&branch_id=${
        //     editBranch ? editBranch?.toString() : selectedBranch?.toString()
        //   }&grade_id=${grades?.toString()}&module_id=${moduleId}`
        // )
        .get(
          `${endpoints.academics.sections}?session_year=${
            params?.id ? editYear : selectedYear?.id
          }&branch_id=${
            editBranch ? editBranch?.toString() : selectedBranch?.toString()
          }&grade_id=${grades?.toString()}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((section) => ({
                  item_id: section.id,
                  id: section.section_id,
                  section_name: `${section.section__section_name}`,
                  branch_id: section?.branch_id,
                  grade_id: section?.grade_id,
                }))
              : [];
            if (transformedData?.length > 1) {
              //   transformedData.unshift({
              //     item_id: 'all',
              //     id: 'all',
              //     grade_name: 'Select All',
              //     branch_id: '',
              //   });
              // }
              setSections([...transformedData]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSections([]);
    }
  };

  const fetchSubjects = (
    sections,
    editBranch,
    editGrade,
    editYear,
    userLevel,
    acadId
  ) => {
    if (sections?.length > 0) {
      if (roleBasedUiConfig?.includes(userLevel)) {
        setSelectedGrade(sections);
      } else {
        setSelectedSections(sections);
      }
      let newEditGrade = [...new Set(editGrade)];
      let newsec = [...new Set(sections)];
      if (roleBasedUiConfig?.includes(userLevel)) {
        setSelectedGrade(sections);
      }
      let params1 = {
        ...(roleBasedUiConfig?.includes(userLevel)
          ? {
              // acad_session: selectedYear?.id,
              acad_session: acadId
                ? acadId?.join(',')
                : branches
                    ?.filter((each) => selectedBranch?.includes(each?.id))
                    ?.map((each) => each?.acadId)
                    ?.join(','),
              grades: sections?.join(','),
            }
          : {
              session_year: params?.id ? editYear : selectedYear?.id,
              branch: editBranch ? editBranch?.join(',') : selectedBranch?.join(','),
              grade: editGrade ? newEditGrade?.join(',') : selectedGrade?.join(','),
              section: sections?.join(','),
            }),
      };
      axiosInstance
        .get(
          `${
            roleBasedUiConfig?.includes(userLevel)
              ? endpointsV1.userManagement.subjectList
              : endpoints.academics.subjects
          }`,
          { params: params1 }
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((obj) => ({
                  id: obj.subject__id,
                  item_id: obj.id,
                  subject_name: obj.subject__subject_name,
                }))
              : response?.data?.result
              ? response?.data?.result.map((obj) => ({
                  id: obj.subject_id,
                  item_id: obj.subject_id,
                  subject_name: obj.subject__subject_name,
                }))
              : [];
            if (transformedData?.length > 0) {
              setSubjects([...transformedData]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSubjects([]);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = (formValues) => {
    setLoading(true);
    setEndProgress(true);
    let familyValues = {};
    familyValues = formValues;
    // if (userLevel === 13) {
    //   familyValues = familyFormValues;
    // } else {
    //   familyValues = formValues;
    // }
    const formData = new FormData();
    //SCHOOL INFORMATION

    //SCHOOL INFORMATION
    formData.append('user_level', schoolFormValues?.user_level);
    if (schoolFormValues?.designation)
      formData.append('designation', schoolFormValues?.designation);
    if (schoolFormValues?.role) {
      formData.append('role_id', schoolFormValues?.role);
    }
    // STUDENT INFO
    formData.append('first_name', studentFormValues?.first_name ?? '');
    formData.append('middle_name', studentFormValues?.middle_name ?? '');
    formData.append('last_name', studentFormValues?.last_name ?? '');
    formData.append('gender', studentFormValues?.gender ?? '');
    formData.append(
      'date_of_birth',
      moment(studentFormValues?.date_of_birth).format('YYYY-MM-DD') ?? ''
    );
    formData.append('age', studentFormValues?.age ?? '');
    formData.append('birth_place', studentFormValues?.birth_place ?? '');
    formData.append('old_school_name', studentFormValues?.old_school_name ?? '');
    formData.append('special_needs', studentFormValues?.special_needs ?? '');
    formData.append('medical_info', studentFormValues?.medical_info ?? '');
    formData.append('aadhaar', familyValues?.aadhaar ?? '');
    formData.append('username', studentFormValues?.username ?? '');
    if (userLevel === 13 && studentFormValues?.single_parent)
      formData.append(
        'single_parent',
        studentFormValues?.single_parent
          ? studentFormValues?.single_parent === 'father'
            ? 2
            : studentFormValues?.single_parent === 'mother'
            ? 1
            : 3
          : null
      );
    let email = '';
    if (userLevel === 13) {
      email = fatherPrimaryEmail
        ? familyValues?.father_email
        : motherPrimaryEmail
        ? familyValues?.mother_email
        : familyValues?.guardian_email;
    } else {
      email = familyValues?.email ?? '';
    }
    formData.append('email', email ?? '');
    let contact = '';
    if (userLevel === 13) {
      if (fatherPrimary || motherPrimary || guardianPrimary) {
        contact = fatherPrimary
          ? (familyValues?.father_mobile_code ?? '+91') +
            '-' +
            familyValues?.father_mobile
          : motherPrimary
          ? (familyValues?.mother_mobile_code ?? '+91') +
            '-' +
            familyValues?.mother_mobile
          : (familyValues?.guardian_mobile_code ?? '+91') +
            '-' +
            familyValues?.guardian_mobile;
      } else {
        contact = familyValues?.father_mobile
          ? (familyValues?.father_mobile_code ?? '+91') +
            '-' +
            familyValues?.father_mobile
          : familyValues?.mother_mobile
          ? (familyValues?.mother_mobile_code ?? '+91') +
            '-' +
            familyValues?.mother_mobile
          : (familyValues?.guardian_mobile_code ?? '+91') +
            '-' +
            familyValues?.guardian_mobile;
      }
    } else {
      contact = (familyValues?.contact_code ?? '+91') + '-' + familyValues?.contact;
    }
    formData.append('contact', `${contact ? contact : ''}`);
    formData.append('address', familyValues?.address ?? '');
    if (studentFormValues?.profile) {
      formData.append(
        'profile',
        studentFormValues?.profile,
        studentFormValues?.profile?.name
      );
    } else if (!studentFormValues?.profile && !studentFormValues?.profile_photo) {
      formData.append('profile', '');
    }
    // STUDENT INFO

    // FAMILY INFO
    let parentObj = {};
    Object.keys(familyValues).forEach((key) => {
      if (
        !key.includes('photo') &&
        key !== 'contact' &&
        key !== 'aadhaar_number' &&
        familyValues[key]
        // !key.includes('address')
      ) {
        if (key.includes('mobile')) {
          parentObj[key] = familyValues[key]
            ? (familyValues[key + '_code'] ?? '+91') + '-' + familyValues[key]
            : '';
        } else parentObj[key] = familyValues[key];
      }
    });
    if (parentId) parentObj.id = parentId;
    parentObj.email = email;
    if (userLevel === 13) {
      formData.append('parent', JSON.stringify(parentObj));
    }
    formData.append('pin_code', familyValues?.pin_code);
    if (familyValues?.father_photo && typeof familyValues?.father_photo !== 'string') {
      formData.append(
        'father_photo',
        familyValues?.father_photo,
        familyValues?.father_photo?.name
      );
    } else if (!familyValues?.father_photo) {
      formData.append('father_photo', '');
    }
    if (familyValues.mother_photo && typeof familyValues?.mother_photo !== 'string') {
      formData.append(
        'mother_photo',
        familyValues?.mother_photo,
        familyValues?.mother_photo?.name
      );
    } else if (!familyValues?.mother_photo) {
      formData.append('mother_photo', '');
    }
    if (familyValues.guardian_photo && typeof familyValues?.guardian_photo !== 'string') {
      formData.append(
        'guardian_photo',
        familyValues?.guardian_photo,
        familyValues?.guardian_photo?.name
      );
    } else if (!familyValues?.guardian_photo) {
      formData.append('guardian_photo', '');
    }
    // FAMILY INFO

    if (editId) {
      formData.append('erp_id', userDetails?.erp_id);
      let section_mapping = multipleAcademicYear?.flatMap((each) => each?.section) ?? [];
      let newSubjects = multipleAcademicYear?.flatMap((each) => each?.subjects) ?? [];
      let newSubjectsIds =
        multipleAcademicYear?.flatMap((each) => each?.subjectsId) ?? [];

      let newBranches = multipleAcademicYear?.flatMap((each) => each?.branch) ?? [];

      const uniqueSubjectsIds = [...new Set([...selectedSubjectsId, ...newSubjectsIds])];
      const uniqueSubjects = [...new Set([...selectedSubjects, ...newSubjects])];

      if (
        roleBasedUiConfig?.includes(schoolFormValues?.user_level?.toString()) &&
        params?.id
      ) {
        let branchObj = branches?.filter((each) =>
          selectedAcadId?.includes(each?.acadId)
        );
        let gradeObj = grades?.filter((each) => selectedGrade?.includes(each?.id));
        let subjectObj = subjects?.filter((each) =>
          selectedSubjectsId?.includes(each?.id)
        );

        let mapping_bgs = {
          [selectedYear?.session_year]: {
            branches: branchObj.map((each) => {
              return {
                acad_id: each?.acadId,
                branch_id: each?.id,
                branch_name: each?.branch_name,
              };
            }),
            grades: gradeObj.map((each) => {
              return { grade_id: each?.id, grade_name: each?.grade_name };
            }),
            subjects: subjectObj.map((each) => {
              return { subject_id: each?.id, subject_name: each?.subject_name };
            }),
          },
          ...multipleAcademicYear.reduce((acc, eachMultipleAcademicYear) => {
            acc[eachMultipleAcademicYear?.academicYearObj?.children] = {
              branches: eachMultipleAcademicYear?.branchObj?.map((each) => ({
                acad_id: each?.acadId,
                branch_id: each?.id,
                branch_name: each?.branch_name,
              })),
              grades: eachMultipleAcademicYear?.gradeObj?.map((each) => ({
                grade_id: each?.id,
                grade_name: each?.grade_name,
              })),
              subjects: eachMultipleAcademicYear?.subjectsObj?.map((each) => ({
                subject_id: each?.id,
                subject_name: each?.subject_name,
              })),
            };
            return acc;
          }, {}),
        };
        formData.append('mapping_bgs', JSON.stringify(mapping_bgs));
        axiosInstance
          .put(`${endpointsV1.userManagement.staffUser}${params?.id}`, formData)
          .then(() => {
            message.success('User Updated Successfully!');
            history.push('/user-management/view-users');
          })
          .catch((error) => {
            setEndProgress(false);
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      } else {
        formData.append('branch', [...selectedBranch, ...newBranches]?.toString());
        formData.append('subjects', uniqueSubjectsIds?.toString());
        formData.append('subject_section_mapping', uniqueSubjects?.toString());
        formData.append(
          'section_mapping',
          [...sectionMappingId, ...section_mapping]?.toString()
        );

        axiosInstance
          .put('/erp_user/update-user/', formData)
          .then(() => {
            message.success('User Updated Successfully!');
            history.push('/user-management/view-users');
          })
          .catch((error) => {
            setEndProgress(false);
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      formData.append('academic_year', selectedYear?.id);
      formData.append('academic_year_value', selectedYear?.session_year);
      formData.append('branch_code', branchCode?.toString());
      formData.append('branch', selectedBranch?.toString());
      formData.append('subjects', selectedSubjectsId?.toString());
      formData.append('subject_section_mapping', selectedSubjects?.toString());
      formData.append('grade', selectedGrade?.toString());
      if (roleBasedUiConfig?.includes(schoolFormValues?.user_level?.toString())) {
        formData.append('acad_session', selectedAcadId?.toString());
        formData.append('subject', selectedSubjectsId?.toString());
      }
      if (!roleBasedUiConfig?.includes(schoolFormValues?.user_level)) {
        formData.append('section', selectedSections?.toString());
      }
      if (roleBasedUiConfig?.includes(schoolFormValues?.user_level?.toString())) {
        axiosInstance
          .post(`${endpointsV1.userManagement.addStaffUser}`, formData)
          .then(() => {
            message.success('User Created Successfully!');
            history.push('/user-management/view-users');
          })
          .catch((error) => {
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
            setEndProgress(false);
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }
      axiosInstance
        .post('/erp_user/add_user/', formData)
        .then(() => {
          message.success('User Created Successfully!');
          history.push('/user-management/view-users');
        })
        .catch((error) => {
          message.error(error?.response?.data?.message ?? 'Something went wrong!');
          setEndProgress(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const closePasswordModal = () => {
    setOpenPasswordModal(false);
    setIsPasswordCanceled(true);
  };

  const handleChangePassword = () => {
    setPasswordLoading(true);
    const password = passwordFormRef.current.getFieldsValue()?.new_password;
    axiosInstance
      .post(`${endpointsV1.userManagement.passwordChange}`, {
        user_id: params?.id,
        password: password,
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success(res?.data?.message);
          closePasswordModal();
          history.push({
            pathname: '/user-management/view-users',
          });
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setPasswordLoading(false);
      });
  };
  // let totalStep = userLevel && userLevel === 13 ? 3 : 3;
  let totalStep = 3;
  return (
    <React.Fragment>
      <>
        <div className='th-bg-white  mb-5 pb-5 px-3'>
          {params?.id && (
            <div className='row pb-3 py-4'>
              <div className='col-md-9' style={{ zIndex: 2 }}>
                <Breadcrumb separator='>'>
                  <Breadcrumb.Item
                    href='/user-management/view-users'
                    className='th-grey th-16'
                  >
                    User Management
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className='th-black-1 th-16'>
                    Edit User
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          )}

          {/* <div className='th-small-steps d-block d-sm-block d-md-none'>
            <Steps
              onChange={(key) => {
                setCurrentStep(key);
              }}
              className='w-100'
              current={currentStep}
              direction='vertical'
              size='small'
            >
              <Step key={0} title='wer' />
              <Step key={1} title='ewr' />
              <Step key={2} title='3e23r' />
              <Step key={3} title='34r' />
            </Steps>
          </div> */}
          <Spin spinning={loading} tip='Loading..' size='large' className='th-primary'>
            <div className='d-flex  pb-5'>
              <div className='d-none d-xs-none d-sm-none d-md-block'>
                <div
                  className='text-center th-erp-steps '
                  style={{
                    height: '65vh',
                  }}
                >
                  <Steps
                    // onChange={(e) => {
                    //   setCurrentStep(e);
                    // }}
                    onChange={null}
                    current={currentStep}
                    direction={'vertical'}
                    className='custom-vertical-steps h-100'
                    type='primary'
                  >
                    <Step key={0} title='School Information' />
                    <Step
                      key={1}
                      title={`${userLevel === 13 ? 'Student' : 'User'} Information`}
                    />
                    <Step key={2} title='Family Information' />
                    {/* {userLevel === 13 && <Step key={3} title='Sibling Information' />} */}
                  </Steps>
                  <Progress
                    strokeColor='#1B4CCB'
                    format={(percent) => (
                      <span className='th-primary th-fw-600 th-18'>
                        {percent}% <br />{' '}
                        <span className='th-12 th-fw-400'>Completed</span>
                      </span>
                    )}
                    trailColor='primary'
                    width={100}
                    type='circle'
                    percent={
                      endProgress ? 100 : Math.ceil((currentStep / totalStep) * 100)
                    }
                  />
                  <div className='th-primary th-18 th-fw-600'>
                    Step {currentStep + 1}/{totalStep}
                  </div>
                </div>
              </div>
              <div className='pl-2' style={{ width: `calc(100% )`, height: '74vh' }}>
                <div className='mb-3 th-primary th-fw-500 th-16'>
                  Please fill the{' '}
                  {currentStep === 0
                    ? 'School'
                    : currentStep === 1
                    ? userLevel === 13
                      ? 'Student'
                      : 'User'
                    : 'Family'}{' '}
                  Information (Step {currentStep + 1}/{totalStep})
                </div>
                <Card
                  className='h-100'
                  style={{
                    background: '#F8F8F8',
                  }}
                >
                  <div className='px-1'>
                    {currentStep === 0 && (
                      <>
                        <SchoolInformation
                          roles={roles}
                          roleBasedUiConfig={roleBasedUiConfig}
                          designations={designations}
                          fetchDesignation={fetchDesignation}
                          branches={branches}
                          fetchGrades={fetchGrades}
                          grades={grades}
                          fetchSections={fetchSections}
                          sections={sections}
                          fetchSubjects={fetchSubjects}
                          subjects={subjects}
                          handleNext={handleNext}
                          schoolFormValues={schoolFormValues}
                          setSchoolFormValues={setSchoolFormValues}
                          selectedYear={selectedYear}
                          setSelectedSubjects={setSelectedSubjects}
                          setSelectedSubjectsId={setSelectedSubjectsId}
                          editId={editId}
                          multipleAcademicYear={multipleAcademicYear}
                          setMultipleAcademicYear={setMultipleAcademicYear}
                          sectionMappingId={sectionMappingId}
                          setSectionMappingId={setSectionMappingId}
                          userLevel={userLevel}
                          setUserLevel={setUserLevel}
                          parent={setParent}
                          setBranches={setBranches}
                          setGrades={setGrades}
                          setSections={setSections}
                          setSubjects={setSubjects}
                          maxSubjectSelection={maxSubjectSelection}
                          roleConfig={roleConfig}
                          editSessionYear={editSessionYear}
                          rolesList={rolesList}
                          selectedRoles={selectedRoles}
                          setSelectedRoles={setSelectedRoles}
                        />
                      </>
                    )}
                    {currentStep === 1 && (
                      <StudentInformation
                        handleNext={handleNext}
                        handleBack={handleBack}
                        studentFormValues={studentFormValues}
                        setStudentFormValues={setStudentFormValues}
                        singleParent={singleParent}
                        setSingleParent={setSingleParent}
                        guardian={guardian}
                        setGuardian={setGuardian}
                        userLevel={userLevel}
                        setParent={setParent}
                      />
                    )}
                    {currentStep === 2 && (
                      <FamilyInformation
                        roleBasedUiConfig={roleBasedUiConfig}
                        schoolFormValues={schoolFormValues}
                        familyFormValues={familyFormValues}
                        setFamilyFormValues={setFamilyFormValues}
                        singleParent={singleParent}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        guardian={guardian}
                        userLevel={userLevel}
                        parent={parent}
                        setParent={setParent}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        editId={editId}
                        fatherPrimary={fatherPrimary}
                        setFatherPrimary={setFatherPrimary}
                        motherPrimary={motherPrimary}
                        setMotherPrimary={setMotherPrimary}
                        guardianPrimary={guardianPrimary}
                        setGuardianPrimary={setGuardianPrimary}
                        fatherPrimaryEmail={fatherPrimaryEmail}
                        setFatherPrimaryEmail={setFatherPrimaryEmail}
                        motherPrimaryEmail={motherPrimaryEmail}
                        setMotherPrimaryEmail={setMotherPrimaryEmail}
                        guardianPrimaryEmail={guardianPrimaryEmail}
                        setGuardianPrimaryEmail={setGuardianPrimaryEmail}
                        setOpenPasswordModal={setOpenPasswordModal}
                      />
                    )}
                  </div>
                </Card>
                {/* <div
                // style={{ position: 'sticky', bottom: '59px' }}
                className='d-flex justify-content-end align-items-center my-4'
              >
                <Button
                  onClick={() => {
                    if (currentStep > 0) setCurrentStep(currentStep - 1);
                  }}
                  className='px-4'
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (currentStep < 3) setCurrentStep(currentStep + 1);
                  }}
                  className='ml-3 px-4'
                  type='primary'
                >
                  Next
                </Button>
              </div> */}
              </div>
            </div>
          </Spin>
        </div>
      </>
      <Modal
        title='Change Password'
        onOk={() => {
          console.log('');
        }}
        visible={openPasswordModal}
        onCancel={closePasswordModal}
        footer={[
          <Button onClick={closePasswordModal}>Cancel</Button>,
          <Button
            loading={loading}
            htmlType='submit'
            form='passwordForm'
            type='primary'
            onClick={() => setIsPasswordSubmit(true)}
            disabled={strengthProgress != '100' ? true : false}
          >
            Submit
          </Button>,
        ]}
        width={'80%'}
        centered
      >
        <ChangePasswordPopup
          isPasswordSubmit={isPasswordSubmit}
          setIsPasswordSubmit={setIsPasswordSubmit}
          loading={loading}
          setLoading={setLoading}
          userId={params?.id}
          strengthProgress={strengthProgress}
          setStrengthProgress={setStrengthProgress}
          isPasswordCanceled={isPasswordCanceled}
          setIsPasswordCanceled={setIsPasswordCanceled}
          redirectPath='/user-management/view-users'
        />

        {/* <div className='p-4'>
          <Form
            layout='vertical'
            ref={passwordFormRef}
            id='passwordForm'
            onFinish={handleChangePassword}
          >
            <div className='row'>
              <div className='col-md-12'>
                <Form.Item
                  label='New Password'
                  name={'new_password'}
                  rules={[
                    {
                      required: true,
                      message: 'Enter new password!',
                    },
                    {
                      validator: (_, value) => {
                        if (value && !/^.{8,}$/.test(value)) {
                          return Promise.reject(
                            `Password should be of more than 8 characters!`
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.Password placeholder='New Password' className='w-100' />
                </Form.Item>
              </div>
              <div className='col-md-12'>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Confirm password!',
                    },
                    {
                      validator: (_, value) => {
                        if (value && !/^.{8,}$/.test(value)) {
                          return Promise.reject(
                            `Password should be of more than 8 characters!`
                          );
                        }
                        if (
                          value &&
                          value !== passwordFormRef.current.getFieldsValue().new_password
                        ) {
                          return Promise.reject(`Password doesn't match!`);
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  label='Confirm Password'
                  name={'confirm_password'}
                >
                  <Input.Password placeholder='Confirm Password' className='w-100' />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div> */}
      </Modal>
    </React.Fragment>
  );
};

export default CreateUser;
