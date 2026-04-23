import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import api from '../api'
import './Training.css'

const MODULES = [
  { id:1, title:'Types of Waste',      icon:'🗑️', desc:'Identify different waste categories',    done:true },
  { id:2, title:'Source Segregation',  icon:'🔀', desc:'How and why to separate waste at home', active:true },
  { id:3, title:'Home Composting',     icon:'🌿', desc:'Turn kitchen scraps into black gold',   locked:true },
  { id:4, title:'Re-use of Plastic',   icon:'♻️', desc:'Creative ways to give plastic new life', locked:true },
  { id:5, title:'E-Waste Disposal',    icon:'⚡', desc:'Safe disposal of electronic waste',     locked:true },
]

export default function Training() {
  const { user, refreshUser } = useAuth()
  const { toast, ToastContainer } = useToast()

  const [questions, setQuestions]   = useState([])
  const [qIndex, setQIndex]         = useState(0)
  const [answered, setAnswered]     = useState(false)
  const [selected, setSelected]     = useState(null)
  const [result, setResult]         = useState(null)
  const [quizDone, setQuizDone]     = useState(false)
  const [score, setScore]           = useState(0)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.get('/quiz/questions')
      .then(r => setQuestions(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const progress = user?.trainingProgress ?? 25

  const answer = async (idx) => {
    if (answered) return
    setAnswered(true); setSelected(idx)
    try {
      const { data } = await api.post('/quiz/answer', { questionId: questions[qIndex].id, answer: idx })
      setResult(data)
      if (data.correct) { setScore(s => s + 1); toast(`🎉 Correct! +${data.coinsEarned} Minecoins`) }
      else toast('❌ Incorrect. Keep learning!')
      await refreshUser()
    } catch { toast('⚠️ Could not submit answer') }
  }

  const next = () => {
    if (qIndex + 1 >= questions.length) { setQuizDone(true); return }
    setQIndex(i => i + 1); setAnswered(false); setSelected(null); setResult(null)
  }

  const restart = () => {
    setQIndex(0); setAnswered(false); setSelected(null); setResult(null)
    setQuizDone(false); setScore(0)
  }

  const q = questions[qIndex]

  return (
    <div className="training-wrap">
      <ToastContainer/>
      <h1 className="font-head mb-2" style={{fontSize:'1.3rem',fontWeight:800}}>🎮 Waste Management Training</h1>

      {/* Progress Header */}
      <div className="progress-header card mb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-muted" style={{fontSize:'0.72rem',marginBottom:'0.2rem'}}>Your Progress</div>
            <div className="font-head" style={{fontSize:'2rem',fontWeight:800,color:'var(--g-accent)'}}>{progress}%</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'0.75rem',color:'var(--g-primary)',fontWeight:600}}>🏅 {user?.badges?.length ?? 0} Badges</div>
            <div className="text-muted" style={{fontSize:'0.7rem'}}>Complete to earn certificate</div>
          </div>
        </div>
        <div className="prog-wrap" style={{height:'8px'}}>
          <div className="prog-fill" style={{width:`${progress}%`,background:'var(--g-primary)'}}/>
        </div>
      </div>

      {/* Modules */}
      <h2 className="font-head mb-1" style={{fontSize:'0.95rem'}}>Training Modules</h2>
      <div className="module-list mb-2">
        {MODULES.map(m => (
          <div key={m.id} className={`module-card ${m.locked?'locked':''}`}>
            <div className="module-icon">{m.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:'0.85rem'}}>{m.title}</div>
              <div className="text-muted" style={{fontSize:'0.72rem',marginTop:'0.1rem'}}>{m.desc}</div>
            </div>
            <div style={{fontSize:'1rem'}}>
              {m.done ? '✅' : m.active ? '🔄' : '🔒'}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div className="divider"/>
      <h2 className="font-head mb-1" style={{fontSize:'0.95rem'}}>Eco Quiz – Earn Minecoins</h2>

      {loading && <div className="spinner"/>}

      {!loading && quizDone && (
        <div className="card" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🎉</div>
          <div className="font-head" style={{fontSize:'1.3rem',fontWeight:800,marginBottom:'0.25rem'}}>Quiz Complete!</div>
          <div className="text-muted">You scored {score} / {questions.length}</div>
          <div style={{color:'var(--yellow)',fontWeight:700,fontSize:'1rem',margin:'0.5rem 0'}}>+{score * 10} Minecoins Earned</div>
          <button className="btn btn-primary mt-2" onClick={restart}>🔄 Play Again</button>
        </div>
      )}

      {!loading && !quizDone && q && (
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="badge badge-green">Question {qIndex+1} / {questions.length}</span>
            <span style={{fontSize:'0.75rem',color:'var(--yellow)',fontWeight:600}}>+10 Minecoins per correct answer</span>
          </div>
          <div style={{fontWeight:600,fontSize:'0.95rem',margin:'0.85rem 0',lineHeight:1.45}}>{q.q}</div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            {q.opts.map((opt, i) => {
              let cls = 'quiz-opt'
              if (answered) {
                if (i === result?.correctIndex) cls += ' correct'
                else if (i === selected && !result?.correct) cls += ' wrong'
              }
              return (
                <button key={i} className={cls} onClick={() => answer(i)} disabled={answered}>
                  <span className="quiz-letter">{'ABCD'[i]}</span>
                  {opt}
                </button>
              )
            })}
          </div>
          {answered && result && (
            <div className={`quiz-result ${result.correct?'ok':'bad'}`}>
              {result.correct ? '✅' : '❌'} {result.hint}
            </div>
          )}
          {answered && (
            <button className="btn btn-primary mt-2" onClick={next}>
              {qIndex + 1 >= questions.length ? '🏁 Finish Quiz' : 'Next →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
