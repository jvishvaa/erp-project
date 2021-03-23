import React from 'react'
import { Box, Typography } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'

const LogSuccessMessage = (props) => {
  return (
    <Box
      boxShadow={3}
      style={{ padding: '40px 20px 20px 20px',
        width: '350px',
        position: 'relative',
        margin: '0 auto',
        overflow: 'visible',
        borderRadius: 10
      }}>
      <Typography align='center' variant='h4'>{props.title}</Typography>
      {
        props.description
          ? <Typography align='center' style={{ marginTop: 20 }}>{props.description}</Typography>
          : ''
      }
      <span style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'green',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        zIndex: 1
      }}>
        <CheckIcon style={{ color: 'white', marginLeft: 10, marginTop: 10 }} fontSize='large' />
      </span>
    </Box>
  )
}

export default LogSuccessMessage
