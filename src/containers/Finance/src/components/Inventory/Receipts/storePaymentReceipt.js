import React from 'react'
import { generatePdf } from '../../../utils'
import schoolshop from '../../../assets/schoolshop.jpeg'

const storePayment = (data, isCancelled) => {
  const style = {
    header: {
      lineHeight: '13px',
      marginTop: '15px'
    },
    headerBranch: {
      textAlign: 'center'
    },
    headerAddress: {
      textAlign: 'center'
    },
    headerGst: {
      textAlign: 'center'
    },
    infoContainer: {
      lineHeight: '18px'
    },
    infoSpan: {
      marginRight: '60px'
    },
    voucherHeading: {
      textAlign: 'center',
      fontWeight: 'lighter'
    },
    voucherDetailsContainer: {
      display: 'flex',
      marginTop: '10px'
    },
    voucherDetails: {
      width: '50%',
      border: '1px solid black'
    },
    voucherDetailsField: {
      borderTop: '0.5px solid black',
      paddingLeft: '4px',
      height: '32px',
      lineHeight: '32px'
    },
    itemContainer: {
      fontSize: '13px',
      fontWeight: 'lighter',
      marginTop: '17px',
      marginBottom: '15px'
    },
    itemHeaders: {
      display: 'flex'
    },
    itemRow: {
      display: 'flex'
    },
    itemElement: {
      border: '0.4px solid black',
      // paddingLeft: '2px',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center'
      // fontSize: '15px'
    },
    headings: {
      marginTop: '8px',
      marginBottom: '8px'
    },
    summaryContainer: {
      display: 'flex'
    },
    summaryElement: {
      border: '0.4px solid black',
      paddingLeft: '5px',
      height: '30px',
      lineHeight: '30px',
      textAlign: 'left',
      width: '50%'
      // fontSize: '15px'
    }
  }
  const title = 'Store Payment Receipt'
  function chequeView (data) {
    const infoStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    }
    return (
      <React.Fragment>
        <div style={{ marginTop: '0.6em', fontSize: '1em' }}><strong>Payment Mode: </strong>Cheque</div>
        <div style={infoStyle}>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Name on Cheque: </strong>{data.cheque_name}</div>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Cheque Number: </strong>{data.cheque_number}</div>
        </div>
        <div style={infoStyle}>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Bank Name: </strong>{data.bank_name}</div>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Branch Name: </strong>{data.branch_name}</div>
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
        <div style={{ marginTop: '0.6em', fontSize: '1em' }}><strong>Payment Mode: </strong>Credit/Debit Card</div>
        <div style={infoStyle}>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Card Last Digits: </strong>{data.card_last_digits}</div>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Approval Code: </strong>{data.approval_code}</div>
        </div>
        <div style={infoStyle}>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Remark: </strong>{data.remarks}</div>
          <div style={{ width: '50%', fontSize: '1em' }}><strong>Branch Name: </strong>{data.branch_name}</div>
        </div>
      </React.Fragment>
    )
  }

  function otherView (name) {
    return (
      <div style={{ marginTop: '0.6em', marginBottom: '0.6em', fontSize: '1em' }}><strong>Payment Mode: </strong>{name}</div>
    )
  }

  function paymentmodeSpecificView (data) {
    switch (data.payment_name) {
      case 'Cheque': {
        return chequeView(data)
      }
      case 'Swipe': {
        return swipeView(data)
      }
      default: {
        return otherView(data.payment_name)
      }
    }
  }

  const header = (
    <React.Fragment></React.Fragment>
  )
  let totalDeliveryQuantity = 0
  let totalDelAmount = 0
  let totalDelWithoutGst = 0
  let totalDelCgst = 0
  let totalDelSgst = 0
  let totalUniformQuantity = 0
  let totalStatQuantity = 0
  let totalCalcAmount = 0
  let totalWithoutGst = 0
  let totalCgst = 0
  let totalSgst = 0
  let totalCalcAmountStan = 0
  let totalWithoutGstStan = 0
  let totalCgstStan = 0
  let totalSgstStan = 0
  let discountStat = 0
  let discountUni = 0
  let totalStat = 0
  let totalUni = 0
  // let shippingAmountUni = 0
  // let shippingAmountStat = 0
  const uniformKit = []
  const stationaryKit = []
  const deliveryItem = []
  data.forEach((item, index) => {
    if (index > 0) {
      if (item.is_uniform_item && !item.is_delivery_item) {
        uniformKit.push(item)
      } else if (!item.is_uniform_item && item.is_delivery_item) {
        deliveryItem.push(item)
      } else {
        stationaryKit.push(item)
      }
    }
  })

  const deliveryKitReceipt = (
    <React.Fragment>
      <div style={{ ...style.header, display: 'flex' }}>
        <hr />
        <div style={{ width: '20%' }}>
          <img src={schoolshop} alt='logo' style={{ width: '100%' }} />
        </div>
        <div style={{ width: '80%' }}>
          <h4 style={style.headerBranch}>{data[1].store_header || 'NA'}</h4>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter' }}>{data[1].store_address || 'NA'}</h5>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter', marginTop: 15 }}>{data[1].gst_no || 'NA'}</h5>
        </div>
        <hr />
      </div>
      <div style={style.infoContainer}>
        <div>Student Name : {data[0].student_name}</div>
        <div>ERP Code : {data[0].student_erp}</div>
        <div>
          <span style={style.infoSpan}>Class : {data[0].student_grade_section}</span>
          <span>Academic Year : {data[0].academic_year}</span>
        </div>
      </div>
      <hr />
      <h4 style={{ ...style.voucherHeading, ...style.headings }}>Receipt Voucher</h4>
      <hr />
      <div style={style.voucherDetailsContainer}>
        <div style={style.voucherDetails}>
          <div style={{ paddingLeft: '4px', height: '32px', lineHeight: '32px' }}>Voucher Number : {data[0].receipt_number || data[0].receipt_number_online}</div>
          <div style={style.voucherDetailsField}>Voucher Date : {data[0].date_of_payment}</div>
          <div style={style.voucherDetailsField}>Place Of Supply: {data[1].place_of_supply || 'NA'}</div>
          <div style={style.voucherDetailsField} />
          <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: {data[1].state || 'NA'}</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>{data[1].state_code || 'NA'}</div>
          </div>
        </div>
        <div style={style.voucherDetails}>
          <div style={{ textAlign: 'center', height: '32px', lineHeight: '32px' }}><strong>Details of Receiver</strong></div>
          <div style={style.voucherDetailsField}>Name : {data[0].parent_name}</div>
          <div style={{ ...style.voucherDetailsField, lineHeight: '15px' }}>{data[0].address || 'N/A'}</div>
          <div style={style.voucherDetailsField} />
          {/* <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: Karnataka</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>20</div>
          </div> */}
        </div>
      </div>
      <div style={style.itemContainer}>
        <div style={style.itemHeaders}>
          <div style={{ ...style.itemElement, width: '4%' }}>S.No</div>
          <div style={{ ...style.itemElement, width: '23%' }}>Product Description</div>
          <div style={{ ...style.itemElement, width: '9%' }}>HSN</div>
          <div style={{ ...style.itemElement, width: '10%' }}>Quantity</div>
          <div style={{ ...style.itemElement, width: '11%' }}>Tax</div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>CGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>SGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '17%', textAlign: 'center' }}>Total</div>
        </div>
        {deliveryItem.map((item, index) => {
          totalDeliveryQuantity = totalDeliveryQuantity + (+item.quantity)
          totalDelAmount = totalDelAmount + (+item.final_price)
          totalDelWithoutGst = totalDelWithoutGst + (+item.actual_price)
          totalDelCgst = totalDelCgst + (+item.cgst_amount)
          totalDelSgst = totalDelSgst + (+item.sgst_amount)
          // shippingAmountUni = shippingAmountUni + (+item.delivery_amount)
          return (
            <div style={style.itemRow} key={index}>
              <div style={{ ...style.itemElement, width: '4%', height: '25px', lineHeight: '25px' }}>
                {index + 1}
              </div>
              <div style={{ ...style.itemElement, width: '23%', height: '25px', lineHeight: '25px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name || ''}
              </div>
              <div style={{ ...style.itemElement, width: '9%', height: '25px', lineHeight: '25px' }}>
                {null}
              </div>
              <div style={{ ...style.itemElement, width: '10%', height: '25px', lineHeight: '25px' }}>
                {item.quantity || 0}
              </div>
              <div style={{ ...style.itemElement, width: '11%', height: '25px', lineHeight: '25px' }}>
                {item.actual_price.toFixed(2) || ''}
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.cgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.cgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.sgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.sgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '17%', textAlign: 'center', height: '25px', lineHeight: '25px' }}>
                {item.final_price || ''}
              </div>
            </div>
          )
        })}
        <div style={style.itemRow}>
          <div style={{ width: '35%', border: '0.5px solid black', textAlign: 'center' }}><strong>Total</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalDeliveryQuantity}</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalDelWithoutGst.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalDelCgst.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalDelSgst.toFixed(2)}</strong></div>
          <div style={{ width: '17%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalDelAmount}</strong></div>
        </div>
        <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Total Paid Rupees : {Number.toNumericString(Math.round(+totalDelAmount))}
        </div>
        {/* <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Payment Mode: {data[0].payment_name || ''}
        </div> */}
        <div style={{
          // height: '30px',
          // lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          {paymentmodeSpecificView(data[0])}
        </div>
        <div style={{ ...style.summaryContainer, border: '0.5px solid black', marginTop: '20px' }}>
          <div style={{ width: '50%' }}>
            <div>Certified that particular given above are true and correct.</div>
            <div>for <strong>{data[1].store_header || 'NA'}</strong></div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount before Tax</div>
              <div style={style.summaryElement}>{totalDelWithoutGst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>CGST(+)</div>
              <div style={style.summaryElement}>{totalDelCgst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>SGST(+)</div>
              <div style={style.summaryElement}>{totalDelSgst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Tax Amount(GST)</div>
              <div style={style.summaryElement}>{(totalDelCgst + totalDelSgst).toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount After Tax</div>
              <div style={style.summaryElement}>{totalDelAmount}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount (Round off)</div>
              <div style={style.summaryElement}>{Math.round(+totalDelAmount)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Discount Amount (-)</div>
              {/* <div style={style.summaryElement}>{totalCalcAmount - data[0].total_amount}</div> */}
              <div style={style.summaryElement}>{'0'}</div>
            </div>
            <div style={style.itemRow}>
              {/* <div style={style.summaryElement}>Delivery Charges (+)</div>
              <div style={style.summaryElement}>{'0'}</div> */}
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount After Coupon</div>
              {/* <div style={style.summaryElement}>{data[0].total_amount}</div> */}
              <div style={style.summaryElement}>{Math.round(+totalDelAmount)}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
  const uniformReceipt = (
    <React.Fragment>
      <div style={{ ...style.header, display: 'flex' }}>
        <hr />
        <div style={{ width: '20%' }}>
          <img src={schoolshop} alt='logo' style={{ width: '100%' }} />
        </div>
        <div style={{ width: '80%' }}>
          <h4 style={style.headerBranch}>{data[1].store_header || 'NA'}</h4>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter' }}>{data[1].store_address || 'NA'}</h5>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter', marginTop: 15 }}>{data[1].gst_no || 'NA'}</h5>
        </div>
        <hr />
      </div>
      <div style={style.infoContainer}>
        <div>Student Name : {data[0].student_name}</div>
        <div>ERP Code : {data[0].student_erp}</div>
        <div>
          <span style={style.infoSpan}>Class : {data[0].student_grade_section}</span>
          <span>Academic Year : {data[0].academic_year}</span>
        </div>
      </div>
      <hr />
      <h4 style={{ ...style.voucherHeading, ...style.headings }}>Receipt Voucher</h4>
      <hr />
      <div style={style.voucherDetailsContainer}>
        <div style={style.voucherDetails}>
          <div style={{ paddingLeft: '4px', height: '32px', lineHeight: '32px' }}>Voucher Number : {data[0].receipt_number || data[0].receipt_number_online}</div>
          <div style={style.voucherDetailsField}>Voucher Date : {data[0].date_of_payment}</div>
          <div style={style.voucherDetailsField}>Place Of Supply: {data[1].place_of_supply || 'NA'}</div>
          <div style={style.voucherDetailsField} />
          <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: {data[1].state || 'NA'}</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>{data[1].state_code || 'NA'}</div>
          </div>
        </div>
        <div style={style.voucherDetails}>
          <div style={{ textAlign: 'center', height: '32px', lineHeight: '32px' }}><strong>Details of Receiver</strong></div>
          <div style={style.voucherDetailsField}>Name : {data[0].parent_name}</div>
          <div style={{ ...style.voucherDetailsField, lineHeight: '15px' }}>{data[0].address || 'N/A'}</div>
          <div style={style.voucherDetailsField} />
          {/* <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: Karnataka</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>20</div>
          </div> */}
        </div>
      </div>
      <div style={style.itemContainer}>
        <div style={style.itemHeaders}>
          <div style={{ ...style.itemElement, width: '4%' }}>S.No</div>
          <div style={{ ...style.itemElement, width: '23%' }}>Product Description</div>
          <div style={{ ...style.itemElement, width: '9%' }}>HSN</div>
          <div style={{ ...style.itemElement, width: '10%' }}>Quantity</div>
          <div style={{ ...style.itemElement, width: '11%' }}>Tax</div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>CGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>SGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '17%', textAlign: 'center' }}>Total</div>
        </div>
        {uniformKit.map((item, index) => {
          totalUniformQuantity = totalUniformQuantity + (+item.quantity)
          totalCalcAmount = totalCalcAmount + (+item.final_price)
          totalWithoutGst = totalWithoutGst + (+item.actual_price)
          totalCgst = totalCgst + (+item.cgst_amount)
          totalSgst = totalSgst + (+item.sgst_amount)
          discountUni = (+item.discount)
          totalUni = totalCalcAmount - discountUni
          // shippingAmountUni = shippingAmountUni + (+item.delivery_amount)
          return (
            <div style={style.itemRow} key={index}>
              <div style={{ ...style.itemElement, width: '4%', height: '25px', lineHeight: '25px' }}>
                {index + 1}
              </div>
              <div style={{ ...style.itemElement, width: '23%', height: '25px', lineHeight: '25px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name || ''}
              </div>
              <div style={{ ...style.itemElement, width: '9%', height: '25px', lineHeight: '25px' }}>
                {null}
              </div>
              <div style={{ ...style.itemElement, width: '10%', height: '25px', lineHeight: '25px' }}>
                {item.quantity || 0}
              </div>
              <div style={{ ...style.itemElement, width: '11%', height: '25px', lineHeight: '25px' }}>
                {item.actual_price.toFixed(2) || ''}
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.cgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.cgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.sgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.sgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '17%', textAlign: 'center', height: '25px', lineHeight: '25px' }}>
                {item.final_price || ''}
              </div>
            </div>
          )
        })}
        <div style={style.itemRow}>
          <div style={{ width: '35%', border: '0.5px solid black', textAlign: 'center' }}><strong>Total</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalUniformQuantity}</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalWithoutGst.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalCgst.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalSgst.toFixed(2)}</strong></div>
          <div style={{ width: '17%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalCalcAmount}</strong></div>
        </div>
        <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Total Paid Rupees : {Number.toNumericString(Math.round(+totalCalcAmount - discountUni))}
        </div>
        {/* <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Payment Mode: {data[0].payment_name || ''}
        </div> */}
        <div style={{
          // height: '30px',
          // lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          {paymentmodeSpecificView(data[0])}
        </div>
        <div style={{ ...style.summaryContainer, border: '0.5px solid black', marginTop: '20px' }}>
          <div style={{ width: '50%' }}>
            <div>Certified that particular given above are true and correct.</div>
            <div>for <strong>{data[1].store_header || 'NA'}</strong></div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount before Tax</div>
              <div style={style.summaryElement}>{totalWithoutGst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>CGST(+)</div>
              <div style={style.summaryElement}>{totalCgst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>SGST(+)</div>
              <div style={style.summaryElement}>{totalSgst.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Tax Amount(GST)</div>
              <div style={style.summaryElement}>{(totalCgst + totalSgst).toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount After Tax</div>
              <div style={style.summaryElement}>{totalCalcAmount}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount (Round off)</div>
              <div style={style.summaryElement}>{Math.round(+totalCalcAmount)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Discount Amount (-)</div>
              {/* <div style={style.summaryElement}>{totalCalcAmount - data[0].total_amount}</div> */}
              <div style={style.summaryElement}>{discountUni}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Delivery Charges (+)</div>
              <div style={style.summaryElement}>{'0'}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Paid Amount</div>
              {/* <div style={style.summaryElement}>{data[0].total_amount}</div> */}
              <div style={style.summaryElement}>{Math.round(+totalCalcAmount - discountUni)}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )

  const stationaryReceipt = (
    <React.Fragment>
      <div style={{ ...style.header, display: 'flex' }}>
        <hr />
        <div style={{ width: '20%' }}>
          <img src={schoolshop} alt='logo' style={{ width: '100%' }} />
        </div>
        <div style={{ width: '80%' }}>
          <h4 style={style.headerBranch}>{data[1].store_header || 'NA'}</h4>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter' }}>{data[1].store_address || 'NA'}</h5>
          <h5 style={{ ...style.headerBranch, ...style.headings, fontWeight: 'lighter', marginTop: 15 }}>{data[1].gst_no || 'NA'}</h5>
        </div>
        <hr />
      </div>
      <div style={style.infoContainer}>
        <div>Student Name : {data[0].student_name}</div>
        <div>ERP Code : {data[0].student_erp}</div>
        <div>
          <span style={style.infoSpan}>Class : {data[0].student_grade_section}</span>
          <span>Academic Year : {data[0].academic_year}</span>
        </div>
      </div>
      <hr />
      <h4 style={{ ...style.voucherHeading, ...style.headings }}>Receipt Voucher</h4>
      <hr />
      <div style={style.voucherDetailsContainer}>
        <div style={style.voucherDetails}>
          <div style={{ paddingLeft: '4px', height: '32px', lineHeight: '32px' }}>Voucher Number : {data[0].receipt_number || data[0].receipt_number_online}</div>
          <div style={style.voucherDetailsField}>Voucher Date : {data[0].date_of_payment}</div>
          <div style={style.voucherDetailsField}>Place Of Supply: {data[1].place_of_supply || 'NA'}</div>
          <div style={style.voucherDetailsField} />
          <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: {data[1].state || 'NA'}</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>{data[1].state_code || 'NA'}</div>
          </div>
        </div>
        <div style={style.voucherDetails}>
          <div style={{ textAlign: 'center', height: '32px', lineHeight: '32px' }}><strong>Details of Receiver</strong></div>
          <div style={style.voucherDetailsField}>Name : {data[0].parent_name}</div>
          <div style={{ ...style.voucherDetailsField, lineHeight: '15px' }}>{data[0].address || 'N/A'}</div>
          <div style={style.voucherDetailsField} />
          {/* <div style={{ ...style.voucherDetailsField, display: 'flex' }}>
            <div style={{ width: '60%' }}>State: Karnataka</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>Code</div>
            <div style={{ width: '20%', paddingLeft: '5px', borderLeft: '0.5px solid black' }}>20</div>
          </div> */}
        </div>
      </div>
      <div style={style.itemContainer}>
        <div style={style.itemHeaders}>
          <div style={{ ...style.itemElement, width: '4%' }}>S.No</div>
          <div style={{ ...style.itemElement, width: '23%' }}>Product Description</div>
          <div style={{ ...style.itemElement, width: '9%' }}>HSN</div>
          <div style={{ ...style.itemElement, width: '10%' }}>Quantity</div>
          <div style={{ ...style.itemElement, width: '11%' }}>Tax</div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>CGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '13%', lineHeight: '20px' }}>
            <div style={{ height: '50%' }}>SGST</div>
            <div style={{ display: 'flex', height: '50%' }}>
              <div style={{ border: '0.4px solid black', width: '45%' }}>
                Rate
              </div>
              <div style={{ border: '0.4px solid black', width: '55%' }}>
                Amount
              </div>
            </div>
          </div>
          <div style={{ ...style.itemElement, width: '17%', textAlign: 'center' }}>Total</div>
        </div>
        {stationaryKit.map((item, index) => {
          totalStatQuantity = totalStatQuantity + (+item.quantity)
          totalCalcAmountStan = totalCalcAmountStan + (+item.final_price)
          totalWithoutGstStan = totalWithoutGstStan + (+item.actual_price)
          totalCgstStan = totalCgstStan + (+item.cgst_amount)
          totalSgstStan = totalSgstStan + (+item.sgst_amount)
          discountStat = (+item.discount)
          totalStat = totalWithoutGstStan - discountStat + totalCgstStan + totalSgstStan
          return (
            <div style={style.itemRow} key={index}>
              <div style={{ ...style.itemElement, width: '4%', height: '25px', lineHeight: '25px' }}>
                {index + 1}
              </div>
              <div style={{ ...style.itemElement, width: '23%', height: '25px', lineHeight: '25px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name || ''}
              </div>
              <div style={{ ...style.itemElement, width: '9%', height: '25px', lineHeight: '25px' }}>
                {null}
              </div>
              <div style={{ ...style.itemElement, width: '10%', height: '25px', lineHeight: '25px' }}>
                {item.quantity || 0}
              </div>
              <div style={{ ...style.itemElement, width: '11%', height: '25px', lineHeight: '25px' }}>
                {item.actual_price.toFixed(2) || ''}
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.cgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.cgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '13%', display: 'flex', height: '25px', lineHeight: '25px' }}>
                <div style={{ width: '45%', borderRight: '0.5px solid black' }}>{item.sgst_per || '0'}</div>
                <div style={{ width: '55%', borderLeft: '0.5px solid black' }}>{item.sgst_amount.toFixed(2) || '0'}</div>
              </div>
              <div style={{ ...style.itemElement, width: '17%', textAlign: 'center', height: '25px', lineHeight: '25px' }}>
                {item.final_price || ''}
              </div>
            </div>
          )
        })}
        <div style={style.itemRow}>
          <div style={{ width: '35%', border: '0.5px solid black', textAlign: 'center' }}><strong>Total</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalStatQuantity}</strong></div>
          <div style={{ width: '11%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalWithoutGstStan.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalCgstStan.toFixed(2)}</strong></div>
          <div style={{ width: '13%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalSgstStan.toFixed(2)}</strong></div>
          <div style={{ width: '17%', border: '0.5px solid black', textAlign: 'center' }}><strong>{totalCalcAmountStan}</strong></div>
        </div>
        <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Total Paid Rupees : {Number.toNumericString(Math.round(deliveryItem[0] && deliveryItem[0].delivery_amount ? +totalStat + deliveryItem[0].delivery_amount : +totalStat))}
        </div>
        {/* <div style={{
          height: '30px',
          lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          Payment Mode: {data[0].payment_name || ''}
        </div> */}
        <div style={{
          // height: '30px',
          // lineHeight: '30px',
          paddingLeft: '5px',
          border: '0.5px solid black'
        }}>
          {paymentmodeSpecificView(data[0])}
        </div>
        <div style={{ ...style.summaryContainer, border: '0.5px solid black', marginTop: '20px' }}>
          <div style={{ width: '50%' }}>
            <div>Certified that particular given above are true and correct.</div>
            <div>for <strong>{data[1].store_header || 'NA'}</strong></div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount before Tax</div>
              <div style={style.summaryElement}>{totalWithoutGstStan.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>CGST(+)</div>
              <div style={style.summaryElement}>{totalCgstStan.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>SGST(+)</div>
              <div style={style.summaryElement}>{totalSgstStan.toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Tax Amount(GST)</div>
              <div style={style.summaryElement}>{(totalCgstStan + totalSgstStan).toFixed(2)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount After Tax</div>
              <div style={style.summaryElement}>{totalCalcAmountStan}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Amount (Round off)</div>
              <div style={style.summaryElement}>{Math.round(+totalCalcAmountStan)}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Discount Amount (-)</div>
              {/* <div style={style.summaryElement}>{totalCalcAmountStan - data[0].total_amount}</div> */}
              <div style={style.summaryElement}>{discountStat}</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Delivery Charges (+)</div>
              <div style={style.summaryElement}>{(deliveryItem[0] && +deliveryItem[0].delivery_amount) || '0' }</div>
            </div>
            <div style={style.itemRow}>
              <div style={style.summaryElement}>Total Paid Amount</div>
              <div style={style.summaryElement}>{Math.round(deliveryItem[0] && deliveryItem[0].delivery_amount ? +totalStat + deliveryItem[0].delivery_amount : +totalStat)}</div>
              {/* <div style={style.summaryElement}>{Math.round(deliveryItem[0] && deliveryItem[0].delivery_amount ? +totalCalcAmountStan + deliveryItem[0].delivery_amount - discountAmt : +totalCalcAmountStan - discountAmt)}</div> */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
  const component = (
    <React.Fragment>
      {!uniformKit.length && !stationaryKit.length && deliveryItem.length ? deliveryKitReceipt : null}
      {uniformKit.length ? uniformReceipt : null}
      {uniformKit.length && stationaryKit.length ? <div style={{ pageBreakAfter: 'always' }} /> : null}
      {stationaryKit.length ? stationaryReceipt : null}
    </React.Fragment>
  )
  const footer = (
    <React.Fragment>
    </React.Fragment>
  )
  generatePdf({ title, header, component, footer, isCancelled })
}

export default storePayment
