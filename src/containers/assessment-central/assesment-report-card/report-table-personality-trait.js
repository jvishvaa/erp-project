import React from 'react';
import './style.scss';
import { personalityTraits } from './constants';

const PersonalityTraitTable = () => {
  
  function rowType(index, trait) {
    return index === 0 ? <th>{trait}</th> : <td>{trait}</td>;
  }

  return (
    <div className='report-Personality-traits'>
      <table>
        {personalityTraits.map((traitArray, index) => (
          <tr>{traitArray.map((trait) => rowType(index, trait))}</tr>
        ))}
      </table>
    </div>
  );
};

export default PersonalityTraitTable;
