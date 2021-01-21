import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Privacy from './privacy'
// import Card from '@material-ui/core/Card'

export class PrivacyPolicy extends React.Component {
  render () {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container style={{ backgroundColor: '#ffffff', height: '30vh' }} maxWidth='100%'>
          <Typography gutterBottom variant='h3' component='h2' color='initial' align='center' position='secondary'> Privacy Policy</Typography>
          <Privacy />
        </Container>
      </React.Fragment>
    )
  }
}

export default PrivacyPolicy
