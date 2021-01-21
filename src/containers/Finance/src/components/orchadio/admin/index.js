import React from 'react'
import {

  makeStyles
} from '@material-ui/core'
import { useSelector } from 'react-redux'

import OrchadioTabs from './OrchadioTabs'

import styles from './orchadioAdmin.styles'
import ListOrchadio from './listOrchadio'
import AddOrchadio from './addOrchadio'

const useStyles = makeStyles(styles)

const OrchadioAdmin = ({
  alert
}) => {
  const classes = useStyles()
  const user = useSelector(state => state.authentication.user)
  const label1 = 'Orchadio List'
  const label2 = 'Add Orchadio'

  return (
    <div className={classes.root} >
      <OrchadioTabs
        alert={alert}
        user={user}
        Tab1Component={ListOrchadio}
        Tab2Component={AddOrchadio}
        tab1Label={label1}
        tab2Label={label2}

      />

    </div>
  )
}

export default OrchadioAdmin
