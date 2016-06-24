var utils = require('../utils');
module.exports = utils.mixFromPath(
    __dirname,
    '../../core/server/metadata/standards.js',
    '../../app/server/metadata/standards.js'
);