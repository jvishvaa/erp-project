/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

const ViewFile = () => {
  const [commentsData] = useState(JSON.parse(localStorage.getItem('s3link')))
  return (
    <div>
      <iframe
        title='myFrame'
        src={commentsData.template_file}
        style={{ width: '100%', height: '700px', frameborder: '0' }}
        alt='file is crashed'
      />
    </div> 
  )
}
export default ViewFile
