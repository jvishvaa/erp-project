// return an array of keys that match on a certain value
function getObjects (obj, val) {
  var objects = {}
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    if (typeof obj[i] === 'object') {
      for (var j in obj[i]) {
        if (typeof obj[i][j] === 'string' && obj[i][j].includes(val)) {
          objects[i] = obj[i]
        } else if (Array.isArray(obj[i][j]) && obj[i][j].includes(val)) {
          objects[i] = obj[i]
        }
      }
    }
  }
  return objects
}

export default getObjects
