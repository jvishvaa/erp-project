import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Terms from './terms'
// import Card from '@material-ui/core/Card'

export class TermsConditions extends React.Component {
  render () {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container style={{ backgroundColor: '#ffffff', height: '30vh' }} maxWidth='100%'>
          <Typography gutterBottom variant='h3' component='h2' color='initial' align='center' position='secondary'> Terms and Conditions</Typography>
          <Terms />
        </Container>
      </React.Fragment>
    )
  }
}

export default TermsConditions
