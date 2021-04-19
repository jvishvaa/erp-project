import React from 'react'
import Button from '@material-ui/core/Button'
// import ArrowLeft from '@material-ui/icons/ArrowLeft'
// import ArrowRight from '@material-ui/icons/ArrowRight'

class Pagination extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      noOfPages: props.noOfPages
    }
    this.generatePageLinks = this.generatePageLinks.bind(this)
  }
  generatePageLinks () {
    let { noOfPages } = this.props
    let PageButtons = []
    for (let i = 1; i <= noOfPages; i++) {
      PageButtons.push(
        <Button variant='outlined' component='span' onClick={() => this.props.goToPage && this.props.goToPage(i)}>
          {i}
        </Button>
      )
    }
    return PageButtons
  }
  render () {
    return <div>
      {/* <Button variant='outlined' component='span'>
        <ArrowLeft />
      </Button> */}
      {this.generatePageLinks()}
      {/* <Button variant='outlined' component='span'>
        <ArrowRight />
      </Button> */}
    </div>
  }
}

export default Pagination
