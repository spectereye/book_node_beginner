var querystring = require('querystring')
var fs = require('fs')
var formidable = require('formidable')
var sys = require('sys')

function start(response) {
  console.log('request handler "start" was called')

  var body =
    '<html>' +
    '<head>' +
    '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<textarea name="text" rows="20" cols="60"></textarea><br>' +
    '<input type="text" name="title"><br>'
    '<input type="file" name="upload" multiple="multiple"><br>' +
    '<input type="submit" value="Upload File" />' +
    '</form>' +
    '</body>' +
    '</html>'

  response.writeHead(200, { 'content-type': 'text/html' })
  response.write(body)
  response.end()
}

function upload(response, request) {
  console.log('request handler "upload" was called')

  var form = new formidable.IncomingForm()
  console.log('about to parse')
  form.parse(request, function (error, fields, files) {
    console.log('parsing done')

    fs.rename(files.upload.path, '/tmp/test.png', function (error) {
      if (error) {
        fs.unlink('/tmp/test.png')
        fs.rename(files.upload.path, '/tmp/test.png')
      }
    })

    response.writeHead(200, { 'content-type': 'text/plain' })
    response.write('received upload:\n\n')
    response.write(sys.inspect({ fields: fields, files: files }))
    response.write("you've sent the text: " + querystring.parse(request).text)
    response.end()
  })
}

function show(response) {
  console.log('request handler "show" was called')
  response.writeHead(200, { 'content-type': 'image/png' })
  fs.createReadStream('/tmp/test.png').pipe(response)
}

exports.start = start
exports.upload = upload
exports.show = show
