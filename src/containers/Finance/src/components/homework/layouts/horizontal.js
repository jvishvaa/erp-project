function buildRow (columns) {
  const row = []
  for (let i = 0; i < columns; i++) {
    row.push({
      filled: false
    })
  }
  return row
}

function findSuitableRow (rows, shift) {
  return rows.findIndex(row => {
    let counter = 0
    for (let i = 0, l = row.length; i < l; i++) {
      if (!row[i].filled) {
        counter++
      }
      if (counter >= shift) {
        return true
      }
    }
    return false
  })
}

function fillRow (rows, rowNumber, shift) {
  let counter = 0
  // index of the column from which the element starts
  const startFrom = { index: 0, blocked: false }
  const row = rows[rowNumber]

  for (let i = 0, r = row.length; i < r; i++) {
    if (counter < shift && !row[i].filled) {
      if (!startFrom.blocked) {
        startFrom.index = i
        startFrom.blocked = true
      }
      row[i].filled = true
      counter++
    }
    if (counter === shift) {
      return startFrom.index
    }
  }
}

export default function (items, props) {
  const { columnWidth, itemHeight = 150, columns,
    gutterWidth, gutterHeight } = props
  let index = 0
  const rows = []
  // build the first row
  rows.push(buildRow(columns))

  const positions = items.map((itemProps) => {
    const ratio = itemProps.dataRatio || 1
    const shift = index + ratio
    let row = findSuitableRow(rows, ratio)
    if (row === -1) {
      rows.push(buildRow(columns))
      row = findSuitableRow(rows, ratio)
    }
    const column = fillRow(rows, row, ratio)

    const x = column * columnWidth + column * gutterWidth
    const y = row * itemHeight + row * gutterHeight
    index = shift

    return [x, y]
  })

  const gridWidth = columns * columnWidth + ((columns - 1) * gutterWidth)
  const gridHeight = rows.length * (itemHeight + gutterHeight) - gutterHeight

  return { positions, gridWidth, gridHeight }
}
