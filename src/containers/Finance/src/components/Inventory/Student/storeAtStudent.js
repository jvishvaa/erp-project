import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import StoreAtAcc from '../BranchAccountant/StoreAtAcc/storeAtAcc'

const StoreAtStudent = (props) => {
  const [erp, setErp] = useState(null)

  useEffect(() => {
    const erp = (JSON.parse(localStorage.getItem('userDetails'))).erp
    setErp(erp)
  }, [])
  return (
    <div>
      {erp ? (
        <StoreAtAcc
          session={'2020-21'}
          getData
          erp={erp}
          user={props.user}
          alert={props.alert}
          isStudent
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items
})

export default connect(mapStateToProps)(StoreAtStudent)
