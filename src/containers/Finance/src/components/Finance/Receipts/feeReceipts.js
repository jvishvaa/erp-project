import React from 'react'
import PdfGenerator from '../../../utils/pdfGenerator'

// const overFlow = {
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   textOverflow: 'ellipsis'
// }
function chequeView (data) {
  const infoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
  return (
    <React.Fragment>
      <div style={{ marginTop: '0.375em', fontSize: '0.625em' }}><strong>Payment Mode: </strong>Cheque</div>
      <div style={infoStyle}>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Name on Cheque: </strong>{data.cheque_name}</div>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Cheque Number: </strong>{data.cheque_number}</div>
      </div>
      <div style={infoStyle}>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Bank Name: </strong>{data.bank_name}</div>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Branch Name: </strong>{data.bank_name}</div>
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
      <div style={{ marginTop: '0.375em', fontSize: '0.625em' }}><strong>Payment Mode: </strong>Credit/Debit Card</div>
      <div style={infoStyle}>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Card Last Digits: </strong>{data.card_last_digits}</div>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Approval Code: </strong>{data.approval_code}</div>
      </div>
      <div style={infoStyle}>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Remark: </strong>{data.remarks}</div>
        <div style={{ width: '50%', fontSize: '0.625em' }}><strong>Branch Name: </strong>{data.bank_name}</div>
      </div>
    </React.Fragment>
  )
}

function otherView (name) {
  return (
    <div style={{ marginTop: '0.375em', fontSize: '0.875em' }}><strong>Payment Mode: </strong>{name}</div>
  )
}

function paymentmodeSpecificView (data) {
  switch (data.payment_in) {
    case 'Cheque': {
      return chequeView(data)
    }
    case 'Swipe': {
      return swipeView(data)
    }
    default: {
      return otherView(data.payment_in)
    }
  }
}

function mainView (data) {
  const infoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
  if (data) {
    // let balanceTotal = 0
    // const metaData = data[data.length - 1]
    return (
      <React.Fragment>
        <div>
          <React.Fragment>
            {/* <div style={{ margin: 'auto', textAlign: 'center' }} className='feeReceipt__main'>
              <label style={{ fontSize: '1em', fontWeight: 'bold' }}>{metaData && metaData.payslip_header}</label>
              <p style={{ marginTop: '-3px' }}>{metaData && metaData.receipt_sub_header}</p>
            </div> */}
            <div style={{ ...infoStyle, marginTop: '-2px' }}>
              <div>Date: {data.transaction_details[0].date_of_payment}</div>
              {/* <div><strong>Receipt No: {data[0].receipt_number ? data[0].receipt_number : data[0].receipt_number_online }</strong></div> */}
              {/* <div>ERP No: {data[0].student_erp}</div> */}
              <div>Academic Year: {data.transaction_details[0].session_year || ''}</div>
            </div>
            <div style={{ ...infoStyle, marginTop: '0.313em', marginBottom: '0.500em' }}>
              <div>Student Name: {data.student_info.student_name}</div>
              <div style={{ marginLeft: 10 }}>{data.student_info.erp ? 'Erp:' + data.student_info.erp : ''}</div>
              <div style={{ marginLeft: 10 }}>Class/Section: {data.student_info.grade}</div>
              <div style={{ marginLeft: 10 }}>Parent Name: {data.student_info.parent_name}</div>
            </div>
            <hr />
          </React.Fragment>
          <div style={{ marginTop: '0.375em' }}>
            <div style={infoStyle}>
              <div style={{ width: '85%', height: '1em', lineHeight: '1em', border: '0.006em solid #e9e8e8', paddingLeft: '0.125em' }}>
                <strong>Fee Particulars</strong>
              </div>
              <div style={{ width: '15%', height: '1em', lineHeight: '1em', textAlign: 'center', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                <strong>Amount</strong>
              </div>
              {/* <div style={{ width: '15%', height: '1em', lineHeight: '1em', textAlign: 'center', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                <strong>Installment Due</strong>
              </div> */}
            </div>
            {/* {data.transaction_details.filter((item, index) => index > 0 && index < (data.transaction_details && data.transaction_details.length - 1)).map((item, index) => { */}
            {/* // balanceTotal += item.balance
              // balanceTotal += item.amount */}
            {data.transaction_details && data.transaction_details.map((item) => {
              return (
                (
                  <div style={infoStyle} >
                    <div style={{ width: '85%', border: '0.006em solid #e9e8e8', paddingLeft: '0.125em' }}>
                      {item.fee_type_name}
                    </div>
                    <div style={{ width: '15%', textAlign: 'center', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                      {item.amount}
                    </div>
                    {/* <div style={{ width: '15%', textAlign: 'center', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                      {item.balance}
                    </div> */}
                  </div>
                )
              )
            })}

            <div style={infoStyle}>
              <div style={{ width: '85%', height: '1em', lineHeight: '1em', border: '0.006em solid #e9e8e8', paddingLeft: '0.125em' }}>
                  Total
              </div>
              <div style={{ width: '15%', height: '1em', textAlign: 'center', lineHeight: '1em', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                {data.payment_details.amount}
              </div>
              {/* <div style={{ width: '25%', height: '1em', lineHeight: '1em', textAlign: 'right', border: '0.006em solid #e9e8e8', paddingRight: '0.125em' }}>
                {balanceTotal}
              </div> */}
            </div>
          </div>
          <div>
            {paymentmodeSpecificView(data.payment_details)}
          </div>
          <hr />
          <React.Fragment>
            <div>
              <label style={{ fontWeight: 'bold', float: 'left' }}>{}</label>
              <label style={{ fontWeight: 'bold', float: 'right' }}>Accountant</label>
            </div>
            <div style={{ borderBottom: '0.125em dotted black', clear: 'both', paddingBottom: '0.300em' }}>
              <label>Note :</label>{data.fee_account.receipt_footer}
            </div>
          </React.Fragment>
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>

      </React.Fragment>
    )
  }
}

const feeReceipts = (data, isCancelled) => {
  const title = 'Receipt'
  const header = (
    <React.Fragment>
      <div style={{ width: '85%', textAlign: 'center' }}>
        <b>{data.fee_account && data.fee_account.receipt_sub_header} </b>
      </div>
    </React.Fragment>
  )
  const component = (
    <React.Fragment>
      {mainView(data)}
      {mainView(data)}
    </React.Fragment>
  )
  const footer = (
    <React.Fragment>
    </React.Fragment>
  )
  PdfGenerator({ title, header, component, footer, isCancelled })
}

export default feeReceipts
