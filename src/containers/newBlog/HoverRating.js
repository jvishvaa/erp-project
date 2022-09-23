import React ,{ useState, useRef, useEffect } from 'react'
import { makeStyles, Typography, Box } from '@material-ui/core/'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Rating from "@material-ui/lab/Rating";
import withStyles from '@material-ui/core/styles/withStyles';

const useStyles = makeStyles({
  root: {
    width: 'min-content',
    display: 'block',
    'text-align': 'center',
    margin: '0 auto'
  }
})
const StyledRating = withStyles((theme) => ({
    iconFilled: {
      color:'#E1C71D',
    },
    root : {
      '& .MuiSvgIcon-root':{
        color : "currentColor"
      }
    },
    iconHover: {
      color: '#E1C71D',
    },
  }))(Rating);

export default function HoverRating (props) {
  const classes = useStyles()

  const editRating = (rating, type) => {
    props.handleRatingEdit(type, rating)
  }
  const DEFAULT_RATING = 0;
  const [data, setData] = useState({
    
    rating: DEFAULT_RATING
  });


  const handleChange = (event) => {
    const { value, name } = event.target
    props.handleRemark(name, value)
  }

  return (
    
      
      <StyledRating
        name="simple-controlled"
        size="small"
        value={props.value}
        // defaultValue={props.defaultValue}
        onChange={props.onChange}
      />
        
         
     
  )
}
