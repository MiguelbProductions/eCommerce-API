const Product = require('../models/productModel');

const addProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            owner: req.user._id,
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};


const addReview = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment,
        };

        product.reviews.push(review);

        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding review:', error); // Log de erro
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
      const {
        name,
        category,
        minPrice,
        maxPrice,
        rating,
        brand,
        inStock,
      } = req.query;
  
      const query = {};
  
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
  
      if (category) {
        query.category = category;
      }
  
      if (minPrice) {
        query.price = { ...query.price, $gte: Number(minPrice) };
      }
  
      if (maxPrice) {
        query.price = { ...query.price, $lte: Number(maxPrice) };
      }
  
      if (rating) {
        query.ratings = { $gte: Number(rating) };
      }
  
      if (brand) {
        query.brand = brand;
      }
  
      if (inStock) {
        query.stock = { $gt: 0 };
      }
  
      const products = await Product.find(query);
      
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error searching products', error: error.message });
    }
  };

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addReview,
    searchProducts
};