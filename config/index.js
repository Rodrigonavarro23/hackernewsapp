module.exports = {
  environment: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  db: {
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
  }
};
