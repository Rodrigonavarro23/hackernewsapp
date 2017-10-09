module.exports = {
  environment: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGODB_URI || null,
    host: process.env.MONGO_HOST || null,
    user: process.env.MONGO_USER || null,
    pass: process.env.MONGO_PASS || null,
  }
};
