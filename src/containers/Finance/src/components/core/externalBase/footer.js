import React from 'react'

const Footer = () => {
  return (
    <div
      style={{ marginTop: 40, padding: 8, paddingTop: 24, paddingBottom: 24, flex: 1, backgroundColor: 'white', paddingLeft: 24, borderTop: '1px solid rgba(0,0,0,0.2)' }}>

      {window.location.host.includes('alwaysonlearning.com')
        ? <span>Copyright &copy; 2020 Always On Learning. All rights reserved.</span>
        : <span>Copyright &copy; 2019 K12 Techno Services Pvt Ltd. All rights reserved.</span>}
    </div>
  )
}

export default Footer
