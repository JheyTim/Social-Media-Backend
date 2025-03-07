const { authTypeDefs } = require('./authTypeDefs');
const { profileTypeDefs } = require('./profileTypeDefs');
const { postTypeDefs } = require('./postTypeDefs');
const { notificationTypeDefs } = require('./notificationTypeDefs');
const { adminTypeDefs } = require('./adminTypeDefs');
const { reportTypeDefs } = require('./reportTypeDefs');

exports.typeDefs = [
  authTypeDefs,
  profileTypeDefs,
  postTypeDefs,
  notificationTypeDefs,
  adminTypeDefs,
  reportTypeDefs,
];
