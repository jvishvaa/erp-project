// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import 'date-fns'
import {
  Divider

} from '@material-ui/core'

import OrchadioTabs from '../orchadio/admin/OrchadioTabs'

import Prospectus from './uploadProspectus'
import ViewProspectus from './viewProspectus'

const ListOfProspectus = ({
  alert,
  user,
  selectedTermId,
  selectedData,
  currentTab
}) => {
  const label1 = 'UPLOAD PROSPECTUS'
  const label2 = 'VIEW PROSPECTUS'

  return (
    <div>
      <Divider />

      <OrchadioTabs
        alert={alert}
        user={user}
        selectedTermId={selectedTermId}
        Tab1Component={Prospectus}
        Tab2Component={ViewProspectus}

        tab1Label={label1}
        tab2Label={label2}

      />

    </div>

  )
}

export default ListOfProspectus
