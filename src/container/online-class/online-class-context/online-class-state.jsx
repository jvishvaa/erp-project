import React, { useReducer } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import OnlineclassContext from './online-class-context';
import onlineclassReducer from './online-class-reducer';

const OnlineclassProvider = (props) => {
  const { children } = props;
  const initalState = {
    name: 'hemanth',
  };
  const [state, dispatch] = useReducer(onlineclassReducer, initalState);

  return (
    <OnlineclassContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </OnlineclassContext.Provider>
  );
};

OnlineclassProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OnlineclassProvider;
