import React, { useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Clear'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { OmsSelect } from '../../../../ui'
import { addStaffContext } from './_context'
import PSelect from '../../../../_components/pselect'
import { urls } from '../../../../urls'

function Step1 ({ match: { params: { id } } }) {
  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  const [year, setyear] = useState([])
  let { rows, onChange, addRow, removeRow, staffData, deleteRow, setUsePowerSelector, setSelectorData, role, setStep } = useContext(addStaffContext)
  setStep(1)

  useEffect(() => {
    returnAcadYear()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnAcadYear = () => {
    let userID = userProfile.personal_info.user_id
    let acadUrl = urls.ACADSESSION + '?user_id=' + userID
    axios.get(acadUrl, {
      headers: {
        Authorization: 'Bearer ' + userProfile.personal_info.token
      }
    })
      .then(res => {
        const { acad_session: acadSession } = res.data
        setyear([...year, { value: acadSession, label: acadSession }])
      }).catch(error => {
        console.log(error)
      })
  }

  return <React.Fragment>
    {rows.map((row, rowIndex) => {
      return <Grid key={rowIndex} style={{ padding: 16, marginLeft: 24 }} container>
        {row.map((selector, selectorIndex) => {
          console.log(selector)
          return <OmsSelect
            key={selectorIndex}
            label={selector.label}
            options={selector.options}
            defaultValue={selector.value ? selector.value : []}
            change={(e) => onChange(e, rowIndex, selectorIndex)}
          />
        })}
        {staffData && (staffData.mappings.mappings.length) > 0 && rowIndex < (staffData.mappings.mappings.length)
          ? <IconButton onClick={() => deleteRow(id, rowIndex)} aria-label='Delete Mapping' color='primary'>
            <DeleteIcon />
          </IconButton>
          : <React.Fragment>
            <OmsSelect
              label={'Acad Session'}
              defaultValue={year || []}
            />
            <IconButton onClick={addRow} aria-label='Add Row' color='primary'>
              <AddIcon />
            </IconButton>
            {rowIndex !== 0 && <IconButton onClick={() => removeRow(rowIndex, 1)} aria-label='Remove Row' color='primary'>
              <RemoveIcon />
            </IconButton>}
          </React.Fragment>
        }
      </Grid>
    })}
    {role.label === 'Planner' && <React.Fragment>or <PSelect subject selectedItems={rows.map(row => row[2].value && row[2].value.value)} onSave={(data) => { setUsePowerSelector(true); setSelectorData(data) }} /></React.Fragment> }
  </React.Fragment>
}

export default withRouter(Step1)
