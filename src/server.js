var http = require('http')
var url = require('url')
var formidable = require('formidable')

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname
    console.log('request for ' + pathname + ' received')

    request.setEncoding('utf8')
    var postData = ''  // event "data" "end" for POST data chunk
    
    request.addListener('data', function (postDataChunk) {
      postData += postDataChunk
      console.log('Received POST data chunk:\n"' + postDataChunk + '"')
    })
    
    request.addListener('end', function () {
      // route after all POST data gathered
      route(handle, pathname, response, request)
    })
  }

  http.createServer(onRequest).listen(8888)
  console.log('server has started at port http://localhost:8888')
}

exports.start = start
