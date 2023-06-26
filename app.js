// Import the required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set the Express Web server
const app = express();

// Add middleware that handles JSON data and enables CORS
app.use(express.json());
app.use(cors());

// Define the routes and endpoints for the DressStore application
app.get('/', (req, res) => {
  res.send('Welcome to the DressStore application.');
});

// Connect to the MongoDB database
const connectionString = "mongodb+srv://idalin:BxKbFRPsJluvo8jS@cluster0.uvegkmf.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define product model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  published: Boolean,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific products based on ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search for products by name keyword
app.get('/api/products', async (req, res) => {
  const keyword = req.query.name;
  try {
    const products = await Product.find({ name: { $regex: keyword, $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search for products by name keyword
app.get('/api/products/:id', async (req, res) => {
  const keyword = req.query.name;
  try {
    // const products = await Product.find({ name: { $regex: keyword, $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new products
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove specific products
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove all products
app.delete('/api/products', async (req, res) => {
  try {
    await Product.deleteMany();
    res.json({ message: 'All products deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Start the Express server by listening on a specific port
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});