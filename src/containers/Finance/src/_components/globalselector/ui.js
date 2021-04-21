import React from 'react'

import Grid from '@material-ui/core/Grid'
import BlocBuilder from 'bloc-builder-react'

import Select from './components/select'
import GSelectBLOC from './bloc'

class UI extends React.Component {
  constructor (props) {
    super(props)
    this.bloc = new GSelectBLOC(props.onChange, props.config, props.initialValue)
  }
  componentDidMount () {
    let userProfile = JSON.parse(localStorage.getItem('user_profile'))
    let personalInfo = userProfile.personal_info
    let { role } = personalInfo
    this.bloc.role = role
  }
  render () {
    return <BlocBuilder
      subject={this.bloc.getSelectorData()}
      builder={(snapshot) => {
        let selectors = snapshot.data
        switch (!snapshot.error) {
          case true:
            return <Grid container>
              {
                selectors && selectors.map((selector, index) => {
                  let { label, options, value, loading, visible, single } = selector
                  return visible && <Grid item>
                    <Select
                      isMulti={!single}
                      label={label}
                      visible={visible}
                      loading={loading}
                      onChange={(value) => this.bloc.onChange(value, index)}
                      options={options}
                      value={value}
                    />
                  </Grid>
                })
              }

            </Grid>
          // else let's expose the error
          default :
            return (<div>Error : <code>{snapshot.error}</code></div>)
        }
      }}
    />
  }
}

export default UI
