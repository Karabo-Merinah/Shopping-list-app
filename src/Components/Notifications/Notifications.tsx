import { useEffect } from "react"

type NotificationProps = {
  message: string
  onClose: () => void
  duration?: number
}

export const Notifications: React.FC<NotificationProps> = ({ message, onClose, duration = 2200 }) => {
  useEffect(() => {
    if (!message) return
    // set up a timer to auto‑close the notification after the time has elapsed
    const timer = setTimeout(onClose, duration)
    // clean up the timer if the component unmounts or message changes
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}
