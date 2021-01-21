import React from 'react'
import {
  Paper
} from '@material-ui/core'
import TopBar from './topbar'
import Footer from './footer'

const ExternalBase = ({
  children,
  title
}) => {
  return (
    <React.Fragment>
      <TopBar title={title} />
      <Paper id='content'
        style={{
          marginTop: 50,
          borderRadius: 0,
          minHeight: '65vh',
          transition: 'width 300ms',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Paper>
      <Footer />
    </React.Fragment>
  )
}

export default ExternalBase
