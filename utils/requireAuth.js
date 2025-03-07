const requireAuth = (user) => {
  if (!user) {
    throw new Error('Not authenticated');
  }
};

const requireAdmin = (user) => {
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }
};

const requireModerator = (user) => {
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    throw new Error('Moderator access required');
  }
};

module.exports = { requireAuth, requireAdmin, requireModerator };
