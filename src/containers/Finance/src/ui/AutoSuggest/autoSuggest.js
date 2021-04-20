import React, { useState, useRef, useEffect } from 'react'
import {
  TextField,
  Popper,
  Paper,
  Fade,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  CircularProgress
} from '@material-ui/core'
import PropTypes from 'prop-types'

const AutoCompleteText = (props) => {
  // const [anchorEl, setAnchorEl] = useState(null);
  const autoRef = useRef()
  const [open, setOpen] = useState(false)
  const [textFieldWidth, setTextFieldWidth] = useState('')

  const {
    data,
    fullWidth,
    className,
    label,
    margin,
    onChange,
    required,
    variant,
    value,
    popperZIndex,
    isPending,
    showAllListItems = false
  } = props

  useEffect(() => {
    if (value && value.length >= 1) {
      setOpen(true)
    }
    if (value && value.length < 1) {
      setOpen(false)
    }
  }, [value, value.length])

  useEffect(() => {
    document.addEventListener('click', () => {
      setOpen(false)
    })
    setTextFieldWidth(autoRef.current.offsetWidth)
    return () => {
      document.removeEventListener('click', () => { setOpen(false) })
    }
  }, [])

  const itemClickHandler = (item) => {
    const event = {
      target: {
        value: item.value,
        label: item.label
      }
    }
    props.onChange(event, true)
  }

  let textValue = ''
  if ((typeof value) === 'number') {
    textValue = data && data.filter(item => item.value === +props.value)[0].label
  } else {
    textValue = value
  }

  const showUntillIndex = !showAllListItems ? 6 : data.length

  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: '1px', left: '1px' }}>
        <Popper open={open} anchorEl={autoRef.current} placement='bottom-start' transition style={{ zIndex: popperZIndex, width: textFieldWidth }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper style={{}}>
                {data ? (
                  <List
                    component='nav'
                    style={{
                      height: `${showAllListItems ? '300px' : ''}`,
                      overflowY: `${showAllListItems ? 'scroll' : ''}`
                    }}
                  >
                    {data.map((item, index) => {
                      if (index < showUntillIndex) {
                        return (
                          <ListItem button onClick={() => itemClickHandler(item)} key={`${item.value}-${item.label}-${index}`}>
                            <ListItemText>{item.label}</ListItemText>
                          </ListItem>
                        )
                      }
                      return null
                    })}
                  </List>
                ) : null}
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
      <TextField
        style={{ position: 'relative', width: '100%' }}
        inputRef={autoRef}
        fullWidth={fullWidth}
        className={className}
        label={label}
        margin={margin}
        onChange={event => onChange(event, false)}
        required={required}
        value={textValue || ''}
        variant={variant}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              {isPending ? <CircularProgress size={20} /> : null}
            </InputAdornment>
          )
        }}
      />
    </React.Fragment>
  )
}

AutoCompleteText.propTypes = {
  data: PropTypes.instanceOf(Array),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  margin: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  variant: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

AutoCompleteText.defaultProps = {
  onChange: () => {},
  data: [],
  required: false,
  fullWidth: false,
  className: '',
  popperZIndex: 1200,
  isPending: false
}
export default AutoCompleteText
