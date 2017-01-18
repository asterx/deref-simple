'use strict';
let debug;

try {
    debug = require('debug')('deref-simple');
} catch(e) {
    debug = function() {};
}

module.exports = debug;
