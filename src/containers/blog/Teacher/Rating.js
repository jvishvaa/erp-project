import React from 'react'
import { makeStyles, Typography, Box } from '@material-ui/core/'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import RatingScale from './RatingScale'

const useStyles = makeStyles({
  root: {
    width: 'min-content',
    display: 'block',
    'text-align': 'center',
    margin: '0 auto'
  }
})

export default function HoverRating (props) {
  const classes = useStyles()

  const editRating = (rating, type) => {
    props.handleRatingEdit(type, rating)
  }

  const handleChange = (event) => {
    const { value, name } = event.target
    props.handleRemark(name, value)
  }

  return (
    <div className={classes.root}>
      <Box component='fieldset' mb={3} borderColor='transparent'>
        <Typography
          variant={props.rating_type === 'Overall' ? 'h4' : 'h5'}
          className='rating__title'
          align='center'
          color='textSecondary'>
          {props.rating_type}
        </Typography>
        <RatingScale
          editRating={editRating}
          rating={props.rating}
          type={props.rating_type}
        />
        <TextareaAutosize
              id='standard-multiline-flexible'
              rowsMax={4}
              type='text'
              placeholder={props.rating_type === 'Overall' ? 'Add review...(Mandatory)' : 'Add review...(optional)'}
              className='blog--form-inputReview'
              name={props.rating_type}
              value={props.rating_type === 'Overall' ? props.overallRemark : props.remark}
              onChange={handleChange}
            />
            : <Typography
              className='rating__review'
              align='center'>
              {props.rating_type === 'Overall' ? props.overallRemark : props.remark}
            </Typography>
      </Box>
    </div>
  )
}
