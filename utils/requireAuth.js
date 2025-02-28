const requireAuth = (user) => {
  if (!user) {
    throw new Error('Not authenticated');
  }
};

module.exports = { requireAuth };
