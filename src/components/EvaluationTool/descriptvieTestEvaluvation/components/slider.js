/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import '../journals.css'
import SinglePagePDFEdtior from '../editor/index'
import { urls } from '../../../urls'

function JournalSlider ({ onChange, url, tool }) {
  return (
    <React.Fragment>
      <div className='slider__content' >

        <SinglePagePDFEdtior onChange={onChange} tool={tool} url={url} />
      </div>
    </React.Fragment>
  )
}
export default JournalSlider
