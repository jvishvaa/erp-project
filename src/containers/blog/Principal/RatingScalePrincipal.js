import React from 'react'
import Rating from '@material-ui/lab/Rating'
import withStyles from '@material-ui/core/styles/withStyles';

const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color:theme.palette.primary.main,
  },
  root : {
    '& .MuiSvgIcon-root':{
      color : "currentColor"
    }
  },
  iconHover: {
    color: theme.palette.primary.main,
  },
}))(Rating);
export default function RatingScale (props) {

  return (
    <StyledRating
      readOnly
      precision={0.5}
      size='large'
      name={props.type}
      value={props.rating}
      style={{color:'#ff6b6b !important'}}

      onChange={(event, newValue) => {
        props.editRating(newValue, event.target.name)
      }}
    />
  )
}
