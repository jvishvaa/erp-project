import { filterConstants } from '../_constants'

export const filterActions = {
  update,
  clear,
  applyToAll
}

function update (data) {
  return { type: filterConstants.UPDATE, data }
}
function applyToAll (allMappings) {
  return { type: filterConstants.APPLY_ALL, allMappings }
}
function clear (message) {
  return { type: filterConstants.CLEAR, message }
}
