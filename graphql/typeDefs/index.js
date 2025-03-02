const { authTypeDefs } = require('./authTypeDefs');
const { profileTypeDefs } = require('./profileTypeDefs');
const { postTypeDefs } = require('./postTypeDefs');

exports.typeDefs = [authTypeDefs, profileTypeDefs, postTypeDefs];
