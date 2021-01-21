import zipcelx from 'zipcelx'

/*
// ----------- sample example -------------
data = {
  fileName: 'my file name',
  columns: [
    {
      Header: 'Demo',
      accessor: 'demo'
    },
    {
      Header: 'Demo2',
      accessor: 'demo2'
    }
  ],
  excelData: [
    {
      demo1: 'Demo 1 ---> Row 1 --> Content',
      demo2: 'Demo 2 ---> Row 1 -->  Content'
    },
    {
      demo1: 'Demo 1 ---> Row 2 --> Content',
      demo2: 'Demo 2 ---> Row 2 --> Content'
    }
  ]
}
*/
async function generateExcel (data) {
  const headers = data.columns.map(item => ({ value: item.Header, type: 'string' }))
  const accessors = data.columns.map(item => item.accessor)
  const makeData = data.excelData.map((item, index) => {
    const dataArr = Array(accessors.length).fill('')
    accessors.forEach((ele, i) => {
      dataArr[i] = {
        value: (item[ele] !== undefined || item[ele] === null) ? item[ele] : '',
        type: (item[ele] !== undefined || item[ele] === null) ? (typeof item[ele] === 'number' ? 'number' : 'string') : 'string'
      }
    })
    return dataArr
  })
  const config = {
    filename: data.fileName,
    sheet: {
      data: [
        headers,
        ...makeData
      ]
    }
  }
  zipcelx(config)
  return Promise.resolve(true)
}

export default generateExcel
