'use strict';

const { VM } = require('vm2');

const VM_OPTIONS = {
  eval: true,
  wasm: false,
  timeout: 5000
};

const VM_ENV = `
  (function (global) {
    const cache = Object.create(null);
    const keys = [];
    const { body, href } = global;
    
    Object.defineProperties(global, {
      document: {
        value: {
          createElement: function () {
            return { firstChild: { href: href } };
          },
          getElementById: function (id) {
            if (keys.indexOf(id) === -1) {
              const re = new RegExp(' id=[\\'"]?' + id + '[^>]*>([^<]*)');
              const match = body.match(re);
      
              keys.push(id);
              cache[id] = match === null ? match : { innerHTML: match[1] };
            }
      
            return cache[id];
          }
        }
      },
      location: { value: { reload: function () {} } }  
    })
  }(this));
`;

module.exports = { eval: evaluate, Context };

function evaluate (code, ctx) {
  const vm = new VM(Object.assign({}, VM_OPTIONS, { sandbox: ctx }));
  return vm().run(VM_ENV + code);
}

// Global context used to evaluate standard IUAM JS challenge
function Context (options) {
  if (!options) options = { body: '', hostname: '' };

  const atob = Object.setPrototypeOf(function (str) {
    try {
      return Buffer.from(str, 'base64').toString('binary');
    } catch (e) {}
  }, null);

  return Object.setPrototypeOf({
    body: options.body,
    href: 'http://' + options.hostname + '/',
    atob
  }, null);
}
