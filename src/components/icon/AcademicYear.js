import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles, withStyles } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
  a: {
    fill: theme.palette.secondary.main,
    fontSize: '20px',
    width: '166px',
    fontFamily: 'Raleway-SemiBold, Raleway',
    fontWeight: 600,
    letterSpacing: '0.1em',
  },
}));

const StyledSvgIcon = withStyles({
  root: {
    width: '24px',
    height: '166px',
  },
})(SvgIcon);

const AcademicYear = (props) => {
  const classes = useStyles({});
  return (
    <StyledSvgIcon viewBox='0 0 24 166'>
      <text className={classes.a} transform='translate(19 166) rotate(-90)'>
        <tspan x='0' y='0'>
          {props.text}
        </tspan>
      </text>
    </StyledSvgIcon>
  );
};

export default AcademicYear;
