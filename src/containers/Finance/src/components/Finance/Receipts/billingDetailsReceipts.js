import React from 'react'

import PdfGenerator from '../../../utils/pdfGenerator'
// import customClasses from './makePayment.module.css'

function mainView (details) {
  const infoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }

  const table = {
    padding: '0px',
    boxSizing: 'border-box',
    color: 'rgb(43, 42, 42)',
    fontWeight: 'bold',
    width: '97%',
    margin: 'auto',
    fontSize: '1vw',
    overflowX: 'auto'
  }

  const tableHead = {
    width: '100%',
    textAlign: 'center',
    height: '30px',
    lineHeight: '30px',
    border: '0.02px solid rgba(100, 100, 100, 0.329)',
    overflow: 'hidden',
    fontWeight: 'bold'
  }

  const tableHeading = {
    width: '100%',
    display: 'flex',
    justifContent: 'space-between',
    overflow: 'hidden',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '0.02px solid rgba(100, 100, 100, 0.329)'
  }

  const tableSno = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    width: '5%',
    fontSize: '14px',
    fontWeight: 'bold'
  }

  const tableInstName = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '14%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableFeeTyp = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '18%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableFeeAcc = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '15%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableAmount = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '20%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableOthrAmt = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '18%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  //   const tableDueDate = {
  //     borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
  //     padding: '10px 2px',
  //     width: '10%',
  //     fontSize: '14px',
  //     fontWeight: 'bold',
  //     wordWrap: 'break-word'
  //   }

  const tableBody = {
    width: '100%',
    overflow: 'hidden'
  }

  const tableBodyRecords = {
    width: '100%',
    display: 'flex',
    justifContent: 'space-between',
    overflow: 'hidden',
    textAlign: 'center',
    border: '0.02px solid rgba(100, 100, 100, 0.329)'
  }

  // const tableBodySno = {
  //   borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
  //   padding: '10px 5px',
  //   width: '10%',
  //   fontWeight: 'bold'
  // }

  const totalAmount = {
    width: '100%',
    textAlign: 'right',
    fontWeight: 'bold',

    fontSize: '1.3rem'
  }

  //   const calculateTotalAmt = () => {
  //     let amt = 0
  //     if (details.data && details.data.length > 0) {
  //       amt = details.data.reduce((acc, item) => {
  //         acc += item.balance
  //         return acc
  //       }, 0)
  //     }
  //     return amt
  //   }

  // const headers = [
  //   {
  //     value: 'Billing Date',
  //     type: 'string'
  //   },
  //   {
  //     value: 'Total Active User Per day',
  //     type: 'string'
  //   },
  //   {
  //     value: 'Per Month User Amount',
  //     type: 'string'
  //   },
  //   {
  //     value: 'Total Paid Amount',
  //     type: 'string'
  //   },
  //   {
  //     value: 'Total Amount',
  //     type: 'string'
  //   }
  // ]

  // const body = dataDateWsie.map(val => {
  //   return ([
  //     {
  //       value: val.date && val.date.split('T')[0],
  //       type: 'string'
  //     },
  //     {
  //       value: val.active_user,
  //       type: 'string'
  //     },
  //     {
  //       value: '₹' + val.amount_per_user,
  //       type: 'string'
  //     },
  //     {
  //       value: val.total_paid_amount ? val.total_paid_amount : '0',
  //       type: 'string'
  //     },
  //     {
  //       value: '₹' + val.amount.toFixed(2),
  //       type: 'string'
  //     }
  //   ])
  // })
  const allFeeDetails = () => {
    let rows = null
    if (details && details.length > 0) {
      rows = details.map((val, index) => (
        <div style={tableBodyRecords} key={val.id}>
          <div style={tableSno}>{index + 1}</div>
          <div style={tableInstName}>{val.date && val.date.split('T')[0]}</div>
          <div style={tableFeeTyp}>{val.active_user}</div>
          <div style={tableFeeAcc}>{'₹' + val.amount_per_user}</div>
          <div style={tableAmount}>{val.total_paid_amount ? val.total_paid_amount : '0'}</div>
          <div style={tableOthrAmt}>{'₹' + val.amount.toFixed(2)}</div>
        </div>
      ))
    }
    return rows
  }

  const getStdDetails = () => {
    let rows = null
    if (details && details.length > 0) {
      rows = (
        <React.Fragment>
          <div style={infoStyle}>
            {/* wfef */}
            {/* <div><strong>ERP :</strong>&nbsp;{details.stdDetails[0].student_erp ? details.stdDetails[0].student_erp : ''}</div>
            <div><strong>Class/Section :</strong>&nbsp;{details.stdDetails[0].grade && details.stdDetails[0].section ? details.stdDetails[0].grade + '/' + details.stdDetails[0].section : ''}</div>
            <div><strong>Student Name :</strong>&nbsp;{details.stdDetails[0].student_name ? details.stdDetails[0].student_name : ''}</div>
          </div>
          <div style={{ ...infoStyle, marginTop: '12px', marginBottom: '20px' }}>
            <div><strong>Admission N0.:</strong>&nbsp;{details.stdDetails[0].admission_no ? details.stdDetails[0].admission_no : ''}</div>
            <div><strong>Father Name :</strong>&nbsp;{details.stdDetails[0].father_name ? details.stdDetails[0].father_name : ''}</div>
            <div><strong>Father Phone :</strong>&nbsp;{details.stdDetails[0].father_mobile ? details.stdDetails[0].father_mobile : ''}</div>
          </div>
          <div style={{ ...infoStyle, marginTop: '12px', marginBottom: '20px' }}>
            <div><strong>Mother Name :</strong>&nbsp;{details.stdDetails[0].mother_name ? details.stdDetails[0].mother_name : ''}</div>
            <div><strong>Mother Phone :</strong>&nbsp;{details.stdDetails[0].mother_mobile ? details.stdDetails[0].mother_mobile : ''}</div> */}
          </div>
        </React.Fragment>
      )
    } else {
      rows = 'No Records Found !!'
    }
    return rows
  }

  return (
    <React.Fragment>
      <React.Fragment>
        {getStdDetails()}
        {/* <hr />  */}
      </React.Fragment>
      <div style={table}>
        <div style={tableHead}>Billing Summary</div>
        <div style={tableHeading}>
          <div style={tableSno}>S.No</div>
          <div style={tableInstName}>Billing Date</div>
          <div style={tableFeeTyp}>Total Active User Per day</div>
          <div style={tableFeeAcc}>Per Month User Amount</div>
          <div style={tableAmount}>Total Paid Amount</div>
          <div style={tableOthrAmt}>Total Amount</div>
        </div>
        <div style={tableBody}>
          {allFeeDetails()}
        </div>
      </div>
      <hr />
      <div style={totalAmount}>
        {/* <p>Total Amount :&nbsp;{calculateTotalAmt()}</p> */}
        {/* <p>Total Amount: {details.data && details.data.length > 0 && details.data[0].total ? details.data[0].total : 0}</p> */}
      </div>
    </React.Fragment>
  )
}

const BillingReceipts = (details) => {
  const title = 'BillingReceipt'
  const header = (
    <React.Fragment>
    </React.Fragment>
  )
  const component = (
    <React.Fragment>
      {mainView(details)}
    </React.Fragment>
  )
  const footer = (
    <React.Fragment>
    </React.Fragment>
  )
  PdfGenerator({ title, header, component, footer })
}

export default BillingReceipts
