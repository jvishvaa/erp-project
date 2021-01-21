import React, { Component } from 'react'
import { withStyles, Button, Hidden, Grid } from '@material-ui/core'
// import AnnouncementIcon from '@material-ui/icons/Announcement'
// import ClearIcon from '@material-ui/icons/Clear'
import CardUI from './cardUI'

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(36),
      height: theme.spacing(8)
    }
    // backgroundColor: 'rgb(242,242,242)'
  }
})
// Solve a new and unique problem every day. Score High and make a mark on the leaderboard
class CardGroup extends Component {
  state = { queryString: '' }
  searchItemData = (data, queryKey, queryStringKey) => {
    let{ [queryStringKey]: qStr } = this.state
    if (!data) { return [] }
    if (data && (qStr && qStr.trim() !== '')) {
      data = data.filter(item => (item[queryKey] && item[queryKey].toLowerCase().includes(qStr)))
      return data
    }
    return data
  }
  render () {
    let { classes, cardItems = [], ...restProps } = this.props
    return <React.Fragment>
      <Hidden mdDown>
        <span
          style={{
            margin: 5,
            marginLeft: 15,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: '2px',
            boxShadow: '0 0 3px 2px rgb(207,207,207)' }}
        >
          <input
            type='text'
            placeholder='Search'
            style={{ margin: 5, border: 'none', height: '25px' }}
            value={this.state.queryString}
            onChange={({ target: { value } }) => this.setState({ queryString: value.toLowerCase() })} />
          <Button
            variant='outlined'
            size='small'
            onClick={() => {
              this.setState({ queryString: '' })
            }}
          // startIcon={<ClearIcon color='primary' fontSize='inherit' />}
          // endIcon={<ClearIcon color='primary' fontSize='inherit' />}
          >Clear</Button>
        </span>
      </Hidden>
      {/* <div className={classes.root} >
        {this.searchItemData(cardItems, restProps.titleKey, 'queryString').map(cardItem => <CardUI cardItem={cardItem} {...restProps} />)}
      </div> */}
      <br />
      <Grid
        container
        spacing={2}
        style={{ padding: 10 }}
      >
        {this.searchItemData(cardItems, restProps.titleKey, 'queryString').map(cardItem => <CardUI cardItem={cardItem} {...restProps} />)}
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(useStyles)(CardGroup)
