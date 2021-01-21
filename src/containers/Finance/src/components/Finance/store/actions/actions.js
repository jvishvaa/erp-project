import axios from 'axios'
import { urls } from '../../../../urls'
// action-types
export const FETCH_FINANCIAL_YEAR = 'FETCH_FINANCIAL_YEAR'
export const FETCH_BRANCH_PER_SESSION = 'FETCH_BRANCH_PER_SESSION'
export const DATA_LOADING = 'DATA_LOADING'
export const DATA_LOADED = 'DATA_LOADED'
export const FETCH_BANK_DETAILS = 'FETCH_BANK_DETAILS'
export const FETCH_FEE_ACCOUNTS = 'FETCH_FEE_ACCOUNTS'
export const FETCH_REMAINING_BANKS = 'FETCH_REMAINING_BANKS'
export const ASSIGN_BANKS = 'ASSIGN_BANKS'
export const GRADE_LIST = 'GRADE_LIST'
export const GRADE_LIST_PER_BRANCH = 'GRADE_LIST_PER_BRANCH'
export const SECTIONS_PER_GRADE = 'SECTIONS_PER_GRADE'
export const FEE_TRANSACTION_RECEIPT = 'FEE_TRANSACTION_RECEIPT'
export const CLEAR_PDF_DATA = 'CLEAR_PDF_DATA'
export const DOWNLOAD_REPORTS = 'DOWNLOAD_REPORTS'
export const GET_BRANCH = 'GET_BRANCH'
export const FETCH_IFSC = 'FETCH_IFSC'
export const FETCH_MICR = 'FETCH_MICR'
export const FETCH_SUBJECTS = 'FETCH_SUBJECTS'
export const FETCH_CLASS_GROUP = 'FETCH_CLASS_GROUP'
export const FETCH_ADMISSION_RECORDS = 'FETCH_ADMISSION_RECORDS'
export const FETCH_DATE = 'FETCH_DATE'
export const SECTIONS_PER_GRADE_AS_ADMIN = 'SECTIONS_PER_GRADE_AS_ADMIN'
export const FETCH_STUDENT_SUGGESTIONS_BY_NAME_ADMIN = 'FETCH_STUDENT_SUGGESTIONS_BY_NAME_ADMIN'
export const FETCH_STUDENT_INFO_ADMIN = 'FETCH_STUDENT_INFO_ADMIN'
export const FETCH_LEDGER_TYPE = 'FETCH_LEDGER_TYPE'
export const FETCH_INSTA_DETAILS = 'FETCH_INSTA_DETAILS'
export const FETCH_DEVICE_ID = 'FETCH_DEVICE_ID'

// action-creators
export const fetchFinancialYear = () => {
  return (dispatch, getState) => {
    const { authentication } = getState()
    axios.get(urls.GetFinancialYear, {
      headers: {
        'Authorization': 'Bearer ' + authentication.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FINANCIAL_YEAR,
        payload: {
          data: response.data
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }
}

export const fetchBranchPerSession = (payload) => {
  let url = null
  if (payload.branchType) {
    url = urls.MiscFeeClass + '?session_year=' + payload.session + '&branch_type=' + payload.branchType
  } else {
    url = urls.MiscFeeClass + '?session_year=' + payload.session
  }
  return (dispatch) => {
    dispatch(dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BRANCH_PER_SESSION,
        payload: {
          branches: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(error => {
      console.log(error)
      dispatch(dataLoaded())
      payload.alert.warning('Unable To Load')
    })
  }
}

export const dataLoading = () => {
  return {
    type: DATA_LOADING
  }
}

export const dataLoaded = () => {
  return {
    type: DATA_LOADED
  }
}

export const fetchBankDetails = (payload) => {
  return dispatch => {
    dispatch(dataLoading())
    axios.get(urls.CorporateBanks + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_BANK_DETAILS,
        payload: {
          data: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(err => {
      dispatch(dataLoaded())
      console.log(err)
    })
  }
}

export const fetchGradesPerBranch = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.GradesPerBranch + '?session_year=' + payload.session + '&branch_id=' + payload.branch, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: GRADE_LIST_PER_BRANCH,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchSubjects = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.SUBJECT, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_SUBJECTS,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchAdmissionRecords = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.AdmissionRecords, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_ADMISSION_RECORDS,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchClassGroup = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.LISTCLASSGROUPTYPE, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_CLASS_GROUP,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchFeeAccounts = (payload) => {
  return dispatch => {
    dispatch(dataLoading())
    axios.get(urls.FeeAccToBrnch + '?academic_year=' + payload.session + '&branch_id=' + payload.branchId, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_FEE_ACCOUNTS,
        payload: {
          data: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(dataLoaded())
    })
  }
}

export const fetchRemainingBanks = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios.get(urls.CorporateBanks + '?branch_id=' + payload.branchId + '&academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_REMAINING_BANKS,
        payload: {
          data: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(err => {
      dispatch(dataLoaded())
      console.log(err)
    })
  }
}

export const assignBanks = (payload) => {
  const {
    user,
    alert,
    branchId,
    banks
  } = payload
  return (dispatch) => {
    const body = {
      'branch_id': branchId,
      'banks': banks
    }
    dispatch(dataLoading())
    axios.put(urls.CorporateBanks + '?academic_year=' + payload.session, body, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: FETCH_BANK_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(dataLoaded())
    }).catch(err => {
      dispatch(dataLoaded())
      console.log(err)
      alert.warning('Unable To Assign')
    })
  }
}

export const assignFeeAccount = (payload) => {
  return (dispatch) => {
    const body = {
      'mapping_id': payload.mappingId,
      'bank_mapping_id': payload.bankMapId,
      'fee_account_id': payload.feeAccId
    }
    dispatch(dataLoading())
    axios.put(urls.CorporateBanks + '?academic_year=' + payload.session, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: FETCH_BANK_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(dataLoaded())
    }).catch(err => {
      dispatch(dataLoaded())
      console.log(err)
      payload.alert.warning('Unable To Assign')
    })
  }
}

export const setActiveInactive = (payload) => {
  return (dispatch) => {
    const body = {
      'mapping_id': payload.mappingId,
      'bank_mapping_id': payload.bankMapId,
      'status_code': !payload.status
    }
    dispatch(dataLoading())
    axios.put(urls.CorporateBanks + '?academic_year=' + payload.session, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({
          type: FETCH_BANK_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(dataLoaded())
    }).catch(err => {
      dispatch(dataLoaded())
      payload.alert.warning('Unable To Change Status')
      console.log(err)
    })
  }
}

export const fetchGradeList = (payload) => {
  return (dispatch) => {
    dispatch(dataLoaded())
    axios
      .get(urls.GradeList, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: GRADE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchAllSectionsPerGrade = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.StudentGradeSectionAcc + '?grade=' + payload.gradeId + '&academic_year=' + payload.session, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: SECTIONS_PER_GRADE,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })
  }
}

export const fetchAllSectionsPerGradeAsAdmin = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios
      .get(urls.StudentGradeSectionAcc + '?grade=' + payload.gradeId + '&academic_year=' + payload.session + '&branch_id=' + payload.branchId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: SECTIONS_PER_GRADE_AS_ADMIN,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        console.log(error)
        payload.alert.warning('Unable to load data')
      })
  }
}

export const feeTransactionReceipt = (payload) => {
  return dispatch => {
    dispatch(dataLoading())
    axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${payload.transactionId}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FEE_TRANSACTION_RECEIPT,
        payload: {
          data: response.data
        } })
      dispatch(dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(dataLoaded())
    })
  }
}

export const downloadReports = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    let url = ''
    // console.log('---------reports-------', payload.data)
    if (payload.reportName === 'TallyReport.xlsx' && payload.data.date_range === 2) {
      url = payload.url + '?session_year=' + payload.data.session_year + '&branch=' + payload.data.branch +
      '&fee_account=' + payload.data.fee_account + '&transactions=' + payload.data.transactions +
      '&payment_mode=' + payload.data.payment_mode + '&download_type=' + payload.data.download_type +
      '&date_range=' + payload.data.date_range + '&date=' + payload.data.date
    } else if (payload.reportName === 'TallyReport.xlsx' && payload.data.date_range === 1) {
      url = payload.url + '?session_year=' + payload.data.session_year + '&branch=' + payload.data.branch +
      '&fee_account=' + payload.data.fee_account + '&transactions=' + payload.data.transactions +
      '&payment_mode=' + payload.data.payment_mode + '&download_type=' + payload.data.download_type +
      '&date_range=' + payload.data.date_range + '&from_date=' + payload.data.from_date + '&to_date=' + payload.data.to_date
    } else if (payload.reportName === 'ReceiptBook.csv') {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&branches=' + payload.data.branches +
      '&fee_account=' + payload.data.fee_account + '&types=' + payload.data.types + '&payment_mode=' +
      payload.data.payment_mode + '&fee_types=' + payload.data.fee_types + '&from_date=' + payload.data.from_date +
      '&to_date=' + payload.data.to_date
    } else if (payload.reportName === 'total_paid_and_due_reports.csv') {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&branches=' + payload.data.branches +
      '&grades=' + payload.data.grades + '&fee_types=' + payload.data.fee_types + '&fee_plan=' + payload.data.fee_plan +
      '&installments=' + payload.data.installments + '&type=' + payload.data.type + '&FeeTypes_installments=' +
      payload.data.FeeTypes_installments + '&student_status=' + payload.data.student_status + '&active=' +
      payload.data.active + '&inactive=' + payload.data.inactive + '&allStudents=' + payload.data.allStudents +
      '&other_fee_type=' + payload.data.other_fee_type + '&other_fee_installments=' + payload.data.other_fee_installments
    } else if (payload.reportName === 'fee_day_sheet.xlsx' && payload.data.branch_id) {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&fee_accounts=' + payload.data.fee_accounts +
      '&from_date=' + payload.data.from_date + '&to_date=' + payload.data.to_date + '&payment_modes=' +
      payload.data.payment_modes + '&type=' + payload.data.type + '&is_effective=' + payload.data.is_effective +
      '&is_issued_date=' + payload.data.is_issued_date + '&branch_id=' + payload.data.branch_id
    } else if (payload.reportName === 'fee_day_sheet.xlsx' && payload.data.branch_id === undefined) {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&fee_accounts=' + payload.data.fee_accounts +
      '&from_date=' + payload.data.from_date + '&to_date=' + payload.data.to_date + '&payment_modes=' +
      payload.data.payment_modes + '&type=' + payload.data.type + '&is_effective=' + payload.data.is_effective +
      '&is_issued_date=' + payload.data.is_issued_date
    } else if (payload.reportName === 'AdmReceiptBook.xlsx') {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&branches=' + payload.data.branches +
      '&fee_account=' + payload.data.fee_account + '&payment_mode=' + payload.data.payment_mode + '&from_date=' +
      payload.data.from_date + '&to_date=' + payload.data.to_date
    } else if (payload.reportName === 'AdmTotalPaidReports.xlsx') {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&branch=' + payload.data.branches +
      '&grade=' + payload.data.grades + '&Fee_type=' + payload.data.fee_types +
      '&type=' + payload.data.type + '&student_status=' + payload.data.student_status + '&active=' +
      payload.data.active + '&inactive=' + payload.data.inactive + '&allStudent=' + payload.data.allStudents
    } else if (payload.reportName === 'StoreReport.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'total_form_report.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'application_form_report.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'registration_form_report.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'admission_form_report.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'WalletReport.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'walletReport.xlsx') {
      url = payload.url
    } else if (payload.reportName === 'LedgerReport.xlsx') {
      if (payload.data.academic_year && payload.data.ledger_type && payload.data.ledger_head && payload.data.ledger_name) {
        url = payload.url + '?academic_year=' + payload.data.academic_year + '&ledger_type=' + payload.data.ledger_type + '&ledger_head=' + payload.data.ledger_head + '&ledger_name=' + payload.data.ledger_name
      } else if (payload.data.academic_year && payload.data.from_date && payload.data.to_date) {
        url = payload.url + '?academic_year=' + payload.data.academic_year + '&fromDate=' + payload.data.from_date + '&toDate=' + payload.data.to_date
      } else if (payload.data.academic_year) {
        url = payload.url + '?academic_year=' + payload.data.academic_year
      }
    } else if (payload.reportName === 'Other_fee_total_paid_and_due_reports.csv') {
      url = payload.url + '?academic_year=' + payload.data.academic_year + '&branches=' + payload.data.branches +
      '&grades=' + payload.data.grades + '&fee_types=' + payload.data.fee_types + '&fee_plan=' + payload.data.fee_plan +
      '&installments=' + payload.data.installments + '&type=' + payload.data.type + '&FeeTypes_installments=' +
      payload.data.FeeTypes_installments + '&student_status=' + payload.data.student_status + '&active=' +
      payload.data.active + '&inactive=' + payload.data.inactive + '&allStudents=' + payload.data.allStudents +
      '&other_fee_type=' + payload.data.other_fee_type + '&other_fee_installments=' + payload.data.other_fee_installments
      console.log('---------reports url-----------', payload)
    }
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        },
        responseType: 'blob'
      }).then(response => {
        // console.log('----response---------', response)
        // const url = urls.BASE + response.data
        // axios.get(url, {
        //   headers: {
        //     Authorization: 'Bearer ' + payload.user
        //   },
        //   responseType: 'blob'
        // }).then(response => {
        //   // console.log(urls.BASE)
        //   const url = window.URL.createObjectURL(new Blob([response.data]))
        //   console.log('--url----------', url)
        //   const link = document.createElement('a')
        //   link.href = url
        //   link.target = '_blank'
        //   link.setAttribute('download', payload.reportName)
        //   document.body.appendChild(link)
        //   link.click()
        // }).catch(err => {
        //   console.log('Error in Second Axios', err)
        // })
        // dispatch({
        //   type: DOWNLOAD_REPORTS,
        //   payload: {
        //     data: response.data
        //   }
        // })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        console.log('--url----------', url)
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.setAttribute('download', payload.reportName)
        document.body.appendChild(link)
        link.click()
        dispatch(dataLoaded())
        payload.alert.success('Downloading...')
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

// export const downloadReports = (payload) => {
//   return (dispatch) => {
//     dispatch(dataLoading())
//     axios
//       .post(payload.url, payload.data, {
//         headers: {
//           Authorization: 'Bearer ' + payload.user
//         }
//         // responseType: 'blob'
//       }).then(response => {
//         console.log('----response---------', response)
//         const url = urls.BASE + response.data
//         axios.get(url, {
//           headers: {
//             Authorization: 'Bearer ' + payload.user
//           },
//           responseType: 'blob'
//         }).then(response => {
//           // console.log(urls.BASE)
//           const url = window.URL.createObjectURL(new Blob([response.data]))
//           console.log('--url----------', url)
//           const link = document.createElement('a')
//           link.href = url
//           link.target = '_blank'
//           link.setAttribute('download', payload.reportName)
//           document.body.appendChild(link)
//           link.click()
//         }).catch(err => {
//           console.log('Error in Second Axios', err)
//         })
//         dispatch({
//           type: DOWNLOAD_REPORTS,
//           payload: {
//             data: response.data
//           }
//         })
//         dispatch(dataLoaded())
//         payload.alert.success('Downloading...')
//       }).catch(error => {
//         dispatch(dataLoaded())
//         payload.alert.error('Something Went Wrong')
//         console.log(error)
//       })
//   }
// }

export const fetchBranchAtAcc = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios.get(urls.GetBranchAtAcc, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('the accountant Branch', response)
      dispatch({
        type: GET_BRANCH,
        payload: {
          data: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load Branch')
      dispatch(dataLoaded())
      console.log(err)
    })
  }
}

export const fetchIfsc = (payload) => {
  return (dispatch) => {
    dispatch(dataLoaded())
    axios
      .get(urls.FetchBankIfsc + '?ifsc=' + payload.ifsc, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_IFSC,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load IFSC')
        console.log(error)
      })
  }
}

export const fetchMicr = (payload) => {
  return (dispatch) => {
    dispatch(dataLoaded())
    axios
      .get(urls.FetchBankMicr + '?micr=' + payload.micr, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_MICR,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to load MICR')
        console.log(error)
      })
  }
}

export const fetchDateFromServer = (payload) => {
  return (dispatch) => {
    dispatch(dataLoaded())
    axios
      .get(urls.FetchDate, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_DATE,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to server date')
        console.log(error)
      })
  }
}

export const fetchErpSuggestionsStudentName = (payload) => {
  let url = urls.SuggestionsForErpAdm + '?student_name=' + payload.erp +
    '&session_year=' + payload.session +
    '&grade=all&section=all&state=3&branch_id=' + payload.branch
  if (payload.grade) {
    url = urls.SuggestionsForErpAdm + '?student_name=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade +
    '&state=3&branch_id=' + payload.branch
  }
  if (payload.grade && payload.section) {
    url = urls.SuggestionsForErpAdm + '?student_name=' + payload.erp +
    '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
    '&state=3&branch_id=' + payload.branch
  }
  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: FETCH_STUDENT_SUGGESTIONS_BY_NAME_ADMIN,
        payload: {
          data: response.data
        }
      })
      // dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      // dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchStudentInfoForAdmin = (payload) => {
  let url = urls.GetStudentInfoForFinAdm + '?academic_year=' + payload.session +
  '&branch=' + payload.branch
  if (payload.grade) {
    url = urls.GetStudentInfoForFinAdm + '?academic_year=' + payload.session + '&grade=' + payload.grade +
    '&branch=' + payload.branch
  }
  if (payload.grade && payload.section) {
    url = urls.GetStudentInfoForFinAdm + '?academic_year=' + payload.session + '&grade=' + payload.grade +
    '&branch=' + payload.branch + '&section=' + payload.section
  }

  return (dispatch) => {
    // dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: FETCH_STUDENT_INFO_ADMIN,
        payload: {
          data: response.data
        }
      })
      // dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load')
      // dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchLedgerType = () => {
  return (dispatch, getState) => {
    const { authentication } = getState()
    axios.get(urls.AddLedgerType, {
      headers: {
        'Authorization': 'Bearer ' + authentication.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_LEDGER_TYPE,
        payload: {
          data: response.data
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }
}

export const fetchInstallDetails = (payload) => {
  return (dispatch) => {
    dispatch(dataLoaded())
    axios
      .get(urls.FetchInstallmentsDetails + '?fee_plan_id=' + payload.feePlanId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_INSTA_DETAILS,
          payload: {
            data: response.data
          }
        })
        dispatch(dataLoaded())
      }).catch(error => {
        dispatch(dataLoaded())
        payload.alert.warning('Unable to server date')
        console.log(error)
      })
  }
}

export const fetchDeviceId = (payload) => {
  return (dispatch) => {
    dispatch(dataLoading())
    axios.get(urls.DeviceIdUrl + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      // console.log('the accountant Branch', response)
      dispatch({
        type: FETCH_DEVICE_ID,
        payload: {
          data: response.data
        }
      })
      dispatch(dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable to fetch device id')
      dispatch(dataLoaded())
      console.log(err)
    })
  }
}
