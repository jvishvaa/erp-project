import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
// import { TextArea } from 'semantic-ui-react'
import swearWords from './swearWords.json'

class ProfanityFilter extends Component {
    state={
      swearWords: [
      ],
      isSwearWord: false,
      inputValue: ''
    }

    componentDidMount () {
      this.setState({ swearWords: swearWords.swearWords })
    }

  handleChange = (e) => {
    let { swearWords } = this.state
    this.setState({ inputValue: e.target.value })

    const filteredSwearword = swearWords.filter(swearWord => {
      // return e.target.value.includes(swearWord)
      const str = e.target.value
      // eslint-disable-next-line no-useless-escape
      const res = str.split(/[\s,\?\,\.!]+/).some(f => f === swearWord)
      return res
    })

    if (filteredSwearword.length >= 1) {
      this.setState({ isSwearWord: true })
    } else {
      this.setState({ isSwearWord: false })
    }
    this.props.onChange(e)
  }

  render () {
    const { label, name, isMultiline, value, helperText, error } = this.props
    return (
      <React.Fragment>
        {
          isMultiline !== true ? (
            <TextField
              label={label}
              autoComplete='off'
              helperText={helperText}
              margin='dense'
              error={error}
              variant='outlined'
              fullWidth
              name={name}
              onChange={this.handleChange}
              value={value}
            />
          ) : (
            // <TextField
            //   rows='4'
            //   placeholder={placeHolder}
            //   autoComplete='off'
            //   fullWidth
            //   name={name}
            //   onChange={this.handleChange}
            //   value={this.state.inputValue}
            //   style={{ width: '100%' }}
            // />
            <TextField
              id='outlined-multiline-static'
              label={label}
              error={error}
              multiline
              required
              fullWidth
              rows='4'
              margin='normal'
              variant='outlined'
              autoComplete='off'
              helperText={helperText}
              name={name}
              onChange={this.handleChange}
              value={value}
              style={{ width: '100%' }}
            />
          )
        }

        {
          this.state.isSwearWord !== true ? '' : <p style={{ color: 'red' }}>Inappropriate usage of words</p>
        }
      </React.Fragment>
    )
  }
}

export default ProfanityFilter
