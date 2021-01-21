import * as rxjs from 'rxjs'
/**
 * @class Stores fetch data and selector data seperately.
 */
class StorageManager {
  /**
   * @param  {} config
   */
  constructor (config) {
    /**
     * @var fetchStorage
     * example structure :
     * [{
     *
     * }]
     */
    this._fetchStorage = {}
    this._selectorStorage = []
    this._selectionStorage = {}
    this._selectedValues = {}
    this.selectedValues = new rxjs.BehaviorSubject({})
    this.fetchStorage = new rxjs.BehaviorSubject([])
    this.selectorStorage = new rxjs.BehaviorSubject([])
    this.abortControllers = {}
    this._config = config
  }

  getStorageData () {
    return this.selectorStorage
  }

  getSelectedData (params, index) {
    let values = []
    let allParams = {}
    Object.values(this._selectionStorage).filter((item, selectorIndex) => index > selectorIndex).forEach((item) => {
      Object.keys(item).forEach(itemData => { allParams[itemData] = item[itemData] })
    })
    params.forEach(param => {
      if (allParams.hasOwnProperty(param)) {
        values.push(allParams[param])
      } else {
        values.push(null)
      }
    })
    return values
  }

  init () {
    let length = this._config.selectorCount
    let initialSelectors = this._config.getInitialSelectors()
    this._selectorStorage = Array.from(Array(length).keys()).map(key => {
      return {
        label: this._config.getSelectorLabel(key),
        value: [],
        options: [],
        single: this._config.isSingle(key),
        visible: this._config.getVisiblity(key) && initialSelectors.includes(key)
      }
    })
    this.selectorStorage.next(this._selectorStorage)
  }

  setAbortController (controller, selectorIndex) {
    this.abortControllers[selectorIndex] = controller
  }

  abortFetch (selectorIndex) {
    this.abortControllers[selectorIndex] && this.abortControllers[selectorIndex].abort()
  }

  async hideAllDependencies (selectorIndex) {
    console.log('Hiding all dependencies')
    let dependencies = this._config.getAllDependencies(selectorIndex)
    await dependencies.forEach(async (dependency, index) => {
      this.abortFetch(dependency)
      this._selectorStorage[dependency] = {
        label: this._config.getSelectorLabel(dependency),
        value: [],
        options: [],
        visible: false
      }
      await delete this._selectedValues[dependency]
    })
    console.log(this._selectedValues)
    await this.selectedValues.next(this._selectedValues)
    await this.selectorStorage.next(this._selectorStorage)
  }

  async deleteValueForDependencies (selectorIndex) {
    console.log('Deleting all dependencies')
    let dependencies = this._config.getAllDependencies(selectorIndex)
    await dependencies.forEach(async (dependency, index) => {
      await delete this._selectedValues[dependency]
    })
    await this.selectedValues.next(this._selectedValues)
  }

  /**
   * @param {*} data
   * @param {*} selectorIndex
   */

  setValue (data, selectorIndex, { action }) {
    console.log(data, selectorIndex, { action })
    this._selectedValues = { ...this._selectedValues, [selectorIndex]: data }
    if (action === 'select-option') {
      let valueParam = this._config.getValue(selectorIndex)
      this._selectionStorage[selectorIndex] = this._fetchStorage[selectorIndex].filter(item => {
        console.log(item[valueParam], data[0].value)
        return item[valueParam] === data[0].value
      })[0]
      this._selectorStorage[selectorIndex] = {
        ...this._selectorStorage[selectorIndex],
        value: data
      }
    } else {
      let valueParam = this._config.getValue(selectorIndex)
      let selectedItemDatas = this._fetchStorage[selectorIndex].filter(item => {
        return parseInt(item[valueParam]) === parseInt(this._selectionStorage[selectorIndex][valueParam])
      })[0]
      Object.keys(selectedItemDatas).forEach(key => {
        delete this._selectionStorage[key]
      })
      this._selectorStorage[selectorIndex] = {
        ...this._selectorStorage[selectorIndex],
        value: data
      }
    }
    this.selectorStorage.next(this._selectorStorage)
    this.selectedValues.next(this._selectedValues)
  }

  setFetchData (data, selectorIndex) {
    this._fetchStorage[selectorIndex] = data
    this.fetchStorage.next(this._fetchStorage)
  }

  setLoading (value, selectorIndex) {
    let allDependencyIndices = this._config.getAllDependencies(selectorIndex)
    allDependencyIndices.forEach(dependencyIndex => {
      this._selectorStorage[dependencyIndex] = {
        ...this._selectorStorage[dependencyIndex],
        options: [],
        value: []
      }
    })
    this._selectorStorage[selectorIndex] = {
      ...this._selectorStorage[selectorIndex],
      loading: value,
      value: [],
      visible: this._config.getVisiblity(selectorIndex) && true
    }
    this.selectorStorage.next(this._selectorStorage)
  }

  setOptions (data, selectorIndex) {
    this._selectorStorage[selectorIndex] = {
      ...this._selectorStorage[selectorIndex],
      label: this._config.getSelectorLabel(selectorIndex),
      options: Array.isArray(data) ? data.map(item => {
        return {
          value: item[this._config.getValue(selectorIndex)],
          label: item[this._config.getLabel(selectorIndex)]
        }
      }) : [],
      visible: true
    }
    this.selectorStorage.next(this._selectorStorage)
  }
}

export default StorageManager
