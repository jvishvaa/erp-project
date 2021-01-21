import React from 'react'
import GSelect from '../index'

function GSelectExample () {
  return <GSelect initialValue={{ branch_id: 41, acad_branch_grade_mapping_id: 1828 }} onChange={(data) => console.log(data)} />
}

export default GSelectExample
