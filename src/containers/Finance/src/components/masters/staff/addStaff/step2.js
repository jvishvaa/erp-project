import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Clear'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import { withRouter } from 'react-router-dom'
import { OmsSelect } from '../../../../ui'
import { addStaffContext } from './_context'
// import PSelect from '../../../../_components/pselect'

function Step2 ({ match: { params: { id } } }) {
  let { stepTwoRows, onChange, addRow, removeRow, staffData, deleteStepTwoRows, setStep } = useContext(addStaffContext)

  setStep(2)
  console.log(stepTwoRows, 'rowss')
  return <React.Fragment>
    {stepTwoRows.map((row, rowIndex) => {
      return <Grid key={rowIndex} style={{ padding: 16, marginLeft: 24 }} container>
        {row.map((selector, selectorIndex) => {
          return <OmsSelect
            key={selectorIndex}
            label={selector.label}
            options={selector.options}
            defaultValue={selector.value ? selector.value : []}
            change={(e) => onChange(e, rowIndex, selectorIndex, 2)}
          />
        })}
        {staffData && staffData.mappings.can_review.length > 0 && rowIndex < staffData.mappings.can_review.length
          ? <IconButton onClick={() => deleteStepTwoRows(id, rowIndex)} aria-label='Delete Mapping' color='primary'>
            <DeleteIcon />
          </IconButton>
          : <React.Fragment>
            <IconButton onClick={addRow} aria-label='Add Row' color='primary'>
              <AddIcon />
            </IconButton>
            {rowIndex !== 0 && <IconButton onClick={() => removeRow(rowIndex, 2)} aria-label='Remove Row' color='primary'>
              <RemoveIcon />
            </IconButton>}
          </React.Fragment>
        }
      </Grid>
    })}
  </React.Fragment>
}

export default withRouter(Step2)
