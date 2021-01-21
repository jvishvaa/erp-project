import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles, Grid } from '@material-ui/core'
// import LinkTag from '@material-ui/core/Link'

// import { TransitionablePortal } from 'semantic-ui-react'
// import { makeStyles } from '@material-ui/core/styles'

const useStyles = theme => ({

  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(16),
    //   height: theme.spacing(16)
    // }
    borderRadius: 5,
    padding: theme.spacing(1)
  },
  pointerCursor: { cursor: 'pointer' },
  blokedCursor: { cursor: 'not-allowed' },
  info: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  textHighlight: {
    fontSize: 17
  },
  textHighlightColor: {
    color: 'white',
    margin: 2,
    marginLeft: 10,
    padding: 3,
    backgroundColor: 'rgb(131,49,86)',
    borderRadius: 4
  }
})

class CardUI extends Component {
  state={ maxTitleLength: 25 }
  limitTitle = title => typeof (title) === 'string' ? title.length <= this.state.maxTitleLength ? title : title.slice(0, 25).trim() + '...' : 'No Title'
  limitCount = count => count ? (String(count).length > 3) ? '999+' : count : count
  render () {
    const { classes, countKey = '', titleKey = '', cardItem = {} } = this.props
    const title = cardItem[titleKey]
    const count = cardItem[countKey]
    return (
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Paper
          className={
            [classes.root,
              'hoverEffect',
              count ? classes.pointerCursor : classes.blokedCursor
            ].join(' ')
          } elevation={4}
          onClick={
            () => {
              let { cardItem = {}, onCardClickArgKeys = [] } = this.props
              let argumentsArray = onCardClickArgKeys.map(argKey => (cardItem[argKey]))
              this.props.onCardClick(...argumentsArray)
            }
          }>
          <span className={classes.textHighlight}>{this.limitTitle(title)}</span>
          <br />
          <br />
          <div className={classes.info}>
            <span>No. of Questions:&nbsp;<h3 className='textHighlight' style={{ color: 'rgb(131,49,86)', display: 'inline-block' }}>{this.limitCount(count)}</h3></span>
            {/* <span className={`${classes.textHighlight} ${classes.textHighlightColor}`}>{this.limitCount(count)}</span> */}
            <span />
          </div>
          {/* </div> */}
          {/* <LinkTag
          component='button'
          onClick={this.getSubjects}>
          <b>></b>
        </LinkTag> */}
        </Paper>
      </Grid>
    )
  }
}

export default withStyles(useStyles)(CardUI)
