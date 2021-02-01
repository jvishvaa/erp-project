import React, { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  dashboard, staff, addStaff, addStaffExcel, staffMapping, student, addStudentExcel, manageSubject, addSubject, editSubject, subjectMapping,
  addSubjectMapping, EditSubjectMapping, grade, addGrade, EditGrade, gradeMapping,
  addGradeMapping, editGradeMapping, section, editSection, addSection, sectionMapping,
  addSectionMapping, branch, addBranch, session, addSessionMapping, designation,
  addDesignation, classGroup, addClassGroup, ViewClassGroup, gradeCategory, editGradeCategory,
  addGradeCategory, vacation, addVacation, vacationType, addVacationType, period, addPeriod,
  role, addRole, EditRole, Permission, department, addDepartment, EditDepartment, EditBranch,
  assignSubjectTeacher, Calendar, addteacherReport, addteacherReport2, showTeacherReport,
  editTeacherReport, teacherHistory, AddQuestion, QuestionEdit, AddChapter,
  StudentTimeTable, StudentCalender, UploadResult, dashboardQuestBox,
  UploadQuestionExcel, CreateAssessment, ListQuestion, Communication, ViewChapter,
  ListCompQuestion, StudentReport, viewAssessment, assessmentDetail, studentAssessment, createQuestionPaper, addQuestionPaper, ViewQuestionPaper, QuestionPaperDetails,
  practiceQuesDashboard, ViewLessonPlan, attendance, ViewAttendance, OnlineTest, circular, circular2,
  viewCircular, viewCircular2, CreateTest, StudentTests, StudentPracticeTests, message, Messaging, viewMessage, ViewMicroSchedule,
  FeeType, MiscFeeType, OtherFeeType, CreateFeePlan, ManageFeeType, EditFeeInstallment, EditFeePlanName, AddFeePlan, MiscFeeClass, EditMiscFee, AddFeePlanType,
  createReceipt, ManagePayment, FeeStructure, ConcessionSettings, MakePayment, TransactionStatus, TabView, Paytm, DepositTab,
  AccountantTransaction, FeeStructureAcc, PettyExpenses, MakeEntry, PostDateCheque, ChangeFeePlanToStudent, AddItems, OtherFeesAccountant, AdminKit,
  StoreAtAcc, ConfigItems, AssignOtherFees, AddOtherFees, videoUpload, playVideo, publicView, report, ItCertificate, LastDateSettings,
  AccountantCerti, Ledger, RegistrationFee, TallyReports, ReceiptBook, TotalPaidReports,
  feedback, viewFeedback, viewGrievance, ApplicationFormAcc, RegistrationForm, ReceiptSettings, FeeCollection, FeeShowList, StudentLedgerTab, AdmissionFormAcc, NewAdmissionFormAcc, CustomizedAdmissionFormAcc, AdminOtherFees,
  StudentShuffle, RequestShuffle, FeePaymentChangeRequests, PendingRequests, UnassignFeeRequests, ApprovalRequest, PendingRequest, RejectedRequest, studentUploadData, studentsShuffleUpload,
  NonRTEFormAcc, UpdateAdmissionFormAcc, ApprovedRequestView, RejectedRequestView, CancelledRequestView, EditTransactionDetails, PartyList, AdminDashboard, AccountantDashboard, StudentShuffleReq, ApprovePendingReq, LedgerReport, StudentInfoAdm,
  StudentActivateInactiveAcc, ActivateInactivateStudentAdm, NewRegistrationForm, FinancialLedgerReport, ChequeBounceReports,
  BankReport, PostDateCount, ViewTestDetails, DailyTimeTable, BulkActiveInactive, BulkReportUpload, BulkFeeUpload, BulkReportStatus, CashReport, Airpay, BulkAccountantLogin, ReceiptBookAdm, TotalPaidDueReportsAdm, CurrFeeType, CurrFeeTypeAcc, StoreReports,
  TotalFormCount, AppFormList, RegFormList, AdmFormList, CommunicationSMS, Meal, StoreAtStudent, TermsAndConditions, AddGst, StorePaymentRequests, PendingStoreRequests, ApprovedStoreRequests, RejectedStoreRequests, CancelledStoreRequests, EditStoreTransactionDetails,
  QRCodeGenerator, OrderStatusUpload, AssignCoupon, StudentUniform, PracticeQuestionsHome, CreateCoupon, BulkUniform, ShippingAmount, UniformVedio, UniformChart, StudentProfileImages, StudentProfileImageUpload, StudentPromotion, HomeworkSubmission, StudentSubmissions, InitiateStudentPromotions, PromotedStudents,
  EmailSms, VideoPlayer, VideoSms, EmailSmsLog, AirpayResponse, ReAssignCoupon, ShuffleReports, AcceptRejectPayment, MPQuizHome, PreQuizHome, SubCategoryAllow, OnlinePaymentUpload, ExtraAmtAdjust, AssignDelieveryCharge, BulkActiveInactiveParent, EMandate, BillingDetails, AddCustomerDeatils, OrderDetails, GenerateSubsequentPayment, Razorpay, DailyBillingDetails, DailyBillingDetailsPage, CreateLink, OnlinePayment, OnlineAdmission
} from './components'
import StudentReviewForTeacher from './components/OnlineClass/ViewClass/studentReviewForTeacher'
import StudentReviews from './components/OnlineClass/ViewClass/studentReviews'
import ClassGroupDetails from './components/OnlineClass/classGroupDetails'
import EngagementReport from './components/OnlineClass/engagementReport'
import Communications from './components/communications'
import ParticipantReport from './components/OnlineClass/GuestStudent/participantReport'
import BulkDownloadReport from './components/OnlineClass/bulkDownloadReport'
import AssessmentTypesAndCategory from './components/questbox/assessment/assessmentMappings'
import viewQuestionPapers from './components/questbox/questionPaper/questionPaperView'
import AwsRouterSwitch from './components/internalTools/aws_switch'
import DeveloperMails from './components/developer_mail'
import GradebookEvaluationCriteria from './components/gradebook/gradeBookEvaluationCriteria'
import GradebookDownload from './components/gradebook/gradeBookBulkDownload'
import StudentReportCard from './components/gradebook/studentReportCard'
import ViewGradBookEvaluationCriteria from './components/gradebook/viewGradeBookEvaluationCriteria'
import GradebookAnalytics from './components/gradebook/GradebookAnalytics'
import QuestionCount from './components/questbox/question_count'
import EditGradebookEvaluationCriteria from './components/gradebook/editGradeBookEvaluationCriteria'
import UpdatePassword from './components/updatePassword'
import IntegrationTesting from './components/internalTools/integration_testreport'
import CrashReport from './components/internalTools/crashReport'
import StudentExtended from './components/masters/student/studentExtended'
import studentRemarks from './components/masters/student/studentRemarks'
import studentActions from './components/masters/student/studentActions'
import StudentContactNumber from './components/masters/student/studentContactNumber'
import grievance from './components/message/grievance'
import LatestTeacherReport from './components/teacherManagement/teacherReport/latestTeacherReport'
import ClassWiseSms from './components/sms/classWiseSms'
import NewAdmittedStudents from './components/sms/newAdmittedStudents'
import SectionWiseSms from './components/sms/sectionWiseSms'
import OfflineSms from './components/sms/offlineSms'
import ClassGroupSms from './components/sms/classGroupSms'
import StaffIdCard from './components/id/staffIdCard'
import StudentIdCard from './components/id/studentIdCard'
import UploadFeeds from './components/feeds/uploadFeeds'
import ViewFeeds from './components/feeds/viewFeeds'
import GradeBook from './components/gradebook/gradebook'
import GradeBookReports from './components/gradebook/gradebook_reports'
import UploadEbook from './components/ebook/uploadEbook'
import ViewEbook from './components/ebook/viewEbook'
import EbookPdf from './components/ebook/ebookPdf'
import Scholarship from './components/scholarship'
import AttendanceExcelReportsDownload from './components/attendance/attendanceExcelReportsDownload'
import BulkExcelDownloadStudentStaff from './components/consolidationExcelReports/bulkExcelDownloadStudentStaff'
import ExcelReport from './components/consolidationExcelReports/excelReport'
import ExcelReportsDownloadAdmin from './components/consolidationExcelReports/excelReportsDownloadAdmin'
import Register from './components/register'
import RegisterGuest from './components/register_guest'
import TermsConditions from './components/terms_policy/terms_conditions'
import PrivacyPolicy from './components/terms_policy/privacy_policy'
import ChangePassword from './components/change_password'
import ViewTestsHome from './components/questbox/CreateTest/viewTestHome'
import HandleTest from './components/questbox/CreateTest/handleTest'
import Reset from './components/forgot_password'
// import practiceQuestions from './components/questbox/CreateTest/practiceQuestions'
// import Reset from './components/forgot_password'
// import PracticeQuestions from './components/questbox/CreateTest/practiceQuestions'
import HidePracticeQuestions from './components/questbox/CreateTest/HidePractiseQuestions'
import ViewReportedQuestions from './components/questbox/CreateTest/reportQuestion/ViewReportedQuestions'
import PracticeQuestionAnalysis from './components/questbox/CreateTest/PracticeQuestionAnalysis/PracticeQuestionAnalysis'
import OnlineClass from './components/questbox/CreateTest/onlineClass'
import AddClassGroup from './components/ClassGroup/addClassGroup'
import TeacherLaggingReport from './components/teacherlagreport/teacherlaggingreport'
import Files from './components/files'
import ResetPassword from './components/reset_password'
// import GlobalSelectorExample from './_components/_globalselector/examples'
import GSelectExample from './_components/globalselector/examples'
import PowerSelectorExample from './_components/pselect/examples'
import MathsDocumentation from './components/MathsDoc/MathsDocumentation'
import AddSmsCredits from './components/sms/addSMSCredits'
import Sms from './components/sms/sms'
import Settings from './components/Settings/settings'
import SelectStudent from './components/selectStudent'
import { GradebookEvaluationCriteriaTermCopy } from './components/gradebook'
import SmsReceived from './components/sms/smsReceived'
import ParentContactInfoUpdation from './components/parentContactStudentlogin'
import mainModule from './ImgDropAndCaptureAndCrop/main-module'
import UploadAssessmentExcel from './components/UploadAssessmentExcel'
import { GenerateNewOnlineClass, ViewClass, AttendeeList, AllotedClasses } from './components/OnlineClass'
import { WriteBlog, StudentViewBlog, ReviewerViewBLog, BlogDashboard, PublishedBlogs } from './components/blog'
import ZoomUsers from './components/zoomUsers/viewZoomUsers'
import AddZoomUser from './components/zoomUsers/addZoomUsers'
import EditZoomUser from './components/zoomUsers/editzoomUsers'
import YoutubeVideos from './components/aol/sampleVideos'
import GuestStudentList from './components/masters/student/guestStudent'
import EditGuestStudent from './components/masters/student/editGuestStudent'
import CreateGroup from './components/OnlineClass/CreateGroup'
import StudentLandingPage from './components/StudentLandingPage/studentLandingPage'
import { Certificate, ViewCertificate } from './components/certificate'
import SignatureManager from './components/certificate/signatureManager/signatureManager'
import SignatureList from './components/certificate/signatureManager/signatureList'
import AddCategory from './components/discussion_form/admin/category/category'
import SubCategory from './components/discussion_form/admin/subCategory/subCategory'
import SubSubCategory from './components/discussion_form/admin/subSubCategory/subSubCategory'
import UserAccessView from './components/discussion_form/userAccessView/userAccessView'
import EditPost from './components/discussion_form/moderator/editPost/editPost'
import EditComments from './components/discussion_form/moderator/editComments/editComments'
// Import Discussion Form
import DiscussForm from './components/discussionForm/discussForm'
import DiscussionDashbard from './components/discussion_form/discussionDashboard/discussionDashboard'
import Answer from './components/discussionForm/posts/replies/Answer'
import { OrchadioListeners, OrchadioAdmin, Orchadio, OrchadioPlayer } from './components/orchadio'
import ListClassGroup from './components/ClassGroup/listClassGroup'
import Publications from './components/Publications/publications'
import PublicationsViewer from './components/Publications/pdfViewer'
import ClassInterestStats from './components/OnlineClass/classInterestStats'
import Homework from './components/homework'
import HomeworkDashboard from './components/homework/components/homeworkDashboard'
import HomeworkReport from './components/homework/components/homeworkReport'
import BulkClassCreation from './components/aolOnlineClass/createBulkClass'
import AddCircularTemplate from './components/circular/addCircularTemplate'
import ViewCircularTemplate from './components/circular/viewCircularTemplate'
// import ViewFile from './components/circular/viewfile'
// import ViewLockDownJournals from './components/lockdownJournal/components/viewListOfJournals'
import StudentJournal from './components/lockdownJournal/components/studentJournal'
import EditorExample from './components/lockdownJournal/editor/example'
import ConcessionReport from './components/Finance/BranchAccountant/ConcessionReport/ConcessionReport'
import ManagementDashboard from './components/ManagementDashboard/components/dashboard'
import ReportAProblem from './components/ReportProblem/index'
import FbAndGoogleDataAnalytics from './components/ManagementDashboard/components/fb&GoogleAnalytics'
import QuizStatistics from './components/PracticeQuestion/mPQuiz/statistics/QuizStatistics'
import UploadPublications from './components/Publications/uploadPublictions'
import Game from './components/Game/Game'
import UploadPaymentFile from './components/Finance/student/managePayment/UploadPaymentFile'
import StudentWallet from './components/Finance/student/StudentWallet/StudentWallet'
import WalletReport from './components/Finance/Reports/WalletReport/walletReport'
import OtherFeeTotalPaidReports from './components/Finance/Reports/TotalPaidDueReports/otherFeeTotalPaidDueReport'

let Login = React.lazy(() => import('./components/login'))
let viewTimeTable = React.lazy(() => import('./components/manageTimeTable/viewTimeTable/viewTimeTable'))
function SuspenseComponent (WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps (nextProps) {
      console.log('Current props: ', this.props)
      console.log('Next props: ', nextProps)
    }
    render () {
      // Wraps the input component in a container, without mutating it. Good!
      return <Suspense fallback={<div style={{ width: '100%', height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center', backgroundColor: 'white', zIndex: 5000 }}> <CircularProgress color='secondary' style={{ margin: 20 }} /></div>}><WrappedComponent {...this.props} /></Suspense>
    }
  }
}
// TeacherPractice
// PracticeTests
const routes = [
  {
    path: '/quiz/start/:onlineClassId',
    component: SuspenseComponent(PreQuizHome),
    protected: true,
    exact: true,
    title: 'Start quiz'
  },
  {
    path: '/quiz/game/:onlineClassId/:lobbyUuid/:lobbyId/',
    component: SuspenseComponent(MPQuizHome),
    protected: true,
    exact: true,
    title: 'Game Play'
  },
  {
    path: '/examples/gselect',
    component: SuspenseComponent(GSelectExample),
    protected: true,
    exact: true,
    title: 'GSelect/> Example',
    roles: ['Admin', 'Teacher', 'Student', 'Planner', 'Subjecthead', 'LeadTeacher', 'CFO']
  },
  {
    path: '/examples/editor',
    component: SuspenseComponent(EditorExample),
    protected: true,
    exact: true,
    title: 'Lockdown Journal',
    roles: ['Admin', 'Teacher', 'Student', 'Planner', 'Subjecthead', 'LeadTeacher', 'CFO']
  },
  // {
  //   path: '/examples/globalselector',
  //   component: SuspenseComponent(GlobalSelectorExample),
  //   protected: true,
  //   exact: true,
  //   title: 'GlobalSelector Example',
  //   roles: ['Admin', 'Teacher', 'Student', 'Planner', 'Subjecthead', 'LeadTeacher']
  // },
  {
    path: '/examples/pselect',
    component: SuspenseComponent(PowerSelectorExample),
    protected: true,
    exact: true,
    title: 'PowerSelector Example',
    roles: ['Admin', 'Teacher', 'Student', 'Planner', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/homework',
    component: SuspenseComponent(Homework),
    protected: true,
    exact: true,
    title: 'Homeworks',
    roles: ['Teacher', 'LeadTeacher']
  },
  {
    path: '/homework/dashboard',
    component: SuspenseComponent(HomeworkDashboard),
    protected: true,
    exact: true,
    title: 'Homework Dashboard',
    roles: ['Subjecthead', 'Admin', 'Teacher', 'Planner', 'Principal', 'AcademicCoordinator', 'HomeWork Admin']
  },
  {
    path: '/homework/report',
    component: SuspenseComponent(HomeworkReport),
    protected: true,
    exact: true,
    title: 'Homework Report',
    roles: ['Subjecthead', 'Admin', 'Teacher', 'Planner', 'Principal', 'AcademicCoordinator', 'HomeWork Admin']
  },
  {
    path: '/',
    component: SuspenseComponent(Login),
    protected: false,
    exact: true
  },
  {
    path: '/login',
    component: SuspenseComponent(Login),
    protected: false,
    exact: true,
    title: 'Login'
  },
  {
    path: '/registerGuest',
    component: SuspenseComponent(RegisterGuest),
    protected: false,
    exact: true,
    title: 'Register Guest'
  },
  {
    path: '/terms_conditions',
    component: TermsConditions,
    protected: false,
    exact: true,
    title: 'Terms and Condition'
  }, {
    path: '/privacy_policy',
    component: PrivacyPolicy,
    protected: false,
    exact: true,
    title: 'Privacy Policy'
  },
  {
    path: '/selectStudent/',
    component: SuspenseComponent(SelectStudent),
    protected: true,
    exact: true,
    withoutBase: true,
    title: 'Select Student',
    roles: ['Parent']
  },
  {
    path: '/register',
    component: SuspenseComponent(Register),
    protected: false,
    exact: true,
    title: 'Register'
  },
  {
    path: '/dashboard',
    component: SuspenseComponent(dashboard),
    protected: true,
    title: 'Dashboard'
  },
  {
    path: '/student',
    component: SuspenseComponent(student),
    protected: true,
    exact: true,
    title: 'Students',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO', 'EA Academics']
  },
  {
    path: '/student/profiles/:sectionMappingId?',
    component: SuspenseComponent(StudentProfileImages),
    protected: true,
    exact: true,
    title: 'student profile Images',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
  },

  {
    path: '/student/profiles/upload/:studentId/:sectionMappingId?',
    component: SuspenseComponent(StudentProfileImageUpload),
    protected: true,
    exact: true,
    title: 'student profiles',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
  },
  {
    path: '/student/promotions/academic/',
    component: SuspenseComponent(InitiateStudentPromotions),
    protected: true,
    exact: true,
    title: 'Academic Promotions',
    // roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
    // roles: ['Admin']
    roles: ['Admin', 'Principal', 'AcademicCoordinator']
  },
  {
    path: '/student/promotions/academic/view/',
    component: SuspenseComponent(PromotedStudents),
    protected: true,
    exact: true,
    title: 'Promoted Students',
    // roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
    // roles: ['Admin'],
    roles: ['Admin', 'Principal', 'AcademicCoordinator']

  },
  {
    path: '/examples/int-mod',
    component: SuspenseComponent(mainModule),
    protected: true,
    exact: true,
    title: 'student profiles dev',
    roles: ['Admin']
  },
  {
    path: '/files',
    component: Files,
    protected: true,
    exact: true,
    title: 'Files',
    roles: ['Admin', 'Subjecthead']
  },
  {
    path: '/student/add',
    component: SuspenseComponent(StudentExtended),
    protected: true,
    exact: true,
    title: 'Add Student',
    roles: ['Admin', 'Principal', 'BDM', 'AcademicCoordinator', 'FOE', 'EA Academics']
  },
  {
    path: '/student/studentActions',
    component: SuspenseComponent(studentActions),
    protected: true,
    exact: true,
    title: 'Student Actions',
    roles: ['Admin', 'Principal', 'BDM', 'AcademicCoordinator', 'FOE', 'EA Academics']

  },
  {
    path: '/attendance/excelReport',
    component: SuspenseComponent(AttendanceExcelReportsDownload),
    protected: true,
    exact: true,
    title: 'Excel Reports',
    roles: ['Admin', 'CFO']
  },
  {
    path: '/excelReportsDownloadAdmin',
    component: SuspenseComponent(ExcelReportsDownloadAdmin),
    protected: true,
    exact: true,
    title: 'Excel Reports',
    roles: ['Admin', 'MIS']
  },
  {
    path: '/excelReport',
    component: SuspenseComponent(ExcelReport),
    protected: true,
    exact: true,
    title: 'Excel Reports',
    roles: ['Principal', 'EA Academics']
  },
  {
    path: '/bulkExcelDownloadStudentStaff',
    component: SuspenseComponent(BulkExcelDownloadStudentStaff),
    protected: true,
    exact: true,
    title: 'Bulk Data Excel Download',
    roles: ['Admin']
  },

  {
    path: '/messaging',
    component: SuspenseComponent(Messaging),
    protected: true,
    exact: true,
    title: 'Messaging',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'Teacher', 'BDM', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/generalDiary',
    component: SuspenseComponent(Communication),
    protected: true,
    exact: true,
    title: 'General Diary',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'Teacher', 'MIS', 'Student', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/generalDiary/:branch_name',
    component: SuspenseComponent(Communication),
    protected: true,
    exact: true,
    title: 'General Diary',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'Teacher', 'MIS', 'Student', 'LeadTeacher', 'EA Academics']
  },
  // {
  //   path: '/sms',
  //   component: SuspenseComponent(SMS),
  //   protected: true,
  //   exact: true,
  //   title: 'SMS'
  // },
  {
    path: '/student/edit/:id',
    // component: SuspenseComponent(editStudent),
    component: SuspenseComponent(StudentExtended),
    protected: true,
    exact: true,
    title: 'Edit Student',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Student', 'EA Academics']
  },
  {
    path: '/student/addExcel',
    component: SuspenseComponent(addStudentExcel),
    protected: true,
    exact: true,
    title: 'Add Student Excel',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/student/upload',
    component: SuspenseComponent(studentUploadData),
    protected: true,
    exact: true,
    title: 'Upload Updated Student Excel',
    roles: ['Admin']
  },
  {
    path: '/student/shuffle',
    component: SuspenseComponent(studentsShuffleUpload),
    protected: true,
    exact: true,
    title: 'Upload Shuffled Data Student Excel',
    roles: ['Admin']
  },
  {
    path: '/gradeCategory',
    component: SuspenseComponent(gradeCategory),
    protected: true,
    exact: true,
    title: 'Grade Category',
    roles: ['Admin']
  },
  {
    path: '/gradeCategory/updateGradeCategory',
    component: SuspenseComponent(editGradeCategory),
    protected: true,
    exact: true,
    title: 'update Grade Category',
    roles: ['Admin']
  },
  {
    path: '/gradeCategory/addgradecategory',
    component: SuspenseComponent(addGradeCategory),
    protected: true,
    exact: true,
    title: 'Add Grade Category',
    roles: ['Admin']
  },
  {
    path: '/vacation',
    component: SuspenseComponent(vacation),
    protected: true,
    exact: true,
    title: 'Vacation'
  },
  {
    path: '/vacation/addVacation',
    component: SuspenseComponent(addVacation),
    protected: true,
    exact: true,
    title: 'Add Vacation'
  },
  {
    path: '/vacationType',
    component: SuspenseComponent(vacationType),
    protected: true,
    exact: true,
    title: 'Vacation Type'
  },
  {
    path: '/vacationType/addVacationType',
    component: SuspenseComponent(addVacationType),
    protected: true,
    exact: true,
    title: 'Add Vacation Type'
  },
  {
    path: '/period',
    component: SuspenseComponent(period),
    protected: true,
    exact: true,
    title: 'Period'
  },
  {
    path: '/period/addPeriod',
    component: SuspenseComponent(addPeriod),
    protected: true,
    exact: true,
    title: 'Add Period'
  },
  {
    path: '/role',
    component: SuspenseComponent(role),
    protected: true,
    exact: true,
    title: 'Role',
    roles: ['Admin']
  },
  {
    path: '/role/addRole',
    component: SuspenseComponent(addRole),
    protected: true,
    exact: true,
    title: 'Add Role',
    roles: ['Admin']
  },
  {
    path: '/role/editRole',
    component: SuspenseComponent(EditRole),
    protected: true,
    exact: true,
    title: 'Edit Role',
    roles: ['Admin']
  },
  {
    path: '/role/permission',
    component: SuspenseComponent(Permission),
    protected: true,
    exact: true,
    title: 'Role Permission',
    roles: ['Admin']
  },
  {
    path: '/department',
    component: SuspenseComponent(department),
    protected: true,
    exact: true,
    title: 'Department',
    roles: ['Admin']
  },
  // {
  //   path: '/test',
  //   component: SuspenseComponent(OnlineTest),
  //   protected: true,
  //   exact: true
  // },
  {
    path: '/test/:testId/:assessId',
    component: SuspenseComponent(OnlineTest),
    protected: true,
    exact: true
  },
  {
    path: '/questbox/createTest',
    component: SuspenseComponent(CreateTest),
    protected: true,
    exact: true,
    title: 'Create Test',
    roles: ['Admin', 'Subjecthead', 'Planner', 'Teacher', 'LeadTeacher', 'ExaminationHead']
  },
  {
    path: '/questbox/viewTests',
    component: SuspenseComponent(ViewTestsHome),
    protected: true,
    exact: true,
    title: 'Tests',
    roles: ['Admin', 'Applicant', 'Planner', 'Subjecthead', 'Teacher', 'LeadTeacher', 'ExaminationHead']
  },
  // practice question analytics id base UI routing Starts here

  // {
  //   path: '/questbox/questions/practice/:subject_id?/:chapter_id?',
  //   component: SuspenseComponent(PracticeQuestionsHome),
  //   protected: true,
  //   exact: true,
  //   title: 'Practice Questions',
  //   roles: ['Student']
  // },
  {
    path: '/questbox/questions/practice/',
    component: SuspenseComponent(PracticeQuestionsHome),
    protected: true,
    exact: true,
    title: 'Practice Questions',
    // roles: ['Student']
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/questbox/questions/practice/:subject_id/',
    component: SuspenseComponent(PracticeQuestionsHome),
    protected: true,
    exact: true,
    title: 'Practice Questions',
    // roles: ['Student']
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/questbox/questions/practice/:subject_id/:chapter_id/',
    component: SuspenseComponent(PracticeQuestionsHome),
    protected: true,
    exact: true,
    title: 'Practice Questions',
    // roles: ['Student']
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/questbox/questions/practice/:subject_id/:chapter_id/:qLevel_id/',
    component: SuspenseComponent(PracticeQuestionsHome),
    protected: true,
    exact: true,
    title: 'Practice Questions',
    // roles: ['Student']
    roles: ['Student', 'GuestStudent']
  },
  // practice question analytics id base UI routing ends here
  // {
  //   path: '/questbox/PracticeQuestions',
  //   component: SuspenseComponent(PracticeQuestions),
  //   protected: true,
  //   exact: true,
  //   title: 'Practice Questions'
  // },
  {
    path: '/questbox/PracticeQuestions/edit_chapters',
    component: SuspenseComponent(HidePracticeQuestions),
    protected: true,
    exact: true,
    title: 'Practise Questions',
    roles: ['Admin']
  },
  {
    path: '/questbox/PracticeQuestions/view_analysis',
    component: SuspenseComponent(PracticeQuestionAnalysis),
    protected: true,
    exact: true,
    title: 'Practise Questions Analysis',
    roles: ['Admin', 'Principal', 'Planner', 'Reviewer', 'Subjecthead', 'Teacher', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/questbox/onlineClass',
    component: SuspenseComponent(OnlineClass),
    protected: true,
    exact: true,
    title: 'Online Class',
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/questbox/handleTest/:id/:user_id?',
    component: SuspenseComponent(HandleTest),
    protected: true,
    exact: true,
    title: 'Test'
  },
  {
    path: '/department/addDepartment',
    component: SuspenseComponent(addDepartment),
    protected: true,
    exact: true,
    title: 'Add Department',
    roles: ['Admin']
  },
  {
    path: '/department/editDepartment',
    component: SuspenseComponent(EditDepartment),
    protected: true,
    exact: true,
    title: 'Edit Department',
    roles: ['Admin']
  },
  {
    path: '/staff',
    component: SuspenseComponent(staff),
    protected: true,
    exact: true,
    title: 'Staff',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'HR', 'CFO', 'EA Academics']
  },
  {
    path: '/staff/add',
    component: SuspenseComponent(addStaff),
    protected: true,
    exact: true,
    title: 'Add Staff',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'HR', 'EA Academics']
  },
  {
    path: '/staff/upload',
    component: SuspenseComponent(addStaffExcel),
    protected: true,
    exact: true,
    title: 'Add Staff Excel',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },

  {
    path: '/staff/edit/:id',
    component: SuspenseComponent(addStaff),
    protected: true,
    exact: true,
    title: 'Edit Staff',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'HR', 'EA Academics']
  },
  {
    path: '/staff/mapping',
    component: SuspenseComponent(staffMapping),
    protected: true,
    exact: true,
    title: 'Staff Mapping',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/subject',
    component: SuspenseComponent(manageSubject),
    protected: true,
    exact: true,
    title: 'Subject',
    roles: ['Admin']
  },
  {
    path: '/subject/add',
    component: SuspenseComponent(addSubject),
    protected: true,
    exact: true,
    title: 'Add Subject',
    roles: ['Admin']
  },
  {
    path: '/subject/editSubject',
    component: SuspenseComponent(editSubject),
    protected: true,
    exact: true,
    title: 'Edit Subject',
    roles: ['Admin']
  },
  {
    path: '/subjectMapping',
    component: SuspenseComponent(subjectMapping),
    protected: true,
    exact: true,
    title: 'Subject Mapping',
    roles: ['Admin']
  },
  {
    path: '/subject/addMapping',
    component: SuspenseComponent(addSubjectMapping),
    protected: true,
    exact: true,
    title: 'Add Subject Mapping',
    roles: ['Admin']
  },
  {
    path: '/subject/editSubjectMapping',
    component: SuspenseComponent(EditSubjectMapping),
    protected: true,
    exact: true,
    title: 'Edit Subject Mapping',
    roles: ['Admin']
  },
  {
    path: '/grade',
    component: SuspenseComponent(grade),
    protected: true,
    exact: true,
    title: 'Grade',
    roles: ['Admin']
  },
  {
    path: '/grade/add',
    component: SuspenseComponent(addGrade),
    protected: true,
    exact: true,
    title: 'Add Grade',
    roles: ['Admin']
  },
  {
    path: '/grade/editGrade',
    component: SuspenseComponent(EditGrade),
    protected: true,
    exact: true,
    title: 'Edit Grade',
    roles: ['Admin']
  },
  {
    path: '/gradeMapping',
    component: SuspenseComponent(gradeMapping),
    protected: true,
    exact: true,
    title: 'Grade Mapping',
    roles: ['Admin']
  },
  {
    path: '/gradeMapping/editGradeMapping',
    component: SuspenseComponent(editGradeMapping),
    protected: true,
    exact: true,
    title: 'Edit Grade Mapping',
    roles: ['Admin']
  },
  {
    path: '/gradeMapping/addGradeMapping',
    component: SuspenseComponent(addGradeMapping),
    protected: true,
    exact: true,
    title: 'Add Grade Mapping',
    roles: ['Admin']
  },
  {
    path: '/section',
    component: SuspenseComponent(section),
    protected: true,
    exact: true,
    title: 'Section',
    roles: ['Admin']
  },
  {
    path: '/section/add',
    component: SuspenseComponent(addSection),
    protected: true,
    exact: true,
    title: 'Add Section',
    roles: ['Admin']
  },
  {
    path: '/section/editSection',
    component: SuspenseComponent(editSection),
    protected: true,
    exact: true,
    title: 'Edit Section',
    roles: ['Admin']
  },
  {
    path: '/sectionMapping',
    component: SuspenseComponent(sectionMapping),
    protected: true,
    exact: true,
    title: 'Section Mapping',
    roles: ['Admin']
  },
  {
    path: '/sectionMapping/add',
    component: SuspenseComponent(addSectionMapping),
    protected: true,
    exact: true,
    title: 'Add Section Mapping',
    roles: ['Admin']
  },
  {
    path: '/branch',
    component: SuspenseComponent(branch),
    protected: true,
    exact: true,
    title: 'Branch',
    roles: ['Admin']
  },
  {
    path: '/branch/edit/:id',
    component: SuspenseComponent(EditBranch),
    protected: true,
    exact: true,
    title: 'Edit Branch',
    roles: ['Admin']
  },
  {
    path: '/branch/add',
    component: SuspenseComponent(addBranch),
    protected: true,
    exact: true,
    title: 'Add Branch',
    roles: ['Admin']
  },
  {
    path: '/session',
    component: SuspenseComponent(session),
    protected: true,
    exact: true,
    title: 'Session',
    roles: ['Admin']
  },
  {
    path: '/sessionMapping/add',
    component: SuspenseComponent(addSessionMapping),
    protected: true,
    exact: true,
    title: 'Add Session Mapping',
    roles: ['Admin']
  },
  {
    path: '/designation',
    component: SuspenseComponent(designation),
    protected: true,
    exact: true,
    title: 'Designation',
    roles: ['Admin']
  },
  {
    path: '/designation/add',
    component: SuspenseComponent(addDesignation),
    protected: true,
    exact: true,
    title: 'Add Designation',
    roles: ['Admin']
  },
  {
    path: '/classGroup',
    component: SuspenseComponent(classGroup),
    protected: true,
    exact: true,
    title: 'Class Group'
  },
  {
    path: '/classGroup/add',
    component: SuspenseComponent(addClassGroup),
    protected: true,
    exact: true,
    title: 'Add Class Group'
  },
  {
    path: '/classGroup/view',
    component: SuspenseComponent(ViewClassGroup),
    protected: true,
    exact: true,
    title: 'View Class Group'
  },
  {
    path: '/classGroup/list',
    component: SuspenseComponent(ListClassGroup),
    protected: true,
    exact: true,
    title: 'List Class Group',
    roles: ['Admin', 'AOLAdmin', 'Online Class Admin']
  },
  {
    path: '/Settings/settings',
    component: SuspenseComponent(Settings),
    protected: true,
    exact: true,
    title: 'Settings',
    roles: ['Admin', 'Principal', 'EA Academics', 'FOE']
  },
  {
    path: '/assignSubjectTeacher',
    component: SuspenseComponent(assignSubjectTeacher),
    protected: true,
    exact: true,
    title: 'Assign Subject Teacher',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/calendar',
    component: SuspenseComponent(Calendar),
    protected: true,
    exact: true,
    title: 'Calendar',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']

  },
  {
    path: '/publications',
    component: SuspenseComponent(Publications),
    protected: true,
    exact: true,
    title: 'Publications'

  },
  {
    path: '/publicationsViewer',
    component: SuspenseComponent(PublicationsViewer),
    protected: true,
    exact: true,
    title: 'PublicationsViewer'

  },
  {
    path: '/timetable',
    component: SuspenseComponent(viewTimeTable),
    protected: true,
    exact: true,
    title: 'Timetable',
    roles: ['Admin', 'Principal', 'FOE', 'AcademicCoordinator', 'Teacher', 'BDM', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/daily_timetable',
    component: SuspenseComponent(DailyTimeTable),
    protected: true,
    exact: true,
    title: 'Daily Timetable',
    roles: ['Teacher', 'LeadTeacher']
  },
  {
    path: '/teacherHistory/:id',
    component: SuspenseComponent(teacherHistory),
    protected: true,
    exact: true,
    title: 'Teacher Report History'
  },
  {
    path: '/teacher-report/add_',
    component: SuspenseComponent(addteacherReport),
    protected: true,
    exact: true,
    title: 'Add Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/teacher-report/add',
    component: SuspenseComponent(addteacherReport2),
    protected: true,
    exact: true,
    title: 'Add Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/teacher-report/edit/:id',
    component: SuspenseComponent(editTeacherReport),
    protected: true,
    exact: true,
    title: 'Edit Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/teacher-report/show',
    component: SuspenseComponent(showTeacherReport),
    protected: true,
    exact: true,
    title: 'View Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'Subjecthead', 'Student', 'MIS', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/teacher-list',
    component: SuspenseComponent(LatestTeacherReport),
    protected: true,
    exact: true,
    title: 'Teacher List',
    roles: ['Planner', 'Principal', 'Admin', 'Subjecthead', 'EA Academics']
  },
  {
    path: '/teacher-report/view',
    component: SuspenseComponent(showTeacherReport),
    protected: true,
    exact: true,
    title: 'View Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'Subjecthead', 'MIS', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/teacher-report/view/:branch_id',
    component: SuspenseComponent(showTeacherReport),
    protected: true,
    exact: true,
    title: 'View Teacher Report',
    roles: ['Planner', 'Reviewer', 'Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'Subjecthead', 'MIS', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/teacher-report/viewHomeworkSubmission',
    component: SuspenseComponent(HomeworkSubmission),
    protected: true,
    exact: true,
    title: 'View Submissions',
    roles: ['Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/lessonplan',
    component: SuspenseComponent(ViewLessonPlan),
    protected: true,
    exact: true,
    title: 'Lesson Plan',
    roles: ['Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/dashboard',
    component: SuspenseComponent(dashboardQuestBox),
    protected: true,
    exact: true,
    title: 'Dashboard'
  },
  {
    path: '/questbox/addquestion',
    component: SuspenseComponent(AddQuestion),
    protected: true,
    exact: true,
    title: 'Add Question',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/create_assessment',
    component: SuspenseComponent(CreateAssessment),
    protected: true,
    exact: true,
    title: 'Create Assessment',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher', 'ExaminationHead']
  },
  {
    path: '/questbox/configuration',
    component: SuspenseComponent(AssessmentTypesAndCategory),
    protected: true,
    exact: true,
    title: 'Assessment Configuration Mappings',
    roles: ['Admin', 'Subjecthead', 'ExaminationHead']
  },
  {
    path: '/questbox/addchapter',
    component: SuspenseComponent(AddChapter),
    protected: true,
    exact: true,
    title: 'Add Chapter',
    roles: ['Admin', 'Subjecthead']
    // roles: ['Admin', 'Planner', 'Subjecthead']
  },
  {
    path: '/questbox/viewchapter',
    component: SuspenseComponent(ViewChapter),
    protected: true,
    exact: true,
    title: 'View Chapter',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/editquestion/:id/type/:type',
    component: SuspenseComponent(QuestionEdit),
    protected: true,
    exact: true,
    title: 'Edit Question',
    roles: ['Admin', 'Planner', 'Reviewer', 'Subjecthead', 'Teacher', 'LeadTeacher']
  },
  {
    path: '/questbox/questions/view/reported_questions',
    component: SuspenseComponent(ViewReportedQuestions),
    protected: true,
    exact: true,
    title: 'View Reported Questions',
    roles: ['Admin', 'Planner', 'Reviewer', 'Subjecthead', 'Teacher', 'LeadTeacher']
  },
  {
    path: '/questbox/createquestionpaper',
    component: SuspenseComponent(createQuestionPaper),
    protected: true,
    exact: true,
    title: 'Create Question paper',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/add',
    component: SuspenseComponent(addQuestionPaper),
    protected: true,
    exact: true,
    title: 'Add Question paper Type and Sub Type',
    roles: ['Admin', 'Subjecthead', 'ExaminationHead']
  },
  {
    path: '/questbox/view',
    component: SuspenseComponent(viewQuestionPapers),
    protected: true,
    exact: true,
    title: 'View Question Paper Type and Sub Type ',
    roles: ['Admin', 'Subjecthead', 'ExaminationHead']
  },
  {
    path: '/questbox/questionpaper',
    component: SuspenseComponent(ViewQuestionPaper),
    protected: true,
    exact: true,
    title: 'View Question Paper',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/view_questionPaper_detail/:id',
    component: SuspenseComponent(QuestionPaperDetails),
    protected: true,
    exact: true,
    title: 'View Question paper Details',
    roles: ['Admin', 'Planner', 'Reviewer', 'Subjecthead', 'Teacher', 'LeadTeacher', 'ExaminationHead']
  },
  {
    path: '/questbox/view_questionPaper_detail/:id/:studentid/:testid',
    component: SuspenseComponent(QuestionPaperDetails),
    protected: true,
    exact: true,
    title: 'View Question paper Details',
    roles: ['Subjecthead', 'Examinationhead']
  },
  {
    path: '/questbox/view_questionPaper_detail/:id/:studentid/:testid',
    component: SuspenseComponent(QuestionPaperDetails),
    protected: true,
    exact: true,
    title: 'View Question paper Details',
    roles: ['Subjecthead', 'Examinationhead']
  },
  {
    path: '/questbox/uploadQuestionExcel',
    component: SuspenseComponent(UploadQuestionExcel),
    protected: true,
    exact: true,
    title: 'Upload Question Excel',
    roles: ['Admin', 'Subjecthead', 'Planner']
  },
  {
    path: '/questbox/upload_result_excel',
    component: SuspenseComponent(UploadResult),
    protected: true,
    exact: true,
    title: 'Upload Result',
    roles: ['Admin', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/listquestion',
    component: SuspenseComponent(ListQuestion),
    protected: true,
    exact: true,
    title: 'List Question',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/list_comprehension_question',
    component: SuspenseComponent(ListCompQuestion),
    protected: true,
    exact: true,
    title: 'List Comprehension Question',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/student_report',
    component: SuspenseComponent(StudentReport),
    protected: true,
    exact: true,
    title: 'Daily Diary',
    roles: ['Student']
  },
  {
    path: '/student_submission',
    component: SuspenseComponent(StudentSubmissions),
    protected: true,
    exact: true,
    title: 'Homework Submissions',
    roles: ['Student']
  },
  {
    path: '/contact_updation',
    component: SuspenseComponent(ParentContactInfoUpdation),
    protected: true,
    exact: true,
    title: 'Contact Update',
    roles: ['Student']
  },
  {
    path: '/student_calendar',
    component: SuspenseComponent(StudentCalender),
    protected: true,
    exact: true,
    title: 'Calendar',
    roles: ['Student']
  },
  {
    path: '/teacher_practice',
    component: SuspenseComponent(ViewTestsHome),
    protected: true,
    exact: true,
    title: 'Question Practice',
    roles: ['Student', 'Teacher', 'LeadTeacher']
  },
  {
    path: '/student_test/online',
    component: SuspenseComponent(StudentTests),
    protected: true,
    exact: true,
    title: 'Test',
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/student_test/practice',
    component: SuspenseComponent(StudentPracticeTests),
    protected: true,
    exact: true,
    title: 'Test',
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/student_timetable',
    component: SuspenseComponent(StudentTimeTable),
    protected: true,
    exact: true,
    title: 'Time Table',
    roles: ['Student']
  },
  {
    path: '/questbox/assessment/view',
    component: SuspenseComponent(viewAssessment),
    protected: true,
    exact: true,
    title: 'View Assessment',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher', 'ExaminationHead']
  },
  {
    path: '/questbox/assessment/view/section/:id/:id1',
    component: SuspenseComponent(assessmentDetail),
    protected: true,
    exact: true,
    title: 'Assessment Detail',
    roles: ['Admin', 'Planner', 'Reviewer', 'Subjecthead']
  },
  {
    path: '/questbox/assessment/view/section/student/:id/:id1',
    component: SuspenseComponent(studentAssessment),
    protected: true,
    exact: true,
    title: 'Student Assessment',
    roles: ['Admin', 'Planner', 'Reviewer', 'Subjecthead']
  },
  {
    path: '/change_Password',
    component: SuspenseComponent(ChangePassword),
    protected: true,
    exact: true,
    title: 'Change Password'
  },
  {
    path: '/reset_Password',
    component: SuspenseComponent(ResetPassword),
    protected: false,
    exact: true,
    title: 'Reset Password'
  },
  {
    path: '/forgot_password',
    component: SuspenseComponent(Reset),
    protected: false,
    exact: true,
    title: 'forgot Password'
  },
  {
    path: '/updatePassword',
    component: SuspenseComponent(UpdatePassword),
    protected: true,
    exact: true,
    withoutBase: true,
    title: 'Update Password'
  },
  {
    path: '/practice_question_dashboard',
    component: SuspenseComponent(practiceQuesDashboard),
    protected: true,
    exact: true,
    title: 'Practice Question Dashboard',
    roles: ['Student', 'Teacher', 'LeadTeacher']
  },
  {
    path: '/attendance',
    component: SuspenseComponent(attendance),
    protected: true,
    exact: true,
    title: 'Attendance',
    roles: ['Teacher', 'BDM', 'FOE', 'Admin', 'Principal', 'AcademicCoordinator', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/attendance/view',
    component: SuspenseComponent(ViewAttendance),
    protected: true,
    exact: true,
    title: 'View Attendance',
    roles: ['Teacher', 'Student', 'FOE', 'BDM', 'Admin', 'Principal', 'AcademicCoordinator', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/editConatactNumber',
    component: SuspenseComponent(StudentContactNumber),
    protected: true,
    exact: true,
    // title: 'Upload Circular',
    roles: ['Student']

  },
  {
    path: '/circular',
    component: SuspenseComponent(circular),
    protected: true,
    exact: true,
    title: 'Upload Circular',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']

  },
  {
    path: '/v2/circular',
    component: SuspenseComponent(circular2),
    protected: true,
    exact: true,
    title: 'Upload Circular',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/v2/circular/view',
    component: SuspenseComponent(viewCircular2),
    protected: true,
    exact: true,
    title: 'View Circular',
    roles: ['Teacher', 'Admin', 'Principal', 'AcademicCoordinator', 'Student', 'BDM', 'MIS', 'LeadTeacher', 'CFO', 'EA Academics']
  },
  {
    path: '/remarks',
    component: SuspenseComponent(studentRemarks),
    protected: true,
    exact: true,
    title: 'Remarks',
    roles: ['Student', 'CFO']
  },
  {
    path: '/remarks/:id',
    component: SuspenseComponent(studentRemarks),
    protected: true,
    exact: true,
    title: 'Remarks',
    roles: ['Student', 'Admin', 'Teacher', 'CFO']
  },

  {
    path: '/v2/circular/view/:branch_id',
    component: SuspenseComponent(viewCircular2),
    protected: true,
    exact: true,
    title: 'View Circular',
    roles: ['Teacher', 'Admin', 'Principal', 'AcademicCoordinator', 'Student', 'BDM', 'MIS', 'LeadTeacher']
  },
  {
    path: '/circular/view',
    component: SuspenseComponent(viewCircular),
    protected: true,
    exact: true,
    title: 'View Circular',
    roles: ['Teacher', 'Admin', 'Principal', 'AcademicCoordinator', 'Student', 'BDM', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/circular/edit/:id',
    component: SuspenseComponent(circular),
    protected: true,
    exact: true,
    title: 'Edit Circular',
    roles: ['Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/feeds/upload',
    component: SuspenseComponent(UploadFeeds),
    protected: true,
    exact: true,
    title: 'Upload Feed',
    roles: ['Admin', 'Subjecthead']
  },
  {
    path: '/feeds/view',
    component: SuspenseComponent(ViewFeeds),
    protected: true,
    exact: true,
    title: 'View Feeds',
    roles: ['Admin', 'Subjecthead', 'Student']
  },
  {
    path: '/studentIdCard/:id',
    component: SuspenseComponent(StudentIdCard),
    protected: true,
    exact: true,
    title: 'Student ID Card'
  },
  {
    path: '/sms/classWiseSms',
    component: SuspenseComponent(ClassWiseSms),
    protected: true,
    exact: true,
    title: 'Classwise SMS',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'FOE', 'EA Academics']
  },
  {
    path: '/sms/newAdmittedStudents',
    component: SuspenseComponent(NewAdmittedStudents),
    protected: true,
    exact: true,
    title: 'New Admitted Students'
  },
  {
    path: '/message',
    component: SuspenseComponent(message),
    protected: true,
    exact: true,
    title: 'Upload Message',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/message/view',
    component: SuspenseComponent(viewMessage),
    protected: true,
    exact: true,
    title: 'View Message',
    roles: ['Student']
  },
  {
    path: '/message/edit/:id',
    component: SuspenseComponent(message),
    protected: true,
    exact: true,
    title: 'Edit Message',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/microschedule',
    component: SuspenseComponent(ViewMicroSchedule),
    protected: true,
    exact: true,
    title: 'MicroSchedule',
    roles: ['Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/grievance',
    component: grievance,
    protected: true,
    exact: true,
    title: 'Support',
    roles: ['Student', 'GuestStudent']

  },
  {
    path: '/applicant/scholarship/:status/:userId/:key',
    component: SuspenseComponent(Scholarship),
    protected: false,
    exact: true,
    title: 'Scholarship'
  },
  {
    path: '/paytm/',
    component: Paytm,
    protected: true,
    exact: true
  },
  {
    path: '/airpay/',
    component: Airpay,
    protected: true,
    exact: true
  },
  {
    path: '/razorpay/',
    component: Razorpay,
    protected: true,
    exact: true
  },
  {
    path: '/book_uniform_payment/',
    component: Airpay,
    protected: true,
    exact: true
  },
  {
    path: '/fee_payment/',
    component: Airpay,
    protected: true,
    exact: true
  },
  {
    path: '/airpayresponse/',
    component: AirpayResponse,
    protected: true,
    exact: true
  },
  {
    path: '/meal',
    component: Meal,
    protected: true,
    exact: true,
    roles: ['Student', 'Teacher', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/finance/feetype',
    component: FeeType,
    protected: true,
    exact: true,
    title: 'Normal Fee Type',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/currFeeType',
    component: CurrFeeType,
    protected: true,
    exact: true,
    title: 'Curricular Fee Type',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/currFeeTypeAcc',
    component: CurrFeeTypeAcc,
    protected: true,
    exact: true,
    title: 'Curricular Fee Type Acc',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/misc_feeType',
    component: MiscFeeType,
    protected: true,
    exact: true,
    title: 'Misc Fee Type',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/transaction_status',
    component: TransactionStatus,
    protected: true,
    exact: true,
    title: 'Transaction Status',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/other_feeType',
    component: OtherFeeType,
    protected: true,
    exact: true,
    title: 'Other Fee Type',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/view_feePlan',
    component: CreateFeePlan,
    protected: true,
    exact: true,
    title: 'Fee Plan',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/manage_feeType/:id',
    component: ManageFeeType,
    protected: true,
    exact: true,
    title: 'Manage Fee Type',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/manage_feeType/add/:id',
    component: AddFeePlanType,
    protected: true,
    exact: true,
    title: 'Add Fee Plan',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/edit_installment/:id',
    component: EditFeeInstallment,
    protected: true,
    exact: true,
    title: 'Edit Installment',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/feePlan_name/edit/:id',
    component: EditFeePlanName,
    protected: true,
    exact: true,
    title: 'Edit Fee Plan',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/create_feePlan',
    component: AddFeePlan,
    protected: true,
    exact: true,
    title: 'Create Fee Plan',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/misc_feeClass',
    component: MiscFeeClass,
    protected: true,
    exact: true,
    title: 'Misc Fee Class',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/misc_feeClass/edit/:id',
    component: EditMiscFee,
    protected: true,
    exact: true,
    title: 'Misc Fee Class',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/corporate_bank',
    component: TabView,
    protected: true,
    exact: true,
    title: 'Corporate Bank',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/create_receipt',
    component: createReceipt,
    protected: true,
    exact: true,
    title: 'Create Receipt',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/manage_payment',
    component: ManagePayment,
    protected: true,
    exact: true,
    title: 'Manage Payment',
    roles: ['Student', 'FinanceAccountant']
  },
  {
    path: '/finance/fee_structure',
    component: FeeStructure,
    protected: true,
    exact: true,
    title: 'Fee Structure',
    roles: ['Student']
  },
  {
    path: '/finance/concession_settings',
    component: ConcessionSettings,
    protected: true,
    exact: true,
    title: 'Concession Settings',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/makePayment',
    component: MakePayment,
    protected: true,
    exact: true,
    title: 'Make Payment',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/makeStorePayment/',
    component: ConfigItems,
    protected: true,
    exact: true,
    title: 'Configure Items',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/feeStructureAcc',
    component: FeeStructureAcc,
    protected: true,
    exact: true,
    title: 'Fee Structure',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/expmngmt/deposit',
    component: DepositTab,
    protected: true,
    exact: true,
    title: 'Expense Management Deposit',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/expmngmt/ledger',
    component: Ledger,
    protected: true,
    exact: true,
    title: 'Expense Management Ledger',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/bulkactiveinactivestudent',
    component: BulkActiveInactive,
    protected: true,
    exact: true,
    title: 'Permanent Active / Inactive',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/bulkactiveinactiveparent',
    component: BulkActiveInactiveParent,
    protected: true,
    exact: true,
    title: 'Temporary Active / Inactive',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/e-mandate',
    component: EMandate,
    protected: true,
    exact: true,
    title: 'E-Mandate',
    roles: ['EMedateAdmin']
  },
  {
    path: '/finance/e-customerdetails',
    component: AddCustomerDeatils,
    protected: true,
    exact: true,
    title: 'Add Customer Details',
    roles: ['EmedateAdmin']
  },
  {
    path: '/finance/e-customerdetail',
    component: AddCustomerDeatils,
    protected: true,
    exact: true,
    title: 'Customer Details',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/e-orderdetails',
    component: OrderDetails,
    protected: true,
    exact: true,
    title: 'Add Order Details',
    roles: ['EmedateAdmin']
  },
  {
    path: '/finance/e-orderdetail',
    component: OrderDetails,
    protected: true,
    exact: true,
    title: 'Order Details',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/e-generatesubsequentpayment',
    component: GenerateSubsequentPayment,
    protected: true,
    exact: true,
    title: 'Generate Subsequent Payment',
    roles: ['EmedateAdmin', 'FinanceAdmin']
  },
  {
    path: '/finance/billingDetails',
    component: BillingDetails,
    protected: true,
    exact: true,
    title: 'Billing Details',
    roles: ['EMedateAdmin', 'FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/uploadOnlinePayments',
    component: OnlinePayment,
    protected: true,
    exact: true,
    title: 'Upload Online Payments',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/onlineAdmissions',
    component: OnlineAdmission,
    protected: true,
    exact: true,
    title: 'Pending Online Admission',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/dailybillingdeatils',
    component: DailyBillingDetails,
    protected: true,
    exact: true,
    title: 'Total Billing Details ',
    roles: ['EMedateAdmin', 'FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/dailybillingdeatilspage',
    component: DailyBillingDetailsPage,
    protected: true,
    exact: true,
    title: 'Daily Billing Details ',
    roles: ['EMedateAdmin', 'FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/createLink',
    component: CreateLink,
    protected: true,
    exact: true,
    title: 'Create Link',
    roles: ['EMedateAdmin']
  },
  {
    path: '/finance/onlinepaymentupload',
    component: OnlinePaymentUpload,
    protected: true,
    exact: true,
    title: 'Online Payment Upload',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/bulkReportUpload',
    component: BulkReportUpload,
    protected: true,
    exact: true,
    title: 'Bulk Report Upload',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/bulkFeeUpload',
    component: BulkFeeUpload,
    protected: true,
    exact: true,
    title: 'Bulk Fee Upload',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/bulkReportStatus',
    component: BulkReportStatus,
    protected: true,
    exact: true,
    title: 'Bulk Report Status',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/bulkaccountantlogin',
    component: BulkAccountantLogin,
    protected: true,
    exact: true,
    title: 'Bulk Accountant Login',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/accountant/transactionStatus',
    component: AccountantTransaction,
    protected: true,
    exact: true,
    title: 'Transaction Status',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/pettyexpnc',
    component: PettyExpenses,
    protected: true,
    exact: true,
    title: 'Petty Cash Expenses',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/acceptrejectPayment',
    component: AcceptRejectPayment,
    protected: true,
    exact: true,
    title: 'Accept/Reject Payment',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/makeentry',
    component: MakeEntry,
    protected: true,
    exact: true,
    title: 'Make Entry',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/bankreport/:id',
    component: BankReport,
    protected: true,
    exact: true,
    title: 'Bank Report',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/otherFees_payment',
    component: OtherFeesAccountant,
    protected: true,
    exact: true,
    title: 'Other Fee Payment',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/certificate',
    component: AccountantCerti,
    protected: true,
    exact: true,
    title: 'Certificate',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/cashreport',
    component: CashReport,
    protected: true,
    exact: true,
    title: 'Cahs Report',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/assign_otherFees',
    component: AssignOtherFees,
    protected: true,
    exact: true,
    title: 'Assign Other Fees',
    roles: ['FinanceAccountant']
  },
  {
    path: '/store/additems',
    component: AddItems,
    protected: true,
    exact: true,
    title: 'Add Items',
    roles: ['StoreAdmin']
  },
  {
    path: '/store/shippingamount',
    component: ShippingAmount,
    protected: true,
    exact: true,
    title: 'Shipping Amount',
    roles: ['FinanceAccountant', 'Student']
  },
  {
    path: '/store/addkit',
    component: AdminKit,
    protected: true,
    exact: true,
    title: 'Add Kit',
    roles: ['StoreAdmin']
  },
  {
    path: '/store/addGst',
    component: AddGst,
    protected: true,
    exact: true,
    title: 'GST',
    roles: ['StoreAdmin']
  },
  {
    path: '/store/orderStatusUpload',
    component: OrderStatusUpload,
    protected: true,
    exact: true,
    title: 'Order Status Upload',
    roles: ['StoreAdmin']
  },
  {
    path: '/store/subcategoryallow',
    component: SubCategoryAllow,
    protected: true,
    exact: true,
    title: 'Sub-Category',
    roles: ['StoreAdmin']
  },
  {
    path: '/store/storereports',
    component: StoreReports,
    protected: true,
    exact: true,
    title: 'Store Reports',
    roles: ['StoreAdmin', 'FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/store/studentUniform',
    component: StudentUniform,
    title: 'Student Uniform',
    protected: true,
    exact: true,
    roles: ['StoreManager', 'Student']
  },
  {
    path: '/store/bulkUniform',
    component: BulkUniform,
    title: 'Bulk Uniform Upload',
    protected: true,
    exact: true,
    roles: ['StoreManager', 'Principal', 'BDM', 'FOE', 'EA Academics']
  },
  {
    path: '/store/bulkUniformVedio',
    component: UniformVedio,
    title: 'Uniform Video',
    protected: true,
    exact: true,
    roles: ['StoreManager', 'Principal', 'BDM', 'FOE', 'EA Academics']
  },
  {
    path: '/store/uniformChart',
    component: UniformChart,
    title: 'View Uniform Chart',
    protected: true,
    exact: true,
    roles: ['StoreManager', 'Principal', 'BDM', 'FOE', 'EA Academics']
  },
  {
    path: '/finance/accountant/postdatecheque',
    component: PostDateCheque,
    protected: true,
    exact: true,
    title: 'Post Date Cheque',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/assignfeeplantostudent',
    component: ChangeFeePlanToStudent,
    protected: true,
    exact: true,
    title: 'Assign Fee Plan',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/applicationForm',
    component: ApplicationFormAcc,
    protected: true,
    exact: true,
    title: 'Application Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/registrationForm',
    component: RegistrationForm,
    protected: true,
    exact: true,
    title: 'Registration Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/newregistrationForm',
    component: NewRegistrationForm,
    protected: true,
    exact: true,
    title: 'Registration Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/store',
    component: StoreAtAcc,
    protected: true,
    exact: true,
    title: 'Store',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/partylist',
    component: PartyList,
    protected: true,
    exact: true,
    title: 'Party List',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/ledgerreport',
    component: LedgerReport,
    protected: true,
    exact: true,
    title: 'Ledger Report',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/accountant/financialledgerreport',
    component: FinancialLedgerReport,
    protected: true,
    exact: true,
    title: 'Financial Ledger Report',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/other_fee',
    component: AdminOtherFees,
    protected: true,
    exact: true,
    title: 'Other Fee',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/add_otherFee',
    component: AddOtherFees,
    protected: true,
    exact: true,
    title: 'Add Other Fee',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/incomeTaxCertificate',
    component: ItCertificate,
    protected: true,
    exact: true,
    title: 'IT Certificate',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/lastDateSettings',
    component: LastDateSettings,
    protected: true,
    exact: true,
    title: 'Last Date Settings',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/changeFeePaymentRequests',
    component: FeePaymentChangeRequests,
    protected: true,
    exact: true,
    title: 'Fee Change Request',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/pendingRequests',
    component: PendingRequests,
    protected: true,
    exact: true,
    title: 'Pending Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/approvedRequestView',
    component: ApprovedRequestView,
    protected: true,
    exact: true,
    title: 'Approved Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/rejectedRequestView',
    component: RejectedRequestView,
    protected: true,
    exact: true,
    title: 'Rejected Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/cancelledRequestView',
    component: CancelledRequestView,
    protected: true,
    exact: true,
    title: 'Cancelled Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/editTransactionDetails',
    component: EditTransactionDetails,
    protected: true,
    exact: true,
    title: 'Edit Transaction Details',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/storePayRequests',
    component: StorePaymentRequests,
    protected: true,
    exact: true,
    title: 'Store Payment Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/pendingStoreRequests',
    component: PendingStoreRequests,
    protected: true,
    exact: true,
    title: 'Pending Store Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/approvedStoreRequests',
    component: ApprovedStoreRequests,
    protected: true,
    exact: true,
    title: 'Approved Store Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/rejectedStoreRequests',
    component: RejectedStoreRequests,
    protected: true,
    exact: true,
    title: 'Rejected Store Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/cancelledStoreRequests',
    component: CancelledStoreRequests,
    protected: true,
    exact: true,
    title: 'Cancelled Store Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/editStoreTransactionDetails',
    component: EditStoreTransactionDetails,
    protected: true,
    exact: true,
    title: 'Edit Store Transaction',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/qrcodegenerator',
    component: QRCodeGenerator,
    protected: true,
    exact: true,
    title: 'QR Code Generator',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/createcoupon',
    component: CreateCoupon,
    protected: true,
    exact: true,
    title: 'Create Coupon',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/assigncoupon',
    component: AssignCoupon,
    protected: true,
    exact: true,
    title: 'Assign Coupon',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/studentwallet',
    component: ExtraAmtAdjust,
    protected: true,
    exact: true,
    title: 'Student Wallet',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/reassigncoupon',
    component: ReAssignCoupon,
    protected: true,
    exact: true,
    title: 'ReAssign Coupon',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/tally_reports',
    component: TallyReports,
    protected: true,
    exact: true,
    title: 'Tally Reports',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/receipt_book',
    component: ReceiptBook,
    protected: true,
    exact: true,
    title: 'Receipt Book',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/total_paid_due_reports',
    component: TotalPaidReports,
    protected: true,
    exact: true,
    title: 'Total Paid Due Reports',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/Other_fee_total_paid_due_reports',
    component: OtherFeeTotalPaidReports,
    protected: true,
    exact: true,
    title: ' Other Fee Total Paid Due Reports',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/chequeBounceReports',
    component: ChequeBounceReports,
    protected: true,
    exact: true,
    title: 'Cheque Bounce Reports',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/registration_feeType',
    component: RegistrationFee,
    protected: true,
    exact: true,
    title: 'Registration/Application Fee',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/receiptSettings',
    component: ReceiptSettings,
    protected: true,
    exact: true,
    title: 'Receipt Settings',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/studentInfo',
    component: StudentInfoAdm,
    protected: true,
    exact: true,
    title: 'Student Info',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/ActivateInactivateStudent',
    component: ActivateInactivateStudentAdm,
    protected: true,
    exact: true,
    title: 'Student Reactivate/Inactive',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/FeeCollection',
    component: FeeCollection,
    protected: true,
    exact: true,
    title: 'Fee Collection',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/assignDeliveryCharge',
    component: AssignDelieveryCharge,
    protected: true,
    exact: true,
    title: 'Assign Delivery Charge Kit Books & Uniform',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/feeShowList',
    component: FeeShowList,
    protected: true,
    exact: true,
    Title: 'Fee List',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/studentLedger',
    component: StudentLedgerTab,
    protected: true,
    exact: true,
    title: 'Student Ledger',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/postDateChequeCount',
    component: PostDateCount,
    protected: true,
    exact: true,
    title: 'Post Date Cheque Count',
    roles: ['FinanceAccountant']
  },
  // {
  //   path: '/finance/changeStudentStatus',
  //   component: ChangeStudentStatus,
  //   protected: true,
  //   exact: true,
  //   roles: ['FinanceAccountant']
  // },
  {
    path: '/finance/AdmissionForm',
    component: AdmissionFormAcc,
    protected: true,
    exact: true,
    title: 'Admission Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/newAdmissionForm',
    component: NewAdmissionFormAcc,
    protected: true,
    exact: true,
    title: 'New Admission Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/NonRTEFormAcc',
    component: NonRTEFormAcc,
    protected: true,
    exact: true,
    title: 'Non RTE Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/UpdateAdmissionForm',
    component: UpdateAdmissionFormAcc,
    protected: true,
    exact: true,
    title: 'Update Admission Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/customizedAdmissionForm',
    component: CustomizedAdmissionFormAcc,
    protected: true,
    exact: true,
    title: 'Admission Form',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/StudentActivateInactiveAcc',
    component: StudentActivateInactiveAcc,
    protected: true,
    exact: true,
    title: 'Student Active/Inactive',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/communicationsms',
    component: CommunicationSMS,
    protected: true,
    exact: true,
    title: 'Communications',
    roles: ['FinanceAccountant', 'FinanceAdmin']
  },
  {
    path: '/finance/totalformcount',
    component: TotalFormCount,
    protected: true,
    exact: true,
    title: 'Total Form Count',
    roles: ['FinanceAccountant', 'FinanceAdmin']
  },
  {
    path: '/finance/studentPromotion',
    component: StudentPromotion,
    title: 'Student Promotion',
    protected: true,
    exact: true,
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/appformlist',
    component: AppFormList,
    protected: true,
    exact: true,
    title: 'Application Form List',
    roles: ['FinanceAccountant', 'FinanceAdmin']
  },
  {
    path: '/finance/regformlist',
    component: RegFormList,
    protected: true,
    exact: true,
    title: 'Registration Form List',
    roles: ['FinanceAccountant', 'FinanceAdmin']
  },
  {
    path: '/finance/admformlist',
    component: AdmFormList,
    protected: true,
    exact: true,
    title: 'Admission Form List',
    roles: ['FinanceAccountant', 'FinanceAdmin']
  },
  {
    path: '/finance/studentshuffle',
    component: StudentShuffle,
    protected: true,
    exact: true,
    title: 'Student Shuffle',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/shufflereports',
    component: ShuffleReports,
    protected: true,
    exact: true,
    title: 'Student Shuffle Reports',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/requestShuffle',
    component: RequestShuffle,
    protected: true,
    exact: true,
    title: 'Request Shuffle',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/unassign_feeRequest',
    component: UnassignFeeRequests,
    protected: true,
    exact: true,
    title: 'Unassign Fee Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/student_shuffle',
    component: StudentShuffleReq,
    protected: true,
    exact: true,
    title: 'Student Shuffle Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/approve_pendingRequest',
    component: ApprovePendingReq,
    protected: true,
    exact: true,
    title: 'Pending Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/dashboard',
    component: AdminDashboard,
    protected: true,
    exact: true,
    title: 'Dashboard',
    roles: ['FinanceAdmin']
  },
  {
    path: '/financeAcc/dashboard',
    component: AccountantDashboard,
    protected: true,
    exact: true,
    title: 'Dashboard',
    roles: ['FinanceAccountant']
  },
  {
    path: '/finance/approval_request',
    component: ApprovalRequest,
    protected: true,
    exact: true,
    title: 'Approve Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/pending_request',
    component: PendingRequest,
    protected: true,
    exact: true,
    title: 'Pending Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/rejected_request',
    component: RejectedRequest,
    protected: true,
    exact: true,
    title: 'Rejected Requests',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/scoolmeal/termsandconditions',
    component: TermsAndConditions,
    protected: true,
    exact: true,
    title: 'Scool Meal',
    roles: ['FinanceAdmin']
  },
  {
    path: '/finance/adm_receipt_book',
    component: ReceiptBookAdm,
    protected: true,
    exact: true,
    title: 'Receipt Book',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/adm_total_paid_due_reports',
    component: TotalPaidDueReportsAdm,
    protected: true,
    exact: true,
    title: 'Total Paid Due Reports',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/staffIdCard/:id',
    component: SuspenseComponent(StaffIdCard),
    protected: true,
    exact: true,
    title: 'Staff ID Card'
  },
  {
    path: '/teacher-lagging-report',
    component: SuspenseComponent(TeacherLaggingReport),
    protected: true,
    exact: true,
    title: 'Teacher Lagging Report'
  },
  {
    path: '/crashreport',
    component: SuspenseComponent(CrashReport),
    protected: true,
    exact: true,
    title: 'Crash Report'
  },
  {
    path: '/integrationtestreport',
    component: SuspenseComponent(IntegrationTesting),
    protected: true,
    exact: true,
    title: 'Integration Test Report'
  },
  {
    path: '/communication',
    component: SuspenseComponent(Communications),
    protected: true,
    exact: true,
    title: 'Communication',
    roles: ['Admin', 'Teacher', 'Student', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/developerreport',
    component: SuspenseComponent(DeveloperMails),
    protected: true,
    exact: true,
    title: 'Select Developer'
  },
  {
    path: '/router_switch',
    component: SuspenseComponent(AwsRouterSwitch),
    protected: true,
    exact: true,
    title: 'Switch Router'
  },
  {
    path: '/video/upload',
    component: videoUpload,
    protected: true,
    exact: true,
    title: 'Upload Video',
    roles: ['Admin', 'Planner', 'Subjecthead', 'EA Academics']
  },
  {
    path: '/video/view/',
    component: playVideo,
    protected: true,
    exact: true,
    title: 'Video',
    roles: ['Admin', 'Teacher', 'Student', 'Planner', 'Subjecthead', 'GuestStudent', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/video/academic',
    component: YoutubeVideos,
    protected: true,
    exact: true,
    title: 'Academic Videos'
  },
  {
    path: '/video',
    component: SuspenseComponent(publicView),
    protected: false,
    exact: true,
    title: 'LMS'
  },
  {
    path: '/report',
    component: report,
    protected: true,
    exact: true,
    title: 'Report',
    roles: ['Student']
  },
  {
    path: '/addClassGroup',
    component: SuspenseComponent(AddClassGroup),
    protected: true,
    exact: true,
    title: 'Add Class Group'
  },
  {
    path: '/sms/sectionWiseSms',
    component: SuspenseComponent(SectionWiseSms),
    protected: true,
    exact: true,
    title: 'Section Wise SMS'
  }, {
    path: '/sms/classGroupSms',
    component: SuspenseComponent(ClassGroupSms),
    protected: true,
    exact: true,
    title: 'Class Group SMS'
  },
  {
    path: '/sms/offlineSms/',
    component: SuspenseComponent(OfflineSms),
    protected: true,
    exact: true,
    title: 'Offline SMS'
  },
  {
    path: '/feedback',
    component: feedback,
    protected: true,
    exact: true,
    title: 'Feedback',
    roles: ['Student']
  }, {
    path: '/feedback/view',
    component: viewFeedback,
    protected: true,
    exact: true,
    title: 'Feedback',
    roles: ['Admin', 'Subjecthead', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/grievance/view',
    component: viewGrievance,
    protected: true,
    exact: true,
    title: 'Grievance',
    roles: ['Admin', 'Subjecthead', 'Principal', 'AcademicCoordinator', 'MIS', 'BDM', 'CFO', 'EA Academics', 'GuestStudent']
  },
  {
    path: '/MathsDoc/MathsDocumentation',
    component: MathsDocumentation,
    protected: true,
    exact: true,
    title: 'Maths Documentation',
    roles: ['Admin', 'Planner', 'Reviewer', 'Teacher', 'Subjecthead', 'LeadTeacher']
  },
  {
    path: '/questbox/viewTests/result/:id',
    component: ViewTestDetails,
    protected: true,
    exact: true,
    title: 'Test Result Details',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'ExaminationHead', 'EA Academics']
  },
  {
    path: '/sms/addSMSCredits',
    component: SuspenseComponent(AddSmsCredits),
    protected: true,
    exact: true,
    title: ' SMS Credits',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/sms',
    component: SuspenseComponent(Sms),
    protected: true,
    exact: true,
    title: 'Send SMS',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'FOE', 'EA Academics', 'EA Academics']
  },
  {
    path: '/emailsms',
    component: SuspenseComponent(EmailSms),
    protected: true,
    exact: true,
    title: 'Send Email/SMS',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'FOE', 'EA Academics', 'EA Academics']
  },
  {
    path: '/sms/log',
    component: SuspenseComponent(EmailSmsLog),
    protected: true,
    exact: true,
    title: 'SMS/Email Logs',
    roles: ['Admin', 'Principal', 'FOE', 'EA Academics']
  },
  {
    path: '/ebook/upload',
    component: SuspenseComponent(UploadEbook),
    protected: true,
    exact: true,
    title: 'Upload Ebook',
    roles: ['Subjecthead', 'Admin']
  },
  {
    path: '/gradebook/marksxls',
    component: SuspenseComponent(GradebookDownload),
    protected: true,
    exact: true,
    title: 'GradeBook Bulk Download',
    roles: ['Subjecthead', 'Admin']
  },
  {
    path: '/gradebook',
    component: SuspenseComponent(GradeBook),
    protected: true,
    exact: true,
    title: 'Grade Book',
    roles: ['Principal', 'Teacher', 'AcademicCoordinator', 'Subjecthead', 'Admin', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/gradebook/reports',
    component: SuspenseComponent(GradeBookReports),
    protected: true,
    exact: true,
    title: 'Grade Book Reports',
    roles: ['Principal', 'Teacher', 'AcademicCoordinator', 'Subjecthead', 'Admin', 'LeadTeacher', 'EA Academics']
  },
  {
    path: '/onlineclass/branchwisexls',
    component: SuspenseComponent(BulkDownloadReport),
    protected: true,
    exact: true,
    title: 'Bulk Excel Download',
    roles: ['Admin', 'Teacher', 'Principal', 'EA Academics', 'AcademicCoordinator', 'Online Class Admin', 'AOLAdmin']
  },
  {
    path: '/participant/report',
    component: SuspenseComponent(ParticipantReport),
    protected: true,
    exact: true,
    title: 'Participant Report Excel',
    roles: ['AOLAdmin']

  },
  {
    path: '/gradebook/student/report',
    component: SuspenseComponent(StudentReportCard),
    protected: true,
    exact: true,
    title: 'Report Card',
    roles: ['Student']
  },
  {
    path: '/ebook/view',
    component: SuspenseComponent(ViewEbook),
    protected: true,
    exact: true,
    title: 'View Ebook',
    roles: ['Subjecthead', 'Planner', 'Student', 'GuestStudent', 'Teacher', 'LeadTeacher', 'Principal', 'Admin', 'EA Academics', 'AcademicCoordinator']
  },
  {
    path: '/ebook/custom',
    component: SuspenseComponent(EbookPdf),
    protected: true,
    exact: true,
    title: 'View Custom Ebook Pdf',
    roles: ['Subjecthead', 'Student', 'GuestStudent']
  },
  {
    path: '/gradebook/evaluationcriteria/add',
    component: SuspenseComponent(GradebookEvaluationCriteria),
    protected: true,
    exact: true,
    title: 'Gradebook Evaluation Criteria',
    roles: ['Subjecthead', 'Admin']
  },
  {
    path: '/gradebook/evaluationcriteria/view',
    component: SuspenseComponent(ViewGradBookEvaluationCriteria),
    protected: true,
    exact: true,
    title: 'View Gradebook Evaluation Criteria',
    roles: ['Admin', 'Subjecthead']
  },
  {
    path: '/gradebook/evaluationcriteria/edit/:id',
    component: SuspenseComponent(EditGradebookEvaluationCriteria),
    protected: true,
    exact: true,
    title: 'Edit Gradebook Evaluation Criteria',
    roles: ['Admin', 'Subjecthead']
  },
  {
    path: '/gradebook/evaluationcriteria/copy/term',
    component: SuspenseComponent(GradebookEvaluationCriteriaTermCopy),
    protected: true,
    exact: true,
    title: 'Gradebook Evaluation Criteria Term Copy',
    roles: ['Admin', 'Subjecthead']
  },
  {
    path: '/gradebook/analytics/view',
    component: SuspenseComponent(GradebookAnalytics),
    protected: true,
    exact: true,
    title: 'Gradebook Analytics',
    roles: ['Admin']
  },
  {
    path: '/finance/student_store',
    component: SuspenseComponent(StoreAtStudent),
    protected: true,
    exact: true,
    title: 'Books & Uniform',
    roles: ['Student']
  }, {
    path: '/sms/smsReceived',
    component: SmsReceived,
    protected: true,
    exact: true,
    title: 'Sms Received',
    roles: ['Student']
  },
  {
    path: '/UploadAssessmentExcel',
    component: UploadAssessmentExcel,
    protected: true,
    exact: true,
    title: 'Upload Assessment Excel',
    roles: ['Admin']
  }, {
    path: '/academic/questioncount',
    component: SuspenseComponent(QuestionCount),
    protected: true,
    exact: true,
    title: 'Question Count',
    roles: ['Admin', 'Subjecthead', 'Principal', 'AcademicCoordinator', 'EA Academics']
  },
  {
    path: '/engagement/report',
    component: EngagementReport,
    protected: true,
    exact: true,
    title: 'Engagement Report',
    roles: ['AOLAdmin']

  },

  {
    path: '/online_class/add_new',
    component: GenerateNewOnlineClass,
    protected: true,
    exact: true,
    title: 'Online Class',
    roles: ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator', 'LeadTeacher', 'Online Class Admin', 'AOLAdmin']
  },
  {
    path: '/online_class/view_class',
    component: ViewClass,
    protected: true,
    exact: true,
    title: 'Class List',
    roles: ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'LeadTeacher', 'Online Class Admin', 'AOLAdmin']
  },
  {
    path: '/online_class/view_alloted_classes',
    component: AllotedClasses,
    protected: true,
    exact: true,
    title: 'Class List',
    roles: ['Teacher']
  },
  {
    path: '/review/view',
    component: StudentReviewForTeacher,
    protected: true,
    exact: true,
    title: 'Student Reviews',
    roles: ['Teacher', 'LeadTeacher']
  },
  {
    path: '/reviews',
    component: StudentReviews,
    protected: true,
    exact: true,
    title: 'Student Reviews',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'EA Academics']
  },
  {
    path: '/online_class/attendee_list/:list_id',
    component: AttendeeList,
    protected: true,
    exact: true,
    title: 'Attendee List',
    roles: ['Admin', 'Teacher', 'Principal', 'EA Academics', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'LeadTeacher', 'Online Class Admin', 'AOLAdmin']
  },
  {
    path: '/blog/view/student',
    component: StudentViewBlog,
    protected: true,
    exact: true,
    title: 'View Blogs',
    roles: ['Student']
  },
  {
    path: '/blog/view/reviewer',
    component: ReviewerViewBLog,
    protected: true,
    exact: true,
    title: 'View Blogs',
    roles: ['Admin', 'Teacher', 'Subjecthead', 'Planner', 'Principal', 'AcademicCoordinator', 'Blog Admin']
  },
  {
    path: '/blog/write',
    component: WriteBlog,
    protected: true,
    exact: true,
    // title: 'Write a Blog',
    roles: ['Student']
  },
  {
    path: '/blog/edit/:blog_id',
    component: WriteBlog,
    protected: true,
    exact: true,
    // title: 'Edit a Blog',
    roles: ['Student']
  },
  {
    path: '/blog/view/dashboard',
    component: SuspenseComponent(BlogDashboard),
    protected: true,
    exact: true,
    title: 'Blog Dashboard',
    roles: ['Subjecthead', 'Admin', 'Teacher', 'Planner', 'Principal', 'AcademicCoordinator', 'Blog Admin']
  }, {
    path: '/blog/view/publishedBlogs',
    component: SuspenseComponent(PublishedBlogs),
    protected: true,
    exact: true,
    title: 'Published Blogs',
    roles: ['Subjecthead', 'Admin', 'Teacher', 'Planner', 'Principal', 'AcademicCoordinator', 'Student', 'Blog Admin']
  },
  {
    path: '/zoomusers/create',
    component: SuspenseComponent(AddZoomUser),
    protected: true,
    exact: true,
    title: 'Create Zoom User',
    roles: ['Admin']

  },
  {
    path: '/zoomusers/view',
    component: SuspenseComponent(ZoomUsers),
    protected: true,
    exact: true,
    title: 'Zoom Users',
    roles: ['Admin']

  },
  {
    path: '/zoomusers/edit/:id',
    component: SuspenseComponent(EditZoomUser),
    protected: true,
    exact: true,
    title: 'Edit Zoom User',
    roles: ['Admin']

  },
  {
    path: '/externalplayer/:key/:token',
    component: SuspenseComponent(VideoPlayer),
    protected: false,
    exact: true,
    title: 'OMS Player'
  },
  {
    path: '/student/guest',
    component: SuspenseComponent(GuestStudentList),
    protected: true,
    exact: true,
    title: 'GuestStudent List',
    roles: ['AOLAdmin']
  },
  {
    path: '/class/group',
    component: SuspenseComponent(ClassGroupDetails),
    protected: true,
    exact: true,
    title: 'Class Group Details',
    roles: ['Admin', 'AOLAdmin', 'Online Class Admin']
  },
  {
    path: '/class/interest',
    component: SuspenseComponent(ClassInterestStats),
    protected: true,
    exact: true,
    title: 'Class Interest Statistics',
    roles: ['Admin', 'AOLAdmin', 'Online Class Admin']
  },
  {
    path: '/student/guest/filter/:id',
    component: SuspenseComponent(EditGuestStudent),
    protected: true,
    exact: true,
    title: 'Edit Guest Student',
    roles: ['AOLAdmin']
  },
  {
    path: '/videoSms/external',
    component: SuspenseComponent(VideoSms),
    protected: true,
    exact: true,
    title: 'Video Message',
    roles: ['Principal']
  },
  {
    path: '/online_class/create/group',
    component: SuspenseComponent(CreateGroup),
    protected: true,
    exact: true,
    title: 'Group Guest Students',
    roles: ['Admin', 'AOLAdmin', 'Online Class Admin']
  },
  {
    path: '/studentWelcome',
    component: StudentLandingPage,
    protected: true,
    exact: true,
    title: 'Create . Eduvate . Innovate',
    roles: ['Student', 'GuestStudent']
  },
  {
    path: '/certificate',
    component: Certificate,
    protected: true,
    exact: true,
    title: 'Certificate',
    roles: ['Admin', 'Principal']
  }, {
    path: '/ViewCertificate',
    component: SuspenseComponent(ViewCertificate),
    protected: true,
    exact: true,
    title: 'Certificate',
    roles: ['Student']
  },
  {
    path: '/certificate/signatureManager',
    component: SuspenseComponent(SignatureManager),
    protected: true,
    exact: true,
    title: 'Signature Manager',
    roles: ['Admin']
  },
  {
    path: '/certificate/signatureList',
    component: SuspenseComponent(SignatureList),
    protected: true,
    exact: true,
    title: 'Signature Upload List',
    roles: ['Admin']
  },
  {
    path: '/discussion-form_add_Category',
    component: SuspenseComponent(AddCategory),
    protected: true,
    exact: true,
    title: 'Add Category',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussion-form_add_Sub_Category',
    component: SuspenseComponent(SubCategory),
    protected: true,
    exact: true,
    title: 'Add Sub Category',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussion-form_add_Sub_Sub_Category',
    component: SuspenseComponent(SubSubCategory),
    protected: true,
    exact: true,
    title: 'Add Sub Sub Category',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussion-form_user_access_view',
    component: SuspenseComponent(UserAccessView),
    protected: true,
    exact: true,
    title: 'User Access View',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussion-form_edit_Post',
    component: SuspenseComponent(EditPost),
    protected: true,
    exact: true,
    title: 'Edit and View Posts',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussion-form_edit_Comments',
    component: SuspenseComponent(EditComments),
    protected: true,
    exact: true,
    title: 'Edit and View Comments',
    roles: ['Admin', 'Principal']
  },
  {
    path: '/discussionForm',
    component: SuspenseComponent(DiscussForm),
    protected: true,
    exact: true,
    title: 'Discussion Forum',
    roles: ['Admin', 'Principal', 'Teacher', 'AcademicCoordinator', 'Student', 'AcademicCoordinator', 'Planner', 'LeadTeacher']
  },
  {
    path: '/discussion_dashboard',
    component: SuspenseComponent(DiscussionDashbard),
    protected: true,
    exact: true,
    title: 'Discussion Dashbard',
    roles: ['Admin', 'Principal', 'Teacher', 'AcademicCoordinator', 'AcademicCoordinator']
  },
  {
    path: '/answers',
    component: SuspenseComponent(Answer),
    protected: true,
    exact: true,
    title: 'Discussion Form',
    roles: ['Admin', 'Principal', 'Teacher', 'AcademicCoordinator']
  },
  {
    path: '/orchadio/listeners',
    component: Orchadio,
    protected: true,
    exact: true,
    title: 'Orchadio'
  },
  {
    path: '/orchadio/radio',
    component: OrchadioListeners,
    protected: true,
    exact: true,
    title: 'Orchadio'
  },
  {
    path: '/orchadio/admin',
    component: OrchadioAdmin,
    protected: true,
    exact: true,
    title: 'Add Orchadio',
    roles: ['Admin']
  },
  {
    path: '/publications',
    component: SuspenseComponent(Publications),
    protected: true,
    exact: true,
    title: 'Publication',
    // roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'HR', 'CFO', 'EA Academics']
    roles: ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'LeadTeacher', 'Online Class Admin', 'Student', 'GuestStudent', 'AOLAdmin', 'BDM', 'Teacher']
  },
  // , {
  //   path: '/report_analysis',
  //   component: Report,
  //   protected: true,
  //   exact: true,
  //   title: 'Report Analysis',
  //   roles: ['Admin']
  // }

  {
    path: '/bulkClass/create',
    component: SuspenseComponent(BulkClassCreation),
    protected: true,
    exact: true,
    title: 'Bulk Class Creation',
    roles: ['AOLAdmin', 'Online Class Admin']
  },
  {
    path: '/v2/circular/template/add',
    component: AddCircularTemplate,
    protected: true,
    exact: true,
    title: 'Add Circular Template',
    roles: ['Admin']
  },
  // {
  //   path: '/lockdown_journals/view',
  //   component: SuspenseComponent(ViewLockDownJournals),
  //   protected: true,
  //   exact: true,
  //   title: 'Lockdown Journals',
  //   roles: ['Teacher']
  // },

  {
    path: '/lockdown_journals',
    component: SuspenseComponent(StudentJournal),
    protected: true,
    exact: true,
    title: 'Journal',
    roles: ['Student']
  },
  {
    path: '/management_dashboard',
    component: SuspenseComponent(ManagementDashboard),
    protected: true,
    exact: true,
    title: 'Management Dashboard',
    roles: ['Management Admin']
  },
  {
    path: '/v2/circular/template/view',
    component: ViewCircularTemplate,
    protected: true,
    exact: true,
    title: 'View Circular Template',
    roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'EA Academics']
  },
  {
    path: '/public/orchadio/:id/:token',
    component: SuspenseComponent(OrchadioPlayer),
    protected: false,
    exact: true,
    title: 'public orchadio'
  }, {
    path: '/finance/concession_report',
    component: ConcessionReport,
    protected: true,
    exact: true,
    title: 'Concession Report',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/finance/wallet_report',
    component: WalletReport,
    protected: true,
    exact: true,
    title: 'Wallet Report',
    roles: ['FinanceAdmin', 'FinanceAccountant']
  },
  {
    path: '/report_problem',
    component: SuspenseComponent(ReportAProblem),
    protected: false,
    exact: true,
    title: 'Report A Problem'
  },
  {
    path: '/management_dashboard_digital_marketing',
    component: SuspenseComponent(FbAndGoogleDataAnalytics),
    protected: true,
    exact: true,
    title: 'Management DashBoard- DigitalMarketing',
    roles: ['Management Admin']
  },
  {
    path: '/quiz/stats',
    component: SuspenseComponent(QuizStatistics),
    protected: true,
    exact: true,
    title: 'Quiz Statistics',
    roles: ['Admin', 'Teacher', 'Principal']
  },
  {
    path: '/game',
    component: SuspenseComponent(Game),
    protected: true,
    exact: true,
    title: 'Game',
    // roles: ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'HR', 'CFO', 'EA Academics']
    roles: ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'LeadTeacher', 'Online Class Admin', 'Student', 'GuestStudent', 'AOLAdmin', 'BDM', 'Teacher']
  },
  {
    path: '/uploadpublications',
    component: SuspenseComponent(UploadPublications),
    protected: true,
    exact: true,
    title: 'Upload Publications'
  },
  {
    path: '/finance/studentWallets',
    component: StudentWallet,
    protected: true,
    exact: true,
    title: 'Student Wallet',
    roles: ['Student']
  },
  {
    path: '/finance/upload_file',
    component: UploadPaymentFile,
    protected: true,
    exact: true,
    title: 'Upload payment screenshot',
    roles: ['StoreAdmin', 'FinanceAdmin', 'FinanceAccountant', 'Student']
  }

]

export default routes
