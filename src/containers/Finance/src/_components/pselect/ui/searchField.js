
import React from 'react'

// import TextField from '@material-ui/core/TextField'

function SearchField ({ branches, setFilteredBranches, setFilteredGrades, setCurrentItem }) {
  return <input
    id='outlined-search'
    placeholder='Search...'
    type='search'
    style={{ position: 'absolute', left: 10, top: 10, zIndex: 7000, width: 200, height: 40, border: 'none' }}
    variant='filled'
    onChange={(e) => {
      if (e.target.value && e.target.value.length > 0) {
        ((e) => {
          let finalBranches = branches.filter(branch => {
            return branch.data.name.toLowerCase().search((e.target.value).toLowerCase()) !== -1
          })
          setFilteredBranches(finalBranches.map(item => item.data.name))
          setFilteredGrades((grades) => {
            finalBranches.map((branch, index) => {
              grades[index] = branch.data.children
            })
            return grades
          })
          setCurrentItem(0)
        })(e)
      } else {
        setFilteredBranches(branches.map(item => item.data.name))
        setFilteredGrades((grades) => {
          branches.map((branch, index) => {
            grades[index] = branch.data.children
          })
          return grades
        })
      }
    }}
  />
}

export default SearchField
