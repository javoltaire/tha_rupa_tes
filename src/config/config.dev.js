const config = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    email_providers: {
      default: 'sendGrid',
      services: {
        mailGun: {
          host: 'https://api.mailgun.net/v3',
          domain: 'sandbox8ec442990e8c45ba9d4c59be7a2c1a71.mailgun.org',
          username: 'api',
          key: '',
        },
        sendGrid: {
          host: 'https://sendgrid.com/v3',
          key: ''
        }
      }
    }
};

  export default config;