
import React from 'react'
import Card from '@material-ui/core/Card'
import Modal from '@material-ui/core/Modal'
// import OrchadioListeners from './../'
import OrchadioPlayer from './publicOrchadioPlayer'

const PublicOrchadioPlayer = ({
  alert
}) => {
  // const
  return (
    <Modal
      open
    >
      <Card style={{
        width: '100%',
        height: '100%'
      }}>
        <OrchadioPlayer
          alert={alert}
        />
      </Card>
    </Modal>

  )
}

export default PublicOrchadioPlayer
