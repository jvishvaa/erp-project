import React from 'react'

import PdfGenerator from '../../../utils/pdfGenerator'
import orchidsLogo from '../../../assets/orchidsLogo.jpeg'
// import customClasses from './makePayment.module.css'

function mainView (details) {
  const infoStyle = {
    display: 'flex',
    // justifyContent: 'space-between',
    width: '97%'
  }

  const voucherWrapper = {
    display: 'flex',
    width: '97%',
    flexDirection: 'row',
    marginBottom: '15px'
  }

  const logoWrapper = {
    // width: '150px',
    // height: '150px'
  }

  const imgstyle = {
    width: '125px',
    height: '125px'
  }

  const logoSideText = {
    width: '100%',
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '10px'
  }

  const logoSideSubText = {
    width: '100%',
    fontSize: '28px',
    textAlign: 'center'
  }

  const textSize = {
    // textDecoration: 'underline',
    fontSize: '20px'
  }

  return (
    <React.Fragment>
      <div style={voucherWrapper}>
        <div style={logoWrapper}><img style={imgstyle} src={orchidsLogo} alt='logo' /></div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={logoSideText}>{details.payslipHeader ? details.payslipHeader : 'ORCHIDS International School'}</div>
          <div style={logoSideSubText}>{details.payslipSubHeader ? details.payslipSubHeader : ''}</div>
        </div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '12px', marginBottom: '15px' }}>
        <div style={textSize}><strong>Transaction Id: &nbsp;{details.transactionId}</strong></div>
        <div style={textSize}>Date:&nbsp;{details.date ? details.date : 'N/A'}</div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '12px', marginBottom: '15px' }}>
        <div style={textSize}>Voucher No: {details.voucherNo ? details.voucherNo : 'N/A'}</div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '25%', alignSelf: 'center' }}><strong>Paid to Mr./Mrs./Ms.</strong></div>&nbsp;
        <div style={{ width: '75%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{details.paidTo ? details.paidTo : 'N/A'}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '5%', alignSelf: 'center' }}><strong>in.</strong></div>
        <div style={{ width: '35%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{details.paymentMode ? details.paymentMode : 'N/A'}</p></div>
        <div style={{ width: '25%', alignSelf: 'center' }}><strong>for the amount of Rs.</strong></div>
        <div style={{ width: '35%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{details.totalAmount ? details.totalAmount : 'N/A'}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '15%', alignSelf: 'center' }}><strong>in words</strong></div>&nbsp;
        <div style={{ width: '85%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{Number.toNumericString(details.totalAmount, 'only')}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}><strong>Debited A/c</strong></div>&nbsp;
        <div style={{ width: '80%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{details.bankName ? details.bankName : 'N/A'}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '15%', alignSelf: 'center' }}><strong>Narration</strong></div>&nbsp;
        <div style={{ width: '85%', alignSelf: 'flex-end', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '16px' }}>{details.narration ? details.narration : 'N/A'}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'flex-start', marginTop: '12px', marginBottom: '15px' }}>
        <div style={{ width: '15%', alignSelf: 'center' }}><strong>Approved By.</strong></div>&nbsp;
        <div style={{ width: '85%', borderBottom: '1px solid black' }}> <p style={{ textAlign: 'center', paddingBottom: '0px', lineHeight: '0px' }}>{details.approvedBy ? details.approvedBy : 'N/A'}</p></div>
      </div>
      <div style={{ ...infoStyle, justifyContent: 'space-between', marginTop: '150px', marginBottom: '15px' }}>
        <div style={{ alignSelf: 'center' }}><strong>Signature of Receiver.</strong></div>&nbsp;
        <div style={{ alignSelf: 'center' }}><strong>Authorized Signature.</strong></div>&nbsp;
        <div style={{ alignSelf: 'center' }}><strong>Cashier Signature.</strong></div>&nbsp;
      </div>
    </React.Fragment>
  )
}

const voucherPdf = (details) => {
  console.log('Voucher VIEW', details)
  // console.log('PDF VIEW', details.data)
  const title = 'Voucher Receipt'
  const header = (
    <React.Fragment />
  )
  const component = (
    <React.Fragment>
      {mainView(details)}
    </React.Fragment>
  )
  const footer = (
    <React.Fragment />
  )
  PdfGenerator({ title, header, component, footer })
}

export default voucherPdf
