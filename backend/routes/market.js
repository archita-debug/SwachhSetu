const router = require('express').Router();
const User   = require('../models/User');
const auth   = require('../middleware/auth');

const PRODUCTS = [
  { id:1, name:'Compost Making Kit',         emoji:'🌱', cat:'compost',   price:1299, coins:800, tag:'Top Seller' },
  { id:2, name:'Segregation Dustbins (x3)',  emoji:'🗑️', cat:'dustbins',  price:849,  coins:500, tag:'' },
  { id:3, name:'Upcycled Denim Tote Bag',    emoji:'👜', cat:'upcycled',  price:649,  coins:400, tag:'Eco-Choice' },
  { id:4, name:'Hazardous Waste Bin (Red)',  emoji:'⚠️', cat:'dustbins',  price:499,  coins:300, tag:'' },
  { id:5, name:'Vermi Compost Starter',      emoji:'🪱', cat:'compost',   price:999,  coins:600, tag:'' },
  { id:6, name:'Reusable Jute Bags (5)',     emoji:'🛍️', cat:'upcycled',  price:349,  coins:200, tag:'New' },
  { id:7, name:'Wet Waste Collector Bin',    emoji:'💧', cat:'dustbins',  price:599,  coins:350, tag:'' },
  { id:8, name:'Garden Composting Tool Set', emoji:'⛏️', cat:'tools',     price:1099, coins:700, tag:'Bestseller' },
];

// GET /api/market/products
router.get('/products', auth, (_, res) => res.json(PRODUCTS));

// POST /api/market/redeem  { productId }
router.post('/redeem', auth, async (req, res) => {
  try {
    const product = PRODUCTS.find(p => p.id === req.body.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user.id);
    if (user.coins < product.coins) return res.status(400).json({ message: 'Not enough Minecoins' });
    user.coins -= product.coins;
    await user.save();
    res.json({ message: `Redeemed: ${product.name}`, coinsLeft: user.coins });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
