import { combineReducers } from 'redux'
import commonReducer from './common.reducer'
import accToBranchReducer from '../../CorporateBank/AccountToBranch/store/reducer/accountToBranch.reducer'
import accToClassReducer from '../../CorporateBank/AccountToClass/store/reducer/accountToClass.reducer'
import bankReducer from './bank.reducer'
import transactionReducer from '../../TransactionStatus/store/reducer/transaction.reducer'
import onlinePaymentReducer from '../../UploadOnlinePayments/store/actions/reducer/uploadOnlinePayments.reducer'
import normalFeeListReducer from '../../CreateFeeType/NormalFeeType/store/reducers/normalFeeList.reducer'
import currFeeTypeReducer from '../../CreateFeeType/CurrFeeType/store/reducer/currFeeType.reducer'
import feePlanReducer from '../../CreateFeePlan/store/reducers/feePlan.reducer'
import createCouponReducer from '../../CreateCoupon/store/reducers/createCoupon.reducer'
import negativeBalanceAdjustReducer from '../../NegativeBalanceAdjust/store/reducer/negativeBalanceAdjust.reducer'
import assignCouponReducer from '../../AssignCoupon/store/reducers/assignCoupon.reducer'
import feeStructureReducer from '../../BranchAccountant/FeeStructureAtAcc/store/reducer/feeStructure.reducer'
import accountantReducer from '../../BranchAccountant/store/reducer/branchAccountant.reducer'
import miscFeeListReducer from '../../CreateFeeType/MiscFeeType/store/reducer/miscFeeList.reducer'
import managePaymentReducer from '../../student/managePayment/store/reducer/managePayment.reducer'
import concessionFeeTypeReducer from '../../ConcessionSettings/store/reducer/concessionSettings.reducer'
import viewBanksReducer from '../../CorporateBank/ViewBanks/store/reducer/viewBanks.reducer'
import viewFeeAccountsReducer from '../../CorporateBank/ViewFeeAccounts/store/reducer/viewFeeAccounts.reducer'
import airPayFeeAccountReducer from '../../CorporateBank/AirPayFeeAccount/store/reducer/airPayFeeAccount.reducer'
import makePaymentAccReducer from '../../MakePaymentAccountant/store/reducer/makePaymentAcc.reducer'
import itCertificateReducer from '../../ItCertificate/store/reducer/itCertificate.reducer'
import receiptRangeReducer from '../../ReceiptChanges/store/reducer/receiptChanges.reducer'
import studentFeeStructureReducer from '../../student/FeeStructure/store/reducer/feeStructure.reducer'
import lastDateReducer from '../../LastDateSettings/store/reducer/lastDate.reducer'
import tallyReportsReducer from '../../Reports/TallyReports/store/reducer/tallyReports.reducer'
import ReceiptbookReducer from '../../Reports/ReceiptBook/store/reducer/receiptBook.reducer'
import totalPaidReportsReducer from '../../Reports/TotalPaidDueReports/store/reducer/totalPaidReports.reducer'
import ChequeBounceReportsReducer from '../../Reports/ChequeBounceReports/store/reducer/chequeBounceReports.reducer'
import expenseMngmtReducer from '../../ExpenseManagement/store/reducer/expenseMngmt.reducer'
import registrationAndApplicationReducer from '../../CreateFeeType/RegistrationFeeType/store/reducer/registrationFee.reducer'
import receiptSettingsReducer from '../../ReceiptSettings/Store/reducer/ReceiptSettings.reducer'
import unassignRequestReducer from '../../ApprovalRequests/UnassignFeeRequests/store/reducers/unassignFeeRequest.reducer'
import feePayChangeReducer from '../../FeePaymentChangeRequests/store/reducer/feePaymentChangeRequest.reducer'
import studentShuffleReducer from '../../ApprovalRequests/StudentShuffle/store/reducers/studentShuffle.reducer'
import financeAdminDashBoardReducer from '../../Dashboard/FinanceAdmin/store/reducer/financeAdminDashboard.reducer'
import bulkReducer from '../../BulkOperations/store/reducer/bulk.reducer'
import eMandateReducer from '../../E-mandate/store/actions/reducer/e-mandate.reducer'
import accToStoreReducer from '../../CorporateBank/AccountToStore/store/reducer/accToStore.reducer'
import scoolMealReducer from '../../ScoolMeal/store/reducer/ScoolMeal.reducer'
import storePaymentRequestsReducer from '../../StorePaymentRequests/store/reducer/storePaymentRequests.reducer'

const financeReducer = combineReducers({
  common: commonReducer,
  accToBranch: accToBranchReducer,
  accToClass: accToClassReducer,
  bank: bankReducer,
  transaction: transactionReducer,
  onlinePaymentReducer: onlinePaymentReducer,
  normalFee: normalFeeListReducer,
  feePlan: feePlanReducer,
  feeStructure: feeStructureReducer,
  expenseMngmt: expenseMngmtReducer,
  accountantReducer: accountantReducer,
  miscFee: miscFeeListReducer,
  studentManagePayment: managePaymentReducer,
  concessionSettings: concessionFeeTypeReducer,
  viewBanks: viewBanksReducer,
  makePayAcc: makePaymentAccReducer,
  receiptRangesLists: receiptRangeReducer,
  viewFeeAccounts: viewFeeAccountsReducer,
  itc: itCertificateReducer,
  studentFeeStructure: studentFeeStructureReducer,
  lastDateSettings: lastDateReducer,
  tallyReports: tallyReportsReducer,
  receiptBook: ReceiptbookReducer,
  totalPaidDueReports: totalPaidReportsReducer,
  bounceReports: ChequeBounceReportsReducer,
  registrationFeeType: registrationAndApplicationReducer,
  receiptSettings: receiptSettingsReducer,
  unassignFeerequest: unassignRequestReducer,
  feePayChange: feePayChangeReducer,
  studentShuffle: studentShuffleReducer,
  financeAdminDashBoard: financeAdminDashBoardReducer,
  airPayFeeAccount: airPayFeeAccountReducer,
  bulkOperation: bulkReducer,
  accToStore: accToStoreReducer,
  currFeeType: currFeeTypeReducer,
  scoolMeal: scoolMealReducer,
  storePayChange: storePaymentRequestsReducer,
  createCoupon: createCouponReducer,
  assignCoupon: assignCouponReducer,
  BalanceAdjustWalletReducer: negativeBalanceAdjustReducer,
  eMandateReducer: eMandateReducer
})

export default financeReducer
