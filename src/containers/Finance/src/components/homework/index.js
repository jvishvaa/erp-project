import React from 'react'

import { HomeworkContextProvider } from './context'
import UI from './ui'

function Homework ({ alert }) {
  return <HomeworkContextProvider>
    <UI alert={alert} />
  </HomeworkContextProvider>
}

export default Homework
