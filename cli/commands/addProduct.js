const inquirer = require('inquirer');
const axios = require('axios');

const addProduct = async () => {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Product Name:' },
    { type: 'input', name: 'price', message: 'Product Price:' },
  ]);

  const response = await axios.post('http://localhost:3000/products', answers);
  console.log('Product added:', response.data);
};

module.exports = addProduct;