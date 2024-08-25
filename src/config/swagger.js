const swaggerJsDoc = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
        title: "eCommerce API",
        version: "1.0.0",
        description: "API for eCommerce application",
        },
        servers: [
        {
            url: "http://localhost:3000",
        },
        ],
    },
    apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsDoc;  