const router = require('express').Router();
const User   = require('../models/User');
const auth   = require('../middleware/auth');

// Mock truck data (in production: integrate GPS API)
const TRUCKS = [
  { id:'T01', name:'Truck GJ-01', route:'MG Road → Station', progress:72, eta:'7 min',  status:'En Route' },
  { id:'T02', name:'Truck GJ-02', route:'Market → Park',      progress:35, eta:'18 min', status:'En Route' },
  { id:'T03', name:'Truck GJ-03', route:'Depot → Sector 9',   progress:10, eta:'34 min', status:'Starting'  },
];

const FACILITIES = [
  { id:'F1', name:'GreenCycle Recycling Center', type:'recycling', dist:'2.1 km', hours:'9 AM – 5 PM', open:true },
  { id:'F2', name:'Reliable Scrap Shop',         type:'scrap',     dist:'5.3 km', hours:'10 AM – 8 PM',open:true },
  { id:'F3', name:'Municipal Compost Plant',     type:'compost',   dist:'8.7 km', hours:'8 AM – 4 PM', open:false },
];

// GET /api/tracking/trucks
router.get('/trucks', auth, (_, res) => res.json(TRUCKS));

// GET /api/tracking/facilities
router.get('/facilities', auth, (_, res) => res.json(FACILITIES));

// GET /api/tracking/leaderboard
router.get('/leaderboard', auth, async (_, res) => {
  try {
    const top = await User.find().select('name points coins').sort('-points').limit(20);
    res.json(top);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
