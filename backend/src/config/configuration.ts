export default () => ({
  port: parseInt(process.env.API_PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'freashday-jwt-super-secret-change-in-production',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
});
