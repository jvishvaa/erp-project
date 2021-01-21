import React, { useState, useEffect } from 'react'
import {
//   withStyles, Paper, Button, Grid,
  // TableFooter, TablePagination,
//   Table, TableBody, TableCell, TableRow, TableHead, TableFooter, TablePagination, IconButton,
  Tab,
  Tabs,
  AppBar,
  Typography
  // IconButton
  // TableHead, Grid, Button, TextField
} from '@material-ui/core/'
import EditFeeInstallment from './editFinanaceInstallment'
import EditFeeInstallmentAmount from './editFinanaceInstallmentAmount'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

const FinanaceInstallment = ({ ...props }) => {
  // const [modal, setModal] = useState(false)
  const [value, setValue] = useState('one')
  useEffect(() => {
    console.log('user token +++ ', props.user)
  }, [props.user])

  // const closeModal = () => {
  //   setModal(false)
  // }
  const handleChange = (event, value) => {
    setValue(value)
  }

  return (
    <React.Fragment>
      <AppBar position='static'>
        <Tabs value={value} onChange={handleChange}>
          <Tab value='one' label='Edit Finanace Installment' />
          <Tab value='two' label='Edit Finanace Installment Amount' />
        </Tabs>
      </AppBar>
      {value === 'one' && <TabContainer>
        <EditFeeInstallment
          id={props.id}
          acadId={props.acadId}
          alert={props.alert}
          close={props.close}
          user={props.user}
        />
      </TabContainer>}
      {value === 'two' && <TabContainer>
        <EditFeeInstallmentAmount
          id={props.id}
          acadId={props.acadId}
          alert={props.alert}
          close={props.close}
          feeTypeId={props.feeTypeId}
          user={props.user}
        />
      </TabContainer>}
    </React.Fragment>
  )
}
export default FinanaceInstallment
