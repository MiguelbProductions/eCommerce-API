const express = require('express');
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');

connectDB();

const app = express();

app.use(express.json());

app.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));