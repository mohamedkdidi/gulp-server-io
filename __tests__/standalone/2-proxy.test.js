'use strict';
/**
 * testing a proxy setup with json-server
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
const jsonServer = require('json-server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
const proxyPort = 3000;
const proxyEndpoint = ['http://localhost', proxyPort].join(':');
// Start test
describe('Testing the standlone setup via the gulp-server-io/server', () => {
  let server, proxyServer;
  beforeEach(() => {
    proxyServer = jsonServer.create();
    const router = jsonServer.router(path.join(__dirname, '..', 'fixtures', 'dummy.json'));
    const middlewares = jsonServer.defaults();
    proxyServer.use(middlewares);
    proxyServer.use('/api', router);
    proxyServer.listen(proxyPort, () => {
      console.log(`JSON Server is running @ ${proxyEndpoint}`);
    });
    server = standaloneSrv({
      path: root,
      reload: false,
      proxies: [{
        target: '/api',
        source: proxyEndpoint + '/api'
      }]
    });
  });

  afterEach(() => {
    server.close();
    if (proxyServer && proxyServer.close) {
      proxyServer.close();
    }
  });

  test('It should able to talk to the proxy server', () => {
    return request(server)
      .post('/api')
      .expect(200, /cats/);
  });
});
