
/**
 * @class
 * @description Manager to manage configurations.
 */
class ConfigManager {
  /**
   * @param  {} config
   */
  constructor (config) {
    this._config = config
  }

  get config () {
    return this._config
  }

  set role (role) {
    this._role = role
    this._roleConfig = this._config[role]
  }
  getSelectorLabel (selectorIndex) {
    return this._roleConfig[selectorIndex].name
  }
  get selectorCount () {
    return this._roleConfig.length
  }
  /**
   * @description Retrieves all the immediate child dependencies for the given selector.
   * @param  {} selectorIndex
   */
  getChildDependencies (selectorIndex) {
    if (selectorIndex.toString()) {
      let dependencyIndices = new Set()
      if (this._role) {
        let selector = this._roleConfig[selectorIndex]
        let dependencies = selector.dependencies
        dependencies.forEach(dependency => {
          let index = this._roleConfig.map(item => item.name).indexOf(dependency)
          dependencyIndices.add(index)
        })
        return [...dependencyIndices]
      } else {
        console.warn('No role is set. Set a role before calling this function.')
      }
    } else {
      console.warn('Selector Index is not passed.')
    }
  }

  getSelector (selectorIndex) {
    return this._config[this._role][selectorIndex]
  }
  getUrl (selectorIndex) {
    return this._roleConfig[selectorIndex].url
  }
  getValue (selectorIndex) {
    return this._roleConfig[selectorIndex].value
  }
  getOutput (selectorIndex) {
    return this._roleConfig[selectorIndex].output
  }
  getLabel (selectorIndex) {
    return this._roleConfig[selectorIndex].label
  }
  getVisiblity (selectorIndex) {
    return !this._roleConfig[selectorIndex].hidden
  }
  isSingle (selectorIndex) {
    return this._roleConfig[selectorIndex].single
  }
  getParams (selectorIndex) {
    if (this._roleConfig[selectorIndex].params) {
      return this._roleConfig[selectorIndex].params
    } else {
      return []
    }
  }
  getAdditionalParams (selectorIndex) {
    if (this._roleConfig[selectorIndex].additionalParams) {
      return this._roleConfig[selectorIndex].additionalParams
    } else {
      return []
    }
  }

  /**
   * @param  {} selectorIndex
   */
  getAllDependencies (selectorIndex) {
    if (selectorIndex.toString()) {
      let dependencyIndices = new Set()
      if (this._role) {
        let selector = this._roleConfig[selectorIndex]
        let dependencies = selector.dependencies
        dependencies.forEach(dependency => {
          let index = this._roleConfig.map(item => item.name).indexOf(dependency)
          dependencyIndices.add(index)
          // check if there are subdependencies
          if (this._roleConfig[index].dependencies.length > 0) {
            // if then add to the list of dependencies
            this._roleConfig[index].dependencies.forEach(subDependency => {
              let subDependencyIndex = this._roleConfig.map(item => item.name).indexOf(subDependency)
              dependencyIndices.add(subDependencyIndex)
            })
          }
        })
        return [...dependencyIndices]
      } else {
        console.warn('No role is set. Set a role before calling this function.')
      }
    } else {
      console.warn('Selector Index is not passed.')
    }
  }

  getInitialSelectors () {
    if (this._role) {
      return this._roleConfig.filter(selector => selector.loadAtStart === true).map((selector, index) => index)
    } else {
      console.warn('No role is set. Set a role before calling this function.')
    }
  }
}

export default ConfigManager
