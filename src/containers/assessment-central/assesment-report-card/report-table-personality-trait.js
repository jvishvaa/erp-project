import React from 'react';
import './style.scss';
import { generatePersonalityTraits } from './transform-report-card-data';

const PersonalityTraitTable = ({ scholastic, coScholastic }) => {
  const personalityTraits = generatePersonalityTraits(scholastic, coScholastic) || [];
  function rowType(index, trait, subIndex) {
    return index === 0 ? (
      <th>{trait}</th>
    ) : (
      <td style={{ textAlign: [1, 3, 4].includes(subIndex) ? 'center' : 'left' }}>
        {trait}
      </td>
    );
  }

  return (
    <div className='report-Personality-traits'>
      <table>
        {personalityTraits.map((traitArray, index) => (
          <tr>{traitArray.map((trait, subIndex) => rowType(index, trait, subIndex))}</tr>
        ))}
      </table>
    </div>
  );
};

export default PersonalityTraitTable;
