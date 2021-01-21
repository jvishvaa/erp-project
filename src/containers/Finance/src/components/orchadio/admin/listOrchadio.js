import React, { useState } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import {
  Grid,

  Divider

} from '@material-ui/core'
import OrchadioTabs from './OrchadioTabs'

import viewOrchidoList from './viewOrchidoList'
import viewOrchidoListnerList from './viewOrchidoListnerList'

const ListOrchadio = ({
  alert,
  user
}) => {
  const [date, setDate] = useState(new Date())
  const label1 = 'Orchadio Participants list'
  const label2 = 'Orchadio Listners List'

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container>
          <Grid item xs={6}>
            <KeyboardDatePicker
              margin='normal'
              label='Select Date'
              format='dd/MM/yyyy'
              name='date'
              value={date}
              onChange={(date) => setDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <Divider />
      <OrchadioTabs
        alert={alert}
        user={user}
        date={date}
        Tab1Component={viewOrchidoList}
        Tab2Component={viewOrchidoListnerList}
        tab1Label={label1}
        tab2Label={label2}

      />

    </div>
  )
}

export default ListOrchadio
