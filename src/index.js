const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.js');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/products', require('./routes/products'));

const PORT = process.env.PORT || 1616;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));