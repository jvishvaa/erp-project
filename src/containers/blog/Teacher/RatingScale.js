import React from 'react'
import Rating from '@material-ui/lab/Rating'
import withStyles from '@material-ui/core/styles/withStyles';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6b6b',
  },
  iconHover: {
    color: '#ff6b6b',
  },
})(Rating);
export default function RatingScale (props) {

  return (
    <StyledRating
      readOnly={props.type === 'Overall'}
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
