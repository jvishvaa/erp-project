import React from 'react'
import Typography from '@material-ui/core/Typography'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import './Expansionstyles.css'

export default function ControlledExpansionPanels (props) {
//   const classes = useStyles()
  // const [expanded, setExpanded] = React.useState(false)

  // const handleChange = panel => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false)
  // }
  const data = props.data

  return (
    <React.Fragment>
      <details style={{ borderRadius: '10px', width: '119px' }}>
        <summary style={{ borderRadius: '10px', width: '50px' }}>
          <ul>
            <li className='titleName'><Typography variant='body1' color='textSecondary'>Branches</Typography></li>
            {/* <li className='titleName'><Typography>Branches</Typography></li> */}
            {/* <li className='titleValue'> Caribbean cruise</li> */}
            <li />
          </ul>
        </summary>
        <div className='content' style={{ borderRadius: '10px' }}>
          <Typography color='textSecondary'>
            {data.map(i => <li>{i}</li>)}
          </Typography>
          {/* <p style={{ color: 'red' }}>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p> */}
          {/* <Typography variant='body1' color='textSecondary'>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</Typography> */}
        </div>
      </details>
    </React.Fragment>
  )
}
