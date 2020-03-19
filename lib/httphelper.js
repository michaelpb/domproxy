const http = require('http');


module.exports.makeRequest = function ({method, path, headers}, callback) {
  const req = http.request({
    hostname: 'news.ycombinator.com',
    port: 80,
    path: '/',
    method: 'GET',
    headers: {
      ...headers,
      'X-DomProxy': 'heckyeah',
    }
  }, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    const dataArray = [];
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      dataArray.push(chunk);
    });
    res.on('end', () => {
      console.log('No more data in response.');
      callback(dataArray.join(''));
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
}
