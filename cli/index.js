const { program } = require('commander');
const addProduct = require('./commands/addProduct');

program
  .command('add-product')
  .description('Add a new product')
  .action(() => {
    addProduct();
  });

program.parse(process.argv);