'use strict';
const url = require('url');
const path = require('path');
const debug = require('./debug');
const SPECIAL = {
    isNull: null,
    isFalse: false,
    isZero: 0,
};

function _parse(key) {
    const parsed = url.parse(key);

    if (parsed.hash) {
        parsed.cleanHash = parsed.hash.replace('#', '').replace(/^\//, '');
    }

    return parsed;
}

/**
 * @param {String} key
 * @param {Object} ctx
 * @param {String} base
 */
function _resolve(key, ctx, base) {
    const parsedUrl = _parse(key);
    const hash = parsedUrl.cleanHash;
    let obj;

    debug(`Resolving path ${parsedUrl.hash}`);

    if (parsedUrl.pathname) {
        const file = path.resolve(base, parsedUrl.pathname);

        debug(`Require file ${file}`);

        base = path.dirname(file);
        obj = require(file);
    } else {
        obj = ctx;
    }

    let res = obj;

    if (hash) {
        if (SPECIAL.hasOwnProperty(hash)) {
            return SPECIAL[hash];
        }

        hash
            .split('/')
            .forEach(part => {
                res = res[part];
            });
    }

    if ( ! res) {
        return { '$ref': key };
    }

    return _deref(res, obj, base);
}

/**
 * @param {Object} schema
 * @param {Object} ctx
 * @param {String} base
 * @param {String} current
 */
function _deref(schema, ctx, base, current) {
    if (schema.hasOwnProperty('$ref')) {
        return _resolve(schema.$ref, ctx, base);
    }

    const obj = current ? schema[current] : schema;

    if ( ! obj) {
        return;
    }

    Object
        .keys(obj)
        .forEach(key => {
            if (typeof obj[key] === 'object') {
                _deref(obj, ctx, base, key);
            } else if (key === '$ref') {
                schema[current] = _resolve(obj[key], ctx, base);
            }
        });

    return schema;
}

/**
 * @param {Object} schema
 * @param {Object} opts
 *  @param {String} opts.schemaBaseDir
 */
module.exports = function deref(schema, opts) {
    opts = Object.assign({ schemaBaseDir: process.cwd() }, opts);

    return _deref(schema, schema, opts.schemaBaseDir);
}
