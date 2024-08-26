const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eCommerce API',
      version: '1.0.0',
      description: 'This is the API documentation for the eCommerce platform.',
      contact: {
        name: 'Miguel Loução Brandão',
        email: 'miguellbproductions@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "eCommerce API Docs",
    customCssUrl: "/public/css/SwaggerDark.css",
    customfavIcon: "/public/docs/favicon.ico",
  }));

  console.log(`Swagger docs available at http://localhost:3000/api-docs`);
};

module.exports = swaggerDocs;
