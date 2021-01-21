import React, { Component } from 'react'
import { Checkbox } from 'semantic-ui-react'
import { withStyles, List, ListItem, Paper, ListItemText, Collapse } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
    paddingRight: 0,
    paddingLeft: 0,
    maxHeight: 250,
    overflowY: 'auto'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
class CheckboxExampleSlider extends Component {
  constructor (props) {
    super(props)
    let { checkedItems = [] } = props
    this.state = { checkedItemsSet: new Set([...checkedItems]), prevPropsChange: props.change }
  }
  static getDerivedStateFromProps (props, state) {
    console.log('checked items array', props.checkedItems, props, state)
    if (state.checkedItemsSet !== new Set([...props.checkedItems])) {
      console.log('Item has changed')
      return {
        checkedItemsSet: new Set([...props.checkedItems])
      }
    }
    if (state.prevPropsChange !== props.change) {
      return {
        prevPropChange: props.change
      }
    }
    return null
  }
  searchBar = (queryStringKey) => {
    let { props: { classes } } = this
    return <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        id={queryStringKey}
        placeholder='Search…'
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        onChange={({ target: { value } }) => this.setState({ [queryStringKey]: value.toLowerCase() })}
        onFocus={e => { this.setState({ [queryStringKey]: e.target.value }) }}
        // onBlur={(e) => { this.setState({ [queryStringKey]: '' }) }}
      />
    </div>
  }
  getData=() => {
    let { array: arrayProps = [] } = this.props
    let array = arrayProps !== undefined ? arrayProps.map(v => {
      return v.value
    }) : null
    return array
  }
  getcheckedItemsStatus = () => {
    let { array: arrayProps = [] } = this.props
    if (!this.props.array) {
      return `No data`
    }
    let { checkedItemsSet = new Set() } = this.state
    if (arrayProps.length === 0) { return 'Data is loading....' }
    if (arrayProps.length === checkedItemsSet.size) { return 'All' }
    if (checkedItemsSet.size === 0) { return 'No item selected' }
    console.log(checkedItemsSet, 'Check item set')
    return `Selected ${checkedItemsSet.size} of ${arrayProps.length}`
  }
  searchItemData = (data, queryKey, queryStringKey) => {
    let{ [queryStringKey]: qStr } = this.state
    if (!data) { return [] }
    if (data && (qStr && qStr.trim() !== '')) {
      data = data.filter(item => (item[queryKey] && item[queryKey].toLowerCase().includes(qStr)))
      return data
    }
    return data
  }
  getItems=() => {
    let { array: arrayProps = [] } = this.props
    // search logic
    console.log(arrayProps, '1111')
    arrayProps = this.searchItemData(arrayProps, 'text', 'queryString')
    let { checkedItemsSet } = this.state
    console.log(checkedItemsSet, arrayProps, 'chechhhhh')
    // getdata = () => {
    //   var v1 = arrayProps.map((v) => {
    //     return v.value
    //   })
    // }

    return arrayProps.map((v) => (
      <React.Fragment>

        { console.log(v.value, 'vaaaaaa')}
        <Checkbox
          key={v.text}
          label={v.text}
          value={v.value}
          name={this.props.heading}
          onChange={(e, i) => {
            let newvalue = this.getData()

            let value = `${i.value}`
            // value === 'All' value = newvalue : value
            console.log(value, 'neee')
            const { heading, qType } = this.props
            if (heading === 'Question Type' && (qType === 'QUIZ' || qType === 'Recorded Lectures') && v.text !== 'MCQ') {
              window.alert(qType === 'Recorded Lectures' ? 'Only MCQ type is allowed for Recorded lectures' : 'Only MCQ type is allowed for Quiz')
              return false
            }

            if (value !== 'All') {
              let { checkedItemsSet: set = new Set() } = this.state
              console.log(checkedItemsSet, 'yyy')
              set.has(value) ? set.delete(value) : set.add(value)
              console.log(set, 'ooo')
              this.setState({ checkedItemsSet: set })
              this.state.prevPropsChange(e, i)
            } else {
              let { checkedItemsSet: set = new Set() } = this.state
              console.log(set, 'lll')
              set.has(value) ? newvalue.map(v => { set.delete(v) }) : newvalue.map(v => {
                set.add(v)
              })
              console.log(checkedItemsSet, 'vv1')
              this.setState({ checkedItemsSet: set })
              this.state.prevPropsChange(e, i)
            }
          }}
          checked={checkedItemsSet.has(`${v.value}`)}
        />
        <br />
      </React.Fragment>))
  }
  render () {
    return (
      <React.Fragment>
        <List>
          <ListItem button onClick={() => this.setState(state => ({ open: !state.open }))} >
            <ListItemText onClick={this.props.onTitleClick} inset primary={this.props.heading} style={{ padding: 0, margin: 0 }}
              secondary={this.getcheckedItemsStatus()} />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </List>

        <Collapse in={this.state.open} timeout='auto' unmountOnExit>
          {this.searchBar('queryString')}
          <Paper className={this.props.classes.paper} elevation={3}>
            {this.getItems()}
          </Paper>
        </Collapse>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CheckboxExampleSlider)
