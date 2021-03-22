import Dexie from 'dexie'

const dexie = new Dexie('PSDB')
dexie.version(2).stores({ branches: '[rowIndex], data', grades: 'rowIndex,columnIndex,data', subjects: '[rowIndex+columnIndex+index],[rowIndex+columnIndex], data', sections: '[rowIndex+columnIndex+index],[rowIndex+columnIndex], data' })
dexie.on('ready', function () { console.log('Ready') }, true) // :TODO to be removed
dexie.on('populate', function () { console.log('Populated') }, true) // :TODO to be removed
export default dexie
