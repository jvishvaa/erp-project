import React from 'react';
import './style.scss';
const placeholderImage =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
const TopDetailsHeader = (props) => {
  const { userInfo = {} } = props || {};
  const { name, erp_id, mothers_name, grade, fathers_name, dob, section, profile_img } =
    userInfo || {};

  const userData = [
    {
      header1: "STUDENT'S NAME",
      value1: name,
      header2: 'ERP CODE',
      value2: erp_id,
    },
    {
      header1: "MOTHER'S NAME",
      value1: mothers_name,
      header2: 'GRADE / DIV.',
      value2: grade,
    },
    {
      header1: "FATHER'S NAME",
      value1: fathers_name,
      header2: 'DATE OF BIRTH',
      value2: dob,
    },
    {
      header1: 'ATTENDANCE',
      value1: '',
      header2: 'SECTION',
      value2: section,
    },
  ];

  return (
    <div className='report-top-header-description'>
      <table>
        {userData.map((responseRow) => (
          <tr>
            {Object.values(responseRow).map((value, index) => (
              <>{index % 2 === 0 ? <th>{value}</th> : <td>{value}</td>}</>
            ))}
          </tr>
        ))}
      </table>
      <div className='report-type-details'>
        <img
          onError={(e) => (e.target.src = placeholderImage)}
          src={profile_img ? profile_img : placeholderImage}
          alt=''
          style={{ width: '100px', height: '100px', borderRadius: '50px' }}
        />
      </div>
    </div>
  );
};

export default TopDetailsHeader;
