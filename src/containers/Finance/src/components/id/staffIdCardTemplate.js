import React from 'react'

const Template = props => {
  let { staff, data } = props
  return (
    <table style={{ border: '1px solid black', borderRadius: '10px', width: '350px' }}>
      <tbody>
        <tr>
          <td>
            <table
              style={{ height: '50px', maxHeight: '50px', minHeight: '50px', width: '100%' }}
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      style={{ margin: '0 auto', display: 'block', width: '105px', height: '75px' }}
                      src={staff.branch_fk.logo.includes('no-img')
                        ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/logo.jpg'
                        : staff.branch_fk.logo
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                height: '50px',
                maxHeight: '50px',
                minHeight: '50px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      style={{
                        width: '100px',
                        height: '85px'
                      }}
                      src={staff.employee_photo && staff.employee_photo.includes('no-img')
                        ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/LetseduvateLogo.jpeg'
                        : staff.employee_photo
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                height: '160px',
                maxHeight: '200px',
                width: '100%'
              }}
            >
              <colgroup>
                <col width='32%' />
                <col />
              </colgroup>
              <tbody>
                <tr style={{
                  backgroundColor: '#f9c763',
                  WebkitPrintColorAdjust: 'exact'
                }}>
                  <td> Staff Name </td>
                  <td>:&nbsp;{staff.name}</td>
                </tr>
                <tr>
                  <td> ERP Code </td>
                  <td>:&nbsp;{staff.erp_code}</td>
                </tr>
                <tr>
                  <td> Designation </td>
                  <td>:&nbsp;{staff.designation && staff.designation.designation_name}</td>
                </tr>
                <tr>
                  <td> Contact </td>
                  <td>:&nbsp;{staff.contact_no}</td>
                </tr>
                <tr style={{
                  backgroundColor: '#f9c763',
                  WebkitPrintColorAdjust: 'exact'
                }}>
                  <td> Address </td>
                  <td>:&nbsp;{staff.address}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                height: '50px',
                maxHeight: '50px',
                minHeight: '50px',
                width: '100%',
                fontWeight: 'bold',
                textAlign: 'right'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    {data && data.sign.includes('no-img')
                      ? ''
                      : <img
                        style={{ width: '100px', height: '50px' }}
                        src={data && data.sign}
                      />
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                height: '25px',
                maxHeight: '25px',
                minHeight: '25px',
                width: '100%',
                fontWeight: 'bold',
                textAlign: 'right'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    Principal
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Template
