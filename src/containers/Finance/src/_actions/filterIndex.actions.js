export const filterIndexActions = {
  update
}

function update (data) {
  return { type: 'UPDATE_INDEX', data }
}
