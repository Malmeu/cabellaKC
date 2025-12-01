import { useEffect } from 'react'
import { CheckCircle, XCircle, X, Info } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[type]} animate-slide-in`}>
      {icons[type]}
      <span className="text-slate-700">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-full transition-colors">
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  )
}
