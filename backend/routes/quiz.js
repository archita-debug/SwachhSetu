const router = require('express').Router();
const User   = require('../models/User');
const auth   = require('../middleware/auth');

const QUESTIONS = [
  { id:1, q:'Which bin should plastic bottles go in?', opts:['Blue (dry waste)','Green (wet waste)','Red (hazardous)','Any bin'], c:0, hint:'Plastic is dry/recyclable — always blue!' },
  { id:2, q:'Best way to dispose of old batteries?', opts:['General bin','Burn it','E-waste collection point','Bury it'], c:2, hint:'E-waste has hazardous materials — use drop-off points.' },
  { id:3, q:'Kitchen food scraps belong in which bin?', opts:['Dry waste','Wet/organic waste','Hazardous','Non-recyclable'], c:1, hint:'Food scraps are wet/organic and are compostable!' },
  { id:4, q:'Which item is NOT recyclable?', opts:['Glass bottle','Aluminium can','Greasy pizza box','Newspaper'], c:2, hint:'Greasy boxes contaminate recycling — general waste.' },
  { id:5, q:'Source segregation means:', opts:['Separating waste at home before disposal','Collecting from street','Burning separately','None'], c:0, hint:'Segregation starts at the source — your home!' },
];

// GET /api/quiz/questions
router.get('/questions', auth, (_, res) => {
  // Send without correct answer index
  res.json(QUESTIONS.map(({ c: _c, hint: _h, ...rest }) => rest));
});

// POST /api/quiz/answer  { questionId, answer }
router.post('/answer', auth, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const q = QUESTIONS.find(x => x.id === questionId);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    const correct = answer === q.c;
    if (correct) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { coins: 10, points: 10 } });
    }
    res.json({ correct, correctIndex: q.c, hint: q.hint, coinsEarned: correct ? 10 : 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
