import React from 'react'

import PdfGenerator from '../../../utils/pdfGenerator'
// import orchidsLogo from '../../../assets/orchidsLogo.jpeg'
// import customClasses from './makePayment.module.css'

function chequeView (data) {
  const infoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
  return (
    <React.Fragment>
      <div style={{ marginTop: '15px' }}><strong>Payment Mode: </strong>Cheque</div>
      <div style={infoStyle}>
        <div style={{ width: '50%' }}><strong>Name on Cheque: </strong>{data.cheque_name}</div>
        <div style={{ width: '50%' }}><strong>Cheque Number: </strong>{data.cheque_number}</div>
      </div>
      <div style={infoStyle}>
        <div style={{ width: '50%' }}><strong>Bank Name: </strong>{data.bank_name}</div>
        <div style={{ width: '50%' }}><strong>Branch Name: </strong>{data.bank_branch}</div>
      </div>
    </React.Fragment>
  )
}

function swipeView (data) {
  const infoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
  return (
    <React.Fragment>
      <div style={{ marginTop: '15px' }}><strong>Payment Mode: </strong>Credit/Debit Card</div>
      <div style={infoStyle}>
        <div style={{ width: '50%' }}><strong>Card Last Digits: </strong>{data.card_last_digits}</div>
        <div style={{ width: '50%' }}><strong>Approval Code: </strong>{data.approval_code}</div>
      </div>
      <div style={infoStyle}>
        <div style={{ width: '50%' }}><strong>Remark: </strong>{data.remarks}</div>
        <div style={{ width: '50%' }}><strong>Bank Name: </strong>{data.bank_name}</div>
      </div>
    </React.Fragment>
  )
}

function otherView (name) {
  return (
    <div style={{ marginTop: '15px' }}><strong>Payment Mode: </strong>{name}</div>
  )
}

function paymentmodeSpecificView (data) {
  switch (data.paymentMode) {
    case 'Cheque': {
      return chequeView(data)
    }
    case 'Swipe': {
      return swipeView(data)
    }
    default: {
      return otherView(data.paymentMode)
    }
  }
}

function mainView (details) {
  const infoStyle = {
    display: 'flex',
    // justifyContent: 'space-between',
    width: '97%'
  }

  const tableStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }

  const voucherWrapper = {
    display: 'flex',
    width: '97%',
    flexDirection: 'row',
    marginBottom: '15px'
  }

  // const imgstyle = {
  //   width: '80px',
  //   height: '80px'
  // }

  const logoSideText = {
    width: '100%',
    fontSize: '1.2em',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: 'bold'
  }

  const logoSideSubText = {
    width: '100%',
    fontSize: '1em',
    textAlign: 'center'
  }

  const textSize = {
    // textDecoration: 'underline',
    fontSize: '16px'
  }

  return (
    <React.Fragment>
      <div style={voucherWrapper}>
        {/* <div style={logoWrapper}><img style={imgstyle} src={orchidsLogo} alt='logo' /></div> */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={logoSideText}>{details.receiptSettings[0].payslip_header ? details.receiptSettings[0].payslip_header : 'ORCHIDS International School'}</div>
          <div style={logoSideSubText}>{details.receiptSettings[0].receipt_sub_header ? details.receiptSettings[0].receipt_sub_header : 'N/A'}</div>
        </div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '-5px' }}>
        <div style={textSize}>Class/Section:&nbsp;<strong>{details.student && details.student.opting_class && details.student.opting_class.grade ? details.student.opting_class.grade : 'N/A'}</strong></div>
        <div style={textSize}>Academic Year:&nbsp;{details.student && details.student.academic_year && details.student.academic_year.session_year ? details.student.academic_year.session_year : 'N/A'}</div>
        <div style={textSize}>Date:&nbsp;{details.date_of_payment ? details.date_of_payment : 'N/A'}</div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '5px' }}>
        <div style={textSize}>Receipt No: {details.receiptNumber ? details.receiptNumber : 'N/A'}</div>
        <div style={textSize}>Student Name: <strong>{details.student && details.student.student_name ? details.student.student_name : 'N/A'}</strong></div>
        <div style={textSize}>Parent Name: <strong>{details.student && details.student.parent && details.student.parent.father_name ? details.student.parent.father_name : 'N/A'}</strong></div>
      </div>
      {/* table comes here */}
      <div style={{ marginTop: '5px' }}>
        <div style={tableStyle}>
          <div style={{ width: '50%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            <strong>Fee Particulars</strong>
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            <strong>Amount</strong>
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            <strong>Installment Due</strong>
          </div>
        </div>
        <div style={tableStyle}>
          <div style={{ width: '50%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            {details.application_number ? 'Application Fee' : 'Registration Fee'}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            {details.application_number ? details.applicationAmountPaid : details.registrationAmountPaid}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            0
          </div>
        </div>

        <div style={tableStyle}>
          <div style={{ width: '75%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            in words:&nbsp;{details.application_number ? Number.toNumericString(details.applicationAmountPaid, 'only') : Number.toNumericString(details.registrationAmountPaid, 'only')}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            Total:&nbsp;{details.application_number ? details.applicationAmountPaid : details.registrationAmountPaid}
          </div>
          {/* <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>

          </div> */}
        </div>
      </div>
      <div>
        {paymentmodeSpecificView(details)}
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '6px' }}>
        <div style={{ width: '100%', alignSelf: 'center' }}><strong>{details.receiptSettings[0] && details.receiptSettings[0].receipt_footer ? details.receiptSettings[0].receipt_footer : 'N/A'}</strong></div>&nbsp;
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '6px' }}>
        <div style={{ width: '100%', alignSelf: 'center' }}>{details.receiptSettings[0] && details.receiptSettings[0].receipt_sub_footer ? details.receiptSettings[0].receipt_sub_footer : 'N/A'}</div>&nbsp;
      </div>
      <div style={{ width: '100%', border: '1px dashed #000', marginTop: '5px', marginBottom: '5px' }} />

      <div style={voucherWrapper}>
        {/* <div style={logoWrapper}><img style={imgstyle} src={orchidsLogo} alt='logo' /></div> */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={logoSideText}>{details.receiptSettings[0].payslip_header ? details.receiptSettings[0].payslip_header : 'ORCHIDS International School'}</div>
          <div style={logoSideSubText}>{details.receiptSettings[0].receipt_sub_header ? details.receiptSettings[0].receipt_sub_header : 'N/A'}</div>
        </div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '-5px' }}>
        <div style={textSize}>Class/Section:&nbsp;<strong>{details.student && details.student.opting_class && details.student.opting_class.grade ? details.student.opting_class.grade : 'N/A'}</strong></div>
        <div style={textSize}>Academic Year:&nbsp;{details.student && details.student.academic_year && details.student.academic_year.session_year ? details.student.academic_year.session_year : 'N/A'}</div>
        <div style={textSize}>Date:&nbsp;{details.date_of_payment ? details.date_of_payment : 'N/A'}</div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '5px' }}>
        <div style={textSize}>Receipt No: {details.receiptNumber ? details.receiptNumber : 'N/A'}</div>
        <div style={textSize}>Student Name: <strong>{details.student && details.student.student_name ? details.student.student_name : 'N/A'}</strong></div>
        <div style={textSize}>Parent Name: <strong>{details.student && details.student.parent && details.student.parent.father_name ? details.student.parent.father_name : 'N/A'}</strong></div>
      </div>
      {/* table comes here */}
      <div style={{ marginTop: '5px' }}>
        <div style={tableStyle}>
          <div style={{ width: '50%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            <strong>Fee Particulars</strong>
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            <strong>Amount</strong>
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            <strong>Installment Due</strong>
          </div>
        </div>
        <div style={tableStyle}>
          <div style={{ width: '50%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            {details.application_number ? 'Application Fee' : 'Registration Fee'}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            {details.application_number ? details.applicationAmountPaid : details.registrationAmountPaid}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            0
          </div>
        </div>

        <div style={tableStyle}>
          <div style={{ width: '75%', height: '25px', lineHeight: '25px', border: '0.1px solid #e9e8e8', paddingLeft: '5px' }}>
            in words:&nbsp;{details.application_number ? Number.toNumericString(details.applicationAmountPaid, 'only') : Number.toNumericString(details.registrationAmountPaid, 'only')}
          </div>
          <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>
            Total:&nbsp;{details.application_number ? details.applicationAmountPaid : details.registrationAmountPaid}
          </div>
          {/* <div style={{ width: '25%', height: '25px', lineHeight: '25px', textAlign: 'right', border: '0.1px solid #e9e8e8', paddingRight: '5px' }}>

          </div> */}
        </div>
      </div>
      {/* <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '100%', alignSelf: 'center' }}><strong>Payment Mode: {details.paymentMode ? details.paymentMode : 'N/A'}</strong></div>&nbsp;
      </div> */}
      <div>
        {paymentmodeSpecificView(details)}
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '6px' }}>
        <div style={{ width: '100%', alignSelf: 'center' }}><strong>{details.receiptSettings[0] && details.receiptSettings[0].receipt_footer ? details.receiptSettings[0].receipt_footer : 'N/A'}</strong></div>&nbsp;
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '6px' }}>
        <div style={{ width: '100%', alignSelf: 'center' }}>{details.receiptSettings[0] && details.receiptSettings[0].receipt_sub_footer ? details.receiptSettings[0].receipt_sub_footer : 'N/A'}</div>&nbsp;
      </div>
    </React.Fragment>
  )
}

const appRegReceiptsPdf = (details) => {
  console.log('App view', details)
  // console.log('PDF VIEW', details.data)
  const title = details.application_number ? 'Application Fee' : 'Registration Fee'
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

export default appRegReceiptsPdf
