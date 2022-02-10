import React from 'react';
import unfiltered from '../../assets/images/unfiltered.svg';
import { SvgIcon, useMediaQuery, useTheme, Typography } from '@material-ui/core';
import selectfilterImg from '../../assets/images/selectfilter.svg';

const NoFilterData = ({ data, selectfilter }) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <SvgIcon
          component={() => (
            <img
              src={unfiltered}
              style={
                isMobile
                  ? { height: '100px', width: '200px' }
                  : { height: '160px', width: '290px' }
              }
            />
          )}
        />

        {data ? (
          <Typography>{data}</Typography>
        ) : selectfilter ? (
          <SvgIcon
            component={() => (
              <img
                style={
                  isMobile
                    ? { height: '20px', width: '250px' }
                    : { height: '50px', width: '400px', marginLeft: '50px' }
                }
                src={selectfilterImg}
              />
            )}
          />
        ) : null}
      </div>
    </>
  );
};

export default NoFilterData;
