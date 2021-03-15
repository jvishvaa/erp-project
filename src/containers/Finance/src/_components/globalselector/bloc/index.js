import * as rxjs from 'rxjs'
import ConfigManager from '../configManager'
import StorageManager from '../storageManager'
import { COMBINATIONS } from '../defaultConfig'

import { authHeader } from '../../../_helpers'

const requestOptions = {
  method: 'GET',
  headers: authHeader()
}

class GSelectBLOC {
  constructor (globalOnChange, config, initialData) {
    this.config = config ? new ConfigManager(config) : new ConfigManager(COMBINATIONS)
    this.selectorStorage = new rxjs.BehaviorSubject([])
    this.globalOnChange = globalOnChange
    console.log(initialData, 'Initial data')
    this.initialData = initialData
  }

  set role (role) {
    this.config.role = role
    this.storage = new StorageManager(this.config)
    this.storage.init()
    this.storage.selectorStorage.subscribe(value => {
      this.selectorStorage.next(value)
    })
    this.storage.selectedValues.subscribe(value => {
      this.generateData(value)
    })
    let initialSelectors = this.config.getInitialSelectors()
    initialSelectors.forEach(selectorIndex => {
      this.fetchAndStore(selectorIndex)
    })
  }
  generateData (selections) {
    let finalData = {}
    let finalDataWithDetails = {}
    Object.keys(selections).forEach(selection => {
      let valueIdentifier = this.config.getValue(selection)
      let outputIdentifier = this.config.getOutput(selection)
      finalData[outputIdentifier] = []
      finalDataWithDetails[selection] = []
      selections[selection].forEach(item => {
        console.log(outputIdentifier)
        let selectedDataDetails = this.storage._fetchStorage[selection].filter(storageItem => {
          return storageItem[valueIdentifier] === item.value
        })[0]
        console.log(selectedDataDetails, valueIdentifier, this.storage._fetchStorage[selection])
        finalData[outputIdentifier].push(selectedDataDetails[outputIdentifier])
        finalDataWithDetails[selection].push(selectedDataDetails)
      })
    })
    Object.keys(finalData).forEach(key => {
      finalData[key] = finalData[key].join(',')
    })
    this.globalOnChange(finalData, this.storage._fetchStorage)
  }

  /**
   * @param  {} data
   * @param  {} selectorIndex
   */
  onChange (data, selectorIndex) {
    console.log('Onchange data', data)
    let selectedOptions = !Array.isArray(data[0]) ? [data[0]] : data[0]
    this.storage.setValue(selectedOptions, selectorIndex, data[1])
    if (data[1].action === 'select-option') {
      console.log(selectedOptions)
      if (selectedOptions.length === 1) {
        let children = this.config.getChildDependencies(selectorIndex)
        children.forEach(child => {
          this.fetchAndStore(child)
        })
        this.storage.deleteValueForDependencies(selectorIndex)
      } else if (selectedOptions.length > 1) {
        // hide the other selections.
        this.storage.hideAllDependencies(selectorIndex)
      }
    } else if (data[1].action === 'remove-value' || data[1].action === 'clear') {
      if (selectedOptions.length === 0) {
        this.storage.hideAllDependencies(selectorIndex)
      } else if (selectedOptions.length === 1) {
        let children = this.config.getChildDependencies(selectorIndex)
        children.forEach(child => {
          this.fetchAndStore(child)
        })
      }
    }
  }
  /**
   * @description Creates Query String from Parameters and their values.
   * @param  {} params
   * @param  {} paramValues
   */
  createQuery (params, paramValues) {
    let query = []
    params.forEach((param, index) => {
      query.push(param + '=' + paramValues[index])
    })
    return query.join('&')
  }
  createQueryFromAdditionalParams (additionalParams) {
    let query = []
    additionalParams.forEach(paramObj => {
      let keys = Object.keys(paramObj)
      if (keys.length) {
        let key = keys[0]
        let value = paramObj[key]
        query.push(key + '=' + value)
      }
    })
    return query.join('&')
  }

  async fetchAndStore (selectorIndex) {
    console.log('initial_data', this.initialData)
    let url = this.config.getUrl(selectorIndex)
    let params = this.config.getParams(selectorIndex)
    let additionalParams = this.config.getAdditionalParams(selectorIndex)
    let paramValues = this.storage.getSelectedData(params, selectorIndex)
    let query = this.createQuery(params, paramValues)
    let additionalQuery = this.createQueryFromAdditionalParams(additionalParams)
    this.storage.setLoading(true, selectorIndex)
    /* global AbortController */
    var controller = new AbortController()
    var signal = controller.signal
    this.storage.setAbortController(controller, selectorIndex)
    /* global fetch */
    fetch(url + '?' + query + '&' + additionalQuery, { ...requestOptions, signal })
      .then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
          response.status)
          return
        }
        // Examine the text in the response
        response.json().then(async (data) => {
          this.storage.setFetchData(data, selectorIndex)
          this.storage.setOptions(data, selectorIndex)
          this.storage.setLoading(false, selectorIndex)
          if (data.length === 1) {
            this.onChange([[{
              value: data[0][this.config.getValue(selectorIndex)],
              label: data[0][this.config.getLabel(selectorIndex)]
            }], { action: 'select-option' }], selectorIndex)
          } else if (this.initialData) {
            if (this.config.getValue(selectorIndex) in this.initialData && data[0][this.config.getLabel(selectorIndex)]) {
              let itemValue = this.config.getValue(selectorIndex)
              console.log(itemValue, data)
              let selectedItems = []
              /* eslint-disable */
              if (Array.isArray(this.initialData[itemValue])) {
                this.initialData[itemValue].forEach(value => {
                  selectedItems.push(...data.filter(item => item[itemValue] == value))
                })
              } else {
                selectedItems = await data.filter(item => item[itemValue] == this.initialData[itemValue])
              }
              if (selectedItems.length > 1) {
                console.log("Selected Items", 148, selectedItems, this.config.getValue(selectorIndex),itemValue)
                this.onChange([selectedItems.map(selectedItem => {
                  return {
                    value: selectedItem[itemValue],
                    label: selectedItem[this.config.getLabel(selectorIndex)]
                  }}), { action: 'select-option' }], selectorIndex)
              } else if ( selectedItems.length > 0) {
                this.onChange([[{
                    value: selectedItems[0][this.config.getValue(selectorIndex)],
                    label: selectedItems[0][this.config.getLabel(selectorIndex)]
                  }
              ], { action: 'select-option' }], selectorIndex)
              }
            }
          }
        })
      }
      )
      .catch((err) => {
        console.log('Fetch Error :-S', err)
      })
  }

  getSelectorData () {
    return this.selectorStorage
  }

  logConfig () {
    console.log(this.config)
  }
}

export default GSelectBLOC
