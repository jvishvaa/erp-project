import React from 'react'

const AccountantTransaction = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./TransactionStatus'))
const OtherFeesAccountant = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./OtherFees/otherFees'))
const AssignOtherFees = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./OtherFees/assignOtherFess'))
const FeeStructureAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./FeeStructureAtAcc'))
const PostDateCheque = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./PostDateCheque'))
const ChangeFeePlanToStudent = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./ChangeFeePlanToStudent'))
const AddOtherFees = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./OtherFees/addOtherFees'))
const AccountantCerti = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ITCertificate/certificate'))
const ApplicationFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./ApplicationForm'))
const FeeCollection = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./FeeCollection/FeeCollection'))
const FeeShowList = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./FeeCollection/FeeShowList'))
const RegistrationForm = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./RegistrationForm/registrationForm'))
const NewRegistrationForm = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./RegistrationForm/newRegistrationForm'))
const StudentLedgerTab = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentLedgerTab/studentLedgerTab'))
const AdminOtherFees = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./OtherFees/adminOtherFees'))
const AdmissionFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/admissionForm'))
const NewAdmissionFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/newAdmissionForm'))
const CustomizedAdmissionFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/customizedAdmissionForm'))
const StudentDetailsFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/studentDetails'))
const StudentShuffle = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentShuffle/studentShuffle'))
const RequestShuffle = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentShuffle/requestShuffle'))
const ShuffleReports = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentShuffleReports/studentShuffleReports'))
const ContactDetailsReport = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentContactDetailsReport/studentContactDetailsReport'))
const NonRTEFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/nonRTEAdmissionForm'))
const UpdateAdmissionFormAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AdmissionForm/updateAdmissionForm'))
const ConcessionDetails = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./ConcessionDetails/concessionDetails'))
const PartyList = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./ExpenseManagement/Party/Party'))
const StudentActivateInactiveAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StudentActivateInactivate/studentActivateInactiveacc'))
const AccountantDashboard = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AccountantDashBoard/FinanceAccountant/dashboard'))
const PostDateCount = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AccountantDashBoard/PostDateCount'))
const CurrFeeTypeAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./CurrFeeTypeAcc'))
// const TotalFormCount = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./TotalFormCount'))
// const AppFormList = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./TotalFormCount/appFormList'))
const StoreItemStatus = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./StoreItemStatus/storeItemStatus'))
const AcceptRejectPayment = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AcceptRejectPayment/acceptRejectPayment'))
const AssignDelieveryCharge = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./AssignDelieveryCharge'))

export * from './ExpenseManagement/PettyExpenses'
export * from './TotalFormCount'
export * from './Communication'
export * from './StudentPromotion'
export {
  AccountantTransaction,
  OtherFeesAccountant,
  FeeStructureAcc,
  PostDateCheque,
  ChangeFeePlanToStudent,
  AssignOtherFees,
  AddOtherFees,
  AccountantCerti,
  ApplicationFormAcc,
  FeeCollection,
  FeeShowList,
  RegistrationForm,
  NewRegistrationForm,
  StudentLedgerTab,
  AdmissionFormAcc,
  NewAdmissionFormAcc,
  CustomizedAdmissionFormAcc,
  StudentDetailsFormAcc,
  AdminOtherFees,
  StudentShuffle,
  RequestShuffle,
  ShuffleReports,
  ContactDetailsReport,
  NonRTEFormAcc,
  UpdateAdmissionFormAcc,
  ConcessionDetails,
  PartyList,
  StudentActivateInactiveAcc,
  AccountantDashboard,
  PostDateCount,
  CurrFeeTypeAcc,
  StoreItemStatus,
  AcceptRejectPayment,
  AssignDelieveryCharge
}
