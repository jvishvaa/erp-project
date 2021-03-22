/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select, { components as inBuiltComponents } from 'react-select'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import CircularProgress from '@material-ui/core/CircularProgress'
import CancelIcon from '@material-ui/icons/Cancel'
import { emphasize } from '@material-ui/core/styles/colorManipulator'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 280
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 40
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 300,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
})

function NoOptionsMessage (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function inputComponent ({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control (props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option (props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component='div'
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue (props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  )
}

function ValueContainer (props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
}

function MultiValue (props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function DropdownIndicator (props) {
  return (
    <inBuiltComponents.DropdownIndicator {...props}>
      <ArrowDropDown />
    </inBuiltComponents.DropdownIndicator>
  )
}
function IndicatorSeparator ({ innerProps }) {
  const indicatorSeparatorStyle = {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    marginBottom: 8,
    marginTop: 8,
    width: 1
  }
  return <span style={indicatorSeparatorStyle} {...innerProps} />
}

function Menu (props) {
  return (
    <Paper className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  )
}
function LoadingIndicator (props) {
  return (
    <CircularProgress size={24} color='secondary' />
  )
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  IndicatorSeparator,
  DropdownIndicator,
  LoadingIndicator
}

class IntegrationReactSelect extends React.Component {
  constructor () {
    super()
    this.state = {
      single: null,
      multi: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (...rest) {
    if (this.props.onChange) this.props.onChange(rest)
  };

  render () {
    const { classes, theme } = this.props
    return (
      <Select
        isLoading={this.props.loading}
        classes={classes}
        styles={{
          input: base => ({
            ...base,
            width: this.props.visible ? '100px' : 0,
            color: theme.palette.text.primary,
            '& input': {
              font: 'inherit'
            }
          })
        }}
        textFieldProps={{
          label: this.props.label ? this.props.label : 'Branch',
          InputLabelProps: {
            shrink: true
          }
        }}
        options={this.props.options}
        components={components}
        value={this.props.value}
        onChange={this.handleChange}
        isMulti={this.props.isMulti}
      />
    )
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect)
