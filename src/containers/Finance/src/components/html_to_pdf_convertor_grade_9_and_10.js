var fs = require('fs')

var fileName = process.argv[2]
var pdf = require('html-pdf')

var html = fs.readFileSync(fileName, 'utf8')

var options = { format: 'A4',
  width: '8.28in',
  height: '11.69in',
  orientation: 'portrait'
}

pdf.create(html, options).toFile(fileName.replace('.html', '.pdf'), function (err, res) {
  if (err) return console.log(err)
  console.log(res) // { filename: '/app/businesscard.pdf' }
})
