import { useEffect } from "react"

type NotificationProps = {
  message: string
  onClose: () => void
  duration?: number
}

export const Notifications: React.FC<NotificationProps> = ({ message, onClose, duration = 2200 }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}
