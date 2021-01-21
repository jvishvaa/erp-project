/* eslint-disable no-mixed-operators */
import React, { Component } from 'react'
import { commonDefaultProps } from 'react-stonecutter/src/utils/commonProps'
import { connect } from 'react-redux'
import { compose } from 'redux'

const enquire = typeof window !== 'undefined' ? require('enquire.js') : null

function makeResponsiveWrapped (Grid, { maxWidth, minPadding = 0, defaultColumns = 4 } = {}) {
  return class extends Component {
    static defaultProps = {
      gutterWidth: commonDefaultProps.gutterWidth
    };

    componentDidMount () {
      const { columnWidth, gutterWidth, sidebar } = this.props
      console.log(columnWidth, gutterWidth)
      const breakpoints = []
      const getWidth = i =>
        i * (columnWidth + gutterWidth) - gutterWidth + minPadding

      for (
        let i = 2;
        getWidth(i) <= maxWidth + columnWidth + gutterWidth;
        i++
      ) {
        breakpoints.push(getWidth(i))
      }

      this.breakpoints = breakpoints
        .map((width, i, arr) =>
          [
            'screen',
            i > 0 && `(min-width: ${arr[i - 1]}px)`,
            i < arr.length - 1 && `(max-width: ${sidebar ? width - 240 : width}px)`
          ]
            .filter(Boolean)
            .join(' and '))
        .map((breakpoint, i) => ({
          breakpoint,
          handler: () => { console.log(breakpoint, i); this.setState({ columns: i + 1 }) }
        }))
      console.log('breakpoints', this.breakpoints)
      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.register(breakpoint, { match: handler }))
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.sidebar !== this.props.sidebar) {
        console.log(this.state.columns)
        this.setState({ columns: this.state.columns })
      }
    }
    componentWillUnmount () {
      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.unregister(breakpoint, handler))
    }

    state = {
      columns: defaultColumns
    };

    render () {
      return <Grid {...this.props} {...this.state} />
    }
  }
}

const mapStateToProps = state => ({
  sidebar: state.view.sidebar
})

export default compose(connect(mapStateToProps, null), makeResponsiveWrapped)
