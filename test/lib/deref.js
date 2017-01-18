'use strict';
const path = require('path');
const deref = require('../../lib');
const schemaBaseDir = path.resolve(__dirname, '../fixtures/');

function get(name) {
    return require(path.join(schemaBaseDir, name));
}

function doDeref(name) {
    return deref(name, { schemaBaseDir });
}

describe('deref', () => {
    it('should work with basic schema', () => {
        const schema = get('basic.json');

        assert.deepEqual(doDeref(schema), schema);
    });

    it('should work with basic local refs', () => {
        const schema = get('localrefs.json');

        assert.deepEqual(doDeref(schema), get('localrefs.expected.json'));
    });

    it('should work with basic file refs and relative schemaBaseDir', () => {
        const schema = get('basicfileref.json');

        assert.deepEqual(doDeref(schema), get('basic.json'));
    });

    it('should work with nested json pointers', () => {
        const schema = get('api.props.json');

        assert.deepEqual(doDeref(schema), get('api.props.expected.json'))
    });

    it('should work with nested json pointers to files with redirect to file in an array', () => {
        const schema = get('arrayfileref.json');

        assert.deepEqual(doDeref(schema), get('arrayfileref.expected.json'));
    });

    it('should work with deep links', () => {
        const schema = get('apideeplink.json');

        assert.deepEqual(doDeref(schema), get('apideeplink.expected.json'));
    });

    it('should work with deep nested ref links', () => {
        const schema = get('apinestedrefs.json');

        assert.deepEqual(doDeref(schema), get('apinestedrefs.expected.json'));
    });

    it('should work with missing properties', () => {
        const schema = get('missing.json');

        assert.deepEqual(doDeref(schema), get('missing.expected.json'));
    });

    it('should work with anyOf array properties', () => {
        const schema = get('anyofref.json');

        assert.deepEqual(doDeref(schema), get('anyofref.expected.json'));
    });

    it('should work with dots (.) in properties', () => {
        const schema = get('dotprop.json');

        assert.deepEqual(doDeref(schema), get('dotprop.expected.json'));
    });

    it('should work with top level ref properties', () => {
        const schema = get('toplevel.json');

        assert.deepEqual(doDeref(schema), get('toplevel.expected.json'));
    });

    it('should work with array refs in file', () => {
        const schema = get('filerefarray-schema1.json');

        assert.deepEqual(doDeref(schema), get('filerefarray.expected.json'));
    });

    it('should work with nested folders object', () => {
        const schema = get('nestedfolder.json');

        assert.deepEqual(doDeref(schema), get('nestedfolder.expected.json'));
    });

    it('should work with nested schema issue 12', () => {
        const schema = get('issue12.json');

        assert.deepEqual(doDeref(schema), get('issue12.expected.json'));
    });

    it('should work with falsy values in schema', () => {
        const schema = get('includesnullvalues.json');

        assert.deepEqual(doDeref(schema), get('includesnullvalues.expected.json'));
    });
});
