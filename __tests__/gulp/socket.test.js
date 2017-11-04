'use strict';
/**
 * Testing the ioDebugger socket functions
 */
const request = require('supertest');
const File = require('gulp-util').File;
const join = require('path').join;
const io = require('socket.io-client');
// Parameters
const webserver = require('../../index');
const {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultSSLUrl
} = require('../fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Socket options
const defaultNamespace = '/debugger-io';
const customNamespace = '/my-custom-namespace';
const expectedMsg = 'IO DEBUGGER is listening ...';
const options = {
  transports: ['websocket'],
  'force new connection': true
};
// Start test with socket
describe('gulp-webserver-io debugger test', () => {
  // Setups
  let stream;
  let client;
  // Clean up afterward
  afterEach(() => {
    if (stream) {
      stream.emit('kill');
      stream = undefined;
    }
    client = undefined;
  });
  // first test
  test(`(1) should auto start debugger-io and connect to default namespace ${defaultNamespace}`, done => {
    stream = webserver({
      reload: false
    });
    stream.write(rootDir);

    client = io.connect([defaultUrl, defaultNamespace].join(''), options);
    client.on('connect', () => {
      expect(true).toBeTruthy(); // Just throw one at it
    });
    client.on('hello', msg => {
      expect(msg).toBe(expectedMsg);
      done();
    });
  });
});
