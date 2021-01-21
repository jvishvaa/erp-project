import React from 'react'
import Rating from '@material-ui/lab/Rating'
import '../blog.css'

export default function RatingScale (props) {
  const role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role

  return (
    <Rating
      readOnly={role === 'Student' || props.type === 'Overall'}
      precision={0.5}
      size='large'
      name={props.type}
      value={props.rating}
      onChange={(event, newValue) => {
        props.editRating(newValue, event.target.name)
      }}
    />
  )
}
