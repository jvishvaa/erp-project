import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import './aol.css'
import ClassLogo from './assets/classLogo.png'
import MinuteLogo from './assets/minuteLogo.png'

const useStyles = makeStyles(theme => ({
  counter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    // margin: '5px 0px'
  },
  content: {
    color: '#767676',
    borderBottom: '1px solid #f59530',
    textAlign: 'center'
  },
  text: {
    color: '#767676',
    marginTop: 2,
    fontSize: '13px',
    textAlign: 'center'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3
  }
  // class: {
  //   width: '2rem'
  // },
  // minutes: {
  //   width: '2rem'
  // }
}))

function ClassCounter (props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.counter}>
        <div className={classes.box} style={{ borderRight: '1px solid #767676', paddingRight: 15, height: 50 }}>
          <img src={ClassLogo} alt='classLogo' width='45px' height='45px' />
          <div style={{ padding: 5 }}>
            <div className={classes.content}>
              <h3>{props.classNo}</h3>
            </div>
            <div className={classes.text}>
              <p>Classes Completed</p>
            </div>
          </div>
        </div>
        <div className={classes.box} style={{ paddingLeft: 15 }}>
          <img src={MinuteLogo} alt='minuteLogo' width='45px' height='45px' />
          <div style={{ padding: 5 }}>
            <div className={classes.content}>
              <h3>{props.duration}</h3>
            </div>
            <div className={classes.text}>
              <p>Student Minutes</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ClassCounter
