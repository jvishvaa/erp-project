import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class TextArea extends Component {
  state={}
  render () {
    let{ state: { presentLength = 0, text = '' }, props: { rows, placeholder, maxLength = 320, lengthExceedString = 'characters left', onChange, ...restProps } } = this
    return <div>
      <TextField
        required
        style={{ border: '1px solid black', maxWidth: '60vw' }}
        id='standard-full-width'
        label='Message'
        value={text}
        onChange={({ target: { value } }) => { this.setState({ presentLength: value.length, text: value.substring(0, maxLength - 1) }); onChange(value.substring(0, maxLength - 1)) }}
        inputProps={{ maxLength: maxLength, border: '0px' }}
        rows={10}
        placeholder='Message'
        fullWidth
        multiline
        margin='normal'
        InputLabelProps={{ shrink: true }}
        {...restProps}
      />
      <p>{maxLength - presentLength} {lengthExceedString}</p>
    </div>
  }
}
export default TextArea
