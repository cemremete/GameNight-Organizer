import clsx from 'clsx'

interface BadgeProps {
  status: 'confirmed' | 'pending' | 'full' | 'cancelled'
  className?: string
}

const statusConfig = {
  confirmed: { bg: 'bg-green-400', text: 'Confirmed' },
  pending: { bg: 'bg-yellow-400', text: 'Pending' },
  full: { bg: 'bg-blue-400', text: 'Full' },
  cancelled: { bg: 'bg-red-400', text: 'Cancelled' }
}

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-sm font-display font-bold border-2 border-charcoal-900",
      config.bg,
      className
    )}>
      {config.text}
    </span>
  )
}
