import React from 'react'
import {
  makeStyles,
  useMediaQuery
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import styles from './orchadioListeners.styles'
import OrchadioListeners from './orchadioListeners'
import desktopImg from './assets/main.svg'
import mobileImg from './assets/main2.svg'

const useStyles = makeStyles(styles)

const Orchadio = ({
  history
}) => {
  const classes = useStyles()
  const matches = useMediaQuery('(min-width:1025px)')

  const onActiveClickHandler = () => {
    history.push({
      pathname: '/orchadio/radio',
      state: {
        showDate: false,
        date: new Date()
      }
    })
  }

  const onArchiveClickHandler = () => {
    const date = moment().subtract(1, 'days').toDate()
    history.push({
      pathname: '/orchadio/radio',
      state: {
        showDate: true,
        date
      }
    })
  }

  return (
    <div className={classes.orchadioContainer}>
      <div className={classes.buttonFiller}>
        <div className={classes.buttonsSection}>
          <div
            className={classes.button}
            onClick={onActiveClickHandler}
          >
            Today's Programs
          </div>
          <div
            className={classes.button}
            onClick={onArchiveClickHandler}
          >
            Archived Programs
          </div>
        </div>
        {/* <div className={classes.emailSection}>
        For more, mail us at radio@orchids.edu.in
        </div> */}
      </div>
      {
        matches ? (
          <img src={desktopImg} className={classes.mainImg} alt='orchadio-logo' />
        ) : (
          <img src={mobileImg} className={classes.mainImg} alt='orchadio-logo' />
        )
      }
    </div>
  )
}

const OrchadioWithRouter = withRouter(Orchadio)
export { OrchadioWithRouter, OrchadioListeners }
