var fs = require('fs')

var fileName = process.argv[2]

var pdf = require('html-pdf')

console.log(fileName, process.argv[2], 'filename from shell')

var html = fs.readFileSync(fileName, 'utf8')

var options = { format: 'A4',
  width: '16in',
  height: '11in',
  border: {
    top: '0.5in', // default is 0, units: mm, cm, in, px
    bottom: '0.5in'
  } }

pdf.create(html, options).toFile(fileName.replace('.html', '.pdf'), function (err, res) {
  if (err) return console.log(err)
  console.log(res)
})
