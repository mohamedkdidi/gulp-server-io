'use strict';
/**
 * Testing the middlewares
 */
const request = require('supertest');
const File = require('gulp-util').File;
const join = require('path').join;
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
// Setups
let stream;

const rootDir = new File({
  path: join(__dirname, 'fixtures')
});

// Clean up afterward
afterEach(() => {
  if (stream) {
    stream.emit('kill');
    stream = undefined;
  }
});
// Util method
const shiftDownOne = str => str.substr(1, str.length - 1);

// Start the test
describe('gulp-webserver-io middleware test', () => {
  test('(1) should use middleware function', () => {
    const testPath = '/middleware';
    stream = webserver({
      open: false,
      reload: false,
      debugger: false,
      middleware: (req, res, next) => {
        if (req.url === testPath) {
          res.end(shiftDownOne(testPath));
        } else {
          next();
        }
      }
    });
    stream.write(rootDir);
    return request(defaultUrl)
      .get(testPath)
      .expect(200, 'middleware');
  });

  test('(2) , should use middleware array', done => {
    const testPaths = ['middleware1', 'middleware2'];
    stream = webserver({
      open: false,
      reload: false,
      debugger: false,
      middleware: [
        function(req, res, next) {
          if (req.url === testPaths[0]) {
            res.end(shiftDownOne(testPaths[0]));
          } else {
            next();
          }
        },
        function(req, res, next) {
          if (req.url === testPaths[1]) {
            res.end(shiftDownOne(testPaths[1]));
          } else {
            next();
          }
        }
      ]
    });
    stream.write(rootDir);

    let count = 0;
    const end = err => {
      if (err) {
        return done(err);
      }
      ++count;
      if (count === 2) {
        done();
      }
    };

    request(defaultUrl)
      .get(testPaths[0])
      .expect(200, shiftDownOne(testPaths[0]))
      .end(end);
    request(defaultUrl)
      .get(testPaths[1])
      .expect(200, shiftDownOne(testPaths[1]))
      .end(end);
  });
});
