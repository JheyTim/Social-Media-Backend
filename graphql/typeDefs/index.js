const { authTypeDefs } = require('./authTypeDefs');
const { profileTypeDefs } = require('./profileTypeDefs');
const { postTypeDefs } = require('./postTypeDefs');
const { notificationTypeDefs } = require('./notificationTypeDefs');

exports.typeDefs = [
  authTypeDefs,
  profileTypeDefs,
  postTypeDefs,
  notificationTypeDefs,
];
