import React from 'react'
import configureStore from 'redux-mock-store'
import Party from '../../../components/Finance/BranchAccountant/ExpenseManagement/Party/Party'

const mockStore = configureStore()
const initialState = {
  finance: {
    accountantReducer: {
      expenseMngmtAcc: {
        party: {
          partyList: []
        }
      }
    },
    common: {
      dataLoader: true
    }
  },
  authentication: {
    user: 'udit'
  }
}

const store = mockStore(initialState)

describe('<Party /> rendering', () => {
  it('should render <h1>', () => {
    let wrapper = shallow(<Party store={store} />)
    expect(wrapper.find('h1')).toBeInstanceOf(Object)
  })
})
