import React from 'react'
import Rating from '@material-ui/lab/Rating'

export default function RatingScale (props) {

  return (
    <Rating
      readOnly
      precision={0.5}
      size='large'
      name={props.type}
      value={props.rating}
      style={{color:'#rgb(255, 109, 117)'}}
      onChange={(event, newValue) => {
        props.editRating(newValue, event.target.name)
      }}
    />
  )
}
