import React from 'react'
import bgi from './images/ColorBG.png'

import Mainbar from './Mainbar/Mainbar'

const DiscussForm = ({ alert }) => {
  return (
    <div style={{ backgroundImage: `url(${bgi})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <Mainbar alert={alert} />

    </div>
  )
}
export default DiscussForm
