import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Radio,
  FormControlLabel
} from '@material-ui/core'

import FeeConcession from './feeConcessionDetails'
import OtherFeeConcession from './otherFeeConcession'

const ConcessionDetails = ({
  session,
  alert,
  user,
  getData,
  erp
}) => {
  const [selectedValue, setSelectedValue] = useState('one')
  // const data = null

  useEffect(() => {
    console.log('erp', erp)
    if (erp && erp.length >= 10) {
      console.log('Api Called')
    }
  }, [getData, erp, session])

  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }

  const getDetails = useCallback(() => {
    let data = null
    if (selectedValue === 'one') {
      data = (
        <FeeConcession
          session={session}
          erp={erp}
          user={user}
          alert={alert}
          getData={getData}
          branchId={this.props.branchId}
          moduleId={this.props.moduleId}
        />
      )
    } else if (selectedValue === 'two') {
      data = (
        <OtherFeeConcession
          session={session}
          erp={erp}
          user={user}
          alert={alert}
          getData={getData}
          branchId={this.props.branchId}
          moduleId={this.props.moduleId}
        />
      )
    }
    return data
  }, [selectedValue, getData, erp, session, alert, user])

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          control={
            <Radio
              checked={selectedValue === 'one'}
              onChange={handleChange}
              value='one'
              name='fee_details'
              inputProps={{ 'aria-label': 'A' }}
            />
          }
          label='Fee Concessions'
        />
        <FormControlLabel
          control={
            <Radio
              checked={selectedValue === 'two'}
              onChange={handleChange}
              value='two'
              name='other_fee_details'
              inputProps={{ 'aria-label': 'A' }}
            />
          }
          label='Other Fee Concessions'
        />
      </div>
      <div>
        {getDetails()}
      </div>
    </React.Fragment>
  )
}

ConcessionDetails.propTypes = {
  session: PropTypes.string.isRequired,
  alert: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.string.isRequired,
  getData: PropTypes.bool.isRequired,
  erp: PropTypes.string.isRequired
}

export default ConcessionDetails
