'use strict';

const chromeData = require('./browsers').chrome;
const useBrotli = require('./brotli').isAvailable;

module.exports = function getHeaders (defaults) {
  const headers = getChromeHeaders(random(chromeData));
  return Object.assign({}, defaults, headers);
};

function random (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getChromeHeaders (options) {
  const { headers } = options;

  headers['User-Agent'] = random(options['User-Agent']);

  if (!useBrotli && headers['Accept-Encoding']) {
    headers['Accept-Encoding'] =
      headers['Accept-Encoding'].replace(/,?\s*\bbr\b\s*/i, '');
  }

  return headers;
}
