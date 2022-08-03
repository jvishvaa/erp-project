import React from 'react';
import { useHistory } from 'react-router-dom';

const ShortcutCard = (props) => {
  const history = useHistory();
  const { title, url, state } = props.data;

  return (
    <div className='row px-2'>
      <div className='col-md-12 my-2 th-bg-grey th-br-2 p-2 th-pointer'>
        <div
          className='th-fw-400 th-14'
          onClick={() =>
            history.push({
              pathname: url,
              state: state,
            })
          }
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default ShortcutCard;
