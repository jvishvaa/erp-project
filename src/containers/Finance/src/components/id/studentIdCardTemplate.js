import React from 'react'

const Template = props => {
  let { student, data, keeper } = props
  return (
    <table
      style={{ border: '1px solid black', borderRadius: '10px', width: '350px' }}
      id='tableIdCard'
    >
      <tbody>
        <tr>
          <td>
            <table
              style={{ maxHeight: '325px', width: '100%' }}
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      style={{ margin: '0 auto', display: 'block', width: '105px', height: '75px' }}
                      src={student.student.branch.logo.includes('no-img')
                        ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/logo.jpg'
                        : student.student.branch.logo
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
                height: 'max-content',
                maxHeight: '70px',
                minHeight: '70px',
                width: '100%',
                backgroundColor: '#f9c763',
                WebkitPrintColorAdjust: 'exact',
                textAlign: 'center'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    {student.student.branch.address}
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
                fontSize: '12px',
                fontWeight: 'bold',
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    Academic Year: {student.student.acad_branch_mapping.acad_session.session_year}
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
                    <div>
                      <img
                        style={{
                          width: '100px',
                          height: '85px'
                        }}
                        src={student.student.student_photo.includes('no-img')
                          ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/LetseduvateLogo.jpeg'
                          : student.student.student_photo
                        }
                      />
                      {student[(keeper === 'student' ? 'father' : keeper) + '_photo']
                        ? <img
                          style={{
                            width: '100px',
                            height: '85px',
                            marginLeft: '10px'
                          }}
                          src={student[(keeper === 'student' ? 'father' : keeper) + '_photo'].includes('no-img')
                            ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/LetseduvateLogo.jpeg'
                            : student[(keeper === 'student' ? 'father' : keeper) + '_photo']
                          }
                        />
                        : ''
                      }
                    </div>
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
                  <td>
                    {keeper === 'student'
                      ? 'Father'
                      : keeper.charAt(0).toUpperCase() + keeper.slice(1)
                    } Name
                  </td>
                  <td>:&nbsp;{student[(keeper === 'student' ? 'father' : keeper) + '_name']}</td>
                </tr>
                <tr>
                  <td>Student Name </td>
                  <td>:&nbsp;{student.student.name}</td>
                </tr>
                <tr>
                  <td>Roll No </td>
                  <td>:&nbsp;{student.student.roll_no}</td>
                </tr>
                <tr>
                  <td>Grade & Section </td>
                  <td>:&nbsp;{student.student.grade.grade} {student.student.section.section_name}</td>
                </tr>
                <tr>
                  <td>Contact </td>
                  <td>:&nbsp;{student.student.contact_no}</td>
                </tr>
                <tr>
                  <td>D.O.B. </td>
                  <td>:&nbsp;{student.student.date_of_birth}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr
          style={{
            backgroundColor: '#f9c763',
            WebkitPrintColorAdjust: 'exact',
            textAlign: 'center'
          }}
        >
          <td>
            <table
              style={{
                height: 'max-content',
                maxHeight: '70px',
                minHeight: '70px',
                width: '100%',
                textAlign: 'center'

              }}
            >
              <tbody>
                <tr>
                  <td>
                    Address: {student.student.address}
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
                fontWeight: 'bold',
                textAlign: 'right'
              }}
            >
              <tbody>
                <tr>
                  <td>
                    {data.sign.includes('no-img')
                      ? ''
                      : <img
                        style={{ width: '100px', height: '50px' }}
                        src={data.sign}
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
                    <small>
                      Principal
                    </small>
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
