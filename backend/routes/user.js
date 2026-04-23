const router  = require('express').Router();
const User    = require('../models/User');
const auth    = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PATCH /api/user/profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { name, wasteData, trainingProgress } = req.body;
    const update = {};
    if (name) update.name = name;
    if (wasteData) update.wasteData = wasteData;
    if (trainingProgress !== undefined) update.trainingProgress = trainingProgress;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
