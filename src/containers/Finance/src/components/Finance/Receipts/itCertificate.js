import React from 'react'
import PdfGenerator from '../../../utils/pdfGenerator'
import orchidsLogo from '../../../assets/orchidsLogo.jpeg'

const itCertificate = (data) => {
  const {
    studentName,
    parentName,
    amount,
    amountString,
    date,
    grade,
    session,
    institute,
    location
  } = data
  const headerStyle = {
    width: '200px',
    height: '200px',
    margin: 'auto',
    border: '1px solid black',
    marginBottom: '80px',
    marginTop: '50px'
  }
  const titleStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'lighter',
    fontFamily: 'sans-serif',
    color: 'rgb(75, 75, 75)'
  }
  const mainStyle = {
    width: '98%',
    margin: 'auto',
    lineHeight: '40px',
    wordSpacing: '12px',
    fontSize: '20px',
    color: 'rgb(75, 75, 75)',
    fontFamily: 'sans-serif'
  }
  const lowerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    lineHeight: '40px',
    wordSpacing: '12px',
    fontSize: '20px',
    marginTop: '50px',
    color: 'rgb(75, 75, 75)'
  }

  const title = 'IT Certificate'
  const header = (
    <React.Fragment>
      <div style={headerStyle}><img src={orchidsLogo} alt='Orchids' style={{ width: '100%', height: '100%' }} /></div>
    </React.Fragment>
  )
  const component = (
    <React.Fragment>
      <h2 style={titleStyle}>TO WHOM IT MAY CONCERN</h2>
      <p style={mainStyle}>This is to certify that we have received an amount of <strong>{amount} ({amountString}) </strong>
        during the financial year <strong>{session}</strong> from <strong>{parentName} </strong>
        towards tuition fee in respect of his/her son/daughter, <strong>{studentName}</strong> who is studying
        in {grade} in our school
      </p>
      <div style={lowerStyle}>
        <div>
          <div>Place: {location}</div>
          <div>Date: {date}</div>
        </div>
        <div style={{ marginTop: '30px' }}>
          <div>for <strong>{ institute }</strong></div>
          <div style={{ textAlign: 'right' }}>Manager(F&A)</div>
        </div>
      </div>
    </React.Fragment>
  )
  const footer = (
    <React.Fragment>
    </React.Fragment>
  )
  PdfGenerator({ title, header, component, footer })
}

export default itCertificate
