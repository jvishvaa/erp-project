import React from 'react';
import {
  Dashboard as DashboardIcon,
  // Add as AddIcon,
  // Edit as EditIcon,
  // NoteAdd as NoteAddIcon,
  // FileCopy as FileCopyIcon,
  // CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';
// import LockOpenIcon from '@material-ui/icons/LockOpen';

// import AdminDashboard from "../components/admin/dashboard/dashboard";
// import ContentDashboard from "../components/contentWriter/dashboard/dashboard";
// import SuperAdminDashboard from "../components/superAdmin/dashboard/dashboard";
// import Role from '../components/superAdmin/role/role';
// import RoleMapping from '../components/superAdmin/roleMapping/roleMapping';
// import AddCategory from "../components/contentWriter/addCategory/AddCategory";
// import CourseLevel from "../components/contentWriter/addCourseLevel/addCourseLevel";
// import Courses from '../components/admin/courses/courses';
// import Approve from '../components/admin/approve/approve';
// import Registration from "../components/superAdmin/registration/registration";
// import CourseLanguage from "../components/contentWriter/dashboard/courseLanguage/courseLanguage";
// import CourseSubTitle from "../components/contentWriter/courseSubTitle/courseSubTitle";
// import StudentCourse from '../components/contentWriter/studentCourse/studentCourse';
// import CreateCourse from "../components/contentWriter/createCourse/createCourse";
// import CreateCourseType from "../components/contentWriter/courseType/courseType";
// import CategorySubType from "../components/contentWriter/categorySubType/categorySubType";
// import CategoryMapping from "../components/contentWriter/categoryMapping/categoryMapping";
// import Authorize from "../components/admin/authorize/Authorize";
// import BranchwiseVideos from "../components/contentWriter/BranchwiseVideos/BranchwiseVideos";
// import StartCourseCreation
//  from "../components/contentWriter/createCourse/startCourseCreation/startCourseCreation";

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import RedoIcon from '@material-ui/icons/Redo';
// import MoreInfo from '../reusableComponents/courseEnroleModle/MoreInfo';
// import TeacherToolBox from "../components/contentWriter/teacherToolBox/TeacherToolBox";
import CoursesView from './PrincipalComponents/CoursesView';
import AssignTeacher from './AssignTeachers/AssignTeacher';
import AssessmentReview from './assessmentReviews/assessmentReviews';
// import PrincipalRouting from './PrincipalRouting';
import ModelBody from '../../studentCourse/courses/sure-learning-trainee-courses-details-content-extension';
import ReAssignTeacher from './ReassignTeachers/ReAssignTeacher';
import TeachersPerformance from './teachersPerformenceCard/teachersPerformenceCard';
import CourseEnroleModle from '../reusableComponents/courseEnroleModle/courseEnroleModle';
import EnrollCourse from './enrollCourses/enrollCourse';
import consolidatedReport from './consolidatedReport/consolidatedReport';
import Report from './report/report';

import AdminDashboard from '../admin/dashboard/dashboard';
import TrainingModule from '../../InHouse/InHouseComponent/InductionTraining/TrainingModule/TrainingModule';
import TrainingChapters from '../../InHouse/InHouseComponent/InductionTraining/TrainingModule/TrainingChapters/TrainingChapters';
import TrainingLesson from '../../InHouse/InHouseComponent/InductionTraining/TrainingModule/TrainingLessons/TrainingLesson';
import TrainingUnit from '../../InHouse/InHouseComponent/InductionTraining/TrainingModule/TrainingUnit/TrainingUnit';
// import dashboard from './visualReportsBranchwise/dashboard';
import dashboard from '../admin/visual-dashboard/dashboard';
import leadTeacher from './leadTeacher/leadTeacher';
import PrincipalLeadTeacher from './principalAssignTeacher/principalAssignTeacher';
import WeeklyReport from '../common/weekly-report/weeklyReport';
// import TeacherEnrollCourse from '../../components/PrincipalDashboard/enrollCourses/enrollCourse';
// import CoursesViewteacher from '../../components/PrincipalDashboard/PrincipalComponents/CoursesView';
// import TrainingModuleteacher from '../../../src/InHouse/InHouseComponent/subjectTraining/TrainingModule/TrainingModule';
// import LandingPage from '../../../src/InHouse/InHouseComponent/InhouseCourses/TeacherDashboard/LandingPage';


const ComponentList = {
  user: [
    localStorage.getItem('Principal_Dashboard')!=="null"?
    {
      name: 'Dashboard',
      icon: <DashboardIcon />,
      link: '/principalDashboard',
      component: AdminDashboard,
    }:null,
    localStorage.getItem('Enroll_Self_Courses')!=="null"?
    {
      name: 'Enroll Self Courses',
      icon: <AssignmentIndIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    }:null,
    localStorage.getItem('Self_Courses')!=="null"?
    {
      name: 'Self Courses',
      icon: <AssignmentIndIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    }:null,
    localStorage.getItem('Trainee_Courses')!=="null"?
    {
      name: 'Trainee Courses',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    }:null,
    localStorage.getItem('Assign_Trainee')!=="null"?
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    }:null,
    localStorage.getItem('Reassign_Trainee')!=="null"?
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    }:null,
    localStorage.getItem('Assessment_Review')!=="null"?
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    }:null,
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    localStorage.getItem('Assign_Lead_Teacher')!=="null"?
    {
      name: 'Assign Lead Teacher\n',
      icon: <RedoIcon />,
      link: '/sure-learning-assign-lead-teacher',
      component: leadTeacher,
    }:null,
    localStorage.getItem('Assign_Teacher')!=="null"?
    {
      name: 'Assign Teacher',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning/assign-teacher',
      component: PrincipalLeadTeacher,
    }:null,
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    localStorage.getItem('Course_Wise_Report')!=="null"?
    {
      name: 'Report',
      icon: <RedoIcon />,
      link: '/sure-learning-course-wise-user-report',
      component: Report,
    }:null,
    localStorage.getItem('Consolidated_Report')!=="null"?
    {
      name: 'Consolidated Report',
      icon: <RedoIcon />,
      link: '/sure-learning-consolidated-report',
      component: consolidatedReport,
    }:null,
    localStorage.getItem('Branch_Wise_Report')!=="null"?
    {
      name: 'Branch wise report',
      icon: <RedoIcon />,
      link: '/sure-learning-branch-level-detailed-report',
      component: dashboard,
    }:null,
    localStorage.getItem('Weekly_Report')!== "null"?
    {
      name: 'Weekly Report',
      icon: <RedoIcon />,
      link: '/sure-learning-weekly-report',
      component: WeeklyReport,
    }:null,
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
  
  ],

  //////////////////////////////////////OLD//////////////////
  leadteacher: [
    {
      name: 'Self Courses',
      icon: <AssignmentIndIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
    {
      link: '/teacherDashboard/chapters',
      component: TrainingChapters,
    },
    {
      link: '/teacherDashboard/lessons',
      component: TrainingLesson,
    },
    {
      link: '/teacherDashboard/unit',
      component: TrainingUnit,
    },
  ],
  principal: [
    {
      name: 'Dashboard',
      icon: <DashboardIcon />,
      link: '/principalDashboard',
      component: AdminDashboard,
    },
    {
      name: 'Enroll Self Courses',
      icon: <AssignmentIndIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    },
    {
      name: 'Self Courses',
      icon: <AssignmentIndIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      name: 'Trainee Courses',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    },
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    },
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    {
      name: 'Assign Lead Teacher\n',
      icon: <RedoIcon />,
      link: '/sure-learning-assign-lead-teacher',
      component: leadTeacher,
    },
    {
      name: 'Assign Teacher',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning/assign-teacher',
      component: PrincipalLeadTeacher,
    },
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    {
      name: 'Report',
      icon: <RedoIcon />,
      link: '/sure-learning-course-wise-user-report',
      component: Report,
    },
    {
      name: 'Consolidated Report',
      icon: <RedoIcon />,
      link: '/sure-learning-consolidated-report',
      component: consolidatedReport,
    },
    {
      name: 'Branch wise report',
      icon: <RedoIcon />,
      link: '/sure-learning-branch-level-detailed-report',
      component: dashboard,
    },
    
    {
      name: 'Weekly Report',
      icon: <RedoIcon />,
      link: '/sure-learning-weekly-report',
      component: WeeklyReport,
    },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
  ],
  academicheads: [
    {
      name: 'Enroll Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    },
    {
      name: 'Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
    {
      name: 'Trainee Courses',
      icon: <DashboardIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    },
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    },
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    {
      name: 'Assign Lead Teacher\n',
      icon: <RedoIcon />,
      link: '/sure-learning-assign-lead-teacher',
      component: TeachersPerformance,
    },
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
  ],
  planner: [
    {
      name: 'Enroll Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    },
    {
      name: 'Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
    {
      name: 'Trainee Courses',
      icon: <DashboardIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    },
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    },
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    // {
    //   name: 'Assign Lead Teacher\n',
    //   icon: <RedoIcon />,
    //   link: '/sure-learning-assign-lead-teacher',
    //   component: TeachersPerformance,
    // },
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
  ],
  coordinator: [
    {
      name: 'Enroll Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    },
    {
      name: 'Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
    {
      name: 'Trainee Courses',
      icon: <DashboardIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    },
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    },
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    // {
    //   name: 'Assign Lead Teacher\n',
    //   icon: <RedoIcon />,
    //   link: '/sure-learning-assign-lead-teacher',
    //   component: TeachersPerformance,
    // },
    {
      name: 'Branch wise report',
      icon: <RedoIcon />,
      link: '/sure-learning-branch-level-detailed-report',
      component: dashboard,
    },
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
  ],
  academicmanagers: [
    {
      name: 'Enroll Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/enroll_course',
      component: EnrollCourse,
    },
    {
      name: 'Self Courses',
      icon: <DashboardIcon />,
      link: '/principalDashboard/modules',
      component: TrainingModule,
    },
    {
      link: '/chapters',
      component: TrainingChapters,
    },
    {
      link: '/lessons',
      component: TrainingLesson,
    },
    {
      link: '/unit',
      component: TrainingUnit,
    },
    {
      name: 'Trainee Courses',
      icon: <DashboardIcon />,
      link: '/sure-learning-trainee-courses',
      component: CoursesView,
    },
    {
      name: 'Assign Trainee',
      icon: <AssignmentIndIcon />,
      link: '/sure-learning-assign-teacher',
      component: AssignTeacher,
    },
    {
      name: 'Reassign Trainee',
      icon: <RedoIcon />,
      link: '/principalDashboard/reAssignTeacher',
      component: ReAssignTeacher,
    },
    {
      name: 'Assessment Review',
      icon: <RedoIcon />,
      link: '/sure-learning-assessment-review',
      component: AssessmentReview,
    },
    // {
    //   name: 'Trainee Performance',
    //   icon: <RedoIcon />,
    //   link: '/principalDashboard/teachers_performance',
    //   component: TeachersPerformance,
    // },
    // {
    //   name: 'Assign Lead Teacher\n',
    //   icon: <RedoIcon />,
    //   link: '/sure-learning-assign-lead-teacher',
    //   component: TeachersPerformance,
    // },
    // {
    //   link: '/MoreInfo',
    //   component: MoreInfo,
    // },
    {
      link: '/sure-learning-trainee-courses-details-content-extension',
      component: ModelBody,
    },
    {
      link: '/sure-learning-trainee-courses-details',
      component: CourseEnroleModle,
    },
  ],
};

export default ComponentList;
