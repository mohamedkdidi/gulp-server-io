/**
 * Create a default options to reduce the complexity of the main file
 */
const path = require('path');
const { version } = require('../../../package.json');
const src = path.join(__dirname, '..', '..');
// Also export the function here
const enableMiddlewareShorthand = require('./enable-middleware-shorthand');
exports.enableMiddlewareShorthand = enableMiddlewareShorthand;
// Move from the app.js to here
exports.defaultProperties = ['reload', 'debugger', 'mock', 'serverReload', 'inject'];
// Rename to the key defaultOptions
exports.defaultOptions = {
  version: version,
  /**
   * Basic options
   */
  development: true,
  host: 'localhost',
  port: 8000,
  path: '/',
  webroot: path.join(process.cwd(), 'app'),
  fallback: false,
  https: false,
  open: true,
  indexes: ['index.html', 'index.htm'],
  callback: () => {},
  staticOptions: {},
  headers: {},
  // Middleware: Proxy
  // For possible options, see:
  // https://github.com/chimurai/http-proxy-middleware
  // replace with the `http-proxy-middleware`
  proxies: [],
  // Stock certicates
  devKeyPem: path.join(src, 'certs', 'cert.pem'),
  devCrtPem: path.join(src, 'certs', 'cert.crt'),
  /**
   * MIDDLEWARE DEFAULTS
   * NOTE:
   *  All middleware should defaults should have the 'enable'
   *  property if you want to support shorthand syntax like:
   *    webserver({
   *      reload: true
   *    });
   */
  // @TODO help the user to track their server reload method
  serverReload: {
    enable: false,
    dir: '/srv',
    start: () => {}, // Start server method
    stop: () => {} // Stop server method
  },
  inject: {
    enable: false,
    target: [], // List of files to inject
    source: [], // List of files to get inject
    options: {
      read: false
    }
  },
  // New mock server using json-server, please note if this is enable then
  // The proxy will be disable
  mock: {
    enable: false,
    json: false,
    port: 3838,
    path: 'localhost',
    watch: true,
    interval: 500 // Listener interval to restart the server, false then don't restart
  },
  // Client reload - default TRUE
  reload: {
    enable: true,
    verbose: true,
    interval: 300
  },
  // Create our socket.io debugger
  // using the socket.io instead of just normal post allow us to do this cross domain
  debugger: {
    enable: true, // Turn on by default otherwise they wouldn't be using this version anyway
    namespace: '/debugger-io',
    js: 'debugger-client.js',
    eventName: 'gulpServerIoJsError',
    hello: 'IO DEBUGGER is listening ...', // Allow the user to change this as well
    client: true, // Allow passing a configuration to overwrite the client
    server: true, // Allow passing configuration - see middleware.js for more detail
    log: false // @TODO further develop this later
  }
};
