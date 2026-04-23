import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2900)
  }, [])

  const ToastContainer = () => (
    <div className="toast-wrap">
      {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
    </div>
  )

  return { toast, ToastContainer }
}
