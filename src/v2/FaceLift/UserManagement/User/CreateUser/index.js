import { Breadcrumb, Card, message, Progress, Spin, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.css';
import './index.css';
import FamilyInformation from './FamilyInformation';
import SchoolInformation from './SchoolInformation';
import SiblingInformation from './SiblingInformation';
import StudentInformation from './StudentInformationForm';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
import moment from 'moment/moment';
import { useHistory, useParams } from 'react-router-dom';
import AcademicYearList from './AcademicYearList';
const { Step } = Steps;
const CreateUser = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignation] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
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
  const [maxSubjectSelection, setMaxSubjectSelection] = useState(null);
  const [siblings, setSiblings] = useState([
    {
      id: Math.random(),
      name: '',
      gender: '',
      age: 0,
      grade_name: '',
      school_name: '',
    },
  ]);
  const history = useHistory();
  const params = useParams();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  useEffect(() => {
    let NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    let module = '';
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
              module = item.child_id;
            }
          });
        }
      });
    }
    if (params?.id) {
      setEditId(params?.id);
      fetchUserData(
        {
          erp_user_id: params?.id,
        },
        module
      );
    }
    fetchRoleConfig({
      config_key: 'subject_limit',
    });
    getRoleApi();
    fetchBranches(module);
  }, [module]);
  const fetchRoleConfig = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`/assessment/check-sys-config/`, { params: { ...params } })
      .then((response) => {
        if (response.data.status_code === 200) {
          setRoleConfig(JSON.parse(response.data?.result[1]) ?? []);
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
  const fetchUserData = (parameters = {}, module) => {
    setLoading(true);
    axiosInstance
      .get(`/erp_user/user-data/`, { params: { ...parameters } })
      .then((response) => {
        const user = response.data.result;
        let multipleYears = user?.mapping_bgs?.slice(0, -1) ?? [];
        let modifiedMultipleYears = [];
        for (let i = 0; i < multipleYears?.length; i++) {
          let obj = {
            id: Math.random(),
            academic_year: multipleYears[i]?.session_year?.flatMap(
              (e) => e.session_year_id
            )[0],
            branch: multipleYears[i]?.branch?.flatMap((e) => e.branch_id),
            grade: multipleYears[i]?.grade?.flatMap((e) => e.grade__grade_name),
            editGrade: multipleYears[i]?.grade?.flatMap((e) => e.grade_id),
            section: multipleYears[i]?.section?.flatMap((e) => e.section_mapping_id),
            editSection: multipleYears[i]?.section?.flatMap((e) => e.section_id),
            subjects: multipleYears[i]?.subjects?.flatMap((e) => e.subject_id),
            isEdit: true,
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
          } else if (
            parentDetails?.father_first_name &&
            parentDetails?.guardian_first_name
          ) {
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
                  item_id: subject_mapping_id,
                  subject_name: subject_name,
                } || [])
            )
          ),
          contact: user?.contact || '',
          date_of_birth: user?.date_of_birth,
          gender,
          profile: user?.profile || '',
          address: user?.address || '',
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
            father_mobile_code:
              user?.parent_details?.father_mobile?.split('-')[0] || '+91',
            mother_mobile: user?.parent_details?.mother_mobile?.split('-')[1] || '',
            mother_mobile_code:
              user?.parent_details?.mother_mobile?.split('-')[0] || '+91',
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
            address: user?.parent_details?.address,
            pin_code: user?.parent_details?.pin_code,
            email: user?.parent_details?.email,
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
          designation: user?.designation,
          siblings: user?.siblings,
        };
        setParentId(user.parent_details?.id);
        if (user?.parent_details?.email === user?.parent_details?.father_email) {
          setFatherPrimaryEmail(true);
          setMotherPrimaryEmail(false);
          setGuardianPrimaryEmail(false);
        } else if (user?.parent_details?.email === user?.parent_details?.mother_email) {
          setFatherPrimaryEmail(false);
          setMotherPrimaryEmail(true);
          setGuardianPrimaryEmail(false);
        } else {
          setFatherPrimaryEmail(false);
          setMotherPrimaryEmail(false);
          setGuardianPrimaryEmail(true);
        }
        if (user?.contact === user?.parent_details?.father_mobile) {
          setFatherPrimary(true);
          setMotherPrimary(false);
          setGuardianPrimary(false);
        } else if (user?.contact === user?.parent_details?.mother_mobile) {
          setFatherPrimary(false);
          setMotherPrimary(true);
          setGuardianPrimary(false);
        } else {
          setFatherPrimary(false);
          setMotherPrimary(false);
          setGuardianPrimary(true);
        }
        setUserDetails(transformedUser);
        var transformedSchoolDetails = transformedUser;
        var gradeObj = transformedSchoolDetails?.grade?.pop();
        var sectionObj = transformedSchoolDetails?.section?.pop();
        var subjectObj = transformedSchoolDetails?.subjects?.pop();
        var schoolDetails = {
          user_level: transformedSchoolDetails?.user_level,
          designation: transformedSchoolDetails?.designation?.id,
          academic_year: transformedSchoolDetails?.academic_year?.pop()[0]?.session_year,
          branch: transformedUser?.branch?.pop()?.map((e) => e.id),
          grade: gradeObj?.map((e) => e.grade_name),
          section: sectionObj?.map((e) => e.section_name),
          subjects: subjectObj?.map((e) => e.item_id),
        };
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
        setSelectedSubjects(subjectObj?.map((e) => e?.id));
        setSingleParent(transformedUser?.single_parent ? true : false);
        fetchDesignation(schoolDetails?.user_level);
        fetchGrades(schoolDetails?.branch, null, module);
        fetchSections(
          gradeObj?.map((e) => e.id),
          null,
          schoolDetails?.branch,
          module
        );
        fetchSubjects(
          sectionObj?.map((e) => e.id),
          schoolDetails?.branch,
          gradeObj?.map((e) => e.id),
          module
        );
        setSchoolFormValues(schoolDetails);
        setStudentFormValues(studentInformation);
        setFamilyFormValues(transformedUser?.parent);
        setSiblings(
          transformedUser?.siblings?.length > 0
            ? transformedUser?.siblings
            : [
                {
                  id: Math.random(),
                  name: '',
                  gender: '',
                  age: 0,
                  grade_name: '',
                  school_name: '',
                },
              ]
        );
      })
      .catch((error) => {
        message.error(error?.response?.data?.message ?? 'Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
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

  const fetchDesignation = (id) => {
    axios
      .get(`${endpoints.userManagement.userDesignation}?user_level=${id}`, {
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

  const fetchBranches = (module) => {
    if (selectedYear) {
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${selectedYear?.id}&module_id=${module}`
        )
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

  const fetchGrades = (branches, branch_code, module) => {
    if (branches?.length > 0) {
      setBranchCode(branch_code);
      setSelectedBranch(branches);
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${
            selectedYear?.id
          }&branch_id=${branches?.toString()}&module_id=${params?.id ? module : moduleId}`
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
            if (transformedData?.length > 1) {
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

  const fetchSections = (grades, grade_id, editBranch, module) => {
    if (grades?.length > 0) {
      setSelectedGrade(grades);
      axiosInstance
        .get(
          `${endpoints.academics.sections}?session_year=${selectedYear?.id}&branch_id=${
            editBranch ? editBranch?.toString() : selectedBranch?.toString()
          }&grade_id=${grades?.toString()}&module_id=${params?.id ? module : moduleId}`
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

  const fetchSubjects = (sections, editBranch, editGrade, module) => {
    if (sections?.length > 0) {
      setSelectedSections(sections);
      axiosInstance
        .get(
          `${endpoints.academics.subjects}?session_year=${selectedYear?.id}&branch=${
            editBranch ? editBranch?.toString() : selectedBranch?.toString()
          }&grade=${
            editGrade ? editGrade?.toString() : selectedGrade?.toString()
          }&section=${sections?.toString()}&module_id=${params?.id ? module : moduleId}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((obj) => ({
                  id: obj.subject__id,
                  item_id: obj.id,
                  subject_name: obj.subject__subject_name,
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
    let familyValues = {};
    if (userLevel === 13) {
      familyValues = familyFormValues;
    } else {
      familyValues = formValues;
    }
    const formData = new FormData();
    //SCHOOL INFORMATION

    //SCHOOL INFORMATION
    formData.append('user_level', schoolFormValues?.user_level);
    if (schoolFormValues?.designation)
      formData.append('designation', schoolFormValues?.designation);
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
    formData.append('parent', JSON.stringify(parentObj));
    if (familyValues?.father_photo && !typeof familyValues?.father_photo === 'string') {
      formData.append(
        'father_photo',
        familyValues?.father_photo,
        familyValues?.father_photo?.name
      );
    }
    if (familyValues.mother_photo && !typeof familyValues?.mother_photo === 'string') {
      formData.append(
        'mother_photo',
        familyValues?.mother_photo,
        familyValues?.mother_photo?.name
      );
    }
    if (
      familyValues.guardian_photo &&
      !typeof familyValues?.guardian_photo === 'string'
    ) {
      formData.append(
        'guardian_photo',
        familyValues?.guardian_photo,
        familyValues?.guardian_photo?.name
      );
    }
    // FAMILY INFO

    //SIBLING INFO
    formData.append('siblings', JSON.stringify(siblings));
    if (editId) {
      formData.append('erp_id', userDetails?.erp_id);
      let section_mapping = multipleAcademicYear?.flatMap((each) => each?.section) ?? [];
      let newSubjects = multipleAcademicYear?.flatMap((each) => each?.subjects) ?? [];
      let newBranches = multipleAcademicYear?.flatMap((each) => each?.branch) ?? [];
      formData.append('branch', [...selectedBranch, ...newBranches]?.toString());
      formData.append('subjects', [...selectedSubjects, ...newSubjects]?.toString());
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
          message.error(error?.response?.data?.message ?? 'Something went wrong!');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      formData.append('academic_year', selectedYear?.id);
      formData.append('academic_year_value', selectedYear?.session_year);
      formData.append('branch_code', branchCode?.toString());
      formData.append('branch', selectedBranch?.toString());
      formData.append('subjects', selectedSubjects?.toString());
      formData.append('grade', selectedGrade?.toString());
      formData.append('section', selectedSections?.toString());
      axiosInstance
        .post('/erp_user/add_user/', formData)
        .then(() => {
          message.success('User Created Successfully!');
          history.push('/user-management/view-users');
        })
        .catch((error) => {
          message.error(error?.response?.data?.message ?? 'Something went wrong!');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  let totalStep = userLevel && userLevel === 13 ? 4 : 3;
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
            <div className='d-flex  '>
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
                    {userLevel === 13 && <Step key={3} title='Sibling Information' />}
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
                    percent={Math.ceil((currentStep / totalStep) * 100)}
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
                    : currentStep === 2
                    ? 'Family'
                    : 'Sibling'}{' '}
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
                          editId={editId}
                          multipleAcademicYear={multipleAcademicYear}
                          setMultipleAcademicYear={setMultipleAcademicYear}
                          sectionMappingId={sectionMappingId}
                          setSectionMappingId={setSectionMappingId}
                          userLevel={userLevel}
                          setUserLevel={setUserLevel}
                          parent={setParent}
                          setGrades={setGrades}
                          setSections={setSections}
                          setSubjects={setSubjects}
                          maxSubjectSelection={maxSubjectSelection}
                          roleConfig={roleConfig}
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
                      />
                    )}
                    {currentStep === 3 && (
                      <SiblingInformation
                        siblings={siblings}
                        setSiblings={setSiblings}
                        handleBack={handleBack}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        editId={editId}
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
    </React.Fragment>
  );
};

export default CreateUser;
