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
    width: '13%',
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
    width: '11%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableOthrAmt = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 0px',
    fontSize: '14px',
    width: '8%',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

  const tableDueDate = {
    borderRight: '0.15px solid rgba(100, 100, 100, 0.904)',
    padding: '10px 2px',
    width: '10%',
    fontSize: '14px',
    fontWeight: 'bold',
    wordWrap: 'break-word'
  }

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

  const calculateTotalAmt = () => {
    let amt = 0
    if (details.data && details.data.length > 0) {
      amt = details.data.reduce((acc, item) => {
        acc += item.balance
        return acc
      }, 0)
    }
    return amt
  }

  const allFeeDetails = () => {
    let rows = null
    if (details.data && details.data.length > 0) {
      rows = details.data.map((row, index) => (
        <div style={tableBodyRecords} key={row.id}>
          <div style={tableSno}>{index + 1}</div>
          <div style={tableInstName}>{row.installments && row.installments.installment_name ? row.installments.installment_name : ''}</div>
          <div style={tableFeeTyp}>{row.fee_type && row.fee_type.fee_type_name ? row.fee_type.fee_type_name : ''}</div>
          <div style={tableFeeAcc}>{row.fee_account_name && row.fee_account_name.fee_account_name ? row.fee_account_name.fee_account_name : ''}</div>
          <div style={tableAmount}>{row.installments && row.installments.installment_amount ? row.installments.installment_amount : ''}</div>
          <div style={tableOthrAmt}>{row.discount ? row.discount : 0}</div>
          <div style={tableOthrAmt}>{row.amount_paid ? row.amount_paid : 0}</div>
          <div style={tableOthrAmt}>{row.fine_amount ? row.fine_amount : 0}</div>
          <div style={tableOthrAmt}>{row.balance ? row.balance : 0}</div>
          <div style={tableDueDate}>{row.installments && row.installments.due_date ? row.installments.due_date : ''}</div>
        </div>
      ))
    }
    return rows
  }

  const getStdDetails = () => {
    let rows = null
    if (details.stdDetails && details.stdDetails.length > 0) {
      rows = (
        <React.Fragment>
          <div style={infoStyle}>
            <div><strong>ERP :</strong>&nbsp;{details.stdDetails[0].student_erp ? details.stdDetails[0].student_erp : ''}</div>
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
            <div><strong>Mother Phone :</strong>&nbsp;{details.stdDetails[0].mother_mobile ? details.stdDetails[0].mother_mobile : ''}</div>
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
        <hr />
      </React.Fragment>
      <div style={table}>
        <div style={tableHead}>Installment Wise Summary</div>
        <div style={tableHeading}>
          <div style={tableSno}>S.No</div>
          <div style={tableInstName}>Installment</div>
          <div style={tableFeeTyp}>Fee Type</div>
          <div style={tableFeeAcc}>Fee Account</div>
          <div style={tableAmount}>Fee Amount</div>
          <div style={tableOthrAmt}>Concession</div>
          <div style={tableOthrAmt}>Paid Amount</div>
          <div style={tableOthrAmt}>Fine Amount</div>
          <div style={tableOthrAmt}>Balance</div>
          <div style={tableDueDate}>Due Date</div>
        </div>
        <div style={tableBody}>
          {allFeeDetails()}
        </div>
      </div>
      <hr />
      <div style={totalAmount}>
        <p>Total Amount :&nbsp;{calculateTotalAmt()}</p>
        {/* <p>Total Amount: {details.data && details.data.length > 0 && details.data[0].total ? details.data[0].total : 0}</p> */}
      </div>
    </React.Fragment>
  )
}

const feeReceipts = (details) => {
  const title = 'Receipt'
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

export default feeReceipts
