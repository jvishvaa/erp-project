
import React from 'react'
import { LockDownContextProvider } from '../context/index'
import LockdownJournal from './contextWrapped'

function StudentJournal (props) {
  return (
    <React.Fragment>
      <LockDownContextProvider alert={props.alert}>
        <LockdownJournal />
      </LockDownContextProvider>
    </React.Fragment>
  )
}
export default StudentJournal
