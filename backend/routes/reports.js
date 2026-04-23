const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const Report = require('../models/Report');
const User   = require('../models/User');
const auth   = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g,'_')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/reports  – all (authority) or own (citizen)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const filter = user.role === 'authority' ? {} : { user: req.user.id };
    const reports = await Report.find(filter).populate('user','name email').sort('-createdAt');
    res.json(reports);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/reports
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { category, description, lat, lng, address } = req.body;
    if (!category || !description) return res.status(400).json({ message: 'Category and description required' });
    const report = await Report.create({
      user: req.user.id,
      category, description,
      photo: req.file ? req.file.filename : null,
      location: { lat: lat || null, lng: lng || null, address: address || '' },
    });
    // Award coins
    await User.findByIdAndUpdate(req.user.id, { $inc: { coins: 20, points: 20 } });
    res.status(201).json(report);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PATCH /api/reports/:id/status  – authority only
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
