import { combineReducers } from 'redux'

import PaymentReducer from '../../TransactionStatus/Payments/store/reducer/payment.reducer'
import ChequePaymentReducer from '../../TransactionStatus/ChequePayments/store/reducer/chequePymt.reducer'
import ExpenseMngmtReducer from '../../ExpenseManagement/store/reducer/expenseMngmtAcc.reducer'
import listOtherFeeReducer from '../../OtherFees/store/reducer/otherFees.reducer'
import changeFeePlanReducer from '../../ChangeFeePlanToStudent/store/reducer/changeFeePlanToStudent.reducer'
import assignDelieveryChargeReducer from '../../AssignDelieveryCharge/store/reducer/assignDelieveryCharge.reducer'
import pdcReducer from '../../PostDateCheque/store/reducer/postDateCheque.reducer'
import applicationFormReducer from '../../ApplicationForm/store/reducer/applicationForm.reducer'
import registrationFormReducer from '../../RegistrationForm/store/reducer/registration.reducer'
import feeCollectionReducer from '../../FeeCollection/store/reducer/FeeCollection.reducer'
import changeStudentStatusReducer from '../../ChangeStudentStatus/store/reducer/changeStudentStatus.reducer'
import studentShuffleReducer from '../../StudentShuffle/store/reducer/studentShuffle.reducer'
import studentShuffleReportsReducer from '../../StudentShuffleReports/store/reducer/studentShuffleReports.reducer'
// import studentContactDetailsReportsReducer from '../../StudentContactDetailsReport/store/reducer/studentContactdeatils.reducer'
import admissionFormReducer from '../../AdmissionForm/store/reducer/admissonForm.reducer'
import acceptRejectPaymentReducer from '../../AcceptRejectPayment/store/reducer/acceptRejectPayment.reducer'
import concessionDetailsReducer from '../../ConcessionDetails/store/reducer/concessionDetails.reducer'
import feeManagementReducer from '../../FeeManagement/store/reducers/feeMang.reducer'
import studentactivateInactivateaccReducer from '../../StudentActivateInactivate/store/reducer/studentactivateInactivateacc.reducer'
import studentLedgerTabReducer from '../../StudentLedgerTab/store/reducer/studentLedgerTab.reducer'
import financeDashboardReducer from '../../AccountantDashBoard/store/reducer/financeDashboard.reducer'
import currFeeTypeAccReducer from '../../CurrFeeTypeAcc/store/reducer/currFeeTypeAcc.reducer'
import totalFormCountReducer from '../../TotalFormCount/store/reducer/totalFormCount.reducer'
import studentPromotionReducer from '../../StudentPromotion/store/reducer/studentPromotion.reducer'
import communicationSmsReducer from '../../Communication/store/reducer/communication.reducer'
import storeItemStatusReducer from '../../StoreItemStatus/store/reducer/storeItemStatus.reducer'

const accountantReducer = combineReducers({
  payment: PaymentReducer,
  chequePayment: ChequePaymentReducer,
  listOtherFee: listOtherFeeReducer,
  changeFeePlan: changeFeePlanReducer,
  changeStudentStatus: changeStudentStatusReducer,
  pdc: pdcReducer,
  appForm: applicationFormReducer,
  feeCollection: feeCollectionReducer,
  regForm: registrationFormReducer,
  admissionForm: admissionFormReducer,
  acceptRejectPaymentReducer: acceptRejectPaymentReducer,
  studentShuffle: studentShuffleReducer,
  shuffleReports: studentShuffleReportsReducer,
  // contactDetailsReport: studentContactDetailsReportsReducer,
  concessionDetails: concessionDetailsReducer,
  expenseMngmtAcc: ExpenseMngmtReducer,
  feeManagement: feeManagementReducer,
  studentactivateInactivate: studentactivateInactivateaccReducer,
  financeAccDashboard: financeDashboardReducer,
  currFeeTypeAcc: currFeeTypeAccReducer,
  totalFormCount: totalFormCountReducer,
  communicationSms: communicationSmsReducer,
  storeItemStatus: storeItemStatusReducer,
  studentPromotion: studentPromotionReducer,
  studentErpSearch: studentLedgerTabReducer,
  assignDelieveryCharge: assignDelieveryChargeReducer
})

export default accountantReducer
