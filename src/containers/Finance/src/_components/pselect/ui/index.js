import React from 'react'

import Window from './window'

export function UI (props) {
  return <Window {...props} showSection={props.section} showSubject={props.subject} />
}
